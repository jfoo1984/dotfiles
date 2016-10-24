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

var _nuclideUiTabs;

function _load_nuclideUiTabs() {
  return _nuclideUiTabs = _interopRequireDefault(require('../../nuclide-ui/Tabs'));
}

var SideBarPanelComponent = (function (_React$Component) {
  _inherits(SideBarPanelComponent, _React$Component);

  function SideBarPanelComponent(props) {
    _classCallCheck(this, SideBarPanelComponent);

    _get(Object.getPrototypeOf(SideBarPanelComponent.prototype), 'constructor', this).call(this, props);
    this._handleTabChange = this._handleTabChange.bind(this);
  }

  _createClass(SideBarPanelComponent, [{
    key: 'focus',
    value: function focus() {
      (_reactForAtom || _load_reactForAtom()).ReactDOM.findDOMNode(this.refs.child).focus();
    }
  }, {
    key: '_handleTabChange',
    value: function _handleTabChange(newTab) {
      var value = newTab.name;
      this.props.onSelectedViewMenuItemChange(value);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var menuItems = _props.menuItems;
      var selectedViewMenuItemValue = _props.selectedViewMenuItemValue;

      var tabs = menuItems.map(function (menuItem) {
        return {
          name: menuItem.value,
          tabContent: (_reactForAtom || _load_reactForAtom()).React.createElement(
            'span',
            null,
            menuItem.label
          )
        };
      });
      var activeTabName = selectedViewMenuItemValue;
      return (_reactForAtom || _load_reactForAtom()).React.createElement(
        'div',
        { style: { display: 'flex', flex: 1, flexDirection: 'column', minWidth: 0 }, tabIndex: 0 },
        (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiTabs || _load_nuclideUiTabs()).default, {
          activeTabName: activeTabName,
          tabs: tabs,
          onActiveTabChange: this._handleTabChange
        }),
        (_reactForAtom || _load_reactForAtom()).React.cloneElement((_reactForAtom || _load_reactForAtom()).React.Children.only(this.props.children), { ref: 'child' })
      );
    }
  }]);

  return SideBarPanelComponent;
})((_reactForAtom || _load_reactForAtom()).React.Component);

exports.default = SideBarPanelComponent;
module.exports = exports.default;