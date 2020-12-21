'use strict'

var _ = require('lodash');
var Base58 = require('../encoding/base58');
var BN = require('../crypto/bn');
var BufferUtil = require('../util/buffer');

var DCT_ID = function(arg, bw) {
  if (!(this instanceof DCT_ID)) {
    return new DCT_ID(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return DCT_ID.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return DCT_ID.toBuffer(arg, bw);
  }
};

DCT_ID.fromBuffer = function(br) {
  var coin = br.readUInt32LE();
  switch (coin) {
    case 1: {
      return 'DFI';
    }
    case 2: {
      return 'BTC';
    }
    case 3: {
      return 'ETH';
    }
    default:
      return coin;
  }
};

DCT_ID.toBuffer = function(data, bw) {
  switch (data) {
    case 'DFI': {
      bw.writeUInt32LE(1);
      break;
    }
    case 'BTC': {
      bw.writeUInt32LE(2);
      break;
    }
    case 'ETH': {
      bw.writeUInt32LE(3);
      break;
    }
  }
  return bw;
};

var CScript = function CScript(arg, bw) {
  if (!(this instanceof CScript)) {
    return new CScript(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return CScript.fromBuffer(arg);
  }
  if (_.isArray(arg)) {
    return CScript.toBuffer(arg, bw);
  }
};

CScript.fromBuffer = function(br) {
  var count = br.readVarintNum();
  return Base58.encode(br.read(count));
};

CScript.toBuffer = function(data, bw) {
  var count = data.length;
  bw.writeVarintNum(count);
  bw.write(data);
  return bw;
};

var CBalances = function(arg, bw) {
  if (!(this instanceof CBalances)) {
    return new CBalances(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return CBalances.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return CBalances.toBuffer(arg, bw);
  }
};

CBalances.fromBuffer = function(br) {
  var res = [];
  var count = br.readVarintNum();
  for (var i = 0; i < count; i++) {
    var coin = DCT_ID.fromBuffer(br);
   res.push(`${br.readUInt64LEBN().toNumber() / 100000000}@${coin}`);
  }
  return res;
};

CBalances.toBuffer = function(data, bw) {
  var size = data.length;
  bw.writeVarintNum(size);
  for (var i = 0; i < size; i++) {
    var [amount, coin] = data[i].split('@');
    bw = DCT_ID.toBuffer(bw, coin);
    bw.writeUInt64LEBN(amount * 100000000);
  }
  return bw;
};

module.exports.CScript = CScript;
module.exports.CBalances = CBalances;
