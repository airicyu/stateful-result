'use strict';

const http = require('http');
const Exception = require('./exception');

/**
 * This class is a general representation of a certain operation result. It can be functional call result or HTTP request response result or anything else.
 * 
 * @class Result
 */
class Result {
    constructor(props) {
        this.status = props.status || null;
        this.code = props.code || null;
        this.error = props.error || null;
        this.data = props.data;
        this.message = props.message !== undefined ? props.message : null;
    }

    /**
     * Is result success
     * 
     * @returns 
     * 
     * @memberOf Result
     */
    isSuccess() {
        return this.status === Result.STATUS.SUCCESS;
    }

    /**
     * Get properties of result
     * 
     * @returns {object}
     * 
     * @memberOf Result
     */
    getContext() {
        let result = {
            error: this.error,
            data: this.data,
            code: this.code,
            result: this,
            message: this.message,
        };
        return result;
    }

    /**
     * Get properties if success result, or throw Error
     * 
     * @returns {object}
     * 
     * @memberOf Result
     */
    getContextOrThrow() {
        if (this.isSuccess() || !this.error) {
            return this.getContext();
        } else {
            throw this.error;
        }
    }

    /**
     * Get properties of result as array
     * 
     * @param {string[]} properties array.
     * 
     * @returns {string[]}
     * 
     * @memberOf Result
     */
    get(propertiesArr) {
        let result = {
            error: this.error,
            data: this.data,
            code: this.code,
            result: this,
            message: this.message,
        };
        if (Array.isArray(propertiesArr)) {
            let resultArr = [];
            for (let property of propertiesArr) {
                resultArr.push(result[property]);
            }
            return resultArr;
        } else {
            return [this.error, this.data, this.code, this, this.message];
        }
    }

    /**
     * Get properties as array if success result, or throw Error
     * 
     * @param {string[]} properties array.
     * 
     * @returns {string[]}
     * 
     * @memberOf Result
     */
    getOrThrow(propertiesArr) {
        if (this.isSuccess() || !this.error) {
            return this.get(propertiesArr);
        } else {
            throw this.error;
        }
    }

    /**
     * For express
     * 
     * @param {object} res response object
     * @param {string} type The attribute being used for represent as response body
     * 
     * @memberOf Result
     */
    sendResponse(res, type) {
        if (this.isSuccess()) {
            let code = this.code || 200;
            let responseBody = ''
            if (type) {
                responseBody = this[type];
            } else {
                responseBody = this.data !== undefined ? this.data : (this.message || http.STATUS_CODES[code]);
            }
            res.status(code).send(responseBody);
        } else {
            let code = this.code || 500;
            let responseBody = ''
            if (type) {
                responseBody = this[type];
            } else {
                responseBody = this.message || http.STATUS_CODES[code];
            }
            res.status(code).send(responseBody);
        }
    }

    /**
     * Helper static function for creating new success result object
     * 
     * @static
     * @param {object} props 
     * @returns 
     * 
     * @memberOf Result
     */
    static newSuccess(props) {
        return new Result(Object.assign({}, props, {
            status: Result.SUCCESS,
            message: props.message || http.STATUS_CODES[props.code]
        }));
    }

    /**
     * Helper static function for creating new fail result object
     * 
     * @static
     * @param {object} props 
     * @returns 
     * 
     * @memberOf Result
     */
    static newFail(props) {
        return new Result(Object.assign({}, props, {
            status: Result.FAIL,
            error: props.error || new Exception(props.code, props.message || http.STATUS_CODES[props.code]),
            message: props.message || http.STATUS_CODES[props.code]
        }));
    }
}

/* Result status enum */
const STATUS = {
    SUCCESS: 'success',
    FAIL: 'fail'
};
Result.STATUS = STATUS;

module.exports = Result;