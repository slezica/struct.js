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