var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _DiagnosticsPane;

function _load_DiagnosticsPane() {
  return _DiagnosticsPane = _interopRequireDefault(require('./DiagnosticsPane'));
}

var _nuclideUiCheckbox;

function _load_nuclideUiCheckbox() {
  return _nuclideUiCheckbox = require('../../nuclide-ui/Checkbox');
}

var _nuclideUiPanelComponent;

function _load_nuclideUiPanelComponent() {
  return _nuclideUiPanelComponent = require('../../nuclide-ui/PanelComponent');
}

var _nuclideUiToolbar;

function _load_nuclideUiToolbar() {
  return _nuclideUiToolbar = require('../../nuclide-ui/Toolbar');
}

var _nuclideUiToolbarCenter;

function _load_nuclideUiToolbarCenter() {
  return _nuclideUiToolbarCenter = require('../../nuclide-ui/ToolbarCenter');
}

var _nuclideUiToolbarLeft;

function _load_nuclideUiToolbarLeft() {
  return _nuclideUiToolbarLeft = require('../../nuclide-ui/ToolbarLeft');
}

var _nuclideUiToolbarRight;

function _load_nuclideUiToolbarRight() {
  return _nuclideUiToolbarRight = require('../../nuclide-ui/ToolbarRight');
}

var _reactForAtom;

function _load_reactForAtom() {
  return _reactForAtom = require('react-for-atom');
}

var _nuclideUiButton;

function _load_nuclideUiButton() {
  return _nuclideUiButton = require('../../nuclide-ui/Button');
}

var _nuclideAnalytics;

function _load_nuclideAnalytics() {
  return _nuclideAnalytics = require('../../nuclide-analytics');
}

/**
 * Dismissable panel that displays the diagnostics from nuclide-diagnostics-store.
 */

var DiagnosticsPanel = (function (_React$Component) {
  _inherits(DiagnosticsPanel, _React$Component);

  function DiagnosticsPanel(props) {
    _classCallCheck(this, DiagnosticsPanel);

    _get(Object.getPrototypeOf(DiagnosticsPanel.prototype), 'constructor', this).call(this, props);
    this._onFilterByActiveTextEditorChange = this._onFilterByActiveTextEditorChange.bind(this);
  }

  _createClass(DiagnosticsPanel, [{
    key: 'render',
    value: function render() {
      var _this = this;

      var warningCount = 0;
      var errorCount = 0;
      var diagnostics = this.props.diagnostics;

      if (this.props.filterByActiveTextEditor && this.props.pathToActiveTextEditor) {
        (function () {
          var pathToFilterBy = _this.props.pathToActiveTextEditor;
          diagnostics = diagnostics.filter(function (diagnostic) {
            return diagnostic.scope === 'file' && diagnostic.filePath === pathToFilterBy;
          });
        })();
      }
      diagnostics.forEach(function (diagnostic) {
        if (diagnostic.type === 'Error') {
          ++errorCount;
        } else if (diagnostic.type === 'Warning') {
          ++warningCount;
        }
      });

      var linterWarning = null;
      if (this.props.warnAboutLinter) {
        linterWarning = (_reactForAtom || _load_reactForAtom()).React.createElement(
          (_nuclideUiToolbar || _load_nuclideUiToolbar()).Toolbar,
          null,
          (_reactForAtom || _load_reactForAtom()).React.createElement(
            (_nuclideUiToolbarCenter || _load_nuclideUiToolbarCenter()).ToolbarCenter,
            null,
            (_reactForAtom || _load_reactForAtom()).React.createElement(
              'span',
              { className: 'inline-block highlight-info' },
              'nuclide-diagnostics is not compatible with the linter package. We recommend that you ',
              (_reactForAtom || _load_reactForAtom()).React.createElement(
                'a',
                { onClick: this.props.disableLinter },
                'disable the linter package'
              ),
              '. ',
              (_reactForAtom || _load_reactForAtom()).React.createElement(
                'a',
                { href: 'http://nuclide.io/docs/advanced-topics/linter-package-compatibility/' },
                'Learn More'
              ),
              '.'
            )
          )
        );
      }

      var errorSpanClassName = 'inline-block ' + (errorCount > 0 ? 'text-error' : '');
      var warningSpanClassName = 'inline-block ' + (warningCount > 0 ? 'text-warning' : '');

      // We hide the horizontal overflow in the PanelComponent because the presence of the scrollbar
      // throws off our height calculations.
      return (_reactForAtom || _load_reactForAtom()).React.createElement(
        (_nuclideUiPanelComponent || _load_nuclideUiPanelComponent()).PanelComponent,
        {
          ref: 'panel',
          dock: 'bottom',
          initialLength: this.props.height,
          noScroll: true,
          overflowX: 'hidden' },
        (_reactForAtom || _load_reactForAtom()).React.createElement(
          'div',
          { style: { display: 'flex', flex: 1, flexDirection: 'column' } },
          linterWarning,
          (_reactForAtom || _load_reactForAtom()).React.createElement(
            (_nuclideUiToolbar || _load_nuclideUiToolbar()).Toolbar,
            { location: 'top' },
            (_reactForAtom || _load_reactForAtom()).React.createElement(
              (_nuclideUiToolbarLeft || _load_nuclideUiToolbarLeft()).ToolbarLeft,
              null,
              (_reactForAtom || _load_reactForAtom()).React.createElement(
                'span',
                { className: errorSpanClassName },
                'Errors: ',
                errorCount
              ),
              (_reactForAtom || _load_reactForAtom()).React.createElement(
                'span',
                { className: warningSpanClassName },
                'Warnings: ',
                warningCount
              )
            ),
            (_reactForAtom || _load_reactForAtom()).React.createElement(
              (_nuclideUiToolbarRight || _load_nuclideUiToolbarRight()).ToolbarRight,
              null,
              (_reactForAtom || _load_reactForAtom()).React.createElement(
                'span',
                { className: 'inline-block' },
                (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiCheckbox || _load_nuclideUiCheckbox()).Checkbox, {
                  checked: this.props.filterByActiveTextEditor,
                  label: 'Show only diagnostics for current file',
                  onChange: this._onFilterByActiveTextEditorChange
                })
              ),
              (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiButton || _load_nuclideUiButton()).Button, {
                onClick: this.props.onDismiss,
                icon: 'x',
                size: (_nuclideUiButton || _load_nuclideUiButton()).ButtonSizes.SMALL,
                className: 'inline-block',
                title: 'Close Panel'
              })
            )
          ),
          (_reactForAtom || _load_reactForAtom()).React.createElement((_DiagnosticsPane || _load_DiagnosticsPane()).default, {
            showFileName: !this.props.filterByActiveTextEditor,
            diagnostics: diagnostics
          })
        )
      );
    }
  }, {
    key: '_onFilterByActiveTextEditorChange',
    value: function _onFilterByActiveTextEditorChange(isChecked) {
      (0, (_nuclideAnalytics || _load_nuclideAnalytics()).track)('diagnostics-panel-toggle-current-file', { isChecked: isChecked.toString() });
      this.props.onFilterByActiveTextEditorChange.call(null, isChecked);
    }
  }]);

  return DiagnosticsPanel;
})((_reactForAtom || _load_reactForAtom()).React.Component);

module.exports = DiagnosticsPanel;