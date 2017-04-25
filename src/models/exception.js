'use strict';

const http = require('http');

var util = require('util');

/**
 * Exception object. Extended from Error to support having the error code attribute.
 * 
 * @param {integer} code 
 * @param {string} message 
 */
function Exception(code, message) {
    Error.captureStackTrace(this, Exception);
    this.name = Exception.name;
    this.code = code;
    this.message = message;
}

util.inherits(Exception, Error);

module.exports = Exception;