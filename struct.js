'use strict'

function typeOf(x) {
  // typeOf(undefined)   is undefined
  // typeOf(null)        is null
  // typeOf(1)           is Number
  // typeOf('foo')       is String
  // typeOf([])          is Array
  // typeOf({})          is Object
  // typeOf(new Class()) is Class
  return (x != null) ? x.constructor : x
}

function typeName(type) {
  return (type != null) ? type.name : '' + type
}


function validate(object, struct) {
  let structType = typeOf(struct)

  if (struct === String || struct === Number || struct === Date || struct === Boolean) {
    return instanceOf(object, struct)
  }

  if (structType === Array) {
    return validateArray(object, struct)

  } else if (structType === Object) {
    return validateProperties(object, struct)

  } else if (structType === Function) {
    return struct(object)
  }

}


function instanceOf(object, expectedType) {
  let actualType = typeOf(object)

  return (actualType === expectedType)
    ? true
    : `This should be of type ${typeName(expectedType)}, not ${typeName(actualType)}`
}

function validateArray(array, typeArray) {
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


function isEmpty(object) {
  return (Object.keys(object).length === 0)
}


// function validateProperties(object, struct) {
// }


class Thing {

}


let struct = {
  age: Number,
  names: [String],

  timestamp: {
    created: Date,
    updated: Date
  },

  has_thing: Boolean,
  thing: instanceOf(Thing)
}

let incorrectValue = {
  age: 'oops',
  names: ['John', 123, null],

  timestamp: {
    created: new Date(),
    updated: NaN
  },

  has_thing: 1
}

let correctValue = {
  age: 23,
  names: ['John', 'Hunt'],

  timestamp: {
    created: new Date(),
    updated: new Date()
  },

  has_thing: true
}


// console.log(validate(incorrectValue, struct));
// console.log(validate(correctValue, struct));
// console.log(validate("hello", String)) // true
// console.log(validate(123, String))    //

const userStruct = {
  name: {
    first: String,
    last: String
  },

  height: Number,
  birth: Date,
  flags: [ Boolean ]
}

console.log(validate({
  name: {
    first: false,
    last: 1234
  },

  height: new Date(),
  birth: NaN,
  flags: [ true, 'not a flag', true ]
}, userStruct));
