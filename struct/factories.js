'use strict'

import { validate } from './validate'
import { typeOf, typeName } from './utils'


export function instanceOf(expectedType) {
  return (object) => {
    let actualType = typeOf(object)

    return (actualType === expectedType)
      ? true
      : `This should be of type ${typeName(expectedType)}, not ${typeName(actualType)}`
  }
}


export function allOf(...structs) {
  return (object) => {
    let errors = []

    for (let struct of structs) {
      let result = validate(object, struct)
      if (result !== true) errors.push(result)
    }

    return (errors.length === 0)
      ? true
      : errors
  }
}


export function oneOf(...structs) {
  return (object) => {
    let results = structs.map(struct => validate(object, struct))

    return results.some(result => result === true)
      ? true
      : results
  }
}


export function optional(struct) {
  return (object) =>
    (object === null)
      ? true
      : validate(object, struct)
}


export function inEnum(validValues) {
  return (object) =>
    (validValues.some(value => object === value))
      ? true
      : `This should be one of [${validValues}], not ${object}`
}
