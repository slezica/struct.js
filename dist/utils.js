'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeOf = typeOf;
exports.typeName = typeName;
exports.isEmpty = isEmpty;
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