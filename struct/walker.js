'use strict'

import { typeOf } from './utils'


export class StructWalker {
  walk(object, struct) {
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
    }
  }
}
