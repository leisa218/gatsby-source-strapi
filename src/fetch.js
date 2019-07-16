'use strict';
var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

// ---original

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
    var apiURL = _ref2.apiURL,
        contentType = _ref2.contentType,
        jwtToken = _ref2.jwtToken,
        availableLngs = _ref2.availableLngs,
        queryLimit = _ref2.queryLimit;
    var apiEndpoint, fetchRequestConfig, documents;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.time('Fetch Strapi data');
            console.log('Starting to fetch data from Strapi (' + (0, _pluralize2.default)(contentType) + ')');

            // Define API endpoint.
            apiEndpoint = apiURL + '/' + (0, _pluralize2.default)(contentType) + '?_limit=' + queryLimit;

            // Set authorization token

            fetchRequestConfig = {};

            if (jwtToken !== null) {
              fetchRequestConfig.headers = {
                Authorization: 'Bearer ' + jwtToken
              };
            }

            // Make API request.
            _context.next = 7;
            return (0, _axios2.default)(apiEndpoint, fetchRequestConfig);

          case 7:
            documents = _context.sent;


            // Query all documents from client.
            console.timeEnd('Fetch Strapi data');

            // Map and clean data.
            return _context.abrupt('return', documents.data.map(function (item) {
              var cleanItem = clean(item);

              if (availableLngs.length) {
                cleanItem.locales = availableLngs.map(function (lng) {
                  return {
                    lng: lng
                  };
                });

                return localize(cleanItem);
              }
              return clean(item);
            }));

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Remove fields starting with `_` symbol.
 *
 * @param {object} item - Entry needing clean
 * @returns {object} output - Object cleaned
 */
var clean = function clean(item) {
  (0, _lodash.forEach)(item, function (value, key) {
    if ((0, _lodash.startsWith)(key, '__')) {
      delete item[key];
    } else if ((0, _lodash.startsWith)(key, '_')) {
      delete item[key];
      item[key.slice(1)] = value;
    } else if ((0, _lodash.isObject)(value)) {
      item[key] = clean(value);
    }
    if (key === 'data') {
      item.data = (0, _stringify2.default)(value);
    }
  });

  return item;
};

var localize = function localize(item) {
  (0, _lodash.forEach)(item, function (value, key) {
    var fieldSplit = key.split('__');
    var fieldName = fieldSplit[0];
    var fieldLocale = fieldSplit[1];

    if (item.locales && item.locales.length && fieldLocale) {
      item.locales = item.locales.map(function (locale) {
        if (fieldLocale === locale.lng) {
          return (0, _extends4.default)({}, locale, (0, _defineProperty3.default)({}, fieldName, value));
        }

        return locale;
      });

      delete item[key];
    }
  });
  return item;
};