Object.defineProperty(exports, '__esModule', {
  value: true
});

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactForAtom;

function _load_reactForAtom() {
  return _reactForAtom = require('react-for-atom');
}

var _nuclideUiButton;

function _load_nuclideUiButton() {
  return _nuclideUiButton = require('../../nuclide-ui/Button');
}

var _nuclideUiButtonGroup;

function _load_nuclideUiButtonGroup() {
  return _nuclideUiButtonGroup = require('../../nuclide-ui/ButtonGroup');
}

var _nuclideUiCheckbox;

function _load_nuclideUiCheckbox() {
  return _nuclideUiCheckbox = require('../../nuclide-ui/Checkbox');
}

var _ChromeActionRegistryActions;

function _load_ChromeActionRegistryActions() {
  return _ChromeActionRegistryActions = _interopRequireDefault(require('./ChromeActionRegistryActions'));
}

var _DebuggerStore;

function _load_DebuggerStore() {
  return _DebuggerStore = require('./DebuggerStore');
}

var DebuggerSteppingComponent = (function (_React$Component) {
  _inherits(DebuggerSteppingComponent, _React$Component);

  function DebuggerSteppingComponent(props) {
    _classCallCheck(this, DebuggerSteppingComponent);

    _get(Object.getPrototypeOf(DebuggerSteppingComponent.prototype), 'constructor', this).call(this, props);
  }

  _createClass(DebuggerSteppingComponent, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var actions = _props.actions;
      var debuggerMode = _props.debuggerMode;
      var pauseOnException = _props.pauseOnException;
      var pauseOnCaughtException = _props.pauseOnCaughtException;
      var allowSingleThreadStepping = _props.allowSingleThreadStepping;
      var singleThreadStepping = _props.singleThreadStepping;
      var customControlButtons = _props.customControlButtons;

      var isPaused = debuggerMode === (_DebuggerStore || _load_DebuggerStore()).DebuggerMode.PAUSED;
      return (_reactForAtom || _load_reactForAtom()).React.createElement(
        'div',
        { className: 'nuclide-debugger-stepping-component' },
        (_reactForAtom || _load_reactForAtom()).React.createElement(
          (_nuclideUiButtonGroup || _load_nuclideUiButtonGroup()).ButtonGroup,
          { className: 'nuclide-debugger-stepping-buttongroup' },
          (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiButton || _load_nuclideUiButton()).Button, {
            icon: isPaused ? 'playback-play' : 'playback-pause',
            title: isPaused ? 'continue' : 'pause',
            onClick: actions.triggerDebuggerAction.bind(actions, (_ChromeActionRegistryActions || _load_ChromeActionRegistryActions()).default.PAUSE)
          }),
          (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiButton || _load_nuclideUiButton()).Button, {
            icon: 'arrow-right',
            title: 'step over',
            onClick: actions.triggerDebuggerAction.bind(actions, (_ChromeActionRegistryActions || _load_ChromeActionRegistryActions()).default.STEP_OVER)
          }),
          (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiButton || _load_nuclideUiButton()).Button, {
            icon: 'arrow-down',
            title: 'step into',
            onClick: actions.triggerDebuggerAction.bind(actions, (_ChromeActionRegistryActions || _load_ChromeActionRegistryActions()).default.STEP_INTO)
          }),
          (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiButton || _load_nuclideUiButton()).Button, {
            icon: 'arrow-up',
            title: 'step out',
            onClick: actions.triggerDebuggerAction.bind(actions, (_ChromeActionRegistryActions || _load_ChromeActionRegistryActions()).default.STEP_OUT)
          }),
          (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiButton || _load_nuclideUiButton()).Button, {
            icon: 'primitive-square',
            title: 'stop debugging',
            onClick: function () {
              return actions.stopDebugging();
            }
          })
        ),
        (_reactForAtom || _load_reactForAtom()).React.createElement(
          (_nuclideUiButtonGroup || _load_nuclideUiButtonGroup()).ButtonGroup,
          { className: 'nuclide-debugger-stepping-buttongroup' },
          customControlButtons.map(function (specification, i) {
            return (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiButton || _load_nuclideUiButton()).Button, _extends({}, specification, { key: i }));
          })
        ),
        (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiCheckbox || _load_nuclideUiCheckbox()).Checkbox, {
          className: 'nuclide-debugger-exception-checkbox',
          onChange: function () {
            return actions.togglePauseOnException(!pauseOnException);
          },
          checked: pauseOnException,
          label: pauseOnException ? 'Pause on' : 'Pause on exception'
        }),
        pauseOnException ? [(_reactForAtom || _load_reactForAtom()).React.createElement(
          (_nuclideUiButtonGroup || _load_nuclideUiButtonGroup()).ButtonGroup,
          { key: 'first' },
          (_reactForAtom || _load_reactForAtom()).React.createElement(
            (_nuclideUiButton || _load_nuclideUiButton()).Button,
            {
              size: 'EXTRA_SMALL',
              selected: !pauseOnCaughtException,
              onClick: function () {
                return actions.togglePauseOnCaughtException(false);
              } },
            'uncaught'
          ),
          (_reactForAtom || _load_reactForAtom()).React.createElement(
            (_nuclideUiButton || _load_nuclideUiButton()).Button,
            {
              size: 'EXTRA_SMALL',
              selected: pauseOnCaughtException,
              onClick: function () {
                return actions.togglePauseOnCaughtException(true);
              } },
            'any'
          )
        ), (_reactForAtom || _load_reactForAtom()).React.createElement(
          'span',
          {
            key: 'second',
            className: 'nuclide-debugger-exception-fragment' },
          ' exception'
        )] : null,
        allowSingleThreadStepping ? (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiCheckbox || _load_nuclideUiCheckbox()).Checkbox, {
          className: 'nuclide-debugger-exception-checkbox',
          onChange: function () {
            return actions.toggleSingleThreadStepping(!singleThreadStepping);
          },
          checked: singleThreadStepping,
          label: 'Single Thread Stepping'
        }) : null
      );
    }
  }]);

  return DebuggerSteppingComponent;
})((_reactForAtom || _load_reactForAtom()).React.Component);

exports.DebuggerSteppingComponent = DebuggerSteppingComponent;
// Toggles paused state