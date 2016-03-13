'use strict'

import { assert } from 'chai'
import { validate, isValid, requireValid, ValidationError } from '../src'

describe('validate', function() {

  // Primitive types:

  it("should validate Strings", function() {
    assert.strictEqual(validate("hello", String), true)
    assert.typeOf(validate(123, String), 'string')
    assert.typeOf(validate(null, String), 'string')
    assert.typeOf(validate(undefined, String), 'string')
  })

  it("should validate Numbers", function() {
    assert.strictEqual(validate(123, Number), true)
    assert.typeOf(validate('oops', Number), 'string')
    assert.typeOf(validate(null, Number), 'string')
    assert.typeOf(validate(undefined, Number), 'string')
  })

  it("should validate Booleans", function() {
    assert.strictEqual(validate(false, Boolean), true)
    assert.typeOf(validate(123, Boolean), 'string')
    assert.typeOf(validate(null, Boolean), 'string')
    assert.typeOf(validate(undefined, Boolean), 'string')
  })

  it("should validate Dates", function() {
    assert.strictEqual(validate(new Date(), Date), true)
    assert.typeOf(validate(123, Date), 'string')
    assert.typeOf(validate(null, Date), 'string')
    assert.typeOf(validate(undefined, Date), 'string')
  })

  it("should validate generic Objects", function() {
    assert.strictEqual(validate({}, Object), true)
    assert.typeOf(validate(new Date(), Object), 'string')
    assert.typeOf(validate(123, Object), 'string')
    assert.typeOf(validate(null, Object), 'string')
    assert.typeOf(validate(undefined, Object), 'string')
  })


  // Containers:

  it("should deep-validate Arrays", function() {
    assert.strictEqual(validate([ 1, 2, 3 ], [ Number ]), true)

    const firstProblem  = [ 'oops', 2, 3 ]
    const middleProblem = [ 1, 'oops', 3]
    const twoProblems   = [ 'oops', 2, 'oops' ]

    let result

    result = validate(firstProblem, [ Number ])
    assert.typeOf(result[0], 'string')
    assert.equal(Object.keys(result).length, 1)

    result = validate(middleProblem, [ Number ])
    assert.typeOf(result[1], 'string')
    assert.equal(Object.keys(result).length, 1)

    result = validate(twoProblems, [ Number ])
    assert.typeOf(result[0], 'string')
    assert.typeOf(result[2], 'string')
    assert.equal(Object.keys(result).length, 2)
  })

  it("should deep-validate Objects", function() {
    const struct = {
      name: {
        first: String,
        last : String
      },

      age: Number
    }

    let result

    // Root problems:
    result = validate({}, struct)
    assert.typeOf(result.name, 'string')
    assert.typeOf(result.age, 'string')

    result = validate({ name: null, age: 10 }, struct)
    assert.typeOf(result.name, 'string')
    assert.notProperty(result, 'age')

    // Deep problems:
    result = validate({ name: { first: 'John' }, age: 10 }, struct)
    assert.typeOf(result.name.last, 'string')
    assert.notProperty(result.name, 'first')
    assert.notProperty(result, 'age')

    result = validate({ name: { first: Number }, age: 10 }, struct)
    assert.typeOf(result.name.last, 'string')
    assert.typeOf(result.name.first, 'string')
    assert.notProperty(result, 'age')
  })


  // Validators:

  it("should propery run validators", function() {
    const alwaysFail = {
      foo: () => "Problem"
    }

    assert.typeOf(validate({}, alwaysFail).foo, 'string')
    assert.typeOf(validate({ foo: 1 }, alwaysFail).foo, 'string')

    const alwaysSucceed = {
      foo: () => true
    }

    assert.strictEqual(validate({}, alwaysSucceed), true)
    assert.strictEqual(validate({ foo: 1 }, alwaysSucceed), true)
  })
})


describe('isValid', function() {
  it("should return false, not details", function() {
    assert.strictEqual(isValid(1, String), false)
  })
})


describe('requireValid', function() {
  it("should throw a ValidationError", function() {
    assert.throws(() => requireValid(1, String), ValidationError)
  })
})
