'use strict';

const http = require('http');
const models = require('./models/models');

var statefulResult = {};

statefulResult.models = {
    Result: models.Result,
    Failure: models.Result
}

/* All HTTP status codes */
var CODE = {};
for (let code in http.STATUS_CODES) {
    CODE[code] = http.STATUS_CODES[code];
}
statefulResult.CODE = CODE;


/* Some Common or potentially meaningful HTTP status codes */
const COMMON_CODE = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    MULTI_STATUS: 207,
    NOT_MODIFIED: 304,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNSUPPORTED_MEDIA_TYPE: 415,

    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501
}
statefulResult.COMMON_CODE = COMMON_CODE;

statefulResult.GET_CODE_DATA = ['code', 'data'];
statefulResult.GET_ERROR_CODE_DATA = ['error', 'code', 'data'];
statefulResult.GET_ERROR_DATA = ['error', 'data'];
statefulResult.GET_ERROR_CODE_DATA_MESSAGE = ['error', 'code', 'data', 'message'];
statefulResult.GET_ERROR_DATA_CODE_MESSAGE = ['error', 'data', 'code', 'message'];
statefulResult.GET_ERROR_DATA_CODE_RESULT_MESSAGE = ['error', 'data', 'code', 'result', 'message'];

module.exports = statefulResult;