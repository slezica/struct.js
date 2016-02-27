'use strict'

import { typeOf, typeName, isEmpty } from './utils'


export function validate(object, struct) {
  let structType = typeOf(struct)

  if (struct === String || struct === Number || struct === Date || struct === Boolean) {
    return validateType(object, struct)
  }

  if (structType === Array) {
    return validateItems(object, struct)

  } else if (structType === Object) {
    return validateProperties(object, struct)

  } else if (structType === Function) {
    return struct(object)
  }

}


function validateType(object, expectedType) {
  let actualType = typeOf(object)

  return (actualType === expectedType)
    ? true
    : `This should be of type ${typeName(expectedType)}, not ${typeName(actualType)}`
}


function validateItems(array, typeArray) {
  let innerType = typeArray[0]
  let errors = {} // array-like object

  array.forEach((item, index) => {
    let result = validate(item, innerType)
    if (result !== true) errors[index] = result
  })

  return isEmpty(errors) ? true : errors
}


function validateProperties(object, struct) {
  let errors = {}

  Object.keys(object).forEach((key) => {
    let result = validate(object[key], struct[key])
    if (result !== true) errors[key] = result
  })

  return isEmpty(errors) ? true : errors
}
