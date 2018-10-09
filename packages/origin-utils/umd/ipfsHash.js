(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('buffer')) :
	typeof define === 'function' && define.amd ? define(['exports', 'buffer'], factory) :
	(factory((global.OriginUtils = {}),global.buffer));
}(this, (function (exports,buffer) { 'use strict';

	buffer = buffer && buffer.hasOwnProperty('default') ? buffer['default'] : buffer;

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var safeBuffer = createCommonjsModule(function (module, exports) {
	/* eslint-disable node/no-deprecated-api */

	var Buffer = buffer.Buffer;

	// alternative to using Object.keys for old browsers
	function copyProps (src, dst) {
	  for (var key in src) {
	    dst[key] = src[key];
	  }
	}
	if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
	  module.exports = buffer;
	} else {
	  // Copy properties from require('buffer')
	  copyProps(buffer, exports);
	  exports.Buffer = SafeBuffer;
	}

	function SafeBuffer (arg, encodingOrOffset, length) {
	  return Buffer(arg, encodingOrOffset, length)
	}

	// Copy static methods from Buffer
	copyProps(Buffer, SafeBuffer);

	SafeBuffer.from = function (arg, encodingOrOffset, length) {
	  if (typeof arg === 'number') {
	    throw new TypeError('Argument must not be a number')
	  }
	  return Buffer(arg, encodingOrOffset, length)
	};

	SafeBuffer.alloc = function (size, fill, encoding) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  var buf = Buffer(size);
	  if (fill !== undefined) {
	    if (typeof encoding === 'string') {
	      buf.fill(fill, encoding);
	    } else {
	      buf.fill(fill);
	    }
	  } else {
	    buf.fill(0);
	  }
	  return buf
	};

	SafeBuffer.allocUnsafe = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return Buffer(size)
	};

	SafeBuffer.allocUnsafeSlow = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return buffer.SlowBuffer(size)
	};
	});
	var safeBuffer_1 = safeBuffer.Buffer;

	// base-x encoding
	// Forked from https://github.com/cryptocoinjs/bs58
	// Originally written by Mike Hearn for BitcoinJ
	// Copyright (c) 2011 Google Inc
	// Ported to JavaScript by Stefan Thomas
	// Merged Buffer refactorings from base58-native by Stephen Pair
	// Copyright (c) 2013 BitPay Inc

	var Buffer$1 = safeBuffer.Buffer;

	var baseX = function base (ALPHABET) {
	  var ALPHABET_MAP = {};
	  var BASE = ALPHABET.length;
	  var LEADER = ALPHABET.charAt(0);

	  // pre-compute lookup table
	  for (var z = 0; z < ALPHABET.length; z++) {
	    var x = ALPHABET.charAt(z);

	    if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')
	    ALPHABET_MAP[x] = z;
	  }

	  function encode (source) {
	    if (source.length === 0) return ''

	    var digits = [0];
	    for (var i = 0; i < source.length; ++i) {
	      for (var j = 0, carry = source[i]; j < digits.length; ++j) {
	        carry += digits[j] << 8;
	        digits[j] = carry % BASE;
	        carry = (carry / BASE) | 0;
	      }

	      while (carry > 0) {
	        digits.push(carry % BASE);
	        carry = (carry / BASE) | 0;
	      }
	    }

	    var string = '';

	    // deal with leading zeros
	    for (var k = 0; source[k] === 0 && k < source.length - 1; ++k) string += LEADER;
	    // convert digits to a string
	    for (var q = digits.length - 1; q >= 0; --q) string += ALPHABET[digits[q]];

	    return string
	  }

	  function decodeUnsafe (string) {
	    if (typeof string !== 'string') throw new TypeError('Expected String')
	    if (string.length === 0) return Buffer$1.allocUnsafe(0)

	    var bytes = [0];
	    for (var i = 0; i < string.length; i++) {
	      var value = ALPHABET_MAP[string[i]];
	      if (value === undefined) return

	      for (var j = 0, carry = value; j < bytes.length; ++j) {
	        carry += bytes[j] * BASE;
	        bytes[j] = carry & 0xff;
	        carry >>= 8;
	      }

	      while (carry > 0) {
	        bytes.push(carry & 0xff);
	        carry >>= 8;
	      }
	    }

	    // deal with leading zeros
	    for (var k = 0; string[k] === LEADER && k < string.length - 1; ++k) {
	      bytes.push(0);
	    }

	    return Buffer$1.from(bytes.reverse())
	  }

	  function decode (string) {
	    var buffer$$1 = decodeUnsafe(string);
	    if (buffer$$1) return buffer$$1

	    throw new Error('Non-base' + BASE + ' character')
	  }

	  return {
	    encode: encode,
	    decodeUnsafe: decodeUnsafe,
	    decode: decode
	  }
	};

	var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

	var bs58 = baseX(ALPHABET);

	// export function getBytes32FromIpfsHash(hash) {
	function getBytes32FromIpfsHash(hash) {
	  return `0x${bs58.decode(hash).slice(2).toString('hex')}`;
	} // Return base58 encoded ipfs hash from bytes32 hex string,
	// E.g. "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
	// --> "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL"

	function getIpfsHashFromBytes32(bytes32Hex) {
	  // Add our default ipfs values for first 2 bytes:
	  // function:0x12=sha2, size:0x20=256 bits
	  // and cut off leading "0x"
	  const hashHex = '1220' + bytes32Hex.slice(2);
	  const hashBytes = Buffer.from(hashHex, 'hex');
	  const hashStr = bs58.encode(hashBytes);
	  return hashStr;
	}
	async function post(gateway, json) {
	  var formData = new FormData();
	  formData.append('file', new Blob([JSON.stringify(json)]));
	  var rawRes = await fetch(`${gateway}/api/v0/add`, {
	    method: 'POST',
	    body: formData
	  });
	  var res = await rawRes.json();
	  return getBytes32FromIpfsHash(res.Hash);
	}
	async function postEnc(gateway, json, pubKeys) {
	  var formData = new FormData();
	  var publicKeys = pubKeys.reduce((acc, val) => acc.concat(openpgp.key.readArmored(val).keys), []);
	  var encrypted = await openpgp.encrypt({
	    data: JSON.stringify(json),
	    publicKeys
	  });
	  formData.append('file', new Blob([encrypted.data]));
	  var rawRes = await fetch(`${gateway}/api/v0/add`, {
	    method: 'POST',
	    body: formData
	  });
	  var res = await rawRes.json();
	  return getBytes32FromIpfsHash(res.Hash);
	}
	async function decode(text, key, pass) {
	  const privKeyObj = openpgp.key.readArmored(key).keys[0];
	  await privKeyObj.decrypt(pass);
	  const decrypted = await openpgp.decrypt({
	    message: openpgp.message.readArmored(text),
	    privateKeys: [privKeyObj]
	  });
	  return decrypted.data;
	}
	async function getText(gateway, hashAsBytes) {
	  var hash = getIpfsHashFromBytes32(hashAsBytes);
	  const response = await new Promise(resolve => {
	    let didTimeOut = false;
	    const timeout = setTimeout(() => {
	      didTimeOut = true;
	      resolve();
	    }, 10000);
	    fetch(`${gateway}/ipfs/${hash}`).then(response => {
	      clearTimeout(timeout);

	      if (!didTimeOut) {
	        resolve(response);
	      }
	    }).catch(() => {
	      clearTimeout(timeout);

	      if (!didTimeOut) {
	        resolve(null);
	      }
	    });
	  });

	  if (!response) {
	    return '{}';
	  }

	  return await response.text();
	}
	async function get(gateway, hashAsBytes, party) {
	  let text = await getText(gateway, hashAsBytes);

	  if (text.indexOf('-----BEGIN PGP MESSAGE-----') === 0 && party) {
	    try {
	      text = await decode(text, party.privateKey, party.pgpPass);
	    } catch (e) {
	      return {
	        encrypted: true,
	        decryptError: e
	      };
	    }
	  }

	  return JSON.parse(text);
	}

	exports.getBytes32FromIpfsHash = getBytes32FromIpfsHash;
	exports.getIpfsHashFromBytes32 = getIpfsHashFromBytes32;
	exports.post = post;
	exports.postEnc = postEnc;
	exports.decode = decode;
	exports.getText = getText;
	exports.get = get;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
