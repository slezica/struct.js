'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.instanceOf = instanceOf;
exports.allOf = allOf;
exports.oneOf = oneOf;
exports.optional = optional;
exports.inEnum = inEnum;

var _validate = require('./validate');

var _utils = require('./utils');

function instanceOf(expectedType) {
  return function (object) {
    var actualType = (0, _utils.typeOf)(object);

    return actualType === expectedType ? true : 'This should be of type ' + (0, _utils.typeName)(expectedType) + ', not ' + (0, _utils.typeName)(actualType);
  };
}

function allOf() {
  for (var _len = arguments.length, structs = Array(_len), _key = 0; _key < _len; _key++) {
    structs[_key] = arguments[_key];
  }

  return function (object) {
    var errors = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = structs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var struct = _step.value;

        var result = (0, _validate.validate)(object, struct);
        if (result !== true) errors.push(result);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return errors.length === 0 ? true : errors;
  };
}

function oneOf() {
  for (var _len2 = arguments.length, structs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    structs[_key2] = arguments[_key2];
  }

  return function (object) {
    var results = structs.map(function (struct) {
      return (0, _validate.validate)(object, struct);
    });

    return results.some(function (result) {
      return result === true;
    }) ? true : results;
  };
}

function optional(struct) {
  return function (object) {
    return object === null ? true : (0, _validate.validate)(object, struct);
  };
}

function inEnum(validValues) {
  return function (object) {
    return validValues.some(function (value) {
      return object === value;
    }) ? true : 'This should be one of [' + validValues + '], not ' + object;
  };
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validate = require('./validate');

Object.defineProperty(exports, 'validate', {
  enumerable: true,
  get: function get() {
    return _validate.validate;
  }
});

var _factories = require('./factories');

var _loop = function _loop(_key3) {
  if (_key3 === "default") return 'continue';
  Object.defineProperty(exports, _key3, {
    enumerable: true,
    get: function get() {
      return _factories[_key3];
    }
  });
};

for (var _key3 in _factories) {
  var _ret = _loop(_key3);

  if (_ret === 'continue') continue;
}

var _utils = require('./utils');

var _loop2 = function _loop2(_key4) {
  if (_key4 === "default") return 'continue';
  Object.defineProperty(exports, _key4, {
    enumerable: true,
    get: function get() {
      return _utils[_key4];
    }
  });
};

for (var _key4 in _utils) {
  var _ret2 = _loop2(_key4);

  if (_ret2 === 'continue') continue;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeOf = typeOf;
exports.typeName = typeName;
exports.isEmpty = isEmpty;
function typeOf(x) {
  // typeOf(undefined)   is undefined
  // typeOf(null)        is null
  // typeOf(1)           is Number
  // typeOf('foo')       is String
  // typeOf([])          is Array
  // typeOf({})          is Object
  // typeOf(new Class()) is Class
  return x != null ? x.constructor : x;
}

function typeName(type) {
  return type != null ? type.name : '' + type;
}

function isEmpty(object) {
  return Object.keys(object).length === 0;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Validator = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.validate = validate;

var _utils = require('./utils');

var _walker = require('./walker');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function validate(object, struct, options) {
  return new Validator(options).handle(object, struct);
}

var Validator = exports.Validator = function (_StructWalker) {
  _inherits(Validator, _StructWalker);

  function Validator(options) {
    _classCallCheck(this, Validator);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Validator).call(this));

    var defaults = {
      strict: true
    };

    _this.options = Object.assign(defaults, options);
    return _this;
  }

  _createClass(Validator, [{
    key: 'handleType',
    value: function handleType(object, expectedType) {
      var actualType = (0, _utils.typeOf)(object);

      return actualType === expectedType ? true : 'This should be of type ' + (0, _utils.typeName)(expectedType) + ', not ' + (0, _utils.typeName)(actualType);
    }
  }, {
    key: 'handleArray',
    value: function handleArray(array, _ref) {
      var _this2 = this;

      var _ref2 = _slicedToArray(_ref, 1);

      var innerType = _ref2[0];

      if (array == null) return 'This should be an Array, not ' + array;

      var errors = {}; // sparse array-like object

      array.forEach(function (item, index) {
        var result = _this2.handle(item, innerType);
        if (result !== true) errors[index] = result;
      });

      return (0, _utils.isEmpty)(errors) ? true : errors;
    }
  }, {
    key: 'handleFunction',
    value: function handleFunction(object, func) {
      return func(object);
    }
  }, {
    key: 'handleObject',
    value: function handleObject(object, struct) {
      var _this3 = this;

      if (object == null) return 'This should be an Object, not ' + object;

      var errors = {};

      Object.keys(struct).forEach(function (key) {
        var result = _this3.handle(object[key], struct[key]);
        if (result !== true) errors[key] = result;
      });

      if (this.options.strict) {
        Object.keys(object).forEach(function (key) {
          if (struct[key] == null) errors[key] = "This property should not be present";
        });
      }

      return (0, _utils.isEmpty)(errors) ? true : errors;
    }
  }]);

  return Validator;
}(_walker.StructWalker);
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StructWalker = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StructWalker = exports.StructWalker = function () {
  function StructWalker() {
    _classCallCheck(this, StructWalker);
  }

  _createClass(StructWalker, [{
    key: 'handle',
    value: function handle(object, struct) {
      if (struct == null) {
        throw new Error('Expected a struct as 2nd parameter, got ' + struct);
      }

      if (struct === String || struct === Number || struct === Date || struct === Boolean) {
        return this.handleType(object, struct);
      }

      var structType = (0, _utils.typeOf)(struct);

      if (structType === Array) {
        return this.handleArray(object, struct);
      } else if (structType === Object) {
        return this.handleObject(object, struct);
      } else if (structType === Function) {
        return this.handleFunction(object, struct);
      } else {
        return this.handleUnknown(object, struct);
      }
    }
  }, {
    key: 'handleUnknown',
    value: function handleUnknown(object, struct) {
      throw new Error('Validator can\'t handle struct <' + struct + '> of type <' + (0, _utils.typeName)((0, _utils.typeOf)(struct)) + '>');
    }
  }]);

  return StructWalker;
}();
