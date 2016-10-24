var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _commonsNodeNuclideUri;

function _load_commonsNodeNuclideUri() {
  return _commonsNodeNuclideUri = _interopRequireDefault(require('../../../commons-node/nuclideUri'));
}

var _Console;

function _load_Console() {
  return _Console = _interopRequireDefault(require('./Console'));
}

var _nuclideUiDropdown;

function _load_nuclideUiDropdown() {
  return _nuclideUiDropdown = require('../../../nuclide-ui/Dropdown');
}

var _nuclideUiPanelComponent;

function _load_nuclideUiPanelComponent() {
  return _nuclideUiPanelComponent = require('../../../nuclide-ui/PanelComponent');
}

var _nuclideUiToolbar;

function _load_nuclideUiToolbar() {
  return _nuclideUiToolbar = require('../../../nuclide-ui/Toolbar');
}

var _nuclideUiToolbarLeft;

function _load_nuclideUiToolbarLeft() {
  return _nuclideUiToolbarLeft = require('../../../nuclide-ui/ToolbarLeft');
}

var _nuclideUiToolbarRight;

function _load_nuclideUiToolbarRight() {
  return _nuclideUiToolbarRight = require('../../../nuclide-ui/ToolbarRight');
}

var _nuclideUiCheckbox;

function _load_nuclideUiCheckbox() {
  return _nuclideUiCheckbox = require('../../../nuclide-ui/Checkbox');
}

var _nuclideUiButton;

function _load_nuclideUiButton() {
  return _nuclideUiButton = require('../../../nuclide-ui/Button');
}

var _commonsAtomCreatePaneContainer;

function _load_commonsAtomCreatePaneContainer() {
  return _commonsAtomCreatePaneContainer = _interopRequireDefault(require('../../../commons-atom/create-pane-container'));
}

var _reactForAtom;

function _load_reactForAtom() {
  return _reactForAtom = require('react-for-atom');
}

var _TestClassTree;

function _load_TestClassTree() {
  return _TestClassTree = _interopRequireDefault(require('./TestClassTree'));
}

var TestRunnerPanel = (function (_React$Component) {
  _inherits(TestRunnerPanel, _React$Component);

  _createClass(TestRunnerPanel, null, [{
    key: 'ExecutionState',
    value: Object.freeze({
      RUNNING: 0,
      STOPPED: 1
    }),
    enumerable: true
  }]);

  function TestRunnerPanel(props) {
    _classCallCheck(this, TestRunnerPanel);

    _get(Object.getPrototypeOf(TestRunnerPanel.prototype), 'constructor', this).call(this, props);
    this.state = {
      roots: [],
      // If there are test runners, start with the first one selected. Otherwise store -1 to
      // later indicate there were no active test runners.
      selectedTestRunnerIndex: props.testRunners.length > 0 ? 0 : -1
    };

    // Bind Functions for use as callbacks;
    // TODO: Replace with property initializers when supported by Flow;
    this.setSelectedTestRunnerIndex = this.setSelectedTestRunnerIndex.bind(this);
  }

  _createClass(TestRunnerPanel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._paneContainer = (0, (_commonsAtomCreatePaneContainer || _load_commonsAtomCreatePaneContainer()).default)();
      this._leftPane = this._paneContainer.getActivePane();
      this._rightPane = this._leftPane.splitRight({
        // Prevent Atom from cloning children on splitting; this panel wants an empty container.
        copyActiveItem: false,
        // Make the right pane 2/3 the width of the parent since console output is generally wider
        // than the test tree.
        flexScale: 2
      });

      this.renderTree();
      this.renderConsole();

      (_reactForAtom || _load_reactForAtom()).ReactDOM.findDOMNode(this.refs.paneContainer).appendChild(atom.views.getView(this._paneContainer));
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.renderTree();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var currSelectedIndex = this.state.selectedTestRunnerIndex;
      if (currSelectedIndex === -1 && nextProps.testRunners.length > 0) {
        this.setState({ selectedTestRunnerIndex: 0 });
      } else if (nextProps.testRunners.length === 0 && currSelectedIndex >= 0) {
        this.setState({ selectedTestRunnerIndex: -1 });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      (_reactForAtom || _load_reactForAtom()).ReactDOM.unmountComponentAtNode(atom.views.getView(this._rightPane).querySelector('.item-views'));
      (_reactForAtom || _load_reactForAtom()).ReactDOM.unmountComponentAtNode(atom.views.getView(this._leftPane).querySelector('.item-views'));
      this._paneContainer.destroy();
    }
  }, {
    key: 'render',
    value: function render() {
      var runStopButton = undefined;
      switch (this.props.executionState) {
        case TestRunnerPanel.ExecutionState.RUNNING:
          runStopButton = (_reactForAtom || _load_reactForAtom()).React.createElement(
            (_nuclideUiButton || _load_nuclideUiButton()).Button,
            {
              icon: 'primitive-square',
              buttonType: (_nuclideUiButton || _load_nuclideUiButton()).ButtonTypes.ERROR,
              onClick: this.props.onClickStop },
            'Stop'
          );
          break;
        case TestRunnerPanel.ExecutionState.STOPPED:
          var initialTest = this.props.path === undefined;
          runStopButton = (_reactForAtom || _load_reactForAtom()).React.createElement(
            (_nuclideUiButton || _load_nuclideUiButton()).Button,
            {
              icon: initialTest ? 'playback-play' : 'sync',
              buttonType: (_nuclideUiButton || _load_nuclideUiButton()).ButtonTypes.PRIMARY,
              disabled: this.isDisabled(),
              onClick: this.props.onClickRun },
            initialTest ? 'Test' : 'Re-Test'
          );
          break;
      }

      // Assign `value` only when needed so a null/undefined value will show an indeterminate
      // progress bar.
      var progressAttrs = undefined;
      if (this.props.progressValue) {
        // `key` is set to force React to treat this as a new element when the `value` attr should be
        // removed. Currently it just sets `value="0"`, which is styled differently from no `value`
        // attr at all.
        // TODO: Remove the `key` once https://github.com/facebook/react/issues/1448 is resolved.
        progressAttrs = {
          key: 1,
          value: this.props.progressValue
        };
      }

      var runMsg = undefined;
      if (this.props.executionState === TestRunnerPanel.ExecutionState.RUNNING) {
        runMsg = (_reactForAtom || _load_reactForAtom()).React.createElement(
          'span',
          { className: 'inline-block' },
          'Running'
        );
      } else if (this.props.runDuration) {
        runMsg = (_reactForAtom || _load_reactForAtom()).React.createElement(
          'span',
          { className: 'inline-block' },
          'Done (in ',
          this.props.runDuration / 1000,
          's)'
        );
      }

      var pathMsg = undefined;
      if (this.props.path) {
        pathMsg = (_reactForAtom || _load_reactForAtom()).React.createElement(
          'span',
          { title: this.props.path },
          (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.basename(this.props.path)
        );
      }

      var dropdown = undefined;
      if (this.isDisabled()) {
        dropdown = (_reactForAtom || _load_reactForAtom()).React.createElement(
          'span',
          { className: 'inline-block text-warning' },
          'No registered test runners'
        );
      } else {
        dropdown = (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiDropdown || _load_nuclideUiDropdown()).Dropdown, {
          className: 'inline-block nuclide-test-runner__runner-dropdown',
          disabled: this.props.executionState === TestRunnerPanel.ExecutionState.RUNNING,
          options: this.props.testRunners.map(function (testRunner, index) {
            return { label: testRunner.label, value: index };
          }),
          onChange: this.setSelectedTestRunnerIndex,
          ref: 'dropdown',
          value: this.state.selectedTestRunnerIndex,
          size: 'sm',
          title: 'Choose a test runner'
        });
      }

      var attachDebuggerCheckbox = null;
      if (this.props.attachDebuggerBeforeRunning != null) {
        attachDebuggerCheckbox = (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiCheckbox || _load_nuclideUiCheckbox()).Checkbox, {
          checked: this.props.attachDebuggerBeforeRunning,
          label: 'Enable Debugger',
          onChange: this.props.onDebuggerCheckboxChanged
        });
      }

      return (_reactForAtom || _load_reactForAtom()).React.createElement(
        (_nuclideUiPanelComponent || _load_nuclideUiPanelComponent()).PanelComponent,
        { dock: 'bottom' },
        (_reactForAtom || _load_reactForAtom()).React.createElement(
          'div',
          { className: 'nuclide-test-runner-panel' },
          (_reactForAtom || _load_reactForAtom()).React.createElement(
            (_nuclideUiToolbar || _load_nuclideUiToolbar()).Toolbar,
            { location: 'top' },
            (_reactForAtom || _load_reactForAtom()).React.createElement(
              (_nuclideUiToolbarLeft || _load_nuclideUiToolbarLeft()).ToolbarLeft,
              null,
              dropdown,
              runStopButton,
              attachDebuggerCheckbox,
              (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiButton || _load_nuclideUiButton()).Button, {
                size: (_nuclideUiButton || _load_nuclideUiButton()).ButtonSizes.SMALL,
                icon: 'trashcan',
                className: 'trashcan inline-block',
                disabled: this.isDisabled() || this.props.executionState === TestRunnerPanel.ExecutionState.RUNNING,
                onClick: this.props.onClickClear,
                title: 'Clear Output'
              }),
              pathMsg
            ),
            (_reactForAtom || _load_reactForAtom()).React.createElement(
              (_nuclideUiToolbarRight || _load_nuclideUiToolbarRight()).ToolbarRight,
              null,
              runMsg,
              (_reactForAtom || _load_reactForAtom()).React.createElement('progress', _extends({ className: 'inline-block', max: '100' }, progressAttrs)),
              (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiButton || _load_nuclideUiButton()).Button, {
                onClick: this.props.onClickClose,
                className: 'inline-block',
                icon: 'x',
                size: (_nuclideUiButton || _load_nuclideUiButton()).ButtonSizes.SMALL,
                title: 'Close Panel'
              })
            )
          ),
          (_reactForAtom || _load_reactForAtom()).React.createElement('div', { className: 'nuclide-test-runner-console', ref: 'paneContainer' })
        )
      );
    }
  }, {
    key: 'isDisabled',
    value: function isDisabled() {
      return this.props.testRunners.length === 0;
    }
  }, {
    key: 'setSelectedTestRunnerIndex',
    value: function setSelectedTestRunnerIndex(selectedTestRunnerIndex) {
      this.setState({ selectedTestRunnerIndex: selectedTestRunnerIndex });
    }
  }, {
    key: 'getSelectedTestRunner',
    value: function getSelectedTestRunner() {
      var selectedTestRunnerIndex = this.state.selectedTestRunnerIndex;
      if (selectedTestRunnerIndex >= 0) {
        return this.props.testRunners[selectedTestRunnerIndex];
      }
    }
  }, {
    key: 'renderTree',
    value: function renderTree() {
      var component = (_reactForAtom || _load_reactForAtom()).ReactDOM.render((_reactForAtom || _load_reactForAtom()).React.createElement((_TestClassTree || _load_TestClassTree()).default, {
        isRunning: this.props.executionState === TestRunnerPanel.ExecutionState.RUNNING,
        testSuiteModel: this.props.testSuiteModel
      }), atom.views.getView(this._leftPane).querySelector('.item-views'));
      (0, (_assert || _load_assert()).default)(component instanceof (_TestClassTree || _load_TestClassTree()).default);
      this._tree = component;
    }
  }, {
    key: 'renderConsole',
    value: function renderConsole() {
      (_reactForAtom || _load_reactForAtom()).ReactDOM.render((_reactForAtom || _load_reactForAtom()).React.createElement((_Console || _load_Console()).default, { textBuffer: this.props.buffer }), atom.views.getView(this._rightPane).querySelector('.item-views'));
    }
  }]);

  return TestRunnerPanel;
})((_reactForAtom || _load_reactForAtom()).React.Component);

module.exports = TestRunnerPanel;

// Bound Functions for use as callbacks.