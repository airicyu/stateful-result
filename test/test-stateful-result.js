'use strict';

const should = require('chai').should;
const expect = require('chai').expect;
const supertest = require('supertest');
const http = require('http');
const statefulResult = require('./../src/stateful-result');

describe('stateful-result-test', function () {
    this.timeout(2000);

    before(function (done) {
        done();
    });

    it("Test module structure", function (done) {

        const models = statefulResult.models;
        expect(models).to.not.null;

        const Result = statefulResult.models.Result;
        expect(Result).to.not.null;
        const Failure = statefulResult.models.Failure;
        expect(Failure).to.not.null;

        const CODE = statefulResult.CODE;
        expect(CODE).to.not.null;
        for (let code in http.STATUS_CODES) {
            expect(CODE[code]).to.equal(http.STATUS_CODES[code]);
        }

        const COMMON_CODE = statefulResult.COMMON_CODE;
        expect(COMMON_CODE).to.not.null;
        expect(COMMON_CODE["OK"]).to.equal(200);
        expect(COMMON_CODE["CREATED"]).to.equal(201);
        expect(COMMON_CODE["NO_CONTENT"]).to.equal(204);
        expect(COMMON_CODE["MULTI_STATUS"]).to.equal(207);
        expect(COMMON_CODE["NOT_MODIFIED"]).to.equal(304);
        expect(COMMON_CODE["BAD_REQUEST"]).to.equal(400);
        expect(COMMON_CODE["UNAUTHORIZED"]).to.equal(401);
        expect(COMMON_CODE["FORBIDDEN"]).to.equal(403);
        expect(COMMON_CODE["NOT_FOUND"]).to.equal(404);
        expect(COMMON_CODE["CONFLICT"]).to.equal(409);
        expect(COMMON_CODE["UNSUPPORTED_MEDIA_TYPE"]).to.equal(415);
        expect(COMMON_CODE["INTERNAL_SERVER_ERROR"]).to.equal(500);
        expect(COMMON_CODE["NOT_IMPLEMENTED"]).to.equal(501);

        expect(statefulResult.GET_CODE_DATA).to.eql(['code', 'data']);
        expect(statefulResult.GET_ERROR_CODE_DATA).to.eql(['error', 'code', 'data']);
        expect(statefulResult.GET_ERROR_DATA).to.eql(['error', 'data']);
        expect(statefulResult.GET_ERROR_CODE_DATA_MESSAGE).to.eql(['error', 'code', 'data', 'message']);
        expect(statefulResult.GET_ERROR_DATA_CODE_MESSAGE).to.eql(['error', 'data', 'code', 'message']);
        expect(statefulResult.GET_ERROR_DATA_CODE_RESULT_MESSAGE).to.eql(['error', 'data', 'code', 'result', 'message']);

        done();
    });

    it("Test module structure", function (done) {
        const { Result, Failure } = statefulResult.models;

        function testSuccess200() {
            return Result.newSuccess({ code: 200, data: true });
        }

        function testFail404() {
            return Result.newFail({ code: 404 });
        }


        //test get all context objects as array destructure
        {
            let error, data, code, result, message;
            [error, data, code, result, message] = testSuccess200().get(statefulResult.GET_ERROR_DATA_CODE_RESULT_MESSAGE);
            expect(error).to.equal(null);
            expect(data).to.equal(true);
            expect(code).to.equal(200);
            expect(message).to.equal('OK');

            expect(result.error).to.equal(null);
            expect(result.data).to.equal(true);
            expect(result.code).to.equal(200);
            expect(result.message).to.equal('OK');
        }

        //test get all context objects as array destructure with default arguments
        {
            let error, data, code, result, message;
            [error, data, code, result, message] = testSuccess200().get();
            expect(error).to.equal(null);
            expect(data).to.equal(true);
            expect(code).to.equal(200);
            expect(message).to.equal('OK');

            expect(result.error).to.equal(null);
            expect(result.data).to.equal(true);
            expect(result.code).to.equal(200);
            expect(result.message).to.equal('OK');
        }

        //test get some context objects as array destructure
        {
            let error, data;
            [error, data] = testSuccess200().get(statefulResult.GET_ERROR_DATA);
            expect(error).to.equal(null);
            expect(data).to.equal(true);
        }

        //test error result, get some context objects as array destructure
        {
            let error, data, code, message;
            [error, data, code, message] = testFail404().get(statefulResult.GET_ERROR_DATA_CODE_MESSAGE);
            expect(error.code).to.equal(404);
            expect(error.message).to.equal('Not Found');
            expect(error instanceof Error).to.equal(true);
            expect(data).to.undefined;
            expect(code).to.equal(404);
            expect(message).to.equal('Not Found');
        }

        //test success result, get or throw error
        {
            let error, data;
            [error, data] = testSuccess200().getOrThrow(statefulResult.GET_ERROR_DATA);
            expect(error).to.equal(null);
            expect(data).to.equal(true);
        }

        //test error result, get or throw error
        try {
            let error, data;
            [error, data] = testFail404().getOrThrow();
        } catch (e) {
            expect(e.code).to.equal(404);
            expect(e.message).to.equal('Not Found');
            expect(e instanceof Error).to.equal(true);
        }

        //test get all context objects as object destructure
        {
            let { error, data, code, result, message } = testSuccess200().getContext(statefulResult.GET_ERROR_DATA_CODE_RESULT_MESSAGE);
            expect(error).to.equal(null);
            expect(data).to.equal(true);
            expect(code).to.equal(200);
            expect(message).to.equal('OK');

            expect(result.error).to.equal(null);
            expect(result.data).to.equal(true);
            expect(result.code).to.equal(200);
            expect(result.message).to.equal('OK');
        }

        //test get all context objects as object destructure with default arguments
        {
            let { error, data, code, result, message } = testSuccess200().getContext();
            expect(error).to.equal(null);
            expect(data).to.equal(true);
            expect(code).to.equal(200);
            expect(message).to.equal('OK');

            expect(result.error).to.equal(null);
            expect(result.data).to.equal(true);
            expect(result.code).to.equal(200);
            expect(result.message).to.equal('OK');
        }

        //test get some context objects as object destructure
        {
            let { error, data } = testSuccess200().getContext(statefulResult.GET_ERROR_DATA);
            expect(error).to.equal(null);
            expect(data).to.equal(true);
        }

        //test error result, get some context objects as object destructure
        {
            let { error, data, code, message } = testFail404().getContext(statefulResult.GET_ERROR_DATA_CODE_MESSAGE);
            expect(error.code).to.equal(404);
            expect(error.message).to.equal('Not Found');
            expect(error instanceof Error).to.equal(true);
            expect(data).to.undefined;
            expect(code).to.equal(404);
            expect(message).to.equal('Not Found');
        }

        //test success result, get or throw error
        {
            let { error, data } = testSuccess200().getContextOrThrow(statefulResult.GET_ERROR_DATA);
            expect(error).to.equal(null);
            expect(data).to.equal(true);
        }

        //test error result, get or throw error
        try {
            let { error, data } = testFail404().getContextOrThrow();
        } catch (e) {
            expect(e.code).to.equal(404);
            expect(e.message).to.equal('Not Found');
            expect(e instanceof Error).to.equal(true);
        }

        done();
    });

});