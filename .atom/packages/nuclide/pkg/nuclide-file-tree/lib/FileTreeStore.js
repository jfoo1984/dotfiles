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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _FileTreeDispatcher;

function _load_FileTreeDispatcher() {
  return _FileTreeDispatcher = _interopRequireDefault(require('./FileTreeDispatcher'));
}

var _FileTreeDispatcher2;

function _load_FileTreeDispatcher2() {
  return _FileTreeDispatcher2 = require('./FileTreeDispatcher');
}

var _FileTreeHelpers;

function _load_FileTreeHelpers() {
  return _FileTreeHelpers = _interopRequireDefault(require('./FileTreeHelpers'));
}

var _FileTreeHgHelpers;

function _load_FileTreeHgHelpers() {
  return _FileTreeHgHelpers = _interopRequireDefault(require('./FileTreeHgHelpers'));
}

var _FileTreeNode;

function _load_FileTreeNode() {
  return _FileTreeNode = require('./FileTreeNode');
}

var _immutable;

function _load_immutable() {
  return _immutable = _interopRequireDefault(require('immutable'));
}

var _atom;

function _load_atom() {
  return _atom = require('atom');
}

var _nuclideHgGitBridgeLibConstants;

function _load_nuclideHgGitBridgeLibConstants() {
  return _nuclideHgGitBridgeLibConstants = require('../../nuclide-hg-git-bridge/lib/constants');
}

var _FileTreeFilterHelper;

function _load_FileTreeFilterHelper() {
  return _FileTreeFilterHelper = require('./FileTreeFilterHelper');
}

var _minimatch;

function _load_minimatch() {
  return _minimatch = require('minimatch');
}

var _nuclideHgGitBridge;

function _load_nuclideHgGitBridge() {
  return _nuclideHgGitBridge = require('../../nuclide-hg-git-bridge');
}

var _nuclideHgRpcLibHgConstants;

function _load_nuclideHgRpcLibHgConstants() {
  return _nuclideHgRpcLibHgConstants = require('../../nuclide-hg-rpc/lib/hg-constants');
}

var _nuclideLogging;

function _load_nuclideLogging() {
  return _nuclideLogging = require('../../nuclide-logging');
}

var _nuclideWorkingSetsCommon;

function _load_nuclideWorkingSetsCommon() {
  return _nuclideWorkingSetsCommon = require('../../nuclide-working-sets-common');
}

var _nuclideAnalytics;

function _load_nuclideAnalytics() {
  return _nuclideAnalytics = require('../../nuclide-analytics');
}

var _commonsNodeNuclideUri;

function _load_commonsNodeNuclideUri() {
  return _commonsNodeNuclideUri = _interopRequireDefault(require('../../commons-node/nuclideUri'));
}

var _FileTreeSelectionRange;

function _load_FileTreeSelectionRange() {
  return _FileTreeSelectionRange = require('./FileTreeSelectionRange');
}

// Used to ensure the version we serialized is the same version we are deserializing.
var VERSION = 1;

var DEFAULT_CONF = {
  vcsStatuses: new (_immutable || _load_immutable()).default.Map(),
  workingSet: new (_nuclideWorkingSetsCommon || _load_nuclideWorkingSetsCommon()).WorkingSet(),
  editedWorkingSet: new (_nuclideWorkingSetsCommon || _load_nuclideWorkingSetsCommon()).WorkingSet(),
  hideIgnoredNames: true,
  excludeVcsIgnoredPaths: true,
  ignoredPatterns: new (_immutable || _load_immutable()).default.Set(),
  usePreviewTabs: false,
  isEditingWorkingSet: false,
  openFilesWorkingSet: new (_nuclideWorkingSetsCommon || _load_nuclideWorkingSetsCommon()).WorkingSet(),
  reposByRoot: {},
  fileChanges: new (_immutable || _load_immutable()).default.Map()
};

exports.DEFAULT_CONF = DEFAULT_CONF;
var instance = undefined;

/**
 * Implements the Flux pattern for our file tree. All state for the file tree will be kept in
 * FileTreeStore and the only way to update the store is through methods on FileTreeActions. The
 * dispatcher is a mechanism through which FileTreeActions interfaces with FileTreeStore.
 */

var FileTreeStore = (function () {
  _createClass(FileTreeStore, null, [{
    key: 'getInstance',
    value: function getInstance() {
      if (!instance) {
        instance = new FileTreeStore();
      }
      return instance;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (instance != null) {
        instance.dispose();
      }

      instance = null;
    }
  }]);

  function FileTreeStore() {
    _classCallCheck(this, FileTreeStore);

    this.roots = new (_immutable || _load_immutable()).default.OrderedMap();
    this._dispatcher = (_FileTreeDispatcher || _load_FileTreeDispatcher()).default.getInstance();
    this._emitter = new (_atom || _load_atom()).Emitter();
    this._dispatcher.register(this._onDispatch.bind(this));
    this._logger = (0, (_nuclideLogging || _load_nuclideLogging()).getLogger)();
    this._fileChanges = new (_immutable || _load_immutable()).default.Map();

    this._usePrefixNav = false;
    this._isLoadingMap = new (_immutable || _load_immutable()).default.Map();
    this._repositories = new (_immutable || _load_immutable()).default.Set();

    this._conf = DEFAULT_CONF;
    global.FTConf = this._conf;
    this._suppressChanges = false;
    this._filter = '';
    this.openFilesExpanded = true;
    this.uncommittedChangesExpanded = true;
    this._selectionRange = null;
  }

  /**
   * Performs a breadth-first iteration over the directories of the tree starting
   * with a given node. The iteration stops once a given limit of nodes (both directories
   * and files) were traversed.
   * The node being currently traversed can be obtained by calling .traversedNode()
   * .next() returns a promise that is fulfilled when the traversal moves on to
   * the next directory.
   */

  /**
   * TODO: Move to a [serialization class][1] and use the built-in versioning mechanism. This might
   * need to be done one level higher within main.js.
   *
   * [1]: https://atom.io/docs/latest/behind-atom-serialization-in-atom
   */

  _createClass(FileTreeStore, [{
    key: 'exportData',
    value: function exportData() {
      var childKeyMap = {};
      var expandedKeysByRoot = {};
      var selectedKeysByRoot = {};

      this.roots.forEach(function (root) {
        var expandedKeys = [];
        var selectedKeys = [];

        // Grab the data of only the expanded portion of the tree.
        root.traverse(function (node) {
          if (node.isSelected) {
            selectedKeys.push(node.uri);
          }

          if (!node.isExpanded) {
            return false;
          }

          expandedKeys.push(node.uri);

          if (!node.children.isEmpty()) {
            childKeyMap[node.uri] = node.children.map(function (child) {
              return child.uri;
            }).toArray();
          }

          return true;
        });

        expandedKeysByRoot[root.uri] = expandedKeys;
        selectedKeysByRoot[root.uri] = selectedKeys;
      });

      var rootKeys = this.roots.map(function (root) {
        return root.uri;
      }).toArray();

      return {
        version: VERSION,
        childKeyMap: childKeyMap,
        expandedKeysByRoot: expandedKeysByRoot,
        rootKeys: rootKeys,
        selectedKeysByRoot: selectedKeysByRoot,
        openFilesExpanded: this.openFilesExpanded,
        uncommittedChangesExpanded: this.uncommittedChangesExpanded
      };
    }

    /**
     * Imports store data from a previous export.
     */
  }, {
    key: 'loadData',
    value: function loadData(data) {
      var _this = this;

      // Ensure we are not trying to load data from an earlier version of this package.
      if (data.version !== VERSION) {
        return;
      }

      var buildNode = function buildNode(rootUri, uri) {
        var rootExpandedKeys = data.expandedKeysByRoot[rootUri] || [];
        var rootSelectedKeys = data.selectedKeysByRoot[rootUri] || [];
        var childrenUris = data.childKeyMap[uri] || [];
        var children = (_FileTreeNode || _load_FileTreeNode()).FileTreeNode.childrenFromArray(childrenUris.map(function (childUri) {
          return buildNode(rootUri, childUri);
        }));

        var isExpanded = rootExpandedKeys.indexOf(uri) >= 0;
        var isLoading = false;

        if (isExpanded && (_FileTreeHelpers || _load_FileTreeHelpers()).default.isDirKey(uri)) {
          _this._fetchChildKeys(uri);
          isLoading = true;
        }

        return new (_FileTreeNode || _load_FileTreeNode()).FileTreeNode({
          uri: uri,
          rootUri: rootUri,
          isExpanded: isExpanded,
          isSelected: rootSelectedKeys.indexOf(uri) >= 0,
          isLoading: isLoading,
          isTracked: false,
          children: children,
          isCwd: false,
          connectionTitle: (_FileTreeHelpers || _load_FileTreeHelpers()).default.getDisplayTitle(rootUri) || ''
        }, _this._conf);
      };

      if (data.openFilesExpanded != null) {
        this.openFilesExpanded = data.openFilesExpanded;
      }

      if (data.uncommittedChangesExpanded != null) {
        this.uncommittedChangesExpanded = data.uncommittedChangesExpanded;
      }

      var normalizedAtomPaths = atom.project.getPaths().map((_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.ensureTrailingSeparator);
      var normalizedDataPaths = data.rootKeys.map((_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.ensureTrailingSeparator).filter(function (rootUri) {
        return (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.isRemote(rootUri) || normalizedAtomPaths.indexOf(rootUri) >= 0;
      });
      var pathsMissingInData = normalizedAtomPaths.filter(function (rootUri) {
        return normalizedDataPaths.indexOf(rootUri) === -1;
      });
      var combinedPaths = normalizedDataPaths.concat(pathsMissingInData);

      this._setRoots(new (_immutable || _load_immutable()).default.OrderedMap(combinedPaths.map(function (rootUri) {
        return [rootUri, buildNode(rootUri, rootUri)];
      })));
    }
  }, {
    key: '_setExcludeVcsIgnoredPaths',
    value: function _setExcludeVcsIgnoredPaths(excludeVcsIgnoredPaths) {
      this._updateConf(function (conf) {
        conf.excludeVcsIgnoredPaths = excludeVcsIgnoredPaths;
      });
    }
  }, {
    key: '_setHideIgnoredNames',
    value: function _setHideIgnoredNames(hideIgnoredNames) {
      this._updateConf(function (conf) {
        conf.hideIgnoredNames = hideIgnoredNames;
      });
    }

    /**
     * Given a list of names to ignore, compile them into minimatch patterns and
     * update the store with them.
     */
  }, {
    key: '_setIgnoredNames',
    value: function _setIgnoredNames(ignoredNames) {
      var ignoredPatterns = (_immutable || _load_immutable()).default.Set(ignoredNames).map(function (ignoredName) {
        if (ignoredName === '') {
          return null;
        }
        try {
          return new (_minimatch || _load_minimatch()).Minimatch(ignoredName, { matchBase: true, dot: true });
        } catch (error) {
          atom.notifications.addWarning('Error parsing pattern \'' + ignoredName + '\' from "Settings" > "Ignored Names"', { detail: error.message });
          return null;
        }
      }).filter(function (pattern) {
        return pattern != null;
      });
      this._updateConf(function (conf) {
        conf.ignoredPatterns = ignoredPatterns;
      });
    }
  }, {
    key: '_onDispatch',
    value: function _onDispatch(payload) {
      switch (payload.actionType) {
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.DELETE_SELECTED_NODES:
          this._deleteSelectedNodes();
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_CWD:
          this._setCwdKey(payload.rootKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_TRACKED_NODE:
          this._setTrackedNode(payload.rootKey, payload.nodeKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.CLEAR_TRACKED_NODE:
          this._clearTrackedNode();
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.MOVE_TO_NODE:
          this._moveToNode(payload.rootKey, payload.nodeKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_ROOT_KEYS:
          this._setRootKeys(payload.rootKeys);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.EXPAND_NODE:
          this._expandNode(payload.rootKey, payload.nodeKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.EXPAND_NODE_DEEP:
          this._expandNodeDeep(payload.rootKey, payload.nodeKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.COLLAPSE_NODE:
          this._collapseNode(payload.rootKey, payload.nodeKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_EXCLUDE_VCS_IGNORED_PATHS:
          this._setExcludeVcsIgnoredPaths(payload.excludeVcsIgnoredPaths);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_USE_PREVIEW_TABS:
          this._setUsePreviewTabs(payload.usePreviewTabs);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_USE_PREFIX_NAV:
          this._setUsePrefixNav(payload.usePrefixNav);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.COLLAPSE_NODE_DEEP:
          this._collapseNodeDeep(payload.rootKey, payload.nodeKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_HIDE_IGNORED_NAMES:
          this._setHideIgnoredNames(payload.hideIgnoredNames);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_IGNORED_NAMES:
          this._setIgnoredNames(payload.ignoredNames);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_VCS_STATUSES:
          this._setVcsStatuses(payload.rootKey, payload.vcsStatuses);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_REPOSITORIES:
          this._setRepositories(payload.repositories);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_WORKING_SET:
          this._setWorkingSet(payload.workingSet);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_OPEN_FILES_WORKING_SET:
          this._setOpenFilesWorkingSet(payload.openFilesWorkingSet);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_WORKING_SETS_STORE:
          this._setWorkingSetsStore(payload.workingSetsStore);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.START_EDITING_WORKING_SET:
          this._startEditingWorkingSet(payload.editedWorkingSet);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.FINISH_EDITING_WORKING_SET:
          this._finishEditingWorkingSet();
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.CHECK_NODE:
          this._checkNode(payload.rootKey, payload.nodeKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.UNCHECK_NODE:
          this._uncheckNode(payload.rootKey, payload.nodeKey);
          break;

        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_DRAG_HOVERED_NODE:
          this._setDragHoveredNode(payload.rootKey, payload.nodeKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.UNHOVER_NODE:
          this._unhoverNode(payload.rootKey, payload.nodeKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_SELECTED_NODE:
          this._setSelectedNode(payload.rootKey, payload.nodeKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_FOCUSED_NODE:
          this._setFocusedNode(payload.rootKey, payload.nodeKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.ADD_SELECTED_NODE:
          this._addSelectedNode(payload.rootKey, payload.nodeKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.UNSELECT_NODE:
          this._unselectNode(payload.rootKey, payload.nodeKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.MOVE_SELECTION_UP:
          this._moveSelectionUp();
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.RANGE_SELECT_TO_NODE:
          this._rangeSelectToNode(payload.rootKey, payload.nodeKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.RANGE_SELECT_UP:
          this._rangeSelectUp();
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.RANGE_SELECT_DOWN:
          this._rangeSelectDown();
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.MOVE_SELECTION_DOWN:
          this._moveSelectionDown();
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.MOVE_SELECTION_TO_TOP:
          this._moveSelectionToTop();
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.MOVE_SELECTION_TO_BOTTOM:
          this._moveSelectionToBottom();
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.ENSURE_CHILD_NODE:
          this._ensureChildNode(payload.nodeKey);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.CLEAR_FILTER:
          this.clearFilter();
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_OPEN_FILES_EXPANDED:
          this._setOpenFilesExpanded(payload.openFilesExpanded);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.SET_UNCOMMITTED_CHANGES_EXPANDED:
          this._setUncommittedChangesExpanded(payload.uncommittedChangesExpanded);
          break;
        case (_FileTreeDispatcher2 || _load_FileTreeDispatcher2()).ActionTypes.INVALIDATE_REMOVED_FOLDER:
          this._invalidateRemovedFolder();
          break;
      }
    }

    /**
    * Use the predicate function to update one or more of the roots in the file tree
    */
  }, {
    key: '_updateRoots',
    value: function _updateRoots(predicate) {
      this._setRoots(this.roots.map(predicate));
    }

    /**
    * Use the predicate to update a node (or a branch) of the file-tree
    */
  }, {
    key: '_updateNodeAtRoot',
    value: function _updateNodeAtRoot(rootKey, nodeKey, predicate) {
      var root = this.roots.get(rootKey);
      if (root == null) {
        return;
      }

      var node = root.find(nodeKey);
      if (node == null) {
        return;
      }

      var roots = this.roots.set(rootKey, this._bubbleUp(node, predicate(node)));

      this._setRoots(roots);
    }

    /**
     * Update a node by calling the predicate, returns the new node.
     */
  }, {
    key: '_updateNode',
    value: function _updateNode(node, predicate) {
      var newNode = predicate(node);
      var roots = this.roots.set(node.rootUri, this._bubbleUp(node, newNode));
      this._setRoots(roots);
      return newNode;
    }

    /**
    * Update a node or a branch under any of the roots it was found at
    */
  }, {
    key: '_updateNodeAtAllRoots',
    value: function _updateNodeAtAllRoots(nodeKey, predicate) {
      var _this2 = this;

      var roots = this.roots.map(function (root) {
        var node = root.find(nodeKey);
        if (node == null) {
          return root;
        }

        return _this2._bubbleUp(node, predicate(node));
      });

      this._setRoots(roots);
    }

    /**
    * Bubble the change up. The newNode is assumed to be prevNode after some manipulateion done to it
    * therefore they are assumed to belong to the same parent.
    *
    * The method updates the child to the new node (which create a new parent instance) and call
    * recursively for the parent update. Until there are no more parents and the new root is returned
    *
    * As the change bubbles up, and in addition to the change from the new child assignment, an
    * optional predicate is also being applied to each newly created parent to support more complex
    * change patterns.
    */
  }, {
    key: '_bubbleUp',
    value: function _bubbleUp(prevNode, newNode) {
      var postPredicate = arguments.length <= 2 || arguments[2] === undefined ? function (node) {
        return node;
      } : arguments[2];

      var parent = prevNode.parent;
      if (parent == null) {
        return newNode;
      }

      var newParent = postPredicate(parent.updateChild(newNode));
      return this._bubbleUp(parent, newParent, postPredicate);
    }

    /**
    * Updates the roots, maintains their sibling relationships and fires the change event.
    */
  }, {
    key: '_setRoots',
    value: function _setRoots(roots) {
      var _this3 = this;

      // Explicitly test for the empty case, otherwise configuration changes with an empty
      // tree will not emit changes.
      var changed = !(_immutable || _load_immutable()).default.is(roots, this.roots) || roots.isEmpty();
      if (changed) {
        (function () {
          _this3.roots = roots;
          var prevRoot = null;
          roots.forEach(function (r) {
            r.prevSibling = prevRoot;
            if (prevRoot != null) {
              prevRoot.nextSibling = r;
            }
            prevRoot = r;
          });

          if (prevRoot != null) {
            prevRoot.nextSibling = null;
          }

          _this3._emitChange();
        })();
      }
    }
  }, {
    key: '_emitChange',
    value: function _emitChange() {
      var _this4 = this;

      if (this._suppressChanges) {
        return;
      }

      if (this._animationFrameRequestId != null) {
        window.cancelAnimationFrame(this._animationFrameRequestId);
      }

      this._animationFrameRequestId = window.requestAnimationFrame(function () {
        var performance = global.performance;

        var renderStart = performance.now();
        var childrenCount = _this4.roots.reduce(function (sum, root) {
          return sum + root.shownChildrenBelow;
        }, 0);

        _this4._emitter.emit('change');
        _this4._suppressChanges = true;
        _this4._checkTrackedNode();
        _this4._suppressChanges = false;
        _this4._animationFrameRequestId = null;

        var duration = (performance.now() - renderStart).toString();
        (0, (_nuclideAnalytics || _load_nuclideAnalytics()).track)('filetree-root-node-component-render', {
          'filetree-root-node-component-render-duration': duration,
          'filetree-root-node-component-rendered-child-count': childrenCount
        });
      });
    }

    /**
    * Update the configuration for the file-tree. The direct writing to the this._conf should be
    * avoided.
    */
  }, {
    key: '_updateConf',
    value: function _updateConf(predicate) {
      predicate(this._conf);
      this._updateRoots(function (root) {
        return root.updateConf().setRecursive(
        // Remove selection from hidden nodes under this root
        function (node) {
          return node.containsSelection && node.containsHidden ? null : node;
        }, function (node) {
          if (node.shouldBeShown) {
            return node;
          }

          // The node is hidden - unselect all nodes under it if there are any
          return node.setRecursive(function (subNode) {
            return subNode.containsSelection ? null : subNode;
          }, function (subNode) {
            return subNode.setIsSelected(false);
          });
        });
      });
    }
  }, {
    key: 'getTrackedNode',
    value: function getTrackedNode() {
      // Locate the root containing the tracked node efficiently by using the child-derived
      // containsTrackedNode property
      var trackedRoot = this.roots.find(function (root) {
        return root.containsTrackedNode;
      });
      if (trackedRoot == null) {
        return null;
      }

      var trackedNode = undefined;
      // Likewise, within the root use the property to efficiently find the needed node
      trackedRoot.traverse(function (node) {
        if (node.isTracked) {
          trackedNode = node;
        }

        return trackedNode == null && node.containsTrackedNode;
      });

      return trackedNode;
    }
  }, {
    key: 'getRepositories',
    value: function getRepositories() {
      return this._repositories;
    }
  }, {
    key: 'getWorkingSet',
    value: function getWorkingSet() {
      return this._conf.workingSet;
    }
  }, {
    key: 'getWorkingSetsStore',
    value: function getWorkingSetsStore() {
      return this._workingSetsStore;
    }
  }, {
    key: 'getRootKeys',
    value: function getRootKeys() {
      return this.roots.toArray().map(function (root) {
        return root.uri;
      });
    }

    /**
     * Returns true if the store has no data, i.e. no roots, no children.
     */
  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return this.roots.isEmpty();
    }
  }, {
    key: 'getFileChanges',
    value: function getFileChanges() {
      return this._fileChanges;
    }
  }, {
    key: '_invalidateRemovedFolder',
    value: function _invalidateRemovedFolder() {
      var _this5 = this;

      var updatedFileChanges = new Map();
      atom.project.getPaths().forEach(function (projectPath) {
        var standardizedPath = (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.ensureTrailingSeparator(projectPath);
        // Atom sometimes tells you a repo exists briefly even after it has been removed
        // This causes the map to first flush out the repo and then again try to add the
        // repo but the files now don't exist causing an undefined value to be added.
        // Adding check to prevent this from happening.
        var fileChangesForPath = _this5._fileChanges.get(standardizedPath);
        if (fileChangesForPath != null) {
          updatedFileChanges.set(standardizedPath, fileChangesForPath);
        }
      });

      this._fileChanges = new (_immutable || _load_immutable()).default.Map(updatedFileChanges);
    }
  }, {
    key: '_setFileChanges',
    value: function _setFileChanges(rootKey, vcsStatuses) {
      var fileChanges = new Map();
      Object.keys(vcsStatuses).forEach(function (filePath) {
        var statusCode = vcsStatuses[filePath];
        fileChanges.set(filePath, (_nuclideHgGitBridgeLibConstants || _load_nuclideHgGitBridgeLibConstants()).HgStatusToFileChangeStatus[statusCode]);
      });

      this._fileChanges = this._fileChanges.set(rootKey, fileChanges);
    }
  }, {
    key: '_setVcsStatuses',
    value: function _setVcsStatuses(rootKey, vcsStatuses) {
      var _this6 = this;

      // We use file changes for populating the uncommitted list, this is different as compared
      // to what is computed in the vcsStatuses in that it does not need the exact path but just
      // the root folder present in atom and the file name and its status. Another difference is
      // in the terms used for status change, while uncommitted changes needs the HgStatusChange
      // codes the file tree doesn't.
      this._setFileChanges(rootKey, vcsStatuses);

      // We can't build on the child-derived properties to maintain vcs statuses in the entire
      // tree, since the reported VCS status may be for a node that is not yet present in the
      // fetched tree, and so it it can't affect its parents statuses. To have the roots colored
      // consistently we manually add all parents of all of the modified nodes up till the root
      var enrichedVcsStatuses = _extends({}, vcsStatuses);

      var ensurePresentParents = function ensurePresentParents(uri) {
        if (uri === rootKey) {
          return;
        }

        var current = uri;
        while (current !== rootKey) {
          current = (_FileTreeHelpers || _load_FileTreeHelpers()).default.getParentKey(current);

          if (enrichedVcsStatuses[current] != null) {
            return;
          }

          enrichedVcsStatuses[current] = (_nuclideHgRpcLibHgConstants || _load_nuclideHgRpcLibHgConstants()).StatusCodeNumber.MODIFIED;
        }
      };

      Object.keys(vcsStatuses).forEach(function (uri) {
        var status = vcsStatuses[uri];
        if (status === (_nuclideHgRpcLibHgConstants || _load_nuclideHgRpcLibHgConstants()).StatusCodeNumber.MODIFIED || status === (_nuclideHgRpcLibHgConstants || _load_nuclideHgRpcLibHgConstants()).StatusCodeNumber.ADDED || status === (_nuclideHgRpcLibHgConstants || _load_nuclideHgRpcLibHgConstants()).StatusCodeNumber.REMOVED) {
          try {
            // An invalid URI might cause an exception to be thrown
            ensurePresentParents(uri);
          } catch (e) {
            _this6._logger.error('Error enriching the VCS statuses for ' + uri, e);
          }
        }
      });

      if (this._vcsStatusesAreDifferent(rootKey, enrichedVcsStatuses)) {
        this._updateConf(function (conf) {
          conf.vcsStatuses = conf.vcsStatuses.set(rootKey, enrichedVcsStatuses);
        });
      }
    }
  }, {
    key: '_vcsStatusesAreDifferent',
    value: function _vcsStatusesAreDifferent(rootKey, newVcsStatuses) {
      var currentStatuses = this._conf.vcsStatuses.get(rootKey);
      if (currentStatuses == null || newVcsStatuses == null) {
        if (currentStatuses !== newVcsStatuses) {
          return true;
        }
      }

      var currentKeys = Object.keys(currentStatuses);
      var newKeys = Object.keys(newVcsStatuses);
      if (currentKeys.length !== newKeys.length) {
        return true;
      }

      return newKeys.some(function (key) {
        return currentStatuses[key] !== newVcsStatuses[key];
      });
    }
  }, {
    key: '_setUsePreviewTabs',
    value: function _setUsePreviewTabs(usePreviewTabs) {
      this._updateConf(function (conf) {
        conf.usePreviewTabs = usePreviewTabs;
      });
    }
  }, {
    key: '_setUsePrefixNav',
    value: function _setUsePrefixNav(usePrefixNav) {
      this._usePrefixNav = usePrefixNav;
    }
  }, {
    key: 'usePrefixNav',
    value: function usePrefixNav() {
      return this._usePrefixNav;
    }

    /**
     * The node child keys may either be available immediately (cached), or
     * require an async fetch. If all of the children are needed it's easier to
     * return as promise, to make the caller oblivious to the way children were
     * fetched.
     */
  }, {
    key: 'promiseNodeChildKeys',
    value: _asyncToGenerator(function* (rootKey, nodeKey) {
      var shownChildrenUris = function shownChildrenUris(node) {
        return node.children.toArray().filter(function (n) {
          return n.shouldBeShown;
        }).map(function (n) {
          return n.uri;
        });
      };

      var node = this.getNode(rootKey, nodeKey);
      if (node == null) {
        return [];
      }

      if (!node.isLoading) {
        return shownChildrenUris(node);
      }

      yield this._fetchChildKeys(nodeKey);
      return this.promiseNodeChildKeys(rootKey, nodeKey);
    })

    /**
    * Uses the .containsSelection child-derived property to efficiently build the list of the
    * currently selected nodes
    */
  }, {
    key: 'getSelectedNodes',
    value: function getSelectedNodes() {
      var selectedNodes = [];
      this.roots.forEach(function (root) {
        root.traverse(function (node) {
          if (node.isSelected) {
            selectedNodes.push(node);
          }
          return node.containsSelection;
        });
      });
      return new (_immutable || _load_immutable()).default.List(selectedNodes);
    }

    /**
    * Returns a node if it is the only one selected, or null otherwise
    */
  }, {
    key: 'getSingleSelectedNode',
    value: function getSingleSelectedNode() {
      var selectedNodes = this.getSelectedNodes();

      if (selectedNodes.isEmpty() || selectedNodes.size > 1) {
        return null;
      }

      return selectedNodes.first();
    }
  }, {
    key: 'getNode',
    value: function getNode(rootKey, nodeKey) {
      var rootNode = this.roots.get(rootKey);

      if (rootNode == null) {
        return null;
      }

      return rootNode.find(nodeKey);
    }
  }, {
    key: 'isEditingWorkingSet',
    value: function isEditingWorkingSet() {
      return this._conf.isEditingWorkingSet;
    }

    /**
    * Builds the edited working set from the partially-child-derived .checkedStatus property
    */
  }, {
    key: 'getEditedWorkingSet',
    value: function getEditedWorkingSet() {
      return this._conf.editedWorkingSet;
    }
  }, {
    key: 'isEditedWorkingSetEmpty',
    value: function isEditedWorkingSetEmpty() {
      return this.roots.every(function (root) {
        return root.checkedStatus === 'clear';
      });
    }
  }, {
    key: 'getOpenFilesWorkingSet',
    value: function getOpenFilesWorkingSet() {
      return this._conf.openFilesWorkingSet;
    }

    /**
     * Initiates the fetching of node's children if it's not already in the process.
     * Clears the node's .isLoading property once the fetch is complete.
     * Once the fetch is completed, clears the node's .isLoading property, builds the map of the
     * node's children out of the fetched children URIs and a change subscription is created
     * for the node to monitor future changes.
     */
  }, {
    key: '_fetchChildKeys',
    value: function _fetchChildKeys(nodeKey) {
      var _this7 = this;

      var existingPromise = this._getLoading(nodeKey);
      if (existingPromise != null) {
        return existingPromise;
      }

      var promise = (_FileTreeHelpers || _load_FileTreeHelpers()).default.fetchChildren(nodeKey).then(function (childrenKeys) {
        return _this7._setFetchedKeys(nodeKey, childrenKeys);
      }, function (error) {
        _this7._logger.error('Unable to fetch children for "' + nodeKey + '".');
        _this7._logger.error('Original error: ', error);

        // Unless the contents were already fetched in the past
        // collapse the node and clear its loading state on error so the
        // user can retry expanding it.
        _this7._updateNodeAtAllRoots(nodeKey, function (node) {
          if (node.wasFetched) {
            return node.setIsLoading(false);
          }

          return node.set({ isExpanded: false, isLoading: false, children: new (_immutable || _load_immutable()).default.OrderedMap() });
        });

        _this7._clearLoading(nodeKey);
      });

      this._setLoading(nodeKey, promise);
      return promise;
    }
  }, {
    key: '_setFetchedKeys',
    value: function _setFetchedKeys(nodeKey) {
      var _this8 = this;

      var childrenKeys = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      var directory = (_FileTreeHelpers || _load_FileTreeHelpers()).default.getDirectoryByKey(nodeKey);

      // The node with URI === nodeKey might be present at several roots - update them all
      this._updateNodeAtAllRoots(nodeKey, function (node) {
        // Maintain the order fetched from the FS
        var childrenNodes = childrenKeys.map(function (uri) {
          var prevNode = node.find(uri);
          // If we already had a child with this URI - keep it
          if (prevNode != null) {
            return prevNode;
          }

          return new (_FileTreeNode || _load_FileTreeNode()).FileTreeNode({
            uri: uri,
            rootUri: node.rootUri,
            isCwd: uri === _this8._cwdKey
          }, _this8._conf);
        });

        var children = (_FileTreeNode || _load_FileTreeNode()).FileTreeNode.childrenFromArray(childrenNodes);
        var subscription = node.subscription || _this8._makeSubscription(nodeKey, directory);

        // If the fetch indicated that some children were removed - dispose of all
        // their subscriptions
        var removedChildren = node.children.filter(function (n) {
          return !children.has(n.name);
        });
        removedChildren.forEach(function (c) {
          c.traverse(function (n) {
            if (n.subscription != null) {
              n.subscription.dispose();
            }

            return true;
          });
        });

        return node.set({ isLoading: false, wasFetched: true, children: children, subscription: subscription });
      });

      this._clearLoading(nodeKey);
    }
  }, {
    key: '_makeSubscription',
    value: function _makeSubscription(nodeKey, directory) {
      var _this9 = this;

      if (directory == null) {
        return null;
      }

      var fetchingPromise = null;
      var couldMissUpdate = false;

      try {
        var _ret2 = (function () {
          // Here we intentionally circumvent, to a degree, the logic in the _fetchChildKeys
          // which wouldn't schedule a new fetch if there is already one running.
          // This is fine for the most cases, but not for the subscription handling, as the
          // subscription is notifying us that something has changed and if a fetch is already in
          // progress then it is racing with the change. Therefore, if we detect that there was a change
          // during the fetch we schedule another right after the first has finished.
          var checkMissed = function checkMissed() {
            fetchingPromise = null;
            if (couldMissUpdate) {
              fetchKeys();
            }
          };

          var fetchKeys = function fetchKeys() {
            if (fetchingPromise == null) {
              couldMissUpdate = false;
              fetchingPromise = _this9._fetchChildKeys(nodeKey).then(checkMissed);
            } else {
              couldMissUpdate = true;
            }
          };

          // This call might fail if we try to watch a non-existing directory, or if permission denied.
          return {
            v: directory.onDidChange(function () {
              fetchKeys();
            })
          };
        })();

        if (typeof _ret2 === 'object') return _ret2.v;
      } catch (ex) {
        /*
         * Log error and mark the directory as dirty so the failed subscription will be attempted
         * again next time the directory is expanded.
         */
        this._logger.error('Cannot subscribe to directory "' + nodeKey + '"', ex);
        return null;
      }
    }
  }, {
    key: '_getLoading',
    value: function _getLoading(nodeKey) {
      return this._isLoadingMap.get(nodeKey);
    }
  }, {
    key: '_setLoading',
    value: function _setLoading(nodeKey, value) {
      this._isLoadingMap = this._isLoadingMap.set(nodeKey, value);
    }
  }, {
    key: 'hasCwd',
    value: function hasCwd() {
      return this._cwdKey != null;
    }
  }, {
    key: '_setCwdKey',
    value: function _setCwdKey(cwdKey) {
      if (this._cwdKey != null) {
        this._updateNodeAtAllRoots(this._cwdKey, function (node) {
          return node.setIsCwd(false);
        });
      }
      this._cwdKey = cwdKey;
      if (cwdKey != null) {
        this._updateNodeAtAllRoots(cwdKey, function (node) {
          return node.setIsCwd(true);
        });
      }
    }
  }, {
    key: 'getFilter',
    value: function getFilter() {
      return this._filter;
    }
  }, {
    key: 'addFilterLetter',
    value: function addFilterLetter(letter) {
      var _this10 = this;

      this._filter = this._filter + letter;
      this._updateRoots(function (root) {
        return root.setRecursive(function (node) {
          return node.containsFilterMatches ? null : node;
        }, function (node) {
          return (0, (_FileTreeFilterHelper || _load_FileTreeFilterHelper()).matchesFilter)(node.name, _this10._filter) ? node.set({
            highlightedText: _this10._filter,
            matchesFilter: true
          }) : node.set({ highlightedText: '', matchesFilter: false });
        });
      });
      this._selectFirstFilter();
      this._emitChange();
    }
  }, {
    key: 'clearFilter',
    value: function clearFilter() {
      this._filter = '';
      this._updateRoots(function (root) {
        return root.setRecursive(function (node) {
          return null;
        }, function (node) {
          return node.set({ highlightedText: '', matchesFilter: true });
        });
      });
    }
  }, {
    key: 'removeFilterLetter',
    value: function removeFilterLetter() {
      var _this11 = this;

      var oldLength = this._filter.length;
      this._filter = this._filter.substr(0, this._filter.length - 1);
      if (oldLength > 1) {
        this._updateRoots(function (root) {
          return root.setRecursive(function (node) {
            return null;
          }, function (node) {
            return (0, (_FileTreeFilterHelper || _load_FileTreeFilterHelper()).matchesFilter)(node.name, _this11._filter) ? node.set({
              highlightedText: _this11._filter,
              matchesFilter: true
            }) : node.set({ highlightedText: '', matchesFilter: false });
          });
        });
        this._emitChange();
      } else if (oldLength === 1) {
        this.clearFilter();
      }
    }
  }, {
    key: 'getFilterFound',
    value: function getFilterFound() {
      return this.roots.some(function (root) {
        return root.containsFilterMatches;
      });
    }

    /**
     * Resets the node to be kept in view if no more data is being awaited. Safe to call many times
     * because it only changes state if a node is being tracked.
     */
  }, {
    key: '_checkTrackedNode',
    value: function _checkTrackedNode() {
      if (
      /*
       * The loading map being empty is a heuristic for when loading has completed. It is inexact
       * because the loading might be unrelated to the tracked node, however it is cheap and false
       * positives will only last until loading is complete or until the user clicks another node in
       * the tree.
       */
      this._isLoadingMap.isEmpty()) {
        // Loading has completed. Allow scrolling to proceed as usual.
        this._clearTrackedNode();
      }
    }
  }, {
    key: '_clearLoading',
    value: function _clearLoading(nodeKey) {
      this._isLoadingMap = this._isLoadingMap.delete(nodeKey);
    }
  }, {
    key: '_moveToNode',
    value: _asyncToGenerator(function* (rootKey, nodeKey) {
      var targetNode = this.getNode(rootKey, nodeKey);
      if (targetNode == null || !targetNode.isContainer) {
        return;
      }

      var selectedNodes = this.getSelectedNodes();
      this._clearDragHover();
      this._clearSelection();

      try {
        yield (_FileTreeHgHelpers || _load_FileTreeHgHelpers()).default.moveNodes(selectedNodes.toJS(), targetNode.uri);
      } catch (e) {
        atom.notifications.addError('Failed to move entries: ' + e.message);
      }
    })
  }, {
    key: '_deleteSelectedNodes',
    value: _asyncToGenerator(function* () {
      var selectedNodes = this.getSelectedNodes();
      try {
        yield (_FileTreeHgHelpers || _load_FileTreeHgHelpers()).default.deleteNodes(selectedNodes.toJS());
        this._selectionRange = null;
      } catch (e) {
        atom.notifications.addError('Failed to delete entries: ' + e.message);
      }
    })
  }, {
    key: '_expandNode',
    value: function _expandNode(rootKey, nodeKey) {
      var _this12 = this;

      this._updateNodeAtRoot(rootKey, nodeKey, function (node) {
        return node.setIsExpanded(true).setRecursive(function (n) {
          return !n.isContainer || !n.isExpanded ? n : null;
        }, function (n) {
          if (n.isContainer && n.isExpanded) {
            _this12._fetchChildKeys(n.uri);
            return n.setIsLoading(true);
          }

          return n;
        });
      });
    }

    /**
     * Performes a deep BFS scanning expand of contained nodes.
     * returns - a promise fulfilled when the expand operation is finished
     */
  }, {
    key: '_expandNodeDeep',
    value: function _expandNodeDeep(rootKey, nodeKey) {
      var _this13 = this;

      // Stop the traversal after 100 nodes were added to the tree
      var itNodes = new FileTreeStoreBfsIterator(this, rootKey, nodeKey, /* limit */100);
      var promise = new Promise(function (resolve) {
        var expand = function expand() {
          var traversedNodeKey = itNodes.traversedNode();
          if (traversedNodeKey) {
            _this13._expandNode(rootKey, traversedNodeKey);

            var nextPromise = itNodes.next();
            if (nextPromise) {
              nextPromise.then(expand);
            }
          } else {
            resolve();
          }
        };

        expand();
      });

      return promise;
    }
  }, {
    key: '_collapseNode',
    value: function _collapseNode(rootKey, nodeKey) {
      this._updateNodeAtRoot(rootKey, nodeKey, function (node) {
        // Clear all selected nodes under the node being collapsed and dispose their subscriptions
        return node.setRecursive(function (childNode) {
          if (childNode.isExpanded) {
            return null;
          }
          return childNode;
        }, function (childNode) {
          if (childNode.subscription != null) {
            childNode.subscription.dispose();
          }

          if (childNode.uri === node.uri) {
            return childNode.set({ isExpanded: false, subscription: null });
          } else {
            return childNode.set({ isSelected: false, subscription: null });
          }
        });
      });
    }
  }, {
    key: '_collapseNodeDeep',
    value: function _collapseNodeDeep(rootKey, nodeKey) {
      this._updateNodeAtRoot(rootKey, nodeKey, function (node) {
        return node.setRecursive(
        /* prePredicate */null, function (childNode) {
          if (childNode.subscription != null) {
            childNode.subscription.dispose();
          }

          if (childNode.uri !== node.uri) {
            return childNode.set({ isExpanded: false, isSelected: false, subscription: null });
          } else {
            return childNode.set({ isExpanded: false, subscription: null });
          }
        });
      });
    }
  }, {
    key: '_setDragHoveredNode',
    value: function _setDragHoveredNode(rootKey, nodeKey) {
      this._clearDragHover();
      this._updateNodeAtRoot(rootKey, nodeKey, function (node) {
        return node.setIsDragHovered(true);
      });
    }
  }, {
    key: '_unhoverNode',
    value: function _unhoverNode(rootKey, nodeKey) {
      this._updateNodeAtRoot(rootKey, nodeKey, function (node) {
        return node.setIsDragHovered(false);
      });
    }

    /**
    * Selects a single node and tracks it.
    */
  }, {
    key: '_setSelectedNode',
    value: function _setSelectedNode(rootKey, nodeKey) {
      this._clearSelection(rootKey, nodeKey);
      this._updateNodeAtRoot(rootKey, nodeKey, function (node) {
        return node.setIsSelected(true);
      });
      this._setTrackedNode(rootKey, nodeKey);
      this._selectionRange = (_FileTreeSelectionRange || _load_FileTreeSelectionRange()).SelectionRange.ofSingleItem(new (_FileTreeSelectionRange || _load_FileTreeSelectionRange()).RangeKey(rootKey, nodeKey));
    }

    /**
     * Mark a node that has been focused, similar to selected, but only true after mouseup.
     */
  }, {
    key: '_setFocusedNode',
    value: function _setFocusedNode(rootKey, nodeKey) {
      this._updateNodeAtRoot(rootKey, nodeKey, function (node) {
        return node.setIsFocused(true);
      });
    }

    /**
     * Selects and focuses a node in one pass.
     */
  }, {
    key: '_setSelectedAndFocusedNode',
    value: function _setSelectedAndFocusedNode(rootKey, nodeKey) {
      this._clearSelection(rootKey, nodeKey);
      this._updateNodeAtRoot(rootKey, nodeKey, function (node) {
        return node.set({ isSelected: true, isFocused: true });
      });
      this._setTrackedNode(rootKey, nodeKey);
      this._selectionRange = (_FileTreeSelectionRange || _load_FileTreeSelectionRange()).SelectionRange.ofSingleItem(new (_FileTreeSelectionRange || _load_FileTreeSelectionRange()).RangeKey(rootKey, nodeKey));
    }
  }, {
    key: '_addSelectedNode',
    value: function _addSelectedNode(rootKey, nodeKey) {
      this._updateNodeAtRoot(rootKey, nodeKey, function (node) {
        return node.setIsSelected(true);
      });
      this._selectionRange = (_FileTreeSelectionRange || _load_FileTreeSelectionRange()).SelectionRange.ofSingleItem(new (_FileTreeSelectionRange || _load_FileTreeSelectionRange()).RangeKey(rootKey, nodeKey));
    }
  }, {
    key: '_unselectNode',
    value: function _unselectNode(rootKey, nodeKey) {
      this._updateNodeAtRoot(rootKey, nodeKey, function (node) {
        return node.set({ isSelected: false, isFocused: false });
      });
    }
  }, {
    key: '_setSelectionRange',
    value: function _setSelectionRange(selectionRange) {
      this._selectionRange = selectionRange;
    }
  }, {
    key: '_clearSelectionRange',
    value: function _clearSelectionRange() {
      this._selectionRange = null;
    }

    /**
     * Refresh the selection range data.
     * invalidate the data
     * - if anchor node or range node is deleted.
     * - if these two nodes are not selected, and there is no nearby node to fall back to.
     * When this function returns, the selection range always contains valid data.
     */
  }, {
    key: '_refreshSelectionRange',
    value: function _refreshSelectionRange() {
      var _this14 = this;

      var invalidate = function invalidate() {
        _this14._selectionRange = null;
        return null;
      };

      var selectionRange = this._selectionRange;
      if (selectionRange == null) {
        return invalidate();
      }
      var anchor = selectionRange.anchor();
      var range = selectionRange.range();
      var anchorNode = this.getNode(anchor.rootKey(), anchor.nodeKey());
      var rangeNode = this.getNode(range.rootKey(), range.nodeKey());
      if (anchorNode == null || rangeNode == null) {
        return invalidate();
      }

      anchorNode = (_FileTreeSelectionRange || _load_FileTreeSelectionRange()).RangeUtil.findSelectedNode(anchorNode);
      rangeNode = (_FileTreeSelectionRange || _load_FileTreeSelectionRange()).RangeUtil.findSelectedNode(rangeNode);
      if (anchorNode == null || rangeNode == null) {
        return invalidate();
      }
      var anchorIndex = anchorNode.calculateVisualIndex();
      var rangeIndex = rangeNode.calculateVisualIndex();
      var direction = rangeIndex > anchorIndex ? 'down' : rangeIndex === anchorIndex ? 'none' : 'up';

      selectionRange = new (_FileTreeSelectionRange || _load_FileTreeSelectionRange()).SelectionRange((_FileTreeSelectionRange || _load_FileTreeSelectionRange()).RangeKey.of(anchorNode), (_FileTreeSelectionRange || _load_FileTreeSelectionRange()).RangeKey.of(rangeNode));
      this._setSelectionRange(selectionRange);
      return { selectionRange: selectionRange, anchorNode: anchorNode, rangeNode: rangeNode, anchorIndex: anchorIndex, rangeIndex: rangeIndex, direction: direction };
    }

    /**
     * Bulk selection based on the range.
     */
  }, {
    key: '_rangeSelectToNode',
    value: function _rangeSelectToNode(rootKey, nodeKey) {
      var data = this._refreshSelectionRange();
      if (data == null) {
        return;
      }
      var selectionRange = data.selectionRange;
      var anchorIndex = data.anchorIndex;
      var rangeIndex = data.rangeIndex;

      var nextRangeNode = this.getNode(rootKey, nodeKey);
      if (nextRangeNode == null) {
        return;
      }
      var nextRangeIndex = nextRangeNode.calculateVisualIndex();
      if (nextRangeIndex === rangeIndex) {
        return;
      }

      var modMinIndex = Math.min(anchorIndex, rangeIndex, nextRangeIndex);
      var modMaxIndex = Math.max(anchorIndex, rangeIndex, nextRangeIndex);

      var beginIndex = 1;

      // traversing the tree, flip the isSelected flag when applicable.
      var roots = this.roots.map(function (rootNode) {
        return rootNode.setRecursive(
        // keep traversing the sub-tree,
        // - if the node is shown, has children, and in the applicable range.
        function (node) {
          if (!node.shouldBeShown) {
            return node;
          }
          if (node.shownChildrenBelow === 1) {
            beginIndex++;
            return node;
          }
          var endIndex = beginIndex + node.shownChildrenBelow - 1;
          if (beginIndex <= modMaxIndex && modMinIndex <= endIndex) {
            beginIndex++;
            return null;
          }
          beginIndex += node.shownChildrenBelow;
          return node;
        },
        // flip the isSelected flag accordingly, based on previous and current range.
        function (node) {
          if (!node.shouldBeShown) {
            return node;
          }
          var curIndex = beginIndex - node.shownChildrenBelow;
          var inOldRange = Math.sign(curIndex - anchorIndex) * Math.sign(curIndex - rangeIndex) !== 1;
          var inNewRange = Math.sign(curIndex - anchorIndex) * Math.sign(curIndex - nextRangeIndex) !== 1;
          if (inOldRange && inNewRange || !inOldRange && !inNewRange) {
            return node;
          } else if (inOldRange && !inNewRange) {
            return node.set({ isSelected: false, isFocused: false });
          } else {
            return node.set({ isSelected: true, isFocused: true });
          }
        });
      });
      this._setRoots(roots);

      // expand the range to merge existing selected nodes.
      var getNextNode = function getNextNode(cur) {
        return nextRangeIndex < rangeIndex ? cur.findPrevious() : cur.findNext();
      };
      var probe = getNextNode(nextRangeNode);
      while (probe != null && probe.isSelected) {
        nextRangeNode = probe;
        probe = getNextNode(nextRangeNode);
      }
      this._setSelectionRange(selectionRange.withNewRange((_FileTreeSelectionRange || _load_FileTreeSelectionRange()).RangeKey.of(nextRangeNode)));
    }

    /**
     * Move the range of selections by one step.
     */
  }, {
    key: '_rangeSelectMove',
    value: function _rangeSelectMove(move) {
      var data = this._refreshSelectionRange();
      if (data == null) {
        return;
      }
      var selectionRange = data.selectionRange;
      var anchorNode = data.anchorNode;
      var rangeNode = data.rangeNode;
      var direction = data.direction;

      var getNextNode = function getNextNode(cur) {
        return move === 'up' ? cur.findPrevious() : cur.findNext();
      };

      var isExpanding = direction === move || direction === 'none';

      if (isExpanding) {
        var nextNode = getNextNode(rangeNode);
        while (nextNode != null && nextNode.isSelected) {
          nextNode = getNextNode(nextNode);
        }
        if (nextNode == null) {
          return;
        }
        nextNode = this._updateNode(nextNode, function (n) {
          return n.set({ isSelected: true, isFocused: true });
        });
        var probe = getNextNode(nextNode);
        while (probe != null && probe.isSelected) {
          nextNode = probe;
          probe = getNextNode(nextNode);
        }
        this._selectionRange = selectionRange.withNewRange((_FileTreeSelectionRange || _load_FileTreeSelectionRange()).RangeKey.of(nextNode));
        this._setTrackedNode(nextNode.rootUri, nextNode.uri);
      } else {
        var nextNode = rangeNode;
        while (nextNode != null && nextNode !== anchorNode && nextNode.isSelected === false) {
          nextNode = getNextNode(nextNode);
        }
        if (nextNode == null) {
          return;
        }
        if (nextNode === anchorNode) {
          this._selectionRange = selectionRange.withNewRange((_FileTreeSelectionRange || _load_FileTreeSelectionRange()).RangeKey.of(nextNode));
          return;
        }
        nextNode = this._updateNode(nextNode, function (n) {
          return n.set({ isSelected: false, isFocused: false });
        });
        this._selectionRange = selectionRange.withNewRange((_FileTreeSelectionRange || _load_FileTreeSelectionRange()).RangeKey.of(nextNode));
        this._setTrackedNode(nextNode.rootUri, nextNode.uri);
      }
    }
  }, {
    key: '_rangeSelectUp',
    value: function _rangeSelectUp() {
      this._rangeSelectMove('up');
    }
  }, {
    key: '_rangeSelectDown',
    value: function _rangeSelectDown() {
      this._rangeSelectMove('down');
    }
  }, {
    key: '_selectFirstFilter',
    value: function _selectFirstFilter() {
      var node = this.getSingleSelectedNode();
      // if the current node matches the filter do nothing
      if (node != null && node.matchesFilter) {
        return;
      }

      this._moveSelectionDown();
      node = this.getSingleSelectedNode();
      // if the selection does not find anything up go down
      if (node != null && !node.matchesFilter) {
        this._moveSelectionUp();
      }
    }

    /**
    * Moves the selection one node down. In case several nodes were selected, the topmost (first in
    * the natural visual order) is considered to be the reference point for the move.
    */
  }, {
    key: '_moveSelectionDown',
    value: function _moveSelectionDown() {
      if (this.roots.isEmpty()) {
        return;
      }

      var selectedNodes = this.getSelectedNodes();

      var nodeToSelect = undefined;
      if (selectedNodes.isEmpty()) {
        nodeToSelect = this.roots.first();
      } else {
        var selectedNode = selectedNodes.first();
        nodeToSelect = selectedNode.findNext();
      }

      while (nodeToSelect != null && !nodeToSelect.matchesFilter) {
        nodeToSelect = nodeToSelect.findNext();
      }

      if (nodeToSelect != null) {
        this._setSelectedAndFocusedNode(nodeToSelect.rootUri, nodeToSelect.uri);
      }
    }

    /**
    * Moves the selection one node up. In case several nodes were selected, the topmost (first in
    * the natural visual order) is considered to be the reference point for the move.
    */
  }, {
    key: '_moveSelectionUp',
    value: function _moveSelectionUp() {
      if (this.roots.isEmpty()) {
        return;
      }

      var selectedNodes = this.getSelectedNodes();

      var nodeToSelect = undefined;
      if (selectedNodes.isEmpty()) {
        nodeToSelect = this.roots.last().findLastRecursiveChild();
      } else {
        var selectedNode = selectedNodes.first();
        nodeToSelect = selectedNode.findPrevious();
      }

      while (nodeToSelect != null && !nodeToSelect.matchesFilter) {
        nodeToSelect = nodeToSelect.findPrevious();
      }

      if (nodeToSelect != null) {
        this._setSelectedAndFocusedNode(nodeToSelect.rootUri, nodeToSelect.uri);
      }
    }
  }, {
    key: '_moveSelectionToTop',
    value: function _moveSelectionToTop() {
      if (this.roots.isEmpty()) {
        return;
      }

      var nodeToSelect = this.roots.first();
      if (nodeToSelect != null && !nodeToSelect.shouldBeShown) {
        nodeToSelect = nodeToSelect.findNext();
      }

      if (nodeToSelect != null) {
        this._setSelectedAndFocusedNode(nodeToSelect.uri, nodeToSelect.uri);
      }
    }
  }, {
    key: '_moveSelectionToBottom',
    value: function _moveSelectionToBottom() {
      if (this.roots.isEmpty()) {
        return;
      }

      var lastRoot = this.roots.last();
      var lastChild = lastRoot.findLastRecursiveChild();
      this._setSelectedAndFocusedNode(lastChild.rootUri, lastChild.uri);
    }
  }, {
    key: '_clearDragHover',
    value: function _clearDragHover() {
      this._updateRoots(function (root) {
        return root.setRecursive(function (node) {
          return node.containsDragHover ? null : node;
        }, function (node) {
          return node.setIsDragHovered(false);
        });
      });
    }

    // Clear selections and focuses on all nodes except an optionally specified
    // current node.
  }, {
    key: '_clearSelection',
    value: function _clearSelection(currRootKey, currNodeKey) {
      this._updateRoots(function (root) {
        return root.setRecursive(function (node) {
          return node.containsSelection ? null : node;
        }, function (node) {
          return node.rootUri === currRootKey && node.uri === currNodeKey ? node : node.set({ isSelected: false, isFocused: false });
        });
      });
      this._selectionRange = null;
    }
  }, {
    key: '_setRootKeys',
    value: function _setRootKeys(rootKeys) {
      var _this15 = this;

      var rootNodes = rootKeys.map(function (rootUri) {
        var root = _this15.roots.get(rootUri);
        if (root != null) {
          return root;
        }

        return new (_FileTreeNode || _load_FileTreeNode()).FileTreeNode({
          uri: rootUri,
          rootUri: rootUri,
          connectionTitle: (_FileTreeHelpers || _load_FileTreeHelpers()).default.getDisplayTitle(rootUri) || ''
        }, _this15._conf);
      });

      var roots = new (_immutable || _load_immutable()).default.OrderedMap(rootNodes.map(function (root) {
        return [root.uri, root];
      }));
      var removedRoots = this.roots.filter(function (root) {
        return !roots.has(root.uri);
      });
      removedRoots.forEach(function (root) {
        return root.traverse(function (node) {
          return node.isExpanded;
        }, function (node) {
          if (node.subscription != null) {
            node.subscription.dispose();
          }
        });
      });
      this._setRoots(roots);

      // Just in case there's a race between the update of the root keys and the cwdKey and the cwdKey
      // is set too early - set it again. If there was no race - it's a noop.
      this._setCwdKey(this._cwdKey);
    }

    /**
    * Makes sure a certain child node is present in the file tree, creating all its ancestors, if
    * needed and scheduling a chilld key fetch. Used by the reveal active file functionality.
    */
  }, {
    key: '_ensureChildNode',
    value: function _ensureChildNode(nodeKey) {
      var _this16 = this;

      var firstRootUri = undefined;

      var expandNode = function expandNode(node) {
        if (node.isExpanded && node.subscription != null) {
          return node;
        }

        if (node.subscription != null) {
          node.subscription.dispose();
        }

        var directory = (_FileTreeHelpers || _load_FileTreeHelpers()).default.getDirectoryByKey(node.uri);
        var subscription = _this16._makeSubscription(node.uri, directory);
        return node.set({ subscription: subscription, isExpanded: true });
      };

      this._updateRoots(function (root) {
        if (!nodeKey.startsWith(root.uri)) {
          return root;
        }

        if (firstRootUri == null) {
          firstRootUri = root.uri;
        }

        var deepest = root.findDeepest(nodeKey);
        if (deepest == null) {
          return root;
        }

        if (deepest.uri === nodeKey) {
          return _this16._bubbleUp(deepest, deepest, expandNode);
        }

        var parents = [];
        var currentParentUri = (_FileTreeHelpers || _load_FileTreeHelpers()).default.getParentKey(nodeKey);
        var rootUri = root.uri;
        while (currentParentUri !== deepest.uri) {
          parents.push(currentParentUri);
          currentParentUri = (_FileTreeHelpers || _load_FileTreeHelpers()).default.getParentKey(currentParentUri);
        }

        var currentChild = new (_FileTreeNode || _load_FileTreeNode()).FileTreeNode({ uri: nodeKey, rootUri: rootUri }, _this16._conf);

        parents.forEach(function (currentUri) {
          _this16._fetchChildKeys(currentUri);
          var parent = new (_FileTreeNode || _load_FileTreeNode()).FileTreeNode({
            uri: currentUri,
            rootUri: rootUri,
            isLoading: true,
            isExpanded: true,
            children: (_FileTreeNode || _load_FileTreeNode()).FileTreeNode.childrenFromArray([currentChild])
          }, _this16._conf);

          currentChild = parent;
        });

        _this16._fetchChildKeys(deepest.uri);
        return _this16._bubbleUp(deepest, deepest.set({
          isLoading: true,
          isExpanded: true,
          children: deepest.children.set(currentChild.name, currentChild)
        }), expandNode);
      });

      if (firstRootUri != null) {
        this._setSelectedNode(firstRootUri, nodeKey);
      }
    }
  }, {
    key: '_clearTrackedNode',
    value: function _clearTrackedNode() {
      this._updateRoots(function (root) {
        if (!root.containsTrackedNode) {
          return root;
        }

        return root.setRecursive(function (node) {
          return node.containsTrackedNode ? null : node;
        }, function (node) {
          return node.setIsTracked(false);
        });
      });
    }
  }, {
    key: '_setTrackedNode',
    value: function _setTrackedNode(rootKey, nodeKey) {
      this._clearTrackedNode();
      this._updateNodeAtRoot(rootKey, nodeKey, function (node) {
        return node.setIsTracked(true);
      });
    }
  }, {
    key: '_setRepositories',
    value: function _setRepositories(repositories) {
      var _this17 = this;

      this._repositories = repositories;
      this._updateConf(function (conf) {
        var reposByRoot = {};
        _this17.roots.forEach(function (root) {
          reposByRoot[root.uri] = (0, (_nuclideHgGitBridge || _load_nuclideHgGitBridge()).repositoryForPath)(root.uri);
        });
        conf.reposByRoot = reposByRoot;
      });
    }
  }, {
    key: '_setWorkingSet',
    value: function _setWorkingSet(workingSet) {
      this._updateConf(function (conf) {
        conf.workingSet = workingSet;
      });
    }
  }, {
    key: '_setOpenFilesWorkingSet',
    value: function _setOpenFilesWorkingSet(openFilesWorkingSet) {
      this._updateConf(function (conf) {
        conf.openFilesWorkingSet = openFilesWorkingSet;
      });
    }
  }, {
    key: '_setWorkingSetsStore',
    value: function _setWorkingSetsStore(workingSetsStore) {
      this._workingSetsStore = workingSetsStore;
    }
  }, {
    key: '_startEditingWorkingSet',
    value: function _startEditingWorkingSet(editedWorkingSet) {
      this._updateConf(function (conf) {
        conf.editedWorkingSet = editedWorkingSet;
        conf.isEditingWorkingSet = true;
      });
    }
  }, {
    key: '_finishEditingWorkingSet',
    value: function _finishEditingWorkingSet() {
      this._updateConf(function (conf) {
        conf.isEditingWorkingSet = false;
        conf.editedWorkingSet = new (_nuclideWorkingSetsCommon || _load_nuclideWorkingSetsCommon()).WorkingSet();
      });
    }
  }, {
    key: '_checkNode',
    value: function _checkNode(rootKey, nodeKey) {
      if (!this._conf.isEditingWorkingSet) {
        return;
      }

      var node = this.getNode(rootKey, nodeKey);
      if (node == null) {
        return;
      }

      var uriToAppend = nodeKey; // Workaround flow's (over)aggressive nullability detection

      var allChecked = function allChecked(nodeParent) {
        return nodeParent.children.every(function (c) {
          return !c.shouldBeShown || c.checkedStatus === 'checked' || c === node;
        });
      };

      while (node.parent != null && allChecked(node.parent)) {
        node = node.parent;
        uriToAppend = node.uri;
      }

      this._updateConf(function (conf) {
        conf.editedWorkingSet = conf.editedWorkingSet.append(uriToAppend);
      });
    }
  }, {
    key: '_uncheckNode',
    value: function _uncheckNode(rootKey, nodeKey) {
      if (!this._conf.isEditingWorkingSet) {
        return;
      }

      var node = this.getNode(rootKey, nodeKey);
      if (node == null) {
        return;
      }

      var nodesToAppend = [];
      var uriToRemove = nodeKey;

      while (node.parent != null && node.parent.checkedStatus === 'checked') {
        var _parent = node.parent; // Workaround flow's (over)aggressive nullability detection
        _parent.children.forEach(function (c) {
          if (c !== node) {
            nodesToAppend.push(c);
          }
        });

        node = _parent;
        uriToRemove = node.uri;
      }

      this._updateConf(function (conf) {
        var _conf$editedWorkingSet$remove;

        var urisToAppend = nodesToAppend.map(function (n) {
          return n.uri;
        });
        conf.editedWorkingSet = (_conf$editedWorkingSet$remove = conf.editedWorkingSet.remove(uriToRemove)).append.apply(_conf$editedWorkingSet$remove, _toConsumableArray(urisToAppend));
      });
    }
  }, {
    key: '_setOpenFilesExpanded',
    value: function _setOpenFilesExpanded(openFilesExpanded) {
      this.openFilesExpanded = openFilesExpanded;
      this._emitChange();
    }
  }, {
    key: '_setUncommittedChangesExpanded',
    value: function _setUncommittedChangesExpanded(uncommittedChangesExpanded) {
      this.uncommittedChangesExpanded = uncommittedChangesExpanded;
      this._emitChange();
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.roots.forEach(function (root) {
        root.traverse(function (n) {
          if (n.subscription != null) {
            n.subscription.dispose();
          }

          return true;
        });
      });

      // Reset data store.
      this._conf = DEFAULT_CONF;
      this._setRoots(new (_immutable || _load_immutable()).default.OrderedMap());
    }
  }, {
    key: 'subscribe',
    value: function subscribe(listener) {
      return this._emitter.on('change', listener);
    }
  }]);

  return FileTreeStore;
})();

exports.FileTreeStore = FileTreeStore;

var FileTreeStoreBfsIterator = (function () {
  function FileTreeStoreBfsIterator(fileTreeStore, rootKey, nodeKey, limit) {
    _classCallCheck(this, FileTreeStoreBfsIterator);

    this._fileTreeStore = fileTreeStore;
    this._rootKey = rootKey;
    this._nodesToTraverse = [];
    this._currentlyTraversedNode = nodeKey;
    this._limit = limit;
    this._numNodesTraversed = 0;
    this._promise = null;
    this._count = 0;
  }

  _createClass(FileTreeStoreBfsIterator, [{
    key: '_handlePromiseResolution',
    value: function _handlePromiseResolution(childrenKeys) {
      this._numNodesTraversed += childrenKeys.length;
      if (this._numNodesTraversed < this._limit) {
        var nextLevelNodes = childrenKeys.filter(function (childKey) {
          return (_FileTreeHelpers || _load_FileTreeHelpers()).default.isDirKey(childKey);
        });
        this._nodesToTraverse = this._nodesToTraverse.concat(nextLevelNodes);

        this._currentlyTraversedNode = this._nodesToTraverse.splice(0, 1)[0];
        this._promise = null;
      } else {
        this._currentlyTraversedNode = null;
        this._promise = null;
      }

      return;
    }
  }, {
    key: 'next',
    value: function next() {
      var currentlyTraversedNode = this._currentlyTraversedNode;
      if (!this._promise && currentlyTraversedNode) {
        this._promise = this._fileTreeStore.promiseNodeChildKeys(this._rootKey, currentlyTraversedNode).then(this._handlePromiseResolution.bind(this));
      }
      return this._promise;
    }
  }, {
    key: 'traversedNode',
    value: function traversedNode() {
      return this._currentlyTraversedNode;
    }
  }]);

  return FileTreeStoreBfsIterator;
})();

// The configuration for the file-tree. Avoid direct writing.