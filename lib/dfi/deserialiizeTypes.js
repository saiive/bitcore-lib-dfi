'use strict'

var _ = require('lodash');
var Base58 = require('../encoding/base58');
var BN = require('../crypto/bn');
var BufferUtil = require('../util/buffer');

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
    var token = br.readUInt32LE();
    res.push({ balance: br.readUInt64LEBN().toNumber() / 100000000, token });
  }
  return res;
};

CBalances.toBuffer = function(data, bw) {
  var size = data.length;
  bw.writeVarintNum(size);
  for (var i = 0; i < size; i++) {
    bw.writeUInt32LE(data[i].token);
    bw.writeUInt64LEBN(data[i].balance * 100000000);
  }
  return bw;
};

var CAccounts = function(arg, bw) {
  if (!(this instanceof CAccounts)) {
    return new CAccounts(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return CAccounts.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return CAccounts.toBuffer(arg, bw);
  }
};

CAccounts.fromBuffer = function(br) {
  var res = [];
  var count = br.readVarintNum();
  for (var i = 0; i < count; i++) {
    res.push({[CScript.fromBuffer(br)]: new CBalances(br)});
  }
  return res;
};

CAccounts.toBuffer = function(data, bw) {
  var size = data.length;
  bw.writeVarintNum(size);
  for (var entry of data) {
    bw = new CScript(entry[0], bw);
    bw = new CBalances(entry[1], bw);
  }
  return bw;
};



module.exports.CScript = CScript;
module.exports.CBalances = CBalances;
module.exports.CAccounts = CAccounts;
