'use strict'

import { typeOf, typeName } from './utils'


export class StructWalker {
  handle(object, struct) {
    if (struct === String || struct === Number || struct === Date || struct === Boolean) {
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
    throw new Error(`Validator can't handle struct <${struct}> of type <${typeName(typeOf(struct))}>`)
  }
}
