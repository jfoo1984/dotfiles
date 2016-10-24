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

exports.makeDiagnosticsDatatipComponent = makeDiagnosticsDatatipComponent;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _commonsAtomGoToLocation;

function _load_commonsAtomGoToLocation() {
  return _commonsAtomGoToLocation = require('../../commons-atom/go-to-location');
}

var _reactForAtom;

function _load_reactForAtom() {
  return _reactForAtom = require('react-for-atom');
}

var _nuclideUiDiagnosticsMessage;

function _load_nuclideUiDiagnosticsMessage() {
  return _nuclideUiDiagnosticsMessage = require('../../nuclide-ui/DiagnosticsMessage');
}

var NOOP = function NOOP() {};

var DiagnosticsDatatipComponent = (function (_React$Component) {
  _inherits(DiagnosticsDatatipComponent, _React$Component);

  function DiagnosticsDatatipComponent() {
    _classCallCheck(this, DiagnosticsDatatipComponent);

    _get(Object.getPrototypeOf(DiagnosticsDatatipComponent.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DiagnosticsDatatipComponent, [{
    key: 'render',
    value: function render() {
      // Remove the `fix` property to prevent the fix button from showing up (for now).
      var message = _extends({}, this.props.message, { fix: undefined });
      return (_reactForAtom || _load_reactForAtom()).React.createElement(
        'div',
        { className: 'nuclide-diagnostics-datatip' },
        (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiDiagnosticsMessage || _load_nuclideUiDiagnosticsMessage()).DiagnosticsMessage, {
          message: message,
          goToLocation: (_commonsAtomGoToLocation || _load_commonsAtomGoToLocation()).goToLocation,
          fixer: NOOP
        })
      );
    }
  }]);

  return DiagnosticsDatatipComponent;
})((_reactForAtom || _load_reactForAtom()).React.Component);

exports.DiagnosticsDatatipComponent = DiagnosticsDatatipComponent;

function makeDiagnosticsDatatipComponent(message) {
  return function () {
    return (_reactForAtom || _load_reactForAtom()).React.createElement(DiagnosticsDatatipComponent, { message: message });
  };
}