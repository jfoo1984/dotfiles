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

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commonsAtomSyncAtomCommands;

function _load_commonsAtomSyncAtomCommands() {
  return _commonsAtomSyncAtomCommands = _interopRequireDefault(require('../../commons-atom/sync-atom-commands'));
}

var _commonsAtomCreatePackage;

function _load_commonsAtomCreatePackage() {
  return _commonsAtomCreatePackage = _interopRequireDefault(require('../../commons-atom/createPackage'));
}

var _commonsAtomPanelRenderer;

function _load_commonsAtomPanelRenderer() {
  return _commonsAtomPanelRenderer = _interopRequireDefault(require('../../commons-atom/PanelRenderer'));
}

var _commonsNodeCollection;

function _load_commonsNodeCollection() {
  return _commonsNodeCollection = require('../../commons-node/collection');
}

var _commonsNodeReduxObservable;

function _load_commonsNodeReduxObservable() {
  return _commonsNodeReduxObservable = require('../../commons-node/redux-observable');
}

var _commonsNodeUniversalDisposable;

function _load_commonsNodeUniversalDisposable() {
  return _commonsNodeUniversalDisposable = _interopRequireDefault(require('../../commons-node/UniversalDisposable'));
}

var _nuclideAnalytics;

function _load_nuclideAnalytics() {
  return _nuclideAnalytics = require('../../nuclide-analytics');
}

var _createEmptyAppState;

function _load_createEmptyAppState() {
  return _createEmptyAppState = require('./createEmptyAppState');
}

var _reduxActions;

function _load_reduxActions() {
  return _reduxActions = _interopRequireWildcard(require('./redux/Actions'));
}

var _reduxEpics;

function _load_reduxEpics() {
  return _reduxEpics = _interopRequireWildcard(require('./redux/Epics'));
}

var _reduxSelectors;

function _load_reduxSelectors() {
  return _reduxSelectors = require('./redux/Selectors');
}

var _reduxReducers;

function _load_reduxReducers() {
  return _reduxReducers = _interopRequireWildcard(require('./redux/Reducers'));
}

var _uiCreatePanelItem;

function _load_uiCreatePanelItem() {
  return _uiCreatePanelItem = require('./ui/createPanelItem');
}

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _atom;

function _load_atom() {
  return _atom = require('atom');
}

var _nullthrows;

function _load_nullthrows() {
  return _nullthrows = _interopRequireDefault(require('nullthrows'));
}

var _redux;

function _load_redux() {
  return _redux = require('redux');
}

var _rxjsBundlesRxMinJs;

function _load_rxjsBundlesRxMinJs() {
  return _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');
}

// TODO: use a more general versioning mechanism.
// Perhaps Atom should provide packages with some way of doing this.
var SERIALIZED_VERSION = 2;

var Activation = (function () {
  function Activation(rawState) {
    var _this = this;

    _classCallCheck(this, Activation);

    var serializedState = rawState;
    if (serializedState == null || serializedState.version !== SERIALIZED_VERSION) {
      serializedState = {};
    }

    var initialState = _extends({}, (0, (_createEmptyAppState || _load_createEmptyAppState()).createEmptyAppState)(), serializedState);

    var epics = Object.keys(_reduxEpics || _load_reduxEpics()).map(function (k) {
      return (_reduxEpics || _load_reduxEpics())[k];
    }).filter(function (epic) {
      return typeof epic === 'function';
    });
    var rootEpic = (0, (_commonsNodeReduxObservable || _load_commonsNodeReduxObservable()).combineEpics).apply(undefined, _toConsumableArray(epics));
    this._store = (0, (_redux || _load_redux()).createStore)((_reduxReducers || _load_reduxReducers()).app, initialState, (0, (_redux || _load_redux()).applyMiddleware)((0, (_commonsNodeReduxObservable || _load_commonsNodeReduxObservable()).createEpicMiddleware)(rootEpic), trackingMiddleware));
    var states = (_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).Observable.from(this._store);
    this._actionCreators = (0, (_redux || _load_redux()).bindActionCreators)(_reduxActions || _load_reduxActions(), this._store.dispatch);
    this._panelRenderer = new (_commonsAtomPanelRenderer || _load_commonsAtomPanelRenderer()).default({
      location: 'top',
      createItem: function createItem() {
        return (0, (_uiCreatePanelItem || _load_uiCreatePanelItem()).createPanelItem)(_this._store);
      }
    });

    this._disposables = new (_commonsNodeUniversalDisposable || _load_commonsNodeUniversalDisposable()).default(this._panelRenderer, atom.commands.add('atom-workspace', {
      'nuclide-task-runner:toggle-toolbar-visibility': function nuclideTaskRunnerToggleToolbarVisibility(event) {
        var visible = event.detail != null && typeof event.detail === 'object' ? event.detail.visible : undefined;
        if (typeof visible === 'boolean') {
          _this._actionCreators.setToolbarVisibility(visible);
        } else {
          _this._actionCreators.toggleToolbarVisibility();
        }
      },
      'nuclide-task-runner:run-selected-task': function nuclideTaskRunnerRunSelectedTask(event) {
        var detail = event != null ? event.detail : null;
        var taskId = detail != null && detail.taskRunnerId && detail.type ? detail : null;
        _this._actionCreators.runTask(taskId);
      }
    }),

    // Add a command for each task type. If there's more than one of the same type runnable, the
    // first is used.
    // TODO: Instead, prompt user for which to use and remember their choice.
    (0, (_commonsAtomSyncAtomCommands || _load_commonsAtomSyncAtomCommands()).default)(states.debounceTime(500).map(function (state) {
      return state.taskLists;
    }).distinctUntilChanged().map(function (taskLists) {
      var _Array$prototype;

      var allTasks = (_Array$prototype = Array.prototype).concat.apply(_Array$prototype, _toConsumableArray(Array.from(taskLists.values())));
      var types = allTasks.filter(function (taskMeta) {
        return taskMeta.runnable;
      }).map(function (taskMeta) {
        return taskMeta.type;
      });
      return new Set(types);
    }), function (taskType) {
      return {
        'atom-workspace': _defineProperty({}, 'nuclide-task-runner:' + taskType, function () {
          var state = _this._store.getState();
          var activeTaskId = state.activeTaskId;
          var taskRunners = state.taskRunners;

          var taskRunnerIds = Array.from(taskRunners.keys());
          // Give precedence to the task runner of the selected task.
          if (activeTaskId != null) {
            (0, (_commonsNodeCollection || _load_commonsNodeCollection()).arrayRemove)(taskRunnerIds, activeTaskId.taskRunnerId);
            taskRunnerIds.unshift(activeTaskId.taskRunnerId);
          }
          for (var taskRunnerId of taskRunnerIds) {
            var taskList = state.taskLists.get(taskRunnerId);
            if (taskList == null) {
              continue;
            }
            for (var taskMeta of taskList) {
              if (taskMeta.runnable && taskMeta.type === taskType) {
                _this._actionCreators.runTask(taskMeta);
                return;
              }
            }
          }
        })
      };
    }),

    // Add a command for each individual task ID.
    (0, (_commonsAtomSyncAtomCommands || _load_commonsAtomSyncAtomCommands()).default)(states.debounceTime(500).map(function (state) {
      return state.taskLists;
    }).distinctUntilChanged().map(function (taskLists) {
      var state = _this._store.getState();
      var taskIds = new Set();
      for (var _ref3 of taskLists) {
        var _ref2 = _slicedToArray(_ref3, 2);

        var taskRunnerId = _ref2[0];
        var taskList = _ref2[1];

        var taskRunnerName = (0, (_nullthrows || _load_nullthrows()).default)(state.taskRunners.get(taskRunnerId)).name;
        for (var taskMeta of taskList) {
          taskIds.add({ taskRunnerId: taskRunnerId, taskRunnerName: taskRunnerName, type: taskMeta.type });
        }
      }
      return taskIds;
    }), function (taskId) {
      return {
        'atom-workspace': _defineProperty({}, 'nuclide-task-runner:' + taskId.taskRunnerName + '-' + taskId.type, function () {
          _this._actionCreators.runTask(taskId);
        })
      };
    }),

    // Add a toggle command for each task runner.
    (0, (_commonsAtomSyncAtomCommands || _load_commonsAtomSyncAtomCommands()).default)(states.debounceTime(500).map(function (state) {
      return state.taskRunners;
    }).distinctUntilChanged().map(function (taskRunners) {
      return new Set(taskRunners.values());
    }), function (taskRunner) {
      return {
        'atom-workspace': _defineProperty({}, 'nuclide-task-runner:toggle-' + taskRunner.name + '-toolbar', function () {
          _this._actionCreators.toggleToolbarVisibility(taskRunner.id);
        })
      };
    }, function (taskRunner) {
      return taskRunner.id;
    }), states.map(function (state) {
      return state.visible;
    }).distinctUntilChanged().subscribe(function (visible) {
      _this._panelRenderer.render({ visible: visible });
    }));
  }

  _createClass(Activation, [{
    key: 'dispose',
    value: function dispose() {
      this._disposables.dispose();
    }
  }, {
    key: 'consumeCurrentWorkingDirectory',
    value: function consumeCurrentWorkingDirectory(api) {
      var _this2 = this;

      this._disposables.add(api.observeCwd(function (directory) {
        _this2._actionCreators.setProjectRoot(directory);
      }));
    }
  }, {
    key: 'consumeToolBar',
    value: function consumeToolBar(getToolBar) {
      var _this3 = this;

      var toolBar = getToolBar('nuclide-task-runner');
      toolBar.addSpacer({
        priority: 400
      });

      var _toolBar$addButton = toolBar.addButton({
        callback: 'nuclide-task-runner:toggle-toolbar-visibility',
        tooltip: 'Toggle Task Runner Toolbar',
        iconset: 'ion',
        icon: 'play',
        priority: 401
      });

      var element = _toolBar$addButton.element;

      element.className += ' nuclide-task-runner-tool-bar-button';

      var buttonUpdatesDisposable = new (_commonsNodeUniversalDisposable || _load_commonsNodeUniversalDisposable()).default(
      // $FlowFixMe: Update rx defs to accept ish with Symbol.observable
      (_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).Observable.from(this._store).subscribe(function (state) {
        if (state.taskRunners.size > 0) {
          element.removeAttribute('hidden');
        } else {
          element.setAttribute('hidden', 'hidden');
        }
      }));

      // Remove the button from the toolbar.
      var buttonPresenceDisposable = new (_atom || _load_atom()).Disposable(function () {
        toolBar.removeItems();
      });

      // If this package is disabled, stop updating the button and remove it from the toolbar.
      this._disposables.add(buttonUpdatesDisposable, buttonPresenceDisposable);

      // If tool-bar is disabled, stop updating the button state and remove tool-bar related cleanup
      // from this package's disposal actions.
      return new (_atom || _load_atom()).Disposable(function () {
        buttonUpdatesDisposable.dispose();
        _this3._disposables.remove(buttonUpdatesDisposable);
        _this3._disposables.remove(buttonPresenceDisposable);
      });
    }
  }, {
    key: 'provideTaskRunnerServiceApi',
    value: function provideTaskRunnerServiceApi() {
      var pkg = this;
      this._disposables.add(function () {
        pkg = null;
      });
      return {
        register: function register(taskRunner) {
          (0, (_assert || _load_assert()).default)(pkg != null, 'Task runner service API used after deactivation');
          pkg._actionCreators.registerTaskRunner(taskRunner);
          return new (_atom || _load_atom()).Disposable(function () {
            if (pkg != null) {
              pkg._actionCreators.unregisterTaskRunner(taskRunner);
            }
          });
        }
      };
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      var state = this._store.getState();
      return {
        previousSessionActiveTaskId: state.activeTaskId || state.previousSessionActiveTaskId,
        visible: state.visible,
        version: SERIALIZED_VERSION
      };
    }
  }, {
    key: 'getDistractionFreeModeProvider',
    value: function getDistractionFreeModeProvider() {
      var pkg = this;
      this._disposables.add(function () {
        pkg = null;
      });
      return {
        name: 'nuclide-task-runner',
        isVisible: function isVisible() {
          (0, (_assert || _load_assert()).default)(pkg != null);
          return pkg._store.getState().visible;
        },
        toggle: function toggle() {
          (0, (_assert || _load_assert()).default)(pkg != null);
          pkg._actionCreators.toggleToolbarVisibility();
        }
      };
    }

    // Exported for testing :'(
  }, {
    key: '_getCommands',
    value: function _getCommands() {
      return this._actionCreators;
    }
  }]);

  return Activation;
})();

exports.default = (0, (_commonsAtomCreatePackage || _load_commonsAtomCreatePackage()).default)(Activation);

function trackTaskAction(type, action, state) {
  var task = action.payload.task;
  var taskTrackingData = task != null && typeof task.getTrackingData === 'function' ? task.getTrackingData() : {};
  var error = action.type === (_reduxActions || _load_reduxActions()).TASK_ERRORED ? action.payload.error : null;
  var activeTaskId = (0, (_reduxSelectors || _load_reduxSelectors()).getActiveTaskId)(state);
  (0, (_nuclideAnalytics || _load_nuclideAnalytics()).trackEvent)({
    type: type,
    data: _extends({}, taskTrackingData, {
      taskRunnerId: activeTaskId && activeTaskId.taskRunnerId,
      taskType: activeTaskId && activeTaskId.type,
      errorMessage: error != null ? error.message : null,
      stackTrace: error != null ? String(error.stack) : null
    })
  });
}

var trackingMiddleware = function trackingMiddleware(store) {
  return function (next) {
    return function (action) {
      switch (action.type) {
        case (_reduxActions || _load_reduxActions()).TASK_STARTED:
          trackTaskAction('nuclide-task-runner:task-started', action, store.getState());
          break;
        case (_reduxActions || _load_reduxActions()).TASK_STOPPED:
          trackTaskAction('nuclide-task-runner:task-stopped', action, store.getState());
          break;
        case (_reduxActions || _load_reduxActions()).TASK_COMPLETED:
          trackTaskAction('nuclide-task-runner:task-completed', action, store.getState());
          break;
        case (_reduxActions || _load_reduxActions()).TASK_ERRORED:
          trackTaskAction('nuclide-task-runner:task-errored', action, store.getState());
          break;
      }
      return next(action);
    };
  };
};
module.exports = exports.default;