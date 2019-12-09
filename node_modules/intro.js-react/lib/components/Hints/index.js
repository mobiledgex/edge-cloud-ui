'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _intro = require('intro.js');

var _intro2 = _interopRequireDefault(_intro);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _proptypes = require('../../helpers/proptypes');

var introJsPropTypes = _interopRequireWildcard(_proptypes);

var _defaultProps = require('../../helpers/defaultProps');

var introJsDefaultProps = _interopRequireWildcard(_defaultProps);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Intro.js Hints Component.
 */
var Hints = function (_Component) {
  _inherits(Hints, _Component);

  /**
   * Creates a new instance of the component.
   * @class
   * @param {Object} props - The props of the component.
   */

  /**
   * React Props
   * @type {Object}
   */
  function Hints(props) {
    _classCallCheck(this, Hints);

    var _this = _possibleConstructorReturn(this, (Hints.__proto__ || Object.getPrototypeOf(Hints)).call(this, props));

    _this.introJs = null;
    _this.isConfigured = false;

    _this.installIntroJs();
    return _this;
  }

  /**
   * Lifecycle: componentDidMount.
   * We use this event to enable Intro.js hints at mount time if enabled right from the start.
   */


  /**
   * React Default Props
   * @type {Object}
   */


  _createClass(Hints, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.enabled) {
        this.configureIntroJs();
        this.renderHints();
      }
    }

    /**
     * Lifecycle: componentDidUpdate.
     * @param  {Object} prevProps - The previous props.
     */

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _props = this.props,
          enabled = _props.enabled,
          hints = _props.hints,
          options = _props.options;


      if (!this.isConfigured || prevProps.hints !== hints || prevProps.options !== options) {
        this.configureIntroJs();
        this.renderHints();
      }

      if (prevProps.enabled !== enabled) {
        this.renderHints();
      }
    }

    /**
     * Lifecycle: componentWillUnmount.
     * We use this even to hide the hints when the component is unmounted.
     */

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.introJs.hideHints();
    }

    /**
     * Installs Intro.js.
     */

  }, {
    key: 'installIntroJs',
    value: function installIntroJs() {
      this.introJs = (0, _intro2.default)();

      var _props2 = this.props,
          onClick = _props2.onClick,
          onClose = _props2.onClose;


      if (onClick) {
        this.introJs.onhintclick(onClick);
      }

      if (onClose) {
        this.introJs.onhintclose(onClose);
      }
    }

    /**
     * Configures Intro.js if not already configured.
     */

  }, {
    key: 'configureIntroJs',
    value: function configureIntroJs() {
      var _props3 = this.props,
          options = _props3.options,
          hints = _props3.hints;

      // We need to remove all hints otherwise new hints won't be added.

      this.introJs.removeHints();

      this.introJs.setOptions(_extends({}, options, { hints: hints }));

      this.isConfigured = true;
    }

    /**
     * Renders the Intro.js hints.
     */

  }, {
    key: 'renderHints',
    value: function renderHints() {
      var _props4 = this.props,
          enabled = _props4.enabled,
          hints = _props4.hints;


      if (enabled && hints.length > 0) {
        this.introJs.showHints();
      } else if (!enabled) {
        this.introJs.hideHints();
      }
    }

    /**
     * Renders the component.
     * @return {null} We do not want to render anything.
     */

  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return Hints;
}(_react.Component);

Hints.propTypes = {
  enabled: _propTypes2.default.bool,
  hints: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    element: _propTypes2.default.string.isRequired,
    hint: _propTypes2.default.string.isRequired,
    hintPosition: introJsPropTypes.hintPosition
  })).isRequired,
  onClick: _propTypes2.default.func,
  onClose: _propTypes2.default.func,
  options: introJsPropTypes.options
};
Hints.defaultProps = {
  enabled: false,
  onClick: null,
  onClose: null,
  options: introJsDefaultProps.options
};
exports.default = Hints;