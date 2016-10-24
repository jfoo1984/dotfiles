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

exports.convertDefinitions = convertDefinitions;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _HackHelpers;

function _load_HackHelpers() {
  return _HackHelpers = require('./HackHelpers');
}

var _simpleTextBuffer;

function _load_simpleTextBuffer() {
  return _simpleTextBuffer = require('simple-text-buffer');
}

function convertDefinitions(hackDefinitions, filePath, projectRoot) {
  function convertDefinition(definition) {
    (0, (_assert || _load_assert()).default)(definition.definition_pos != null);
    return {
      path: definition.definition_pos.filename || filePath,
      position: new (_simpleTextBuffer || _load_simpleTextBuffer()).Point(definition.definition_pos.line - 1, definition.definition_pos.char_start - 1),
      // TODO: range, definition_id
      id: definition.name,
      name: definition.name,
      language: 'php',
      projectRoot: projectRoot
    };
  }

  var filteredDefinitions = hackDefinitions.filter(function (definition) {
    return definition.definition_pos != null;
  });
  if (filteredDefinitions.length === 0) {
    return null;
  }

  var definitions = filteredDefinitions.map(convertDefinition);

  return {
    queryRange: [(0, (_HackHelpers || _load_HackHelpers()).hackRangeToAtomRange)(filteredDefinitions[0].pos)],
    definitions: definitions
  };
}