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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _commonsAtomFeatureConfig;

function _load_commonsAtomFeatureConfig() {
  return _commonsAtomFeatureConfig = _interopRequireDefault(require('../../commons-atom/featureConfig'));
}

var _reactForAtom;

function _load_reactForAtom() {
  return _reactForAtom = require('react-for-atom');
}

var _commonsAtomDebounced;

function _load_commonsAtomDebounced() {
  return _commonsAtomDebounced = require('../../commons-atom/debounced');
}

var _rxjsBundlesRxMinJs;

function _load_rxjsBundlesRxMinJs() {
  return _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');
}

var _nuclideAnalytics;

function _load_nuclideAnalytics() {
  return _nuclideAnalytics = require('../../nuclide-analytics');
}

var _nuclideLogging;

function _load_nuclideLogging() {
  return _nuclideLogging = require('../../nuclide-logging');
}

var _ContextViewMessage;

function _load_ContextViewMessage() {
  return _ContextViewMessage = _interopRequireDefault(require('./ContextViewMessage'));
}

var _ContextViewPanel;

function _load_ContextViewPanel() {
  return _ContextViewPanel = require('./ContextViewPanel');
}

var _ProviderContainer;

function _load_ProviderContainer() {
  return _ProviderContainer = require('./ProviderContainer');
}

var _NoProvidersView;

function _load_NoProvidersView() {
  return _NoProvidersView = require('./NoProvidersView');
}

var EDITOR_DEBOUNCE_INTERVAL = 500;
var POSITION_DEBOUNCE_INTERVAL = 500;

var logger = (0, (_nuclideLogging || _load_nuclideLogging()).getLogger)();

/**
 * Manages registering/unregistering of definition service and context providers,
 * and manages re-rendering when a new definition is emitted from the definition
 * service.
 */

var ContextViewManager = (function () {
  function ContextViewManager(width, isVisible) {
    _classCallCheck(this, ContextViewManager);

    this._atomPanel = null;
    this._contextProviders = [];
    this._defServiceSubscription = null;
    this._settingDisposables = new Map();
    this._definitionService = null;
    this._isVisible = isVisible;
    this._locked = false; // Should be unlocked by default
    this._panelDOMElement = null;
    this._width = width;
    this.currentDefinition = null;

    this.hide = this.hide.bind(this);
    this._onResize = this._onResize.bind(this);
    this._setLocked = this._setLocked.bind(this);

    this._render();
  }

  _createClass(ContextViewManager, [{
    key: 'dispose',
    value: function dispose() {
      this._disposeView();
      this._settingDisposables.forEach(function (disposable) {
        disposable.dispose();
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      (0, (_nuclideAnalytics || _load_nuclideAnalytics()).track)('nuclide-context-view:hide');
      if (this._isVisible) {
        this._isVisible = false;
        this._render();
      }
      this.updateSubscription();
    }
  }, {
    key: 'registerProvider',
    value: function registerProvider(newProvider) {
      var _this = this;

      // Ensure provider with given ID isn't already registered,
      // and find index to insert at based on priority
      var insertIndex = -1;
      var foundIndex = false;
      var keyPath = newProvider.id + '.priority';
      var newPriority = (_commonsAtomFeatureConfig || _load_commonsAtomFeatureConfig()).default.get(keyPath);
      var providers = this._contextProviders;
      for (var i = 0; i < providers.length; i++) {
        if (newProvider.id === providers[i].id) {
          return false;
        }
        var existingPriority = (_commonsAtomFeatureConfig || _load_commonsAtomFeatureConfig()).default.get(providers[i].id + '.priority');
        if (!foundIndex && newPriority <= existingPriority) {
          insertIndex = i;
          foundIndex = true;
        }
      }
      if (insertIndex === -1) {
        insertIndex = providers.length;
      }
      this._contextProviders.splice(insertIndex, 0, newProvider);
      var disposable = (_commonsAtomFeatureConfig || _load_commonsAtomFeatureConfig()).default.observe(keyPath, function (newValue) {
        _this._sortProvidersBasedOnPriority();
      });
      this._settingDisposables.set(newProvider.id, disposable);
      this._render();
      return true;
    }
  }, {
    key: '_sortProvidersBasedOnPriority',
    value: function _sortProvidersBasedOnPriority() {
      this._contextProviders.sort(function (provider1, provider2) {
        var priority1 = (_commonsAtomFeatureConfig || _load_commonsAtomFeatureConfig()).default.get(provider1.id + '.priority');
        var priority2 = (_commonsAtomFeatureConfig || _load_commonsAtomFeatureConfig()).default.get(provider2.id + '.priority');
        return priority1 - priority2;
      });
      this._render();
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return {
        width: this._width,
        visible: this._isVisible
      };
    }

    /**
     * Sets handle to registered definition service, sets the subscriber
     * to the definition service to an Observable<Definition>, and
     * re-renders if necessary.
     */
  }, {
    key: 'consumeDefinitionService',
    value: function consumeDefinitionService(service) {
      this._definitionService = service;
      this.updateSubscription();
      this._render();
    }

    /**
     * Subscribes or unsubscribes to definition service based on the current state.
     */
  }, {
    key: 'updateSubscription',
    value: function updateSubscription() {
      var _this2 = this;

      // Only subscribe if panel showing && there's something to subscribe to && not locked
      if (this._isVisible && this._definitionService != null && !this._locked) {
        this._defServiceSubscription = (0, (_commonsAtomDebounced || _load_commonsAtomDebounced()).observeTextEditorsPositions)(EDITOR_DEBOUNCE_INTERVAL, POSITION_DEBOUNCE_INTERVAL).filter(function (editorPos) {
          return editorPos != null;
        }).map(function (editorPos) {
          return (0, (_nuclideAnalytics || _load_nuclideAnalytics()).trackOperationTiming)('nuclide-context-view:getDefinition', function () {
            (0, (_assert || _load_assert()).default)(editorPos != null);
            (0, (_assert || _load_assert()).default)(_this2._definitionService != null);
            return _this2._definitionService.getDefinition(editorPos.editor, editorPos.position).catch(function (error) {
              logger.error('Error querying definition service: ', error);
              return null;
            });
          });
        }).switchMap(function (queryResult) {
          return queryResult != null ? (_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).Observable.fromPromise(queryResult) : (_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).Observable.empty();
        }).map(function (queryResult) {
          if (queryResult != null) {
            (0, (_nuclideAnalytics || _load_nuclideAnalytics()).track)('nuclide-context-view:filterQueryResults', {
              definitionsReturned: queryResult.definitions.length
            });
            // TODO (@reesjones) Handle case where multiple definitions are shown
            return queryResult.definitions[0];
          }
          // We do want to return null sometimes so providers can show "No definition selected"
          return null;
        }).subscribe(function (def) {
          return _this2.updateCurrentDefinition(def);
        });
        return;
      }
      // Otherwise, unsubscribe if there is a subscription
      if (this._defServiceSubscription != null) {
        this._defServiceSubscription.unsubscribe();
        this._defServiceSubscription = null;
      }
    }
  }, {
    key: 'show',
    value: function show() {
      (0, (_nuclideAnalytics || _load_nuclideAnalytics()).track)('nuclide-context-view:show');
      if (!this._isVisible) {
        this._isVisible = true;
        this._render();
      }
      this.updateSubscription();
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this._isVisible) {
        this.hide();
      } else {
        this.show();
      }
    }
  }, {
    key: 'unregisterProvider',
    value: function unregisterProvider(idToRemove) {
      var wasRemoved = false;
      for (var i = 0; i < this._contextProviders.length; i++) {
        if (this._contextProviders[i].id === idToRemove) {
          // Remove from array
          this._contextProviders.splice(i, 1);
          // Unsubscribe from change events on the removed provider's `priority` setting
          var settingChangeListener = this._settingDisposables.get(idToRemove);
          if (settingChangeListener != null) {
            settingChangeListener.dispose();
          }
          this._settingDisposables.delete(idToRemove);
          wasRemoved = true;
        }
      }
      this._render();
      return wasRemoved;
    }
  }, {
    key: 'updateCurrentDefinition',
    value: function updateCurrentDefinition(newDefinition) {
      if (newDefinition === this.currentDefinition) {
        return;
      }

      this.currentDefinition = newDefinition;
      this._render();
    }
  }, {
    key: '_setLocked',
    value: function _setLocked(locked) {
      if (locked !== this._locked) {
        this._locked = locked;
        this.updateSubscription();
        this._render();
      }
    }
  }, {
    key: '_disposeView',
    value: function _disposeView() {
      if (this._panelDOMElement != null) {
        (_reactForAtom || _load_reactForAtom()).ReactDOM.unmountComponentAtNode(this._panelDOMElement);
        this._panelDOMElement = null;
      }
      if (this._atomPanel != null) {
        this._atomPanel.destroy();
        this._atomPanel = null;
      }
      if (this._defServiceSubscription != null) {
        this._defServiceSubscription.unsubscribe();
        this._defServiceSubscription = null;
      }
    }
  }, {
    key: '_onResize',
    value: function _onResize(newWidth) {
      this._width = newWidth;
    }
  }, {
    key: '_renderProviders',
    value: function _renderProviders() {
      var _this3 = this;

      // Create collection of provider React elements to render, and

      var providerElements = this._contextProviders.map(function (prov, index) {
        var createElementFn = prov.getElementFactory();
        return (_reactForAtom || _load_reactForAtom()).React.createElement(
          (_ProviderContainer || _load_ProviderContainer()).ProviderContainer,
          { title: prov.title, key: index },
          createElementFn({
            ContextViewMessage: (_ContextViewMessage || _load_ContextViewMessage()).default,
            definition: _this3.currentDefinition,
            setLocked: _this3._setLocked
          })
        );
      });

      // If there are no context providers to show, show a message instead
      if (providerElements.length === 0) {
        providerElements.push((_reactForAtom || _load_reactForAtom()).React.createElement((_NoProvidersView || _load_NoProvidersView()).NoProvidersView, { key: 0 }));
      }

      // Render the panel in atom workspace
      if (!this._panelDOMElement) {
        this._panelDOMElement = document.createElement('div');
        this._panelDOMElement.style.display = 'flex';
      }

      (_reactForAtom || _load_reactForAtom()).ReactDOM.render((_reactForAtom || _load_reactForAtom()).React.createElement(
        (_ContextViewPanel || _load_ContextViewPanel()).ContextViewPanel,
        {
          initialWidth: this._width,
          onResize: this._onResize,
          definition: this.currentDefinition,
          locked: this._locked,
          onHide: this.hide },
        providerElements
      ), this._panelDOMElement);

      if (!this._atomPanel) {
        (0, (_assert || _load_assert()).default)(this._panelDOMElement != null);
        this._atomPanel = atom.workspace.addRightPanel({
          item: this._panelDOMElement,
          visible: true,
          priority: 200
        });
      }
    }
  }, {
    key: '_render',
    value: function _render() {
      if (this._isVisible) {
        this._renderProviders();
      } else {
        this._disposeView();
      }
    }
  }]);

  return ContextViewManager;
})();

exports.ContextViewManager = ContextViewManager;

// Subscriptions to all changes in registered context providers' `priority` setting.
//    Key: ID of the context provider
//    Value: Disposable for the change event subscription on its priority setting

// Whether Context View should keep displaying the current content even after the cursor moves
// display them in order