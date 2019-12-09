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
 * Intro.js Steps Component.
 */
var Steps = function (_Component) {
  _inherits(Steps, _Component);

  /**
   * Creates a new instance of the component.
   * @class
   * @param {Object} props - The props of the component.
   */

  /**
   * React Props
   * @type {Object}
   */
  function Steps(props) {
    _classCallCheck(this, Steps);

    var _this = _possibleConstructorReturn(this, (Steps.__proto__ || Object.getPrototypeOf(Steps)).call(this, props));

    _this.onExit = function () {
      var onExit = _this.props.onExit;


      _this.isVisible = false;

      onExit(_this.introJs._currentStep);
    };

    _this.onBeforeExit = function () {
      var onBeforeExit = _this.props.onBeforeExit;


      if (onBeforeExit) {
        return onBeforeExit(_this.introJs._currentStep);
      }

      return true;
    };

    _this.onBeforeChange = function () {
      if (!_this.isVisible) {
        return true;
      }

      var _this$props = _this.props,
          onBeforeChange = _this$props.onBeforeChange,
          onPreventChange = _this$props.onPreventChange;


      if (onBeforeChange) {
        var continueStep = onBeforeChange(_this.introJs._currentStep);

        if (continueStep === false && onPreventChange) {
          setTimeout(function () {
            onPreventChange(_this.introJs._currentStep);
          }, 0);
        }

        return continueStep;
      }

      return true;
    };

    _this.onAfterChange = function (element) {
      if (!_this.isVisible) {
        return;
      }

      var onAfterChange = _this.props.onAfterChange;


      if (onAfterChange) {
        onAfterChange(_this.introJs._currentStep, element);
      }
    };

    _this.onChange = function (element) {
      if (!_this.isVisible) {
        return;
      }

      var onChange = _this.props.onChange;


      if (onChange) {
        onChange(_this.introJs._currentStep, element);
      }
    };

    _this.onComplete = function () {
      var onComplete = _this.props.onComplete;


      if (onComplete) {
        onComplete();
      }
    };

    _this.updateStepElement = function (stepIndex) {
      var element = document.querySelector(_this.introJs._options.steps[stepIndex].element);

      if (element) {
        _this.introJs._introItems[stepIndex].element = element;
        _this.introJs._introItems[stepIndex].position = _this.introJs._options.steps[stepIndex].position || 'auto';
      }
    };

    _this.introJs = null;
    _this.isConfigured = false;
    // We need to manually keep track of the visibility state to avoid a callback hell.
    _this.isVisible = false;

    _this.installIntroJs();
    return _this;
  }

  /**
   * Lifecycle: componentDidMount.
   * We use this event to enable Intro.js steps at mount time if enabled right from the start.
   */


  /**
   * React Default Props
   * @type {Object}
   */


  _createClass(Steps, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.enabled) {
        this.configureIntroJs();
        this.renderSteps();
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
          steps = _props.steps,
          options = _props.options;


      if (!this.isConfigured || prevProps.steps !== steps || prevProps.options !== options) {
        this.configureIntroJs();
        this.renderSteps();
      }

      if (prevProps.enabled !== enabled) {
        this.renderSteps();
      }
    }

    /**
     * Lifecycle: componentWillUnmount.
     * We use this even to hide the steps when the component is unmounted.
     */

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.introJs.exit();
    }

    /**
     * Triggered when Intro.js steps are exited.
     */


    /**
     * Triggered before exiting the intro.
     * @return {Boolean} Returning `false` will prevent exiting the intro.
     */


    /**
     * Triggered before changing step.
     * @return {Boolean} Returning `false` will prevent the step transition.
     */


    /**
     * Triggered after changing step.
     * @param  {HTMLElement} element - The element associated to the new step.
     */


    /**
     * Triggered when changing step.
     * @param  {HTMLElement} element - The element associated to the next step.
     */


    /**
     * Triggered when completing all the steps.
     */


    /**
     * Updates the element associated to a step based on its index.
     * This is useful when the associated element is not present in the DOM on page load.
     * @param  {number} stepIndex - The index of the step to update.
     */

  }, {
    key: 'installIntroJs',


    /**
     * Installs Intro.js.
     */
    value: function installIntroJs() {
      this.introJs = (0, _intro2.default)();

      this.introJs.onexit(this.onExit);
      this.introJs.onbeforeexit(this.onBeforeExit);
      this.introJs.onbeforechange(this.onBeforeChange);
      this.introJs.onafterchange(this.onAfterChange);
      this.introJs.onchange(this.onChange);
      this.introJs.oncomplete(this.onComplete);
    }

    /**
     * Configures Intro.js if not already configured.
     */

  }, {
    key: 'configureIntroJs',
    value: function configureIntroJs() {
      var _props2 = this.props,
          options = _props2.options,
          steps = _props2.steps;


      this.introJs.setOptions(_extends({}, options, { steps: steps }));

      this.isConfigured = true;
    }

    /**
     * Renders the Intro.js steps.
     */

  }, {
    key: 'renderSteps',
    value: function renderSteps() {
      var _props3 = this.props,
          enabled = _props3.enabled,
          initialStep = _props3.initialStep,
          steps = _props3.steps,
          onStart = _props3.onStart;


      if (enabled && steps.length > 0 && !this.isVisible) {
        this.introJs.start();

        this.isVisible = true;

        this.introJs.goToStepNumber(initialStep + 1);

        if (onStart) {
          onStart(this.introJs._currentStep);
        }
      } else if (!enabled && this.isVisible) {
        this.isVisible = false;

        this.introJs.exit();
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

  return Steps;
}(_react.Component);

Steps.propTypes = {
  enabled: _propTypes2.default.bool,
  initialStep: _propTypes2.default.number.isRequired,
  steps: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    element: _propTypes2.default.string,
    intro: _propTypes2.default.string.isRequired,
    position: introJsPropTypes.tooltipPosition,
    tooltipClass: _propTypes2.default.string,
    highlightClass: _propTypes2.default.string
  })).isRequired,
  onStart: _propTypes2.default.func,
  onExit: _propTypes2.default.func.isRequired,
  onBeforeExit: _propTypes2.default.func,
  onBeforeChange: _propTypes2.default.func,
  onAfterChange: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onPreventChange: _propTypes2.default.func,
  onComplete: _propTypes2.default.func,
  options: introJsPropTypes.options
};
Steps.defaultProps = {
  enabled: false,
  onStart: null,
  onBeforeExit: null,
  onBeforeChange: null,
  onAfterChange: null,
  onChange: null,
  onPreventChange: null,
  onComplete: null,
  options: introJsDefaultProps.options
};
exports.default = Steps;