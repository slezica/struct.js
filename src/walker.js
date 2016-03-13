'use strict'

import { typeOf, typeName, ValidationError } from './utils'


export class StructWalker {

  handle(object, struct) {
    if (struct == null) {
      throw new ValidationError(`Expected a struct as 2nd parameter, got ${struct}`)
    }

    if (struct === String || struct === Number || struct === Date || struct === Boolean || struct === Object) {
      return this.handleType(object, struct)
    }

    let structType = typeOf(struct)

    if (structType === Array) {
      return this.handleArray(object, struct)

    } else if (structType === Object) {
      return this.handleObject(object, struct)

    } else if (structType === Function) {
      return this.handleFunction(object, struct)

    } else {
      return this.handleUnknown(object, struct)
    }
  }

  handleUnknown(object, struct) {
    throw new ValidationError(`Validator can't handle struct <${struct}> of type <${typeName(typeOf(struct))}>`)
  }
}
