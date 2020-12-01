export namespace Script {
  import Signature = Transaction.Signature;
  function buildPublicKeyHashIn (publicKey: any, signature: Signature | Buffer, sigtype: number): Script;
}

export class Script {
  set(obj: object): this;

  toBuffer(): Buffer;
  toASM(): string;
  toString(): string;
  toHex(): string;

  isPublicKeyHashOut(): boolean;
  isPublicKeyHashIn(): boolean;

  getPublicKey(): Buffer;
  getPublicKeyHash(): Buffer;

  isPublicKeyOut(): boolean;
  isPublicKeyIn(): boolean;

  isScriptHashOut(): boolean;
  isWitnessScriptHashOut(): boolean;
  isWitnessPublicKeyHashOut(): boolean;
  isWitnessProgram(): boolean;
  isScriptHashIn(): boolean;
  isMultisigOut(): boolean;
  isMultisigIn(): boolean;
  isDataOut(): boolean;

  getData(): Buffer;
  isPushOnly(): boolean;

  classify(): string;
  classifyInput(): string;
  classifyOutput(): string;

  isStandard(): boolean;

  prepend(obj: any): this;
  add(obj: any): this;

  hasCodeseparators(): boolean;
  removeCodeseparators(): this;

  equals(script: Script): boolean;

  getAddressInfo(): Address | boolean;
  findAndDelete(script: Script): this;
  checkMinimalPush(i: number): boolean;
  getSignatureOperationsCount(accurate: boolean): number;

  toAddress(): Address;
}

export interface SignatureData {
  publicKey: any,
  prevTxId: Buffer | string,
  outputIndex: number,
  inputIndex: number,
  signature: CryptoSignature | Buffer | string,
  sigtype: number,
}

export namespace Transaction {
  class Input {
    readonly prevTxId: Buffer | string;
    readonly outputIndex: number;
    readonly sequenceNumber: number;
    readonly script: Script;
    readonly output: Output;
    setScript(script: Script): this;
  }

  export class Output {
    constructor(arg: {satoshis: number, script: Script | string, tokenId: number });
    readonly script: Script;
    invalidSatoshis(): string | false;
    toObject(): object;
    fromObject: Output;
    setScriptFromBuffer(buffer: Buffer): void;
    setScript(script: Script): this;
    inspect(): any;
    fromBufferReader(br: encoding.BufferReader, version: number): Output;
    toBufferWriter(writer: encoding.BufferWriter, version: number): encoding.BufferWriter;
  }

  class Signature {
    public publicKey: any;
    public prevTxId: Buffer | string;
    public outputIndex: number;
    public inputIndex: number;
    public signature: CryptoSignature | Buffer | string;
    public sigtype: number;
    public toDER(): Buffer;
    constructor(data: SignatureData)

  }

  const Sighash: Sighash;

  const customTxMarker = 'DfTx';
}

export class Transaction {
  constructor(serialized?: Transaction | Buffer | object | string);
  inputs: Transaction.Input[];
  addOutput(output: Transaction.Output): this;
  from(utxo: Array<Transaction> | { script: Buffer | string | Script},
       pubkeys?: Array<any>, threshold?: number, nestedWitness?: boolean, opts?: object): this;
  to(address: string | Address | object, amount: number): this;
  fee(amount: number): this;
}

export namespace Networks {
  interface Network {
    readonly name: string;
    readonly alias: string;
  }

  const livenet: Network;
  const mainnet: Network;
  const testnet: Network;

  function addNetwork(data: any): Network;
  function removeNetwork(network: Network): void;
  function get(args: string | number | Network, keys: string | string[]): Network;
}

export namespace Address {
  function isValid(data: any, network: string, type?: any): boolean;
}

export class Address {
  readonly hashBuffer: Buffer;
  readonly network: Networks.Network;
  readonly type: string;

  constructor(data: Buffer | Uint8Array | string | object, network?: Networks.Network, type?: string);

}

export namespace Opcode {
  const map: {
    // push value
    OP_FALSE: 0,
    OP_0: 0,
    OP_PUSHDATA1: 76,
    OP_PUSHDATA2: 77,
    OP_PUSHDATA4: 78,
    OP_1NEGATE: 79,
    OP_RESERVED: 80,
    OP_TRUE: 81,
    OP_1: 81,
    OP_2: 82,
    OP_3: 83,
    OP_4: 84,
    OP_5: 85,
    OP_6: 86,
    OP_7: 87,
    OP_8: 88,
    OP_9: 89,
    OP_10: 90,
    OP_11: 91,
    OP_12: 92,
    OP_13: 93,
    OP_14: 94,
    OP_15: 95,
    OP_16: 96,

    // control
    OP_NOP: 97,
    OP_VER: 98,
    OP_IF: 99,
    OP_NOTIF: 100,
    OP_VERIF: 101,
    OP_VERNOTIF: 102,
    OP_ELSE: 103,
    OP_ENDIF: 104,
    OP_VERIFY: 105,
    OP_RETURN: 106,

    // stack ops
    OP_TOALTSTACK: 107,
    OP_FROMALTSTACK: 108,
    OP_2DROP: 109,
    OP_2DUP: 110,
    OP_3DUP: 111,
    OP_2OVER: 112,
    OP_2ROT: 113,
    OP_2SWAP: 114,
    OP_IFDUP: 115,
    OP_DEPTH: 116,
    OP_DROP: 117,
    OP_DUP: 118,
    OP_NIP: 119,
    OP_OVER: 120,
    OP_PICK: 121,
    OP_ROLL: 122,
    OP_ROT: 123,
    OP_SWAP: 124,
    OP_TUCK: 125,

    // splice ops
    OP_CAT: 126,
    OP_SUBSTR: 127,
    OP_LEFT: 128,
    OP_RIGHT: 129,
    OP_SIZE: 130,

    // bit logic
    OP_INVERT: 131,
    OP_AND: 132,
    OP_OR: 133,
    OP_XOR: 134,
    OP_EQUAL: 135,
    OP_EQUALVERIFY: 136,
    OP_RESERVED1: 137,
    OP_RESERVED2: 138,

    // numeric
    OP_1ADD: 139,
    OP_1SUB: 140,
    OP_2MUL: 141,
    OP_2DIV: 142,
    OP_NEGATE: 143,
    OP_ABS: 144,
    OP_NOT: 145,
    OP_0NOTEQUAL: 146,

    OP_ADD: 147,
    OP_SUB: 148,
    OP_MUL: 149,
    OP_DIV: 150,
    OP_MOD: 151,
    OP_LSHIFT: 152,
    OP_RSHIFT: 153,

    OP_BOOLAND: 154,
    OP_BOOLOR: 155,
    OP_NUMEQUAL: 156,
    OP_NUMEQUALVERIFY: 157,
    OP_NUMNOTEQUAL: 158,
    OP_LESSTHAN: 159,
    OP_GREATERTHAN: 160,
    OP_LESSTHANOREQUAL: 161,
    OP_GREATERTHANOREQUAL: 162,
    OP_MIN: 163,
    OP_MAX: 164,

    OP_WITHIN: 165,

    // crypto
    OP_RIPEMD160: 166,
    OP_SHA1: 167,
    OP_SHA256: 168,
    OP_HASH160: 169,
    OP_HASH256: 170,
    OP_CODESEPARATOR: 171,
    OP_CHECKSIG: 172,
    OP_CHECKSIGVERIFY: 173,
    OP_CHECKMULTISIG: 174,
    OP_CHECKMULTISIGVERIFY: 175,

    OP_CHECKLOCKTIMEVERIFY: 177,
    OP_CHECKSEQUENCEVERIFY: 178,

    // expansion
    OP_NOP1: 176,
    OP_NOP2: 177,
    OP_NOP3: 178,
    OP_NOP4: 179,
    OP_NOP5: 180,
    OP_NOP6: 181,
    OP_NOP7: 182,
    OP_NOP8: 183,
    OP_NOP9: 184,
    OP_NOP10: 185,

    // template matching params
    OP_PUBKEYHASH: 253,
    OP_PUBKEY: 254,
    OP_INVALIDOPCODE: 255
  };
}

export class Opcode {
  add(obj: any): this;
}

export namespace encoding {
  namespace BufferWriter {
    function varintBufNum (n: number): Buffer;
    function varintBufBN (n: number): Buffer;
  }


  class BufferWriter {
    set(obj: any): this;
    toBuffer(): Buffer;
    concat(): Buffer;
    write(buf: any): this;
    writeReverse(buf: any): this;
    writeVarLengthBuff(buf: any): this;
    writeUInt8(n: any): this;
    writeUInt16BE(n: any): this;
    writeUInt16LE(n: any): this;
    writeUInt32BE(n: any): this;
    writeInt32LE(n: any): this;
    writeUInt32LE(n: any): this;
    writeUInt64BEBN(n: any): this;
    writeUInt64LEBN(n: any): this;
    writeVarintNum(n: any): this;
    writeVarintBN(bn: any): this;
  }

  class BufferReader {
    constructor(buf: Buffer)
    readonly finished: boolean;
    readonly pos: number;
    set(obj: any): this;
    eof(): boolean;
    read(len: number): Buffer;
    readAll(): Buffer;
    readUInt8(): number;
    readUInt16BE(): number;
    readUInt16LE(): number;
    readUInt32BE(): number;
    readUInt32LE(): number;
    readInt32LE(): number;
    readUInt64BEBN(): Buffer;
    readUInt64LEBN(): Buffer;
    readVarintNum(): number;
    readVarLengthBuffer(): Buffer;
    readVarintBuf(): Buffer;
    readVarintBN(): Buffer;
    reverse(): this;
    readReverse(len?: number): Buffer;
  }
}

type ArgCustomTx = encoding.BufferReader | Object;

export namespace CustomTx {
  const customTxType: {
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
  };

  class CreateMasternode {
    constructor(data: ArgCustomTx);
  }


  class ResignMasternode {
    constructor(data: ArgCustomTx);
  }


  class CreateToken {
    constructor(data: ArgCustomTx);
  }

  class MintToken {
    constructor(data: ArgCustomTx);
  }

  class UpdateToken {
    constructor(data: ArgCustomTx);
  }

  class UpdateTokenAny {
    constructor(data: ArgCustomTx);
  }

  class CreatePoolPair {
    constructor(data: ArgCustomTx);
  }

  class UpdatePoolPair {
    constructor(data: ArgCustomTx);
  }

  class PoolSwap {
    constructor(data: ArgCustomTx);
  }

  class AddPoolLiquidity {
    constructor(data: ArgCustomTx);
  }

  class RemovePoolLiquidity {
    constructor(data: ArgCustomTx);
  }

  class SetGovVariable {
    constructor(data: ArgCustomTx);
  }

  class UtxosToAccount {
    constructor(data: ArgCustomTx);
  }

  class AccountToUtxos {
    constructor(data: ArgCustomTx);
  }

  class AccountToAccount {
    constructor(data: ArgCustomTx);
  }
}

export type Sighash = {
  sighash: (transaction: Transaction, sighashType: number, inputNumber: number, subscript: Script) => Buffer;
  sign: (transaction: Transaction, provateKey: any, sighashType: number, inputIndex: number, subscript: Script) => any;
  verify: (transaction: Transaction, signature: any, publicKey: any, inputIndex: number, subscript: Script) => any;
}

interface CryptoSignature {
  SIGHASH_ALL: 0x01,
  SIGHASH_NONE: 0x02,
  SIGHASH_SINGLE: 0x03,
  SIGHASH_ANYONECANPAY: 0x80,
}

export namespace crypto {
  const Signature: CryptoSignature;
  const Hash: {
    sha256: (buf: Buffer) => any;
  };
}

export namespace util {
  const buffer: {
    fill: (buffer: Buffer, value: number) => Buffer;
    copy: (original: Buffer) => Buffer;
    isBuffer: (arg: any) => boolean;
    emptyBuffer: (bytes: number) => Buffer;
    reverse: (param: Buffer) => Buffer;
  }

  const preconditions: {
    checkState: (condition: any, message: string) => any;
    checkArgument: (condition: any, argumentName: string, message: string, docsPath: string) => any;
    checkArgumentType: (argument: any, type: string, argumentName: string) => any;
  }
}




