'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = function (animationSourceMap) {
  if (animationSourceMap && animationSourceMap.prototype && animationSourceMap.prototype.render) {
    var ComposedComponent = animationSourceMap;
    return enhance(undefined, ComposedComponent);
  } else {
    return enhance.bind(undefined, animationSourceMap);
  }
};

var _react = require('react');

var _attachRefs = require('./attachRefs');

var _attachRefs2 = _interopRequireDefault(_attachRefs);

var _Controller = require('./Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _createTarget = require('./createTarget');

var _createTarget2 = _interopRequireDefault(_createTarget);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function enhance(animationSourceMap, ComposedComponent) {
  var GSAPEnhancer = function (_ComposedComponent) {
    _inherits(GSAPEnhancer, _ComposedComponent);

    function GSAPEnhancer(props) {
      _classCallCheck(this, GSAPEnhancer);

      var _this = _possibleConstructorReturn(this, (GSAPEnhancer.__proto__ || Object.getPrototypeOf(GSAPEnhancer)).call(this, props));

      _this.addAnimation = function (animationSource, options) {
        //if the animation is in the source map the if from there
        var sourceMap = _this.__animationSourceMap;
        if (sourceMap && sourceMap[animationSource]) {
          animationSource = sourceMap[animationSource];
        }

        if (process.env.NODE_ENV !== 'production') {
          if (typeof animationSource !== 'function') {
            var error = '[react-gsap-enhancer] animationSource (the first parameter of ' + ('addAnimation(animationSource, options)) has to be a function instead of "' + animationSource + '"');
            if (sourceMap) {
              error += '\nYou provided a sourceMap so the animationSource also can' + (' be a string key of these: [' + Object.keys(sourceMap) + ']');
            }
            var name = Object.getPrototypeOf(Object.getPrototypeOf(_this)).constructor.name;
            error += '\nCheck out the addAnimation() call in ' + name;
            throw Error(error);
          }
        }

        var target = (0, _createTarget2.default)(_this.__itemTree);
        var controller = new _Controller2.default(animationSource, options, target, function () {
          return (0, _utils.reattachAll)(_this.__itemTree, _this.__runningAnimations);
        }, function () {
          _this.__runningAnimations.delete(controller);
          //rerender the component without the animation
          _this.forceUpdate();
        });
        _this.__runningAnimations.add(controller);
        //the animation will be attached on the next render so force the update
        _this.forceUpdate();

        return controller;
      };

      _this.__itemTree = new Map();
      _this.__runningAnimations = new Set();
      _this.__animationSourceMap = animationSourceMap;
      return _this;
    }

    _createClass(GSAPEnhancer, [{
      key: 'removeAnimation',
      value: function removeAnimation(controller) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[react-gsap-enhancer] component.removeAnimation(controller)' + ' is deprecated. Use just controller.kill() instead!');
        }
        controller.kill();
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        (0, _utils.saveRenderedStyles)(this.__itemTree);

        if (_get(GSAPEnhancer.prototype.__proto__ || Object.getPrototypeOf(GSAPEnhancer.prototype), 'componentDidMount', this)) {
          var _get2;

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          (_get2 = _get(GSAPEnhancer.prototype.__proto__ || Object.getPrototypeOf(GSAPEnhancer.prototype), 'componentDidMount', this)).call.apply(_get2, [this].concat(args));
        }
      }
    }, {
      key: 'componentWillUpdate',
      value: function componentWillUpdate() {
        (0, _utils.restoreRenderedStyles)(this.__itemTree);

        if (_get(GSAPEnhancer.prototype.__proto__ || Object.getPrototypeOf(GSAPEnhancer.prototype), 'componentWillUpdate', this)) {
          var _get3;

          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          (_get3 = _get(GSAPEnhancer.prototype.__proto__ || Object.getPrototypeOf(GSAPEnhancer.prototype), 'componentWillUpdate', this)).call.apply(_get3, [this].concat(args));
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _get4;

        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        var element = (_get4 = _get(GSAPEnhancer.prototype.__proto__ || Object.getPrototypeOf(GSAPEnhancer.prototype), 'render', this)).call.apply(_get4, [this].concat(args));
        if ((0, _react.isValidElement)(element)) {
          return (0, _attachRefs2.default)(element, this.__itemTree);
        } else {
          //let React throwing an error for invalid element
          return element;
        }
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        (0, _utils.saveRenderedStyles)(this.__itemTree);
        (0, _utils.attachAll)(this.__runningAnimations);

        if (_get(GSAPEnhancer.prototype.__proto__ || Object.getPrototypeOf(GSAPEnhancer.prototype), 'componentDidUpdate', this)) {
          var _get5;

          for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          (_get5 = _get(GSAPEnhancer.prototype.__proto__ || Object.getPrototypeOf(GSAPEnhancer.prototype), 'componentDidUpdate', this)).call.apply(_get5, [this].concat(args));
        }
      }
    }]);

    return GSAPEnhancer;
  }(ComposedComponent);

  //TODO test this
  // Class inheritance uses Object.create and because of __proto__ issues
  // with IE <10 any static properties of the superclass aren't inherited and
  // so need to be manually populated
  // See http://babeljs.io/docs/advanced/caveats/#classes-10-and-below-
  // var staticKeys = [
  //   'defaultProps',
  //   'propTypes',
  //   'contextTypes',
  //   'childContextTypes'
  // ]
  //
  // staticKeys.forEach((key) => {
  //   if (ComposedComponent.hasOwnProperty(key)) {
  //     GSAPEnhancer[key] = ComposedComponent[key]
  //   }
  // })

  //TODO test this
  // if (process.env.NODE_ENV !== 'production') {
  //   // This fixes React Hot Loader by exposing the original components top level
  //   // prototype methods on the enhanced prototype as discussed in
  //   // https://github.com/FormidableLabs/radium/issues/219
  //   Object.keys(ComposedComponent.prototype).forEach(key => {
  //     if (!GSAPEnhancer.prototype.hasOwnProperty(key)) {
  //       var descriptor = Object.getOwnPropertyDescriptor(ComposedComponent.prototype, key)
  //       Object.defineProperty(GSAPEnhancer.prototype, key, descriptor)
  //     }
  //   })
  // }

  var composedName = ComposedComponent.displayName || ComposedComponent.name || 'Component';
  var displayName = 'GSAP(' + composedName + ')';
  Object.defineProperty(GSAPEnhancer, 'displayName', { value: displayName, writable: true, configurable: true });

  return GSAPEnhancer;
}
//# sourceMappingURL=gsap-enhancer.js.map