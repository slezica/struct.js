'use strict'

import { typeOf, typeName, isEmpty } from './utils'
import { StructWalker } from './walker'


export function validate(object, struct) {
  return new Validator().handle(object, struct)
}


export class Validator extends StructWalker {

  handleType(object, expectedType) {
    let actualType = typeOf(object)

    return (actualType === expectedType)
      ? true
      : `This should be of type ${typeName(expectedType)}, not ${typeName(actualType)}`
  }

  handleArray(array, [ innerType ]) {
    let errors = {} // array-like object

    array.forEach((item, index) => {
      let result = this.handle(item, innerType)
      if (result !== true) errors[index] = result
    })

    return isEmpty(errors) ? true : errors
  }

  handleFunction(object, func) {
    return func(object)
  }

  handleObject(object, struct) {
    let errors = {}

    Object.keys(object).forEach((key) => {
      let result = this.handle(object[key], struct[key])
      if (result !== true) errors[key] = result
    })

    return isEmpty(errors) ? true : errors
  }

}
