import { validate, instanceOf, oneOf, allOf, inEnum } from './struct'


class Thing {}


function lengthGT5(string) {
  return (string.length > 5)
    ? true
    : `This string's length should be greater than 5, not ${string.length}`
}


const userStruct = {
  name: {
    first: String,
    last: String
  },

  height: Number,
  birth: Date,
  flags: [ Boolean ],

  thing: instanceOf(Thing),
  code: oneOf(String, Number),
  longCode: allOf(String, lengthGT5),

  status: inEnum([ 'a', 'b', 'c' ])
}


let result = validate({
  name: {
    first: false,
    last: 1234
  },

  height: new Date(),
  birth: NaN,
  flags: [ true, 'not a flag', true ],

  thing: null,
  code: new Date(),
  longCode: 'short',

  status: 1234
}, userStruct);


console.log(result);


let struct = {
  secretCode: oneOf(String, Number)
}

// console.log(validate({ secretCode: 123 }, struct))
// console.log(validate({ secretCode: null }, struct))

class X {}

struct = {
  'x': instanceOf(X)
}

// console.log(validate({ x: new X() }, struct))
// console.log(validate({ x: 'what?' }, struct))


struct = {
  status: inEnum([ 'draft', 'sent', 'deleted' ])
}

console.log(validate({ status: 'draft' }, struct))
console.log(validate({ status: 'other' }, struct))
