"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = balancesFromWei;

var _numberFormat = _interopRequireDefault(require("./numberFormat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function balancesFromWei(wei, context) {
  var eth = web3.utils.fromWei(wei, 'ether').substr(0, 7);
  var usd = '$' + (0, _numberFormat.default)(Number(eth) * context.usd, 2);
  return {
    wei: wei,
    eth: eth,
    usd: usd
  };
}