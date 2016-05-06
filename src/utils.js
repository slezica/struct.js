'use strict'

export function typeOf(x) {
  // typeOf(undefined)   is undefined
  // typeOf(null)        is null
  // typeOf(1)           is Number
  // typeOf('foo')       is String
  // typeOf([])          is Array
  // typeOf({})          is Object
  // typeOf(new Class()) is Class
  return (x != null) ? x.constructor : x
}


export function typeName(type) {
  return (type != null) ? type.name : '' + type
}


export function isEmpty(object) {
  return (Object.keys(object).length === 0)
}


export class ValidationError {
  constructor(details) {
    this.message = "Struct validation failed"
    this.details = details
    this.stack   = this.message + '\nat ' + new Error().stack.slice(1) + '\nReason: ' + JSON.stringify(details, null, 2)
  }
}
