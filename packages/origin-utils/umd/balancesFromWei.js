(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.OriginUtils = factory());
}(this, (function () { 'use strict';

  function numberFormat(number, dec, dsep, tsep) {
    if (isNaN(number) || number == null) return '';
    number = number.toFixed(~~dec);
    tsep = typeof tsep == 'string' ? tsep : ',';
    var parts = number.split('.'),
        fnums = parts[0],
        decimals = parts[1] ? (dsep || '.') + parts[1] : '';
    return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
  }

  function balancesFromWei(wei, context) {
    const eth = web3.utils.fromWei(wei, 'ether').substr(0, 7);
    const usd = '$' + numberFormat(Number(eth) * context.usd, 2);
    return {
      wei,
      eth,
      usd
    };
  }

  return balancesFromWei;

})));
