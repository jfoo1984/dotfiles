Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _RelatedFileFinder;

function _load_RelatedFileFinder() {
  return _RelatedFileFinder = _interopRequireDefault(require('./RelatedFileFinder'));
}

var _nuclideAnalytics;

function _load_nuclideAnalytics() {
  return _nuclideAnalytics = require('../../nuclide-analytics');
}

var _commonsAtomFeatureConfig;

function _load_commonsAtomFeatureConfig() {
  return _commonsAtomFeatureConfig = _interopRequireDefault(require('../../commons-atom/featureConfig'));
}

/**
 * Sets up listeners so the user can jump to related files.
 *
 * Clients must call `dispose()` once they're done with an instance.
 */

var JumpToRelatedFile = (function () {
  function JumpToRelatedFile() {
    var _this = this;

    _classCallCheck(this, JumpToRelatedFile);

    this._subscription = atom.commands.add('atom-workspace', {
      'nuclide-related-files:jump-to-next-related-file': function nuclideRelatedFilesJumpToNextRelatedFile() {
        var editor = atom.workspace.getActiveTextEditor();
        if (editor == null) {
          return;
        }
        var path = editor.getPath();
        if (path) {
          (0, (_nuclideAnalytics || _load_nuclideAnalytics()).trackOperationTiming)('nuclide-related-files:jump-to-next-related-file', _asyncToGenerator(function* () {
            return _this._open((yield _this.getNextRelatedFile(path)));
          }));
        }
      },
      'nuclide-related-files:jump-to-previous-related-file': function nuclideRelatedFilesJumpToPreviousRelatedFile() {
        var editor = atom.workspace.getActiveTextEditor();
        if (editor == null) {
          return;
        }
        var path = editor.getPath();
        if (path) {
          (0, (_nuclideAnalytics || _load_nuclideAnalytics()).trackOperationTiming)('nuclide-related-files:jump-to-previous-related-file', _asyncToGenerator(function* () {
            return _this._open((yield _this.getPreviousRelatedFile(path)));
          }));
        }
      }
    });
  }

  _createClass(JumpToRelatedFile, [{
    key: 'dispose',
    value: function dispose() {
      this._subscription.dispose();
    }

    /**
     * Gets the next related file, which Xcode defines as the one that comes
     * before the current one alphabetically.
     */
  }, {
    key: 'getNextRelatedFile',
    value: _asyncToGenerator(function* (path) {
      var _ref = yield (_RelatedFileFinder || _load_RelatedFileFinder()).default.find(path, this._getFileTypeWhitelist());

      var relatedFiles = _ref.relatedFiles;
      var index = _ref.index;

      if (index === -1) {
        return path;
      }
      return relatedFiles[(relatedFiles.length + index - 1) % relatedFiles.length];
    })

    /**
     * Gets the previous related file, which Xcode defines as the one that comes
     * after the current one alphabetically.
     */
  }, {
    key: 'getPreviousRelatedFile',
    value: _asyncToGenerator(function* (path) {
      var _ref2 = yield (_RelatedFileFinder || _load_RelatedFileFinder()).default.find(path, this._getFileTypeWhitelist());

      var relatedFiles = _ref2.relatedFiles;
      var index = _ref2.index;

      if (index === -1) {
        return path;
      }
      return relatedFiles[(index + 1) % relatedFiles.length];
    })
  }, {
    key: '_getFileTypeWhitelist',
    value: function _getFileTypeWhitelist() {
      var fileTypeWhitelist = (_commonsAtomFeatureConfig || _load_commonsAtomFeatureConfig()).default.get('nuclide-related-files.fileTypeWhitelist');
      return new Set(fileTypeWhitelist);
    }
  }, {
    key: '_open',
    value: function _open(path) {
      if ((_commonsAtomFeatureConfig || _load_commonsAtomFeatureConfig()).default.get('nuclide-related-files.openInNextPane')) {
        atom.workspace.activateNextPane();
      }
      atom.workspace.open(path, { searchAllPanes: true });
    }
  }]);

  return JumpToRelatedFile;
})();

exports.default = JumpToRelatedFile;
module.exports = exports.default;