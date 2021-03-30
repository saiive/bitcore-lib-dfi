'use strict'

var _ = require('lodash');
var BN = require('../crypto/bn');
var BufferWriter = require('../encoding/bufferwriter');
var $ = require('../util/preconditions');
let BufferUtil = require('../util/buffer');
var CBalances = require('./deserialiizeTypes').CBalances;
var CScript = require('./deserialiizeTypes').CScript;
var CAccounts = require('./deserialiizeTypes').CAccounts;

var customTxType = {
  createMasternode: 'C',
  resignMasternode: 'R',
  createToken: 'T',
  mintToken: 'M',
  updateToken: 'N',
  updateTokenAny: 'n',
  createPoolPair: 'p',
  updatePoolPair: 'u',
  poolSwap: 's',
  addPoolLiquidity: 'l',
  removePoolLiquidity: 'r',
  utxosToAccount: 'U',
  accountToUtxos: 'b',
  accountToAccount: 'B',
  setGovVariable: 'G',
  anyAccountsToAccounts: 'a',
};

var CUSTOM_SIGNATURE = 'DfTx';

var INT64_MAX = 9223372036854775807;

var CreateMasternode = functionCreateMasternode(arg) {
  if (!(this instanceof CreateMasternode)) {
    return new CreateMasternode(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return CreateMasternode.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return CreateMasternode.toBuffer(arg);
  }
};

CreateMasternode.fromBuffer = function(buffer) {
  var data = {};
  data.operatorType = buffer.readUInt8();
  data.operatorAuthAddress = buffer.read(20).toString('hex');
  return data;
};

CreateMasternode.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.createMasternode));
  bw.writeUInt8(data.operatorType);
  bw.write(new Buffer(data.operatorAuthAddress));
  return bw.toBuffer();
};

var ResignMasternode = function(arg) {
  if (!(this instanceof ResignMasternode)) {
    return new ResignMasternode(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return ResignMasternode.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return ResignMasternode.toBuffer(arg);
  }
};

ResignMasternode.fromBuffer = function(br) {
  var data = {};
  data.nodeId = br.read(32).toString('hex');
  return data;
};

ResignMasternode.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.resignMasternode));
  bw.write(new Buffer(data.nodeId));
  return bw.toBuffer();
};

var CreateToken = functionCreateToken(arg) {
  if (!(this instanceof CreateToken)) {
    return new CreateToken(arg);
  }
  if (arg.buf && BufferUtil.isBuffer(arg.buf)) {
    return CreateToken.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return CreateToken.toBuffer(arg);
  }
};

CreateToken.fromBuffer = function(br) {
  var data = {};
  var lenSymbol = br.readVarintNum();
  data.symbol = br.read(lenSymbol).toString();
  var lenName = br.readVarintNum();
  data.name = br.read(lenName).toString();
  data.decimal = br.readUInt8();
  data.limit = br.readUInt64LEBN().toNumber();
  data.flags = br.readUInt8();
  return data;
};

CreateToken.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.createToken));
  bw.writeVarintNum(data.symbol.length);
  bw.write(new Buffer(data.symbol));
  bw.writeVarintNum(data.name.length);
  bw.write(new Buffer(data.name));
  bw.writeUInt8(BN.fromNumber(data.decimal));
  bw.writeUInt64LEBN(BN.fromNumber(data.limit));
  bw.writeUInt8(data.flags);
  return bw.toBuffer();
};

var MintToken = functionMintToken(arg) {
  if (!(this instanceof MintToken)) {
    return new MintToken(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return MintToken.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return MintToken.toBuffer(arg);
  }
};

MintToken.fromBuffer = function(br) {
  var data = {};
  data.minted = new CBalances(br);
  return data;
};

MintToken.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.mintToken));
  bw = new CBalances(data.minted, bw);
  return bw.toBuffer();
};

var UpdateToken = functionUpdateToken(arg) {
  if (!(this instanceof UpdateToken)) {
    return new UpdateToken(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return UpdateToken.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return UpdateToken.toBuffer(arg);
  }
};

UpdateToken.fromBuffer = function(br) {
  var data = {};
  data.tokenTx = br.read(32).toString('hex');
  data.isDAT = br.readUInt8();
  return data;
};

UpdateToken.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.updateToken));
  bw.write(new Buffer(data.tokenTx));
  bw.writeUInt8(data.isDAT);
  return bw.toBuffer();
};

var UpdateTokenAny = functionUpdateTokenAny(arg) {
  if (!(this instanceof UpdateTokenAny)) {
    return new UpdateTokenAny(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return UpdateTokenAny.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return UpdateTokenAny.toBuffer(arg);
  }
};

UpdateTokenAny.fromBuffer = function(br) {
  var data = {};
  data.tokenTx = br.read(32).toString('hex');
  var len = br.readUInt8();
  var symbol = br.read(len).toString();
  len = br.readUInt8();
  var name = br.read(len).toString();
  data.newToken = {
    symbol: symbol,
    name: name,
    decimal: br.readUInt8(),
    limit: br.readUInt64LEBN().toNumber(),
    flags: br.readUInt8(),
  };
  return data;
};

UpdateTokenAny.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.updateTokenAny));
  bw.write(new Buffer(data.tokenTx));
  bw.writeVarintNum(data.symbol.length);
  bw.write(new Buffer(data.symbol));
  bw.writeVarintNum(data.name.length);
  bw.write(new Buffer(data.name));
  bw.writeUInt8(data.decimal);
  bw.writeUInt64LEBN(BN.fromNumber(data.limit));
  bw.writeUInt8(data.mintable);
  bw.writeUInt8(data.tradeable);
  bw.writeUInt8(data.isDAT);
  return bw.toBuffer();
};

var CreatePoolPair = functionCreatePoolPair(arg) {
  if (!(this instanceof CreatePoolPair)) {
    return new CreatePoolPair(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return CreatePoolPair.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return CreatePoolPair.toBuffer(arg);
  }
};

CreatePoolPair.fromBuffer = function(br) {
  var data = {};
  data.idTokenA = br.readVarintNum();
  data.idTokenB = br.readVarintNum();
  data.commission = br.readUInt64LEBN().toNumber() / 100000000;
  data.ownerAddress = CScript.fromBuffer(br);
  data.status = br.readUInt8();
  return data;
};

CreatePoolPair.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.createPoolPair));
  bw.writeVarintNum(data.idTokenA);
  bw.writeVarintNum(data.idTokenB);
  bw.writeUInt64LEBN(data.commission * 100000000);
  bw = CScript.toBuffer(data.ownerAddress, bw);
  bw.writeUInt8(data.status);
  return bw.toBuffer();
};

var UpdatePoolPair = functionUpdatePoolPair(arg) {
  if (!(this instanceof UpdatePoolPair)) {
    return new UpdatePoolPair(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return UpdatePoolPair.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return UpdatePoolPair.toBuffer(arg);
  }
};

UpdatePoolPair.fromBuffer = function(br) {
  var data = {};
  data.pollId = br.readUInt32LE().toString();
  data.status = br.readUInt8();
  data.commission = br.readUInt64LEBN().toNumber() / 100000000;
  data.ownerAddress = CScript.fromBuffer(br);
  return data;
};

UpdatePoolPair.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.updatePoolPair));
  bw.writeUInt32LE(data.pollId);
  bw.writeUInt8(data.status);
  bw.writeUInt64LEBN(BN.fromNumber(data.commission * 100000000));
  bw = CScript.toBuffer(data.ownerAddress, bw);
  return bw.toBuffer();
};

var PoolSwap = functionPoolSwap(arg) {
  if (!(this instanceof PoolSwap)) {
    return new PoolSwap(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return PoolSwap.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return PoolSwap.toBuffer(arg);
  }
};

PoolSwap.fromBuffer = function(br) {
  var data = {};
  data.from = CScript.fromBuffer(br);
  data.idTokenFrom = br.readVarintNum();
  data.amountFrom = br.readUInt64LEBN().toNumber() / 100000000;
  data.to = CScript.fromBuffer(br);
  data.idTokenTo = br.readVarintNum();
  data.maxPrice = {
    integer: br.readUInt64LEBN().toNumber() / 100000000,
    fraction: br.readUInt64LEBN().toNumber() / 100000000,
  };
  return data;
};

PoolSwap.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.poolSwap));
  bw = CScript.toBuffer(data.from, bw);
  bw.writeVarintNum(Number(data.idTokenFrom));
  bw.writeUInt64LEBN(BN.fromNumber(data.amountFrom * 100000000));
  bw = CScript.toBuffer(data.to, bw);
  bw.writeVarintNum(Number(data.idTokenTo));
  if (data.maxPrice) {
    bw.writeUInt64LEBN(BN.fromNumber(data.maxPrice / 100000000));
    bw.writeUInt64LEBN(BN.fromNumber(data.maxPrice % 100000000));
  } else {
    bw.writeUInt64LEBN(new BN(String(INT64_MAX)));
    bw.writeUInt64LEBN(new BN(String(INT64_MAX)));
  }
  return bw.toBuffer();
};

var AddPoolLiquidity = functionAddPoolLiquidity(arg) {
  if (!(this instanceof AddPoolLiquidity)) {
    return new AddPoolLiquidity(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return AddPoolLiquidity.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return AddPoolLiquidity.toBuffer(arg);
  }
};

AddPoolLiquidity.fromBuffer = function(br) {
  var data = {};
  var from = {};
  var count = br.readVarintNum();
  for (var i = 0; i < count; i++) {
    from[CScript.fromBuffer(br)] = new CBalances(br);
  }
  data.from = from;
  data.shareAddress = CScript.fromBuffer(br);
  return data;
};

AddPoolLiquidity.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.addPoolLiquidity));
  var size = Object.keys(data.from).length;
  bw.writeVarintNum(size);
  for (var entry of Object.entries(data.from)) {
    bw = CScript.toBuffer(entry[0], bw);
    bw = new CBalances(entry[1], bw);
  }
  bw = CScript.toBuffer(data.shareAddress, bw);
  return bw.toBuffer();
};

var RemovePoolLiquidity = functionRemovePoolLiquidity(arg) {
  if (!(this instanceof RemovePoolLiquidity)) {
    return new RemovePoolLiquidity(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return RemovePoolLiquidity.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return RemovePoolLiquidity.toBuffer(arg);
  }
};

RemovePoolLiquidity.fromBuffer = function(br) {
  var data = {};
  data.from = CScript.fromBuffer(br);
  data.nTokenId = br.readVarintNum();
  data.nValue = br.readUInt64LEBN().toNumber() / 100000000;
  return data;
};

RemovePoolLiquidity.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.removePoolLiquidity));
  bw = CScript.toBuffer(data.from, bw);
  bw.writeVarintNum(data.nTokenId);
  bw.writeUInt64LEBN(BN.fromNumber(data.nValue * 100000000));
  return bw.toBuffer();
};

var SetGovVariable = functionSetGovVariable(arg) {
  if (!(this instanceof SetGovVariable)) {
    return new SetGovVariable(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return SetGovVariable.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return SetGovVariable.toBuffer(arg);
  }
};

SetGovVariable.fromBuffer = function(br) {
  var data = {};
  var len = br.readVarintNum();
  data.name = br.read(len).toString();
  return data;
};

SetGovVariable.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.setGovVariable));
  bw.writeVarintNum(data.name.length);
  bw.write(new Buffer(data.name));
  return bw.toBuffer();
};

var UtxosToAccount = functionUtxosToAccount(arg) {
  if (!(this instanceof UtxosToAccount)) {
    return new UtxosToAccount(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return UtxosToAccount.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return UtxosToAccount.toBuffer(arg);
  }
};

UtxosToAccount.fromBuffer = function(br) {
  var to = {};
  var count = br.readVarintNum();
  for (var i = 0; i < count; i++) {
    to[CScript.fromBuffer(br)] = new CBalances(br);
  }
  var data = {};
  data.to = to;
  return data;
};

UtxosToAccount.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.utxosToAccount));
  var keys = Object.keys(data.to);
  bw.writeVarintNum(keys.length);
  for (var [key, value] of Object.entries(data.to)) {
    bw = CScript.toBuffer(key, bw);
    bw = new CBalances(value, bw);
  }
  return bw.toBuffer();
};

var AccountToUtxos = functionAccountToUtxos(arg) {
  if (!(this instanceof AccountToUtxos)) {
    return new AccountToUtxos(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return AccountToUtxos.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return AccountToUtxos.toBuffer(arg);
  }
};

AccountToUtxos.fromBuffer = function(br) {
  var data = {};
  data.from = CScript.fromBuffer(br);
  data.balances = new CBalances(br);
  data.mintingOutputsStart = br.readVarintNum();
  return data;
};

AccountToUtxos.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.accountToUtxos));
  bw = new CScript(data.from, bw);
  bw = new CBalances(data.balances, bw);
  bw.writeVarintNum(data.mintingOutputsStart);
  return bw.toBuffer();
};

var AccountToAccount = functionAccountToAccount(arg) {
  if (!(this instanceof AccountToAccount)) {
    return new AccountToAccount(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return AccountToAccount.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return AccountToAccount.toBuffer(arg);
  }
};

AccountToAccount.fromBuffer = function(br) {
  var data = {};
  data.from = CScript.fromBuffer(br);
  var to = {};
  var count = br.readVarintNum();
  for (var i = 0; i < count; i++) {
    to[CScript.fromBuffer(br)] = new CBalances(br);
  }
  data.to = to;
  return data;
};

AccountToAccount.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.accountToAccount));
  bw = CScript.toBuffer(data.from, bw);
  var keys = Object.keys(data.to);
  bw.writeVarintNum(keys.length);
  for (var [key, value] of Object.entries(data.to)) {
    bw = CScript.toBuffer(key, bw);
    bw = new CBalances(value, bw);
  }
  return bw.toBuffer();
};

var AnyAccountsToAccounts = functionAnyAccountsToAccounts(arg) {
  if (!(this instanceof AnyAccountsToAccounts)) {
    return new AnyAccountsToAccounts(arg);
  }
  if (BufferUtil.isBuffer(arg.buf)) {
    return AnyAccountsToAccounts.fromBuffer(arg);
  }
  if (_.isObject(arg)) {
    return AnyAccountsToAccounts.toBuffer(arg);
  }
};

AnyAccountsToAccounts.fromBuffer = function(br) {
  var data = {};
  data.from = new CAccounts(br, null);
  data.to = new CAccounts(br, null);
  return data;
};

AnyAccountsToAccounts.toBuffer = function(data) {
  $.checkArgument(data, 'data is required');
  var bw = new BufferWriter();
  bw.write(new Buffer(CUSTOM_SIGNATURE));
  bw.write(new Buffer(customTxType.anyAccountsToAccounts));
  bw = new CAccounts(data.from, bw);
  bw = new CAccounts(data.to, bw);
  return bw.toBuffer();
};

module.exports = {
  customTxType: customTxType,
  CreateMasternode: CreateMasternode,
  ResignMasternode: ResignMasternode,
  CreateToken: CreateToken,
  MintToken: MintToken,
  UpdateToken: UpdateToken,
  UpdateTokenAny: UpdateTokenAny,
  CreatePoolPair: CreatePoolPair,
  UpdatePoolPair: UpdatePoolPair,
  PoolSwap: PoolSwap,
  AddPoolLiquidity: AddPoolLiquidity,
  RemovePoolLiquidity: RemovePoolLiquidity,
  UtxosToAccount: UtxosToAccount,
  AccountToUtxos: AccountToUtxos,
  AccountToAccount: AccountToAccount,
  SetGovVariable: SetGovVariable,
  AnyAccountsToAccounts: AnyAccountsToAccounts,
};





