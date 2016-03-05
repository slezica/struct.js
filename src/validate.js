'use strict'

import { typeOf, typeName, isEmpty } from './utils'
import { StructWalker } from './walker'


export function validate(object, struct, options) {
  return new Validator(options).handle(object, struct)
}


export class Validator extends StructWalker {

  constructor(options) {
    super()

    const defaults = {
      strict: true
    }

    this.options = Object.assign(defaults, options)
  }

  handleType(object, expectedType) {
    let actualType = typeOf(object)

    return (actualType === expectedType)
      ? true
      : `This should be of type ${typeName(expectedType)}, not ${typeName(actualType)}`
  }

  handleArray(array, [ innerType ]) {
    if (array == null) return `This should be an Array, not ${array}`

    let errors = {} // sparse array-like object

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
    if (object == null) return `This should be an Object, not ${object}`

    let errors = {}

    Object.keys(struct).forEach((key) => {
      let result = this.handle(object[key], struct[key])
      if (result !== true) errors[key] = result
    })

    if (this.options.strict) {
      Object.keys(object).forEach((key) => {
        if (struct[key] == null)
          errors[key] = "This property should not be present"
      })
    }

    return isEmpty(errors) ? true : errors
  }

}
