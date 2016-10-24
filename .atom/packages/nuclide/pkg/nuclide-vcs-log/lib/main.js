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

// TODO: Make it possible to move or split a pane with a VcsLogPaneItem.

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.activate = activate;
exports.deactivate = deactivate;
exports.addItemsToFileTreeContextMenu = addItemsToFileTreeContextMenu;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom;

function _load_atom() {
  return _atom = require('atom');
}

var _VcsLogPaneItem;

function _load_VcsLogPaneItem() {
  return _VcsLogPaneItem = _interopRequireDefault(require('./VcsLogPaneItem'));
}

var _commonsAtomFeatureConfig;

function _load_commonsAtomFeatureConfig() {
  return _commonsAtomFeatureConfig = _interopRequireDefault(require('../../commons-atom/featureConfig'));
}

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _commonsAtomProjects;

function _load_commonsAtomProjects() {
  return _commonsAtomProjects = require('../../commons-atom/projects');
}

var _commonsNodeString;

function _load_commonsNodeString() {
  return _commonsNodeString = require('../../commons-node/string');
}

var _querystring;

function _load_querystring() {
  return _querystring = _interopRequireDefault(require('querystring'));
}

var _nuclideHgGitBridge;

function _load_nuclideHgGitBridge() {
  return _nuclideHgGitBridge = require('../../nuclide-hg-git-bridge');
}

var _util;

function _load_util() {
  return _util = require('./util');
}

var _nuclideAnalytics;

function _load_nuclideAnalytics() {
  return _nuclideAnalytics = require('../../nuclide-analytics');
}

var _url;

function _load_url() {
  return _url = _interopRequireDefault(require('url'));
}

var SHOW_LOG_FILE_TREE_CONTEXT_MENU_PRIORITY = 500;

var CONTEXT_MENU_LABEL = 'Show history';
var MAX_NUM_LOG_RESULTS = 100;
var VCS_LOG_URI_PREFIX = 'atom://nucide-vcs-log/view';
var VCS_LOG_URI_PATHS_QUERY_PARAM = 'path';

var Activation = (function () {
  function Activation() {
    _classCallCheck(this, Activation);

    this._subscriptions = new (_atom || _load_atom()).CompositeDisposable();
    this._registerOpener();
  }

  _createClass(Activation, [{
    key: '_registerOpener',
    value: function _registerOpener() {
      this._subscriptions.add(atom.workspace.addOpener(function (uriToOpen) {
        if (!uriToOpen.startsWith(VCS_LOG_URI_PREFIX)) {
          return;
        }

        var _default$parse = (_url || _load_url()).default.parse(uriToOpen, /* parseQueryString */true);

        var query = _default$parse.query;

        (0, (_assert || _load_assert()).default)(query);

        // Make sure a non-zero number of paths have been specified.
        var path = query[VCS_LOG_URI_PATHS_QUERY_PARAM];
        return createLogPaneForPath(path);
      }));

      // TODO(mbolin): Once the nuclide-file-tree.context-menu is generalized to automatically add
      // menu items to the editor context menu, as appropriate, it should be possible to eliminate
      // (or at least reduce) the logic here.

      this._subscriptions.add(atom.commands.add('atom-text-editor', 'nuclide-vcs-log:show-log-for-active-editor', function () {
        var uri = getActiveTextEditorURI();
        if (uri != null) {
          openLogPaneForURI(uri);
          (0, (_nuclideAnalytics || _load_nuclideAnalytics()).track)('nuclide-vcs-log:open-from-text-editor');
        }
      }), atom.contextMenu.add({
        'atom-text-editor': [{
          label: 'Source Control',
          submenu: [{
            label: CONTEXT_MENU_LABEL,
            command: 'nuclide-vcs-log:show-log-for-active-editor',
            shouldDisplay: function shouldDisplay() {
              var uri = getActiveTextEditorURI();
              return getRepositoryWithLogMethodForPath(uri) != null;
            }
          }]
        }]
      }));
    }
  }, {
    key: 'addItemsToFileTreeContextMenu',
    value: function addItemsToFileTreeContextMenu(contextMenu) {
      var _this = this;

      var contextDisposable = contextMenu.addItemToSourceControlMenu({
        label: CONTEXT_MENU_LABEL,
        callback: function callback() {
          var node = contextMenu.getSingleSelectedNode();
          if (node == null) {
            return;
          }

          var uri = node.uri;

          var repository = getRepositoryWithLogMethodForPath(uri);
          if (repository == null) {
            return;
          }

          openLogPaneForURI(uri);
          (0, (_nuclideAnalytics || _load_nuclideAnalytics()).track)('nuclide-vcs-log:open-from-file-tree');
        },
        shouldDisplay: function shouldDisplay() {
          var node = contextMenu.getSingleSelectedNode();
          if (node == null) {
            return false;
          }

          return getRepositoryWithLogMethodForPath(node.uri) != null;
        }
      }, SHOW_LOG_FILE_TREE_CONTEXT_MENU_PRIORITY);

      this._subscriptions.add(contextDisposable);

      // We don't need to dispose of the contextDisposable when the provider is disabled -
      // it needs to be handled by the provider itself. We only should remove it from the list
      // of the disposables we maintain.
      return new (_atom || _load_atom()).Disposable(function () {
        return _this._subscriptions.remove(contextDisposable);
      });
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this._subscriptions.dispose();
    }
  }]);

  return Activation;
})();

function getRepositoryWithLogMethodForPath(path) {
  if (path == null) {
    return null;
  }

  var repository = (0, (_nuclideHgGitBridge || _load_nuclideHgGitBridge()).repositoryForPath)(path);
  // For now, we only expect HgRepository to work. We should also find a way to
  // make this work for Git.
  if (repository != null && repository.getType() === 'hg') {
    return repository;
  } else {
    return null;
  }
}

function getActiveTextEditorURI() {
  var editor = atom.workspace.getActiveTextEditor();
  if (editor == null) {
    return null;
  }

  var filePath = editor.getPath();
  if (filePath == null) {
    return null;
  }

  return filePath;
}

function openLogPaneForURI(uri) {
  (0, (_nuclideAnalytics || _load_nuclideAnalytics()).track)('nuclide-vcs-log:open');
  var openerURI = VCS_LOG_URI_PREFIX + '?' + (_querystring || _load_querystring()).default.stringify(_defineProperty({}, VCS_LOG_URI_PATHS_QUERY_PARAM, uri));
  atom.workspace.open(openerURI);
}

function createLogPaneForPath(path) {
  if (path == null) {
    return null;
  }

  var repository = getRepositoryWithLogMethodForPath(path);
  if (repository == null) {
    return null;
  }

  var pane = new (_VcsLogPaneItem || _load_VcsLogPaneItem()).default();

  var _ref = (_commonsAtomFeatureConfig || _load_commonsAtomFeatureConfig()).default.get('nuclide-vcs-log');

  var showDifferentialRevision = _ref.showDifferentialRevision;

  (0, (_assert || _load_assert()).default)(typeof showDifferentialRevision === 'boolean');
  pane.initialize({
    iconName: 'repo',
    initialProps: {
      files: [path],
      showDifferentialRevision: showDifferentialRevision
    },
    title: repository.getType() + ' log ' + (0, (_commonsNodeString || _load_commonsNodeString()).maybeToString)((0, (_commonsAtomProjects || _load_commonsAtomProjects()).getAtomProjectRelativePath)(path))
  });

  repository.log([path], MAX_NUM_LOG_RESULTS).then(function (response) {
    return pane.updateWithLogEntries(response.entries);
  });

  return pane;
}

var activation = undefined;

function activate(state) {
  if (activation == null) {
    activation = new Activation();
  }
}

function deactivate() {
  if (activation != null) {
    activation.dispose();
    activation = null;
  }
}

function addItemsToFileTreeContextMenu(contextMenu) {
  (0, (_assert || _load_assert()).default)(activation);
  return activation.addItemsToFileTreeContextMenu(contextMenu);
}

var shortNameForAuthor = (_util || _load_util()).shortNameForAuthor;
exports.shortNameForAuthor = shortNameForAuthor;