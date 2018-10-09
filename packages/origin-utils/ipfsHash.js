"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBytes32FromIpfsHash = getBytes32FromIpfsHash;
exports.getIpfsHashFromBytes32 = getIpfsHashFromBytes32;
exports.post = post;
exports.postEnc = postEnc;
exports.decode = decode;
exports.getText = getText;
exports.get = get;

var _bs = _interopRequireDefault(require("bs58"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function getBytes32FromIpfsHash(hash) {
  return "0x".concat(_bs.default.decode(hash).slice(2).toString('hex'));
} // Return base58 encoded ipfs hash from bytes32 hex string,
// E.g. "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
// --> "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL"


function getIpfsHashFromBytes32(bytes32Hex) {
  // Add our default ipfs values for first 2 bytes:
  // function:0x12=sha2, size:0x20=256 bits
  // and cut off leading "0x"
  var hashHex = '1220' + bytes32Hex.slice(2);
  var hashBytes = Buffer.from(hashHex, 'hex');

  var hashStr = _bs.default.encode(hashBytes);

  return hashStr;
}

function post(_x, _x2) {
  return _post.apply(this, arguments);
}

function _post() {
  _post = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(gateway, json) {
    var formData, rawRes, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            formData = new FormData();
            formData.append('file', new Blob([JSON.stringify(json)]));
            _context.next = 4;
            return fetch("".concat(gateway, "/api/v0/add"), {
              method: 'POST',
              body: formData
            });

          case 4:
            rawRes = _context.sent;
            _context.next = 7;
            return rawRes.json();

          case 7:
            res = _context.sent;
            return _context.abrupt("return", getBytes32FromIpfsHash(res.Hash));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _post.apply(this, arguments);
}

function postEnc(_x3, _x4, _x5) {
  return _postEnc.apply(this, arguments);
}

function _postEnc() {
  _postEnc = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(gateway, json, pubKeys) {
    var formData, publicKeys, encrypted, rawRes, res;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            formData = new FormData();
            publicKeys = pubKeys.reduce(function (acc, val) {
              return acc.concat(openpgp.key.readArmored(val).keys);
            }, []);
            _context2.next = 4;
            return openpgp.encrypt({
              data: JSON.stringify(json),
              publicKeys: publicKeys
            });

          case 4:
            encrypted = _context2.sent;
            formData.append('file', new Blob([encrypted.data]));
            _context2.next = 8;
            return fetch("".concat(gateway, "/api/v0/add"), {
              method: 'POST',
              body: formData
            });

          case 8:
            rawRes = _context2.sent;
            _context2.next = 11;
            return rawRes.json();

          case 11:
            res = _context2.sent;
            return _context2.abrupt("return", getBytes32FromIpfsHash(res.Hash));

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _postEnc.apply(this, arguments);
}

function decode(_x6, _x7, _x8) {
  return _decode.apply(this, arguments);
}

function _decode() {
  _decode = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(text, key, pass) {
    var privKeyObj, decrypted;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            privKeyObj = openpgp.key.readArmored(key).keys[0];
            _context3.next = 3;
            return privKeyObj.decrypt(pass);

          case 3:
            _context3.next = 5;
            return openpgp.decrypt({
              message: openpgp.message.readArmored(text),
              privateKeys: [privKeyObj]
            });

          case 5:
            decrypted = _context3.sent;
            return _context3.abrupt("return", decrypted.data);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _decode.apply(this, arguments);
}

function getText(_x9, _x10) {
  return _getText.apply(this, arguments);
}

function _getText() {
  _getText = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(gateway, hashAsBytes) {
    var hash, response;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            hash = getIpfsHashFromBytes32(hashAsBytes);
            _context4.next = 3;
            return new Promise(function (resolve) {
              var didTimeOut = false;
              var timeout = setTimeout(function () {
                didTimeOut = true;
                resolve();
              }, 10000);
              fetch("".concat(gateway, "/ipfs/").concat(hash)).then(function (response) {
                clearTimeout(timeout);

                if (!didTimeOut) {
                  resolve(response);
                }
              }).catch(function () {
                clearTimeout(timeout);

                if (!didTimeOut) {
                  resolve(null);
                }
              });
            });

          case 3:
            response = _context4.sent;

            if (response) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return", '{}');

          case 6:
            _context4.next = 8;
            return response.text();

          case 8:
            return _context4.abrupt("return", _context4.sent);

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _getText.apply(this, arguments);
}

function get(_x11, _x12, _x13) {
  return _get.apply(this, arguments);
}

function _get() {
  _get = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(gateway, hashAsBytes, party) {
    var text;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return getText(gateway, hashAsBytes);

          case 2:
            text = _context5.sent;

            if (!(text.indexOf('-----BEGIN PGP MESSAGE-----') === 0 && party)) {
              _context5.next = 13;
              break;
            }

            _context5.prev = 4;
            _context5.next = 7;
            return decode(text, party.privateKey, party.pgpPass);

          case 7:
            text = _context5.sent;
            _context5.next = 13;
            break;

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](4);
            return _context5.abrupt("return", {
              encrypted: true,
              decryptError: _context5.t0
            });

          case 13:
            return _context5.abrupt("return", JSON.parse(text));

          case 14:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this, [[4, 10]]);
  }));
  return _get.apply(this, arguments);
}