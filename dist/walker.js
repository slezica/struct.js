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
        throw new _utils.ValidationError('Expected a struct as 2nd parameter, got ' + struct);
      }

      if (struct === String || struct === Number || struct === Date || struct === Boolean || struct === Object) {
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
      throw new _utils.ValidationError('Validator can\'t handle struct <' + struct + '> of type <' + (0, _utils.typeName)((0, _utils.typeOf)(struct)) + '>');
    }
  }]);

  return StructWalker;
}();