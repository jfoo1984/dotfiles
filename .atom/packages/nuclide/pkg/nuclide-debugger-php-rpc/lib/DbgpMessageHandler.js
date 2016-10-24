Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.getDbgpMessageHandlerInstance = getDbgpMessageHandlerInstance;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _utils;

function _load_utils() {
  return _utils = _interopRequireDefault(require('./utils'));
}

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _commonsNodeSingleton;

function _load_commonsNodeSingleton() {
  return _commonsNodeSingleton = _interopRequireDefault(require('../../commons-node/singleton'));
}

var _xml2js;

function _load_xml2js() {
  return _xml2js = _interopRequireDefault(require('xml2js'));
}

var GLOBAL_HHVM_DEBUGGER_KEY = '_global_hhvm_debugger_key';

var DbgpMessageHandler = (function () {
  function DbgpMessageHandler() {
    _classCallCheck(this, DbgpMessageHandler);
  }

  /**
   * A single dbgp message is of the format below:
   * Completed message:   length <NULL> xml-blob <NULL>
   * Incompleted message: length <NULL> xml-blob-part1
   * Once an incompleted message is received the next server message
   * will be in following format:
   * xml-blob-part2
   *
   * A single response from the server may contain
   * multiple DbgpMessages.
   *
   * Throws if the message is malformatted.
   */

  _createClass(DbgpMessageHandler, [{
    key: 'parseMessages',
    value: function parseMessages(data) {
      var components = data.split('\x00');
      /**
       * components.length can be 1, 2 or more than 3:
       * 1: The whole data block is part of a full message(xml-partX).
       * 2: length<NULL>xml-part1.
       * >=3: Other scenarios.
       */
      (_utils || _load_utils()).default.log('Total components: ' + components.length);

      // Merge head component with prevIncompletedMessage if needed.
      var results = [];
      var prevIncompletedMessage = this._prevIncompletedMessage;
      if (prevIncompletedMessage) {
        var firstMessageContent = components.shift();
        prevIncompletedMessage.content += firstMessageContent;

        if (this._isCompletedMessage(prevIncompletedMessage)) {
          results.push(this._parseXml(prevIncompletedMessage));
          prevIncompletedMessage = null;
        }
      }

      // Verify that we can't get another message without completing previous one.
      if (prevIncompletedMessage && components.length !== 0) {
        (_utils || _load_utils()).default.logErrorAndThrow('Error: got extra messages without completing previous message. ' + ('Previous message was: ' + JSON.stringify(prevIncompletedMessage) + '. ') + ('Remaining components: ' + JSON.stringify(components)));
      }

      var isIncompleteResponse = components.length % 2 === 0;

      // Verify empty tail component for completed response.
      if (!isIncompleteResponse) {
        var lastComponent = components.pop();
        if (lastComponent.length !== 0) {
          (_utils || _load_utils()).default.logErrorAndThrow('The complete response should terminate with' + (' zero character while got: ' + lastComponent + ' '));
        }
      }

      // Process two tail components into prevIncompletedMessage for incompleted response.
      if (isIncompleteResponse && components.length > 0) {
        (0, (_assert || _load_assert()).default)(components.length >= 2);
        // content comes after length.
        var _content = components.pop();
        var _length = Number(components.pop());
        var lastMessage = { length: _length, content: _content };
        if (!this._isIncompletedMessage(lastMessage)) {
          (_utils || _load_utils()).default.logErrorAndThrow('The last message should be a fragment of a full message: ' + JSON.stringify(lastMessage));
        }
        prevIncompletedMessage = lastMessage;
      }

      // The remaining middle components should all be completed messages.
      (0, (_assert || _load_assert()).default)(components.length % 2 === 0);
      while (components.length >= 2) {
        var message = {
          length: Number(components.shift()),
          content: components.shift()
        };
        if (!this._isCompletedMessage(message)) {
          (_utils || _load_utils()).default.logErrorAndThrow('Got message length(' + message.content.length + ') ' + ('not equal to expected(' + message.length + '). ') + ('Message was: ' + JSON.stringify(message)));
        }
        results.push(this._parseXml(message));
      }
      this._prevIncompletedMessage = prevIncompletedMessage;
      return results;
    }
  }, {
    key: '_isCompletedMessage',
    value: function _isCompletedMessage(message) {
      return message.length === message.content.length;
    }
  }, {
    key: '_isIncompletedMessage',
    value: function _isIncompletedMessage(message) {
      return message.length > message.content.length;
    }

    /**
     * Convert xml to JS. Uses the xml2js package.
     * xml2js has a rather ... unique ... callback based API for a
     * synchronous operation. This functions purpose is to give a reasonable API.
     *
     * Format of the result:
     * Children become fields.
     * Multiple children of the same name become arrays.
     * Attributes become children of the '$' member
     * Body becomes either a string (if no attributes or children)
     * or the '_' member.
     * CDATA becomes an array containing a string, or just a string.
     *
     * Throws if the input is not valid xml.
     */
  }, {
    key: '_parseXml',
    value: function _parseXml(message) {
      var xml = message.content;
      var errorValue = undefined;
      var resultValue = undefined;
      (_xml2js || _load_xml2js()).default.parseString(xml, function (error, result) {
        errorValue = error;
        resultValue = result;
      });
      if (errorValue !== null) {
        throw new Error('Error ' + JSON.stringify(errorValue) + ' parsing xml: ' + xml);
      }
      (_utils || _load_utils()).default.log('Translating server message result json: ' + JSON.stringify(resultValue));
      (0, (_assert || _load_assert()).default)(resultValue != null);
      return resultValue;
    }

    // For testing purpose.
  }, {
    key: 'clearIncompletedMessage',
    value: function clearIncompletedMessage() {
      this._prevIncompletedMessage = null;
    }
  }]);

  return DbgpMessageHandler;
})();

exports.DbgpMessageHandler = DbgpMessageHandler;

function getDbgpMessageHandlerInstance() {
  return (_commonsNodeSingleton || _load_commonsNodeSingleton()).default.get(GLOBAL_HHVM_DEBUGGER_KEY, function () {
    return new DbgpMessageHandler();
  });
}