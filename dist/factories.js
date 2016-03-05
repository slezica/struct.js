'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.instanceOf = instanceOf;
exports.allOf = allOf;
exports.oneOf = oneOf;
exports.optional = optional;
exports.inEnum = inEnum;

var _validate = require('./validate');

var _utils = require('./utils');

function instanceOf(expectedType) {
  return function (object) {
    var actualType = (0, _utils.typeOf)(object);

    return actualType === expectedType ? true : 'This should be of type ' + (0, _utils.typeName)(expectedType) + ', not ' + (0, _utils.typeName)(actualType);
  };
}

function allOf() {
  for (var _len = arguments.length, structs = Array(_len), _key = 0; _key < _len; _key++) {
    structs[_key] = arguments[_key];
  }

  return function (object) {
    var errors = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = structs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var struct = _step.value;

        var result = (0, _validate.validate)(object, struct);
        if (result !== true) errors.push(result);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return errors.length === 0 ? true : errors;
  };
}

function oneOf() {
  for (var _len2 = arguments.length, structs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    structs[_key2] = arguments[_key2];
  }

  return function (object) {
    var results = structs.map(function (struct) {
      return (0, _validate.validate)(object, struct);
    });

    return results.some(function (result) {
      return result === true;
    }) ? true : results;
  };
}

function optional(struct) {
  return function (object) {
    return object === null ? true : (0, _validate.validate)(object, struct);
  };
}

function inEnum(validValues) {
  return function (object) {
    return validValues.some(function (value) {
      return object === value;
    }) ? true : 'This should be one of [' + validValues + '], not ' + object;
  };
}