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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactForAtom;

function _load_reactForAtom() {
  return _reactForAtom = require('react-for-atom');
}

var _HandlesTableComponent;

function _load_HandlesTableComponent() {
  return _HandlesTableComponent = _interopRequireDefault(require('./HandlesTableComponent'));
}

var ActiveHandlesSectionComponent = (function (_React$Component) {
  _inherits(ActiveHandlesSectionComponent, _React$Component);

  function ActiveHandlesSectionComponent() {
    _classCallCheck(this, ActiveHandlesSectionComponent);

    _get(Object.getPrototypeOf(ActiveHandlesSectionComponent.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ActiveHandlesSectionComponent, [{
    key: 'render',
    value: function render() {
      if (!this.props.activeHandlesByType || Object.keys(this.props.activeHandlesByType).length === 0) {
        return (_reactForAtom || _load_reactForAtom()).React.createElement('div', null);
      }

      // Note that widthPercentage properties should add up to 90 since the ID column always adds 10.
      return (_reactForAtom || _load_reactForAtom()).React.createElement(
        'div',
        null,
        (_reactForAtom || _load_reactForAtom()).React.createElement((_HandlesTableComponent || _load_HandlesTableComponent()).default, {
          key: 2,
          title: 'TLS Sockets',
          handles: this.props.activeHandlesByType.tlssocket,
          keyed: function (socket) {
            return socket.localPort;
          },
          columns: [{
            title: 'Host',
            value: function value(socket) {
              return socket._host || socket.remoteAddress;
            },
            widthPercentage: 70
          }, {
            title: 'Read',
            value: function value(socket) {
              return socket.bytesRead;
            },
            widthPercentage: 10
          }, {
            title: 'Written',
            value: function value(socket) {
              return socket.bytesWritten;
            },
            widthPercentage: 10
          }]
        }),
        (_reactForAtom || _load_reactForAtom()).React.createElement((_HandlesTableComponent || _load_HandlesTableComponent()).default, {
          key: 3,
          title: 'Other handles',
          handles: this.props.activeHandlesByType.other,
          keyed: function (handle, h) {
            return h;
          },
          columns: [{
            title: 'Type',
            value: function value(handle) {
              return handle.constructor.name;
            },
            widthPercentage: 90
          }]
        })
      );
    }
  }]);

  return ActiveHandlesSectionComponent;
})((_reactForAtom || _load_reactForAtom()).React.Component);

exports.default = ActiveHandlesSectionComponent;
module.exports = exports.default;