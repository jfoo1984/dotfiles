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

var _reactForAtom;

function _load_reactForAtom() {
  return _reactForAtom = require('react-for-atom');
}

var _nuclideUiAtomTextEditor;

function _load_nuclideUiAtomTextEditor() {
  return _nuclideUiAtomTextEditor = require('../../../nuclide-ui/AtomTextEditor');
}

var _rxjsBundlesRxMinJs;

function _load_rxjsBundlesRxMinJs() {
  return _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');
}

var ENTER_KEY_CODE = 13;
var UP_KEY_CODE = 38;
var DOWN_KEY_CODE = 40;

var OutputTable = (function (_React$Component) {
  _inherits(OutputTable, _React$Component);

  function OutputTable(props) {
    _classCallCheck(this, OutputTable);

    _get(Object.getPrototypeOf(OutputTable.prototype), 'constructor', this).call(this, props);
    this._handleTextEditor = this._handleTextEditor.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this.state = {
      historyIndex: -1,
      draft: ''
    };
  }

  _createClass(OutputTable, [{
    key: '_handleTextEditor',
    value: function _handleTextEditor(component) {
      if (this._keySubscription) {
        this._textEditorModel = null;
        this._keySubscription.unsubscribe();
      }
      if (component) {
        this._textEditorModel = component.getModel();
        var el = (_reactForAtom || _load_reactForAtom()).ReactDOM.findDOMNode(component);
        this._keySubscription = (_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).Observable.fromEvent(el, 'keydown').subscribe(this._handleKeyDown);
      }
    }
  }, {
    key: '_handleKeyDown',
    value: function _handleKeyDown(event) {
      var editor = this._textEditorModel;
      if (editor == null) {
        return;
      }
      if (event.which === ENTER_KEY_CODE) {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (event.ctrlKey) {
          editor.insertNewline();
          return;
        }

        // Clear the text and trigger the `onSubmit` callback
        var text = editor.getText();

        if (text === '') {
          return;
        }

        editor.setText(''); // Clear the text field.
        this.props.onSubmit(text);
        this.setState({ historyIndex: -1 });
      } else if (event.which === UP_KEY_CODE) {
        if (this.props.history.length === 0) {
          return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        var _historyIndex = Math.min(this.state.historyIndex + 1, this.props.history.length - 1);
        if (this.state.historyIndex === -1) {
          this.setState({ historyIndex: _historyIndex, draft: editor.getText() });
        } else {
          this.setState({ historyIndex: _historyIndex });
        }
        editor.setText(this.props.history[this.props.history.length - _historyIndex - 1]);
      } else if (event.which === DOWN_KEY_CODE) {
        if (this.props.history.length === 0) {
          return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        var _historyIndex2 = Math.max(this.state.historyIndex - 1, -1);
        this.setState({ historyIndex: _historyIndex2 });
        if (_historyIndex2 === -1) {
          editor.setText(this.state.draft);
        } else {
          editor.setText(this.props.history[this.props.history.length - _historyIndex2 - 1]);
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var grammar = this.props.scopeName == null ? null : atom.grammars.grammarForScopeName(this.props.scopeName);
      return (_reactForAtom || _load_reactForAtom()).React.createElement(
        'div',
        { className: 'nuclide-console-input-wrapper' },
        (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiAtomTextEditor || _load_nuclideUiAtomTextEditor()).AtomTextEditor, {
          ref: this._handleTextEditor,
          grammar: grammar,
          gutterHidden: true,
          autoGrow: true,
          lineNumberGutterVisible: false
        })
      );
    }
  }]);

  return OutputTable;
})((_reactForAtom || _load_reactForAtom()).React.Component);

exports.default = OutputTable;
module.exports = exports.default;