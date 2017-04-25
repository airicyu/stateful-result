# stateful-result.js

[![npm version](https://img.shields.io/npm/v/stateful-result.svg)](https://www.npmjs.com/package/stateful-result)
[![node](https://img.shields.io/node/v/stateful-result.svg)](https://www.npmjs.com/package/stateful-result)
[![Codecov branch](https://img.shields.io/codecov/c/github/airicyu/stateful-result/master.svg)](https://codecov.io/gh/airicyu/stateful-result)
[![Build](https://travis-ci.org/airicyu/stateful-result.svg?branch=master)](https://travis-ci.org/airicyu/stateful-result)

[![GitHub issues](https://img.shields.io/github/issues/airicyu/stateful-result.svg)](https://github.com/airicyu/stateful-result/issues)
[![GitHub forks](https://img.shields.io/github/forks/airicyu/stateful-result.svg)](https://github.com/airicyu/stateful-result/network)
[![GitHub stars](https://img.shields.io/github/stars/airicyu/stateful-result.svg)](https://github.com/airicyu/stateful-result/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/airicyu/stateful-result/master/LICENSE)
[![dependencies Status](https://david-dm.org/airicyu/stateful-result/status.svg)](https://david-dm.org/airicyu/stateful-result)
[![devDependencies Status](https://david-dm.org/airicyu/stateful-result/dev-status.svg)](https://david-dm.org/airicyu/stateful-result?type=dev)

This module can be used for representing an operation(e.g: function return) result with a meaningful status code. By default, we suggest to make use of HTTP status code.
Hence, code 200 for status of operation OK, and code 404 for status of operation target not found, etc.

## Project Page

//- [Project Home](http://blog.airic-yu.com/1880/stateful-result-js-nodejs-module-using-jquery-manipulate-foldersfiles)
- [Github](https://github.com/airicyu/stateful-result)
- [NPM](https://www.npmjs.com/package/stateful-result)

## Install

```bash
$ npm install --save stateful-result
```

------------------------
## Helloworld

### Sample 1: Getting success result (code 200 OK)
```javascript
const { Result } = statefulResult.models;

function testSuccess200() {
    return Result.newSuccess({code: 200, data: true});
}

let error, data, code;
[error, data, code] = testSuccess200().get();
console.log([error, data, code]);
```

console output
```
[ null, true, 200 ]
```

Description:

Simple enough, isn't it?

### Sample 2: Getting fail result (code 404 Not found)
```javascript
const { Result } = statefulResult.models;

function testFail404() {
    return Result.newFail({code: 404});
}

let error, data, code;
[error, data, code] = testFail404().get();
console.log([error, data, code]);
```

console output
```
[ { Error
      at Function.newFail (......\stateful-result\src\models\result.js:167:35)
      at testFail404 (......\stateful-result\index.js:14:19)
      at Object.<anonymous> (......\stateful-result\index.js:18:23)
      at Module._compile (module.js:571:32)
      at Object.Module._extensions..js (module.js:580:10)
      at Module.load (module.js:488:32)
      at tryModuleLoad (module.js:447:12)
      at Function.Module._load (module.js:439:3)
      at Module.runMain (module.js:605:10)
      at run (bootstrap_node.js:423:7) name: 'Exception', code: 404, message: 'Not Found' },
  undefined,
  404 ]]
```

Description:
The error object is an extended error object which has the "code" attribute. In this case, the code is 404.


### Sample 3: Get result if success result or throw error if returning fail result (code 404 Not found)
```javascript
const { Result } = statefulResult.models;

function testSuccess200() {
    return Result.newSuccess({code: 200, data: true});
}

function testFail404() {
    return Result.newFail({code: 404});
}

let error, data, code;
try{
    [error, data, code] = testSuccess200().getOrThrow();
    console.log('testSuccess200 result', [error, data, code]);
    [error, data, code] = testFail404().getOrThrow();
} catch(e){
    console.log(e);
}

```

console output
```
testSuccess200 result [ null, true, 200 ]
{ Error
    at Function.newFail (......\stateful-result\src\models\result.js:167:35)
    at testFail404 (......\stateful-result\index.js:14:19)
    at Object.<anonymous> (......\stateful-result\index.js:18:23)
    at Module._compile (module.js:571:32)
    at Object.Module._extensions..js (module.js:580:10)
    at Module.load (module.js:488:32)
    at tryModuleLoad (module.js:447:12)
    at Function.Module._load (module.js:439:3)
    at Module.runMain (module.js:605:10)
    at run (bootstrap_node.js:423:7) name: 'Exception', code: 404, message: 'Not Found' }
```

Description:
This time we called method "getOrThrow". If the result is success, the result would be returned as previous samples. If the result is fail, the error object would be thrown.


## Model

### Result Class

The Result class is the main model of this module.
It would have below attributes:

| Attribute name | Description   | Example |
| -------------  | ------------- | ------- |
| status         | Either 'success' or 'fail' to indicate success or fail. It would affect the handling behavour in methods like getOrThrow() | 'success' |
| code           | The status code of the result | 200 |
| error          | The error of the operation | any Error object |
| data           | The result data | any |
| message        | The result message. If code is defined and message is not defined, it would auto reuse HTTP status code's correspondng message | "OK" |

### Exception Class

The Exception class is a custom extended Error object with adding a code attribute. It can be thrown like normal Error object.
It would have below attributes (in addition to JS's native Error object):

| Attribute name | Description   | Example |
| -------------  | ------------- | ------- |
| code           | The error code | 404 |


------------------------

## API
Result object method APIs:

- [new Result(props)](#result)
- [isSuccess()](#issuccess)
- [get(propertiesArr)](#get)
- [getOrThrow(propertiesArr)](#getorthrow)
- [getContext()](#getcontext)
- [getContextOrThrow()](#getcontextorthrow)
- [sendResponse(res, type)](#sendresponse)
- [static newSuccess(props)](#newsuccess)
- [static newFail(props)](#newfail)

------------------------

### new Result(props)

The constructor of Result class.
It would accept a property json object as parameter for object initialization.

| Attribute name | Description   | Example |
| -------------  | ------------- | ------- |
| status         | Either 'success' or 'fail' to indicate success or fail. It would affect the handling behavour in methods like getOrThrow() | 'success' |
| code           | The status code of the result | 200 |
| error          | The error of the operation | any Error object |
| data           | The result data | any |
| message        | The result message. If code is defined and message is not defined, it would auto reuse HTTP status code's correspondng message | "OK" |

------------------------

### isSuccess()
It return a boolean to indicate whether the result is success or not.

------------------------

### get(propertiesArr)

#### parameters:

| Attribute name | Description   | Example |
| -------------  | ------------- | ------- |
| propertiesArr  | It is an optional parameters. It should be an Array of String which indicating whatever object should be returned in the return Array. The allowed attributes are ["error", "data", "code", "result", "message"]. If it is obmitted, it would default assume returning all (["error", "data", "code", "result", "message"]). | ["error", "data"] |

#### return value:

If propertiesArr is passed, the result would be an Array of propertiesArr specified attributes. Otherwise it would return an Array of all attributes.

#### Sample:
You may refer to above sample 1.

------------------------

### getOrThrow(propertiesArr)

Basically it is similar to [get()](#get) except that if the result is failed, it would throw the error instead of returning result.

#### parameters:

Same as [get()](#get)

#### return value:

Same as [get()](#get)

#### Sample:
You may refer to above sample 3.

------------------------

### getContext()

It is similar to [get()](#get).
However, the returned value is an object(attribute mapping object) instead of Array.

#### return value:

An object with attributes "error", "data", "code", "result", "message".

------------------------

### getContextOrThrow()

It is similar to [getContext()](#getcontext) except that if the result is failed, it would throw the error instead of returning result.

#### return value:

Same as [getContext()](#getcontext)

------------------------

### sendResponse(res, type)

It is a helper method if you want to directly sending HTTP response with the result code and data/error/message.

#### parameters:

| Attribute name | Description   | Example |
| -------------  | ------------- | ------- |
| res            | express response object | - |
| type           | The attribute of Result which would be used for response body. | "data", "error", "message" |

#### samples:
```javascript
//sending the result data as response body.
result.sendResponse(res, "data");

//sending the error object as response body.
result.sendResponse(res, "error");

//sending the result message as response body.
result.sendResponse(res, "message");

/* Auto determine the result body. If the result is success,
then it would sending the result data as response body.
If the result is fail, then it would sending the error 
object as response body. */
result.sendResponse(res);
```

------------------------

### static newSuccess(props)

This is a helper static factory method for creating new **'success'** result.
The "props" parameter would be passed to the constructor to create the Result instance.

#### return value:

A Result object with 'success' status.

------------------------

### static newFail(props)

This is a helper static factory method for creating new **'fail'** result.
The "props" parameter would be passed to the constructor to create the Result instance.
In addition, a new Exception object would be auto set with its error code & error message set as the Result object's code & message.

#### return value:

A Result object with 'fail' status.

------------------------
## Contact

- Eric Yu: airic.yu@gmail.com
