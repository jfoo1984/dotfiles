Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.observePanes = observePanes;

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _commonsNodeEvent;

function _load_commonsNodeEvent() {
  return _commonsNodeEvent = require('../../commons-node/event');
}

var _rxjsBundlesRxMinJs;

function _load_rxjsBundlesRxMinJs() {
  return _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');
}

/**
 * Observe all of the panes in the container. This custom logic is required because of a weird Atom
 * behavior (bug?): `PaneContainer::getPanes()` doesn't include the added pane when called in the
 * `onDidAddPane` event callback. This function works around that issue by maintaining its own list
 * of panes.
 *
 * See https://github.com/atom/atom/issues/12654
 *     https://github.com/atom/atom/pull/12674
 */

function observePanes(paneContainer) {
  return (_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).Observable.defer(function () {
    var panes = new Set(paneContainer.getPanes());
    return (_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).Observable.merge((_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).Observable.of(null), (0, (_commonsNodeEvent || _load_commonsNodeEvent()).observableFromSubscribeFunction)(paneContainer.onDidDestroyPane.bind(paneContainer)).do(function (event) {
      panes = new Set(paneContainer.getPanes());
      panes.delete(event.pane);
    }), (0, (_commonsNodeEvent || _load_commonsNodeEvent()).observableFromSubscribeFunction)(paneContainer.onDidAddPane.bind(paneContainer)).do(function (event) {
      panes = new Set(panes).add(event.pane);
    })).map(function () {
      return panes;
    });
  });
}