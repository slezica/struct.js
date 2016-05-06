'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeOf = typeOf;
exports.typeName = typeName;
exports.isEmpty = isEmpty;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function typeOf(x) {
  // typeOf(undefined)   is undefined
  // typeOf(null)        is null
  // typeOf(1)           is Number
  // typeOf('foo')       is String
  // typeOf([])          is Array
  // typeOf({})          is Object
  // typeOf(new Class()) is Class
  return x != null ? x.constructor : x;
}

function typeName(type) {
  return type != null ? type.name : '' + type;
}

function isEmpty(object) {
  return Object.keys(object).length === 0;
}

var ValidationError = exports.ValidationError = function ValidationError(details) {
  _classCallCheck(this, ValidationError);

  this.message = "Struct validation failed";
  this.details = details;
  this.stack = this.message + '\n' + new Error().stack.split('\n').slice(1).join('\n') + '\n' + 'Reason: ' + JSON.stringify(details, null, 2);
};