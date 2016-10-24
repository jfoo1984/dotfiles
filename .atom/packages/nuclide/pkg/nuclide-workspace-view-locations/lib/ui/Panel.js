Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _nuclideUiPanelComponent;

function _load_nuclideUiPanelComponent() {
  return _nuclideUiPanelComponent = require('../../../nuclide-ui/PanelComponent');
}

var _nuclideUiView;

function _load_nuclideUiView() {
  return _nuclideUiView = require('../../../nuclide-ui/View');
}

var _reactForAtom;

function _load_reactForAtom() {
  return _reactForAtom = require('react-for-atom');
}

var Panel = (function (_React$Component) {
  _inherits(Panel, _React$Component);

  function Panel() {
    _classCallCheck(this, Panel);

    _get(Object.getPrototypeOf(Panel.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Panel, [{
    key: '_getInitialSize',
    value: function _getInitialSize() {
      if (this.props.initialSize != null) {
        return this.props.initialSize;
      }

      var activePaneItem = this.props.paneContainer.getActivePaneItem();
      if (activePaneItem != null) {
        return getPreferredInitialSize(activePaneItem, this.props.position);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.paneContainer == null) {
        return null;
      }
      return (_reactForAtom || _load_reactForAtom()).React.createElement(
        (_nuclideUiPanelComponent || _load_nuclideUiPanelComponent()).PanelComponent,
        {
          initialLength: this._getInitialSize() || undefined,
          noScroll: true,
          onResize: this.props.onResize,
          dock: this.props.position },
        (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiView || _load_nuclideUiView()).View, { item: this.props.paneContainer })
      );
    }
  }]);

  return Panel;
})((_reactForAtom || _load_reactForAtom()).React.Component);

exports.Panel = Panel;

function getPreferredInitialSize(item, position) {
  switch (position) {
    case 'top':
    case 'bottom':
      return typeof item.getPreferredInitialHeight === 'function' ? item.getPreferredInitialHeight() : null;
    case 'left':
    case 'right':
      return typeof item.getPreferredInitialWidth === 'function' ? item.getPreferredInitialWidth() : null;
    default:
      throw new Error('Invalid position: ' + position);
  }
}