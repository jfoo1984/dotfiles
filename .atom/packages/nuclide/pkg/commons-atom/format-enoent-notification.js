Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = formatEnoentNotification;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _featureConfig;

function _load_featureConfig() {
  return _featureConfig = _interopRequireDefault(require('./featureConfig'));
}

var _commonsNodeString;

function _load_commonsNodeString() {
  return _commonsNodeString = require('../commons-node/string');
}

var capitalize = function capitalize(str) {
  return str[0].toUpperCase() + str.substr(1);
};

function formatEnoentNotification(options) {
  var feature = options.feature;
  var toolName = options.toolName;
  var pathSetting = options.pathSetting;

  var schema = (_featureConfig || _load_featureConfig()).default.getSchema(pathSetting);
  var settingTitle = schema.title;
  var categoryTitle = capitalize(pathSetting.split('.').shift());
  var command = (_featureConfig || _load_featureConfig()).default.get(pathSetting);
  var capitalizedFeature = capitalize(feature);
  var description = capitalizedFeature + ' needs *' + toolName + '* but Nuclide couldn\'t find it at `' + command + '`.\n\n**Troubleshooting Tips**\n1. Make sure that *' + toolName + '* is installed. Some Nuclide features require tools that aren\'t\n   bundled with Nuclide. You may need to install this tool yourself.\n2. Make sure that *' + toolName + '* can be run using the command `' + command + '`.\n3. Atom doesn\'t know about PATH modifications made in your shell config (".bash_profile", ".zshrc",\n   etc.). If *' + toolName + '* is installed and you can run it successfully from your terminal using the\n   command `' + command + '`, Nuclide may just not be looking in the right place. Update the command by\n   changing the **' + (0, (_commonsNodeString || _load_commonsNodeString()).maybeToString)(settingTitle) + '** setting (under **' + categoryTitle + '**) on the\n   Nuclide settings page.';

  return {
    message: 'Nuclide couldn\'t find *' + toolName + '*!',
    meta: {
      dismissable: true,
      description: description
    }
  };
}

module.exports = exports.default;