'use strict'

var _ = require('lodash');
var Base58 = require('../encoding/base58');
var BN = require('../crypto/bn');
var BufferUtil = require('../util/buffer');
var Script = require('../script/script')
var Address = require('../address');
var BufferWriter = require('../encoding/bufferwriter');

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

CScript.fromBuffer = function(br, network) {
  var count = br.readVarintNum();
  return new Script(br.read(count)).toAddress(network).toString();
};

CScript.toBuffer = function(data, bw) {
  const a = Script.fromAddress(data).toBuffer();
  bw.writeVarintNum(a.length);
  bw.write(a);
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
  var size = Object.keys(data).length;
  bw.writeVarintNum(size);
  for (var i = 0; i < size; i++) {
    bw.writeUInt32LE(data[i].token);
    bw.writeUInt64LEBN(new BN(data[i].balance * 100000000))
  }
  return bw;
};

var CAccounts = function(arg, bw, network) {
  if (!(this instanceof CAccounts)) {
    return new CAccounts(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return CAccounts.fromBuffer(arg, network);
  }
  if (_.isObject(arg)) {
    return CAccounts.toBuffer(arg, bw);
  }
};

CAccounts.fromBuffer = function(br, network) {
  var res = [];
  var count = br.readVarintNum();
  for (var i = 0; i < count; i++) {
    res.push({[CScript.fromBuffer(br, network)]: new CBalances(br)});
  }
  return res;
};

CAccounts.toBuffer = function(data, bw) {
  var size = data.length;
  bw.writeVarintNum(size);
  for (var i = 0; i < size; i++) {
    bw = CScript.toBuffer(Object.keys(data[i])[0], bw);
    bw = new CBalances(Object.values(data[i])[0], bw);
  }
  return bw;
};



module.exports.CScript = CScript;
module.exports.CBalances = CBalances;
module.exports.CAccounts = CAccounts;
