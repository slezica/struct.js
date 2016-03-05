# Welcome

`struct.js` is a military-grade validation library, with focus on fluent type
definition and precise error reporting.

```
npm install struct-js
```

## Terminology

A `validator` is a `Function` that returns either exactly `true` or the precise
`description` of all errors.

For simple values, the `description` is a `String`. For containers, the
`description` is a mapping of keys to their individual error `description`.

```javascript
function equalsOne(object) {
  return (object === 1) ? true : `Expected 1, not ${object}`
}
```

A `struct` is an object where each key is:

- A built-in type (`String`, `Number`, `Boolean`, or `Date`)
- A `validator` function (`equalsOne`)
- An array with a `struct` as its only element (`[ String ]`)
- An object with a `struct` as its values (`{ name: String }`)


```javascript
const userStruct = {
  name: {
    first: String,
    last: String
  },

  height: Number,
  birth: Date,
  flags: [ Boolean ]
}
```


## Validate

`validate()` is the generic `validator`. It will verify that an object
matches a `struct`, and return either `true` or a `description`.

```javascript
import { validate } from 'struct-js'

validate("hello", String) // true
validate(123, String)     // "This should be of type String, not Number"
```

Let's see `struct.validate` handle an invalid `userStruct`:

```javascript
let invalidUser = {
  name: {
    first: false,
    last: 1234
  },

  height: new Date(),
  birth: NaN,
  flags: [ true, 'not a flag', true ]
}

validate(invalidUser, userStruct)
```

```javascript
{
  name: {
    first: 'This should be of type String, not Boolean',
    last: 'This should be of type String, not Number'
  },

  height: 'This should be of type Number, not Date',
  birth: 'This should be of type Date, not Number',

  flags: { '1': 'This should be of type Boolean, not String' }
}
```


## Advanced Validators

The recommended pattern for creating advanced `validators` is to use a `factory`,
a function that given parameters returns a `validator`. For example, a more
generic version of `equalsOne`:

```javascript
function equals(number) {
  return (object) =>
    (object === number) ? true : `Expected ${number}, not ${object}`
}
```

`struct.js` alredy comes with some useful `factories`. `import` them from the
module.


#### optional

`optional(struct)` allows an object to be `null` or `undefined`, validating
it against `struct` if not.

```javascript
const struct = {
  unimportant: optional(String)
}

validate({ unimportant: 'nothing' }, struct) // true
validate({ unimportant: null }, struct)      // true
validate({}, struct)                         // true
```


#### instanceOf

`instanceOf(Class)` verifies an object is an insance of a `Class`.

```javascript
class X {}

const struct = {
  'x': instanceOf(X)
}

validate({ x: new X() }, struct) // true
validate({ x: 'what?' }, struct)
```

```javascript
{ x: 'This should be of type X, not String' }
```


#### oneOf

`oneOf(...structs)` validates an object against many `structs`, returning `true`
if any validation is successful, an array of error `descriptions` otherwise.

```javascript
const struct = {
  secretCode: oneOf(String, Number)
}

validate({ secretCode: 123 }, struct) // true
validate({ secretCode: null }, struct)
```

```javascript
{
  secretCode:  [
    'This should be of type String, not null',
    'This should be of type Number, not null'
  ]
}
```


#### allOf

`allOf(...structs)` validates an object against many `structs`, returning `true`
only if **all** validations are successful, an array of error `descriptions`
otherwise.

```javascript
const struct = {
  name: allOf(String, minLength(4))
}

validate({ name: 'John' }, struct) // true
validate({ name: '!' }, struct)
```

```javascript
{
  name:  [ 'This should be have length >= 4, not 1' ]
}
```


#### inEnum

`inEnum(validValues)` ensures an object is found in an array of `validValues`.

```javascript
const struct = {
  status: inEnum([ 'draft', 'sent', 'deleted' ])
}

validate({ status: 'draft' }, struct) // true
validate({ status: 'other' }, struct)
```

```javascript
{
  status: 'This should be one of [draft,sent,deleted], not other'
}
```


## Usage patterns

`struct.js` can be extremely effective at controlling code complexity and ensuring
correctness. Here are some patterns to explore.

### Named structs

Assign names to `structs`, and compose them into complex type definitions:

```javascript
const userStruct = {
  name: String,
  age : Number
}

const groupStruct = {
  leader : userStruct,
  members: [ userStruct ]
}
```
