import { validate, instanceOf, oneOf, allOf } from './struct'


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
  longCode: allOf(String, lengthGT5)
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
  longCode: 'short'
}, userStruct);


let struct = {
  secretCode: oneOf(String, Number)
}

console.log(validate({ secretCode: 123 }, struct))
console.log(validate({ secretCode: null }, struct))

class X {}

struct = {
  'x': instanceOf(X)
}

console.log(validate({ x: new X() }, struct))
console.log(validate({ x: 'what?' }, struct))
