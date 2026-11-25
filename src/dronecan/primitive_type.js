/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

const Type = require('./type');
const { Buffer } = require('buffer');

Buffer.prototype.setBit = function (bitOffset, value) {
    if (!Number.isInteger(bitOffset) || bitOffset < 0 || bitOffset >= this.length * 8) {
        throw new RangeError('setBit: bitOffset out of range');
    }
    const byteIndex = Math.floor(bitOffset / 8);
    const mask = 1 << (7 - bitOffset % 8);
    if (value === 1) {
        this[byteIndex] |= mask;
    } else if (value === 0) {
        this[byteIndex] &= ~mask;
    } else {
        throw new Error('setBit: value must be 0 or 1');
    }
};

const FLOAT_MAX = { 16: 65504, 32: 3.4028234663852886e38, 64: Number.MAX_VALUE };
const floatWireBytes = Symbol('floatWireBytes');
const MIN_SAFE_INTEGER = BigInt(Number.MIN_SAFE_INTEGER);
const MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);

function integer(value) {
    if (typeof value === 'number') {
        if (!Number.isInteger(value)) throw new RangeError('Integer values must be whole numbers');
        if (!Number.isSafeInteger(value)) {
            throw new RangeError('Integer values outside the safe Number range must be provided as BigInt');
        }
    }
    return BigInt(value ?? 0);
}

function toExactNumber(value) {
    return value >= MIN_SAFE_INTEGER && value <= MAX_SAFE_INTEGER ? Number(value) : value;
}

function getValueRange(kind, width) {
    if (!Number.isInteger(width) || width < 1 || width > 64) {
        throw new RangeError('Primitive bit length must be between 1 and 64');
    }
    switch (kind) {
        case PrimitiveType.KIND_BOOLEAN:
            if (width !== 1) throw new RangeError('Boolean values require one bit');
            return { min: 0, max: 1 };
        case PrimitiveType.KIND_UNSIGNED_INT:
            return { min: 0n, max: (1n << BigInt(width)) - 1n };
        case PrimitiveType.KIND_SIGNED_INT: {
            const limit = 1n << BigInt(width - 1);
            return { min: -limit, max: limit - 1n };
        }
        case PrimitiveType.KIND_FLOAT: {
            const max = FLOAT_MAX[width];
            if (max === undefined) throw new RangeError('Float bit length must be 16, 32 or 64');
            return { min: -max, max };
        }
        default:
            throw new TypeError('Unknown primitive kind: ' + kind);
    }
}

function normalizedDefinition(kind, width, castMode) {
    const mode = castMode === PrimitiveType.CAST_MODE_TRUNCATED ? 'truncated' : 'saturated';
    const type = ['bool', 'uint' + width, 'int' + width, 'float' + width][kind];
    return `${mode} ${type}`;
}

function floatToHalf(value) {
    if (Number.isNaN(value)) return 0x7fff;
    const sign = value < 0 || Object.is(value, -0) ? 0x8000 : 0;
    const magnitude = Math.abs(Math.fround(value));
    if (magnitude === Infinity) return sign | 0x7c00;

    // In a subnormal half, each increment represents 2^-24.
    if (magnitude < 2 ** -14) return sign | Math.round(magnitude * 2 ** 24);

    // Round the 11-bit significand, including the leading 1. A carry moves into the exponent.
    const exponent = Math.floor(Math.log2(magnitude));
    const significand = Math.round(magnitude * 2 ** (10 - exponent));
    return sign | ((exponent + 14) * 1024 + significand);
}

function halfToFloat(bits) {
    const sign = (bits & 0x8000) === 0 ? 1 : -1;
    const exponent = (bits >> 10) & 0x1f;
    const fraction = bits & 0x3ff;
    if (exponent === 0) return sign * fraction * 2 ** -24;
    if (exponent === 31) return fraction === 0 ? sign * Infinity : NaN;
    return sign * (1024 + fraction) * 2 ** (exponent - 25);
}

// Finite values (including -0) encode exactly. Infinities and NaN payloads
// need the received bits until the caller explicitly assigns a value.
function retainNonFiniteEncoding(field, bytes) {
    let value = field.value;
    if (Number.isFinite(value)) return;
    field[floatWireBytes] = bytes;
    Object.defineProperty(field, 'value', {
        get() { return value; },
        set(next) {
            value = next;
            this[floatWireBytes] = null;
        },
    });
}

// The bytes are little-endian, with bits within each byte in MSB-first order.
function bytesToBits(bytes, width) {
    const bits = [];
    for (let offset = 0; offset < width; offset += 8) {
        const byte = bytes[offset / 8];
        for (let bit = Math.min(8, width - offset) - 1; bit >= 0; bit--) {
            bits.push((byte >> bit) & 1);
        }
    }
    return bits;
}

function bitsToBytes(bits, width) {
    const bytes = Buffer.alloc(8);
    for (let offset = 0; offset < width; offset += 8) {
        let byte = 0;
        const end = Math.min(offset + 8, width);
        for (let i = offset; i < end; i++) {
            const bit = bits[i];
            if (bit !== 0 && bit !== 1) throw new TypeError('Expected a bit with value 0 or 1');
            byte = (byte << 1) | bit;
        }
        bytes[offset / 8] = byte;
    }
    return bytes;
}

class PrimitiveType extends Type {
    static KIND_BOOLEAN = 0;
    static KIND_UNSIGNED_INT = 1;
    static KIND_SIGNED_INT = 2;
    static KIND_FLOAT = 3;
    static CAST_MODE_SATURATED = 0;
    static CAST_MODE_TRUNCATED = 1;

    constructor(value, kind, bitlen, cast_mode = PrimitiveType.CAST_MODE_SATURATED) {
        super(normalizedDefinition(kind, bitlen, cast_mode), Type.CATEGORY_PRIMITIVE);
        this.value = value ?? (kind === PrimitiveType.KIND_BOOLEAN ? false : 0);
        this.kind = kind;
        this.bitlen = bitlen;
        this.cast_mode = cast_mode ?? PrimitiveType.CAST_MODE_SATURATED;
        this.value_range = getValueRange(kind, bitlen);
    }

    getNormalizedDefinition() {
        return normalizedDefinition(this.kind, this.bitlen, this.cast_mode);
    }

    validateValueRange(value) {
        const { min, max } = this.value_range;
        const input = typeof min === 'bigint' ? integer(value) : value;
        if (input < min || input > max) {
            throw new RangeError(`Value [${value}] is out of range [${min}, ${max}]`);
        }
    }

    getMaxBitlen() {
        return this.bitlen;
    }

    getMinBitlen() {
        return this.bitlen;
    }

    pack() {
        if (this.kind === PrimitiveType.KIND_BOOLEAN) return [Number(Boolean(this.value))];

        const { min, max } = this.value_range;
        const saturated = this.cast_mode !== PrimitiveType.CAST_MODE_TRUNCATED;
        const bytes = Buffer.alloc(8);
        if (this.kind === PrimitiveType.KIND_FLOAT) {
            if (this[floatWireBytes]) return bytesToBits(this[floatWireBytes], this.bitlen);
            let value = Number(this.value ?? 0);
            if (saturated) value = Math.max(min, Math.min(max, value));
            else if (value < min || value > max) value = Math.sign(value) * Infinity;

            if (this.bitlen === 16) {
                bytes.writeUInt16LE(floatToHalf(value), 0);
            } else if (this.bitlen === 32) {
                if (Number.isNaN(value)) bytes.writeUInt32LE(0x7fc00000, 0);
                else bytes.writeFloatLE(value, 0);
            } else {
                if (Number.isNaN(value)) bytes.writeBigUInt64LE(0x7ff8000000000000n, 0);
                else bytes.writeDoubleLE(value, 0);
            }
        } else {
            let value = integer(this.value);
            if (saturated && value < min) value = min;
            if (saturated && value > max) value = max;
            bytes.writeBigUInt64LE(BigInt.asUintN(this.bitlen, value), 0);
        }
        return bytesToBits(bytes, this.bitlen);
    }

    static unpack(kind, bits, bitlen, castMode = PrimitiveType.CAST_MODE_SATURATED) {
        if (!Array.isArray(bits) && !(bits instanceof Uint8Array)) {
            throw new TypeError('Expected an array of bits or a Uint8Array');
        }
        const primitive = new PrimitiveType(null, kind, bitlen, castMode);
        if (bits.length < bitlen) throw new RangeError('Not enough bits for the primitive');
        const bytes = bitsToBytes(bits, bitlen);
        if (kind === PrimitiveType.KIND_FLOAT) {
            if (bitlen === 16) primitive.value = halfToFloat(bytes.readUInt16LE(0));
            else if (bitlen === 32) primitive.value = bytes.readFloatLE(0);
            else primitive.value = bytes.readDoubleLE(0);
            retainNonFiniteEncoding(primitive, bytes);
        } else if (kind === PrimitiveType.KIND_BOOLEAN) {
            primitive.value = Boolean(bytes[0]);
        } else {
            const value = bytes.readBigUInt64LE(0);
            primitive.value = toExactNumber(kind === PrimitiveType.KIND_SIGNED_INT ? BigInt.asIntN(bitlen, value) : value);
        }
        return primitive;
    }

    toObj() {
        if (this.kind === PrimitiveType.KIND_BOOLEAN) return Number(Boolean(this.value));
        if (this.kind === PrimitiveType.KIND_FLOAT) return Number(this.value);
        return toExactNumber(integer(this.value));
    }

    toString() {
        return `PrimitiveType(${this.kind}): ${this.value}`;
    }
}

module.exports = PrimitiveType;
