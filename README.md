`struct.js` is a military-grade validation library, with focus on fluent type
definition and precise error reporting.


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
- An object with `struct` as its values (`{ name: String }`)


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

`struct.validate` is the generic `validator`. It will verify that an object
matches a `struct`, and return either `true` or a `description`.

```javascript
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
