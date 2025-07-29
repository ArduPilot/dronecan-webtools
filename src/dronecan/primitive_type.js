/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

const Type = require('./type');

var Buffer = require('buffer').Buffer;

Buffer.prototype.setBit = function(bitOffset, value) {
    const byteIndex = Math.floor(bitOffset / 8);
    const bitPosition = bitOffset % 8;

    if (byteIndex >= this.length) {
        throw new RangeError("setBit: bitOffset out of range");
    }

    if (value === 1) {
        this[byteIndex] |= (1 << (7 - bitPosition));
    } else if (value === 0) {
        this[byteIndex] &= ~(1 << (7 - bitPosition));
    } else {
        throw new Error("setBit: value must be 0 or 1");
    }
};

// Helper functions for value ranges.
function getUnsignedIntegerRange(bitlen) {
    return { min: 0n, max: (1n << BigInt(bitlen)) - 1n };
}

function getSignedIntegerRange(bitlen) {
    return { min: -(1n << BigInt(bitlen - 1)), max: (1n << BigInt(bitlen - 1)) - 1n };
}

function getFloatRange(bitlen) {
    if (bitlen === 16) {
        // Approximate range for float16.
        return { min: -65504, max: 65504 };
    } else if (bitlen === 32) {
        return { min: -3.4e38, max: 3.4e38 };
    } else if (bitlen === 64) {
        return { min: -1.8e308, max: 1.8e308 };
    } else {
        throw new Error("Unsupported float bitlen: " + bitlen);
    }
}

// New helper to resolve the value range.
function getValueRange(kind, bitlen) {
    switch (kind) {
        case PrimitiveType.KIND_BOOLEAN:
            return { min: 0, max: 1 };
        case PrimitiveType.KIND_UNSIGNED_INT:
            return getUnsignedIntegerRange(bitlen);
        case PrimitiveType.KIND_SIGNED_INT:
            return getSignedIntegerRange(bitlen);
        case PrimitiveType.KIND_FLOAT:
            if (bitlen === 1) {
                throw new Error("Unsupported float bitlen: " + bitlen);
            }
            return getFloatRange(bitlen);
        default:
            throw new Error("Unknown kind: " + kind);
    }
}

// Helper functions for float16 conversion.
function floatToHalf(val) {
    const floatView = new Float32Array(1);
    const int32View = new Int32Array(floatView.buffer);
    floatView[0] = val;
    const x = int32View[0];
    const sign = (x >> 16) & 0x8000;
    let exp = ((x >> 23) & 0xff) - 127 + 15;
    let mantissa = (x >> 13) & 0x03ff;
    if (exp <= 0) {
        // Underflow - convert to subnormal value.
        if (exp < -10) {
            return sign;
        }
        mantissa = (mantissa | 0x0400) >> (1 - exp);
        return sign | mantissa;
    } else if (exp === 0xff - 127 + 15) {
        if (mantissa) {
            // NaN
            return sign | 0x7e00;
        }
        // Inf
        return sign | 0x7c00;
    } else if (exp > 30) {
        // Overflow - return Inf.
        return sign | 0x7c00;
    }
    return sign | (exp << 10) | mantissa;
}

function halfToFloat(h) {
    const sign = (h & 0x8000) << 16;
    let exp = (h & 0x7c00) >> 10;
    let mantissa = h & 0x03ff;
    if (exp === 0) {
        if (mantissa === 0) {
            // Zero.
            return sign ? -0 : 0;
        }
        // Subnormal number
        exp = 1;
        while ((mantissa & 0x0400) === 0) {
            mantissa <<= 1;
            exp--;
        }
        mantissa &= 0x03ff;
    } else if (exp === 31) {
        // Inf or NaN.
        return mantissa === 0 ? (sign ? -Infinity : Infinity) : NaN;
    }
    exp = exp + (127 - 15);
    const int32 = sign | (exp << 23) | (mantissa << 13);
    const floatView = new Float32Array(new Uint32Array([int32]).buffer);
    return floatView[0];
}

class PrimitiveType extends Type {
    // Type kind constants.
    static KIND_BOOLEAN = 0;
    static KIND_UNSIGNED_INT = 1;
    static KIND_SIGNED_INT = 2;
    static KIND_FLOAT = 3;

    // Cast mode constants.
    static CAST_MODE_SATURATED = 0;
    static CAST_MODE_TRUNCATED = 1;

    /**
     * Constructs a new PrimitiveType.
     * @param {*} value - The value to store.
     * @param {number} kind - The kind of the primitive. Use one of the PrimitiveType kind constants.
     * @param {number} bitlen - The bit length to use for encoding. For booleans, use 1.
     * @param {number} [cast_mode=PrimitiveType.CAST_MODE_SATURATED] - The cast mode.
     */
    constructor(value, kind, bitlen, cast_mode = PrimitiveType.CAST_MODE_SATURATED) {
        // Generate the normalized definition string.
        const cast_mode_str = (cast_mode === PrimitiveType.CAST_MODE_SATURATED) ? "saturated" : "truncated";
        let primary_type;
        switch (kind) {
            case PrimitiveType.KIND_BOOLEAN:
                primary_type = "bool";
                break;
            case PrimitiveType.KIND_UNSIGNED_INT:
                primary_type = "uint" + bitlen;
                break;
            case PrimitiveType.KIND_SIGNED_INT:
                primary_type = "int" + bitlen;
                break;
            case PrimitiveType.KIND_FLOAT:
                primary_type = "float" + bitlen;
                break;
            default:
                primary_type = "unknown";
        }
        const normalizedDefinition = `${cast_mode_str} ${primary_type}`;

        super(normalizedDefinition, Type.CATEGORY_PRIMITIVE);

        this.value = value;
        this.kind = kind;
        this.bitlen = bitlen;
        this.cast_mode = cast_mode;
        this.value_range = getValueRange(this.kind, this.bitlen);
    }

    getNormalizedDefinition() {
        const cast_mode_str = (this.cast_mode === PrimitiveType.CAST_MODE_SATURATED) ? "saturated" : "truncated";
        let primary_type;
        switch (this.kind) {
            case PrimitiveType.KIND_BOOLEAN:
                primary_type = "bool";
                break;
            case PrimitiveType.KIND_UNSIGNED_INT:
                primary_type = "uint" + this.bitlen;
                break;
            case PrimitiveType.KIND_SIGNED_INT:
                primary_type = "int" + this.bitlen;
                break;
            case PrimitiveType.KIND_FLOAT:
                primary_type = "float" + this.bitlen;
                break;
            default:
                primary_type = "unknown";
        }
        return `${cast_mode_str} ${primary_type}`;
    }

    validateValueRange(value) {
        const low = this.value_range.min;
        const high = this.value_range.max;
        let v = (typeof low === 'bigint') ? BigInt(value) : value;
        if (v < low || v > high) {
            throw new Error(`Value [${value}] is out of range [${low}, ${high}]`);
        }
    }

    getMaxBitlen() {
        return this.bitlen;
    }

    getMinBitlen() {
        return this.bitlen;
    }

    pack() {
        let buffer;
        if (this.bitlen === 0) {
            throw new Error("Bit length must be greater than zero");
        };
        switch (this.kind) {
            case PrimitiveType.KIND_FLOAT: {
                if (this.bitlen === 16) {
                    buffer = Buffer.alloc(2);
                    if (Number.isNaN(this.value)) {
                        buffer.writeUInt16LE(0x7FFF, 0);
                    } else {
                        buffer.writeUInt16LE(floatToHalf(this.value), 0);
                    }
                } else if (this.bitlen === 32) {
                    buffer = Buffer.alloc(4);
                    if (Number.isNaN(this.value)) {
                        buffer.writeUInt32LE(0x7FC00000, 0);
                    } else {
                        buffer.writeFloatLE(this.value, 0);
                    }
                } else if (this.bitlen === 64) {
                    buffer = Buffer.alloc(8);
                    if (Number.isNaN(this.value)) {
                        buffer.writeUInt32LE(0x7FF80000, 0);
                    } else {
                        buffer.writeDoubleLE(this.value, 0);
                    }
                } else {
                    throw new Error(`Unsupported bitlen for float: ${this.bitlen}. Use 16, 32, or 64.`);
                }
                break;
            }
            case PrimitiveType.KIND_BOOLEAN: {
                const byteCount = Math.ceil(this.bitlen / 8);
                buffer = Buffer.alloc(byteCount);
                buffer[0] = this.value ? 1 : 0;
                break;
            }
            case PrimitiveType.KIND_UNSIGNED_INT: {
                if (this.bitlen <= 8) {
                    buffer = Buffer.alloc(1);
                    buffer.writeUInt8(this.value, 0);
                } else if (this.bitlen <= 16) {
                    buffer = Buffer.alloc(2);
                    buffer.writeUInt16LE(this.value, 0);
                } else if (this.bitlen <= 32) {
                    buffer = Buffer.alloc(4);
                    buffer.writeUInt32LE(this.value, 0);
                } else if (this.bitlen <= 64) {
                    buffer = Buffer.alloc(8);
                    buffer.writeBigUInt64LE(BigInt(this.value), 0);
                } else {
                    throw new Error(`Unsupported bitlen for unsigned int: ${this.bitlen}`);
                }
                break;
            }
            case PrimitiveType.KIND_SIGNED_INT: {
                if (this.bitlen <= 8) {
                    if (this.value < 0) {
                        buffer = Buffer.alloc(1, 0xFF);
                    } else {
                        buffer = Buffer.alloc(1);
                    }
                    if (this.value !== null) {
                        buffer.writeInt8(0, this.value);
                    }
                } else if (this.bitlen <= 16) {
                    if (this.value < 0) {
                        buffer = Buffer.alloc(2, 0xFF);
                    } else {
                        buffer = Buffer.alloc(2);
                    }
                    buffer.writeInt16LE(this.value, 0);
                } else if (this.bitlen <= 32) {
                    if (this.value < 0) {
                        buffer = Buffer.alloc(4, 0xFF);
                    } else {
                        buffer = Buffer.alloc(4);
                    }
                    buffer.writeInt32LE(this.value, 0);
                } else if (this.bitlen <= 64) {
                    if (this.value < 0) {
                        buffer = Buffer.alloc(8, 0xFF);
                    } else {
                        buffer = Buffer.alloc(8);
                    }
                    if (this.value !== null) {
                        buffer.writeBigInt64LE(BigInt(this.value), 0);
                    } 
                } else {
                    throw new Error(`Unsupported bitlen for signed int: ${this.bitlen}`);
                }
                break;
            }
            default:
                throw new Error("Unsupported kind for encoding");
        }

        const bits = [];
        for (let i = 0; i < this.bitlen; i++) {
            if (this.bitlen < 8 || (this.bitlen % 8 !== 0 && i >= Math.floor(this.bitlen / 8) * 8)) {
                let bitOffset = 8 - this.bitlen % 8;
                bits.push(buffer.getBit(i + bitOffset));
            } else {
                bits.push(buffer.getBit(i));
            }
        }

        if (bits.length !== this.bitlen) {
            throw new Error("Bit length mismatch");
        }

        return bits;
    }

    static unpack(kind, bits, bitlen, castMode = null) {
        if (!(bits instanceof Array) && !(bits instanceof Uint8Array)) {
            throw new Error("Unsupported input type for decoding; expected Uint8Array or Buffer");
        }
        let value;
        switch (kind) {
            case PrimitiveType.KIND_FLOAT: {
                if (bitlen === 16) {
                    let buffer = Buffer.alloc(2);
                    for (let i = 0; i < 16; i++) {
                        buffer.setBit(i, bits[i]);
                    }
                    if (buffer.length < 2) throw new Error("Buffer too small for float16");
                    const half = buffer.readUInt16LE(0);
                    value = halfToFloat(half);
                } else if (bitlen === 32) {
                    let buffer = Buffer.alloc(4);
                    for (let i = 0; i < 32; i++) {
                        buffer.setBit(i, bits[i]);
                    }
                    if (buffer.length < 4) throw new Error("Buffer too small for float32");
                    value = buffer.readFloatLE(0);
                } else if (bitlen === 64) {
                    let buffer = Buffer.alloc(8);
                    for (let i = 0; i < 64; i++) {
                        buffer.setBit(i, bits[i]);
                    }
                    if (buffer.length < 8) throw new Error("Buffer too small for float64");
                    value = buffer.readDoubleLE(0);
                } else {
                    throw new Error(`Unsupported bitlen for float: ${bitlen}. Use 16, 32, or 64.`);
                }
                break;
            }
            case PrimitiveType.KIND_BOOLEAN: {
                if (bits.length === 1) 
                    value = Boolean(bits[0] === 1);
                else {
                    console.error("unexpected bits length for boolean: ", bits.length);
                } 
                break;
            }
            case PrimitiveType.KIND_UNSIGNED_INT: {
                value = 0;
                let buffer = Buffer.alloc(8, 0);
                if (castMode == PrimitiveType.CAST_MODE_TRUNCATED) {
                    for (let i = 0; i < bitlen; i++) {
                        buffer.setBit(i, bits[i]);
                    }
                } else if (castMode == PrimitiveType.CAST_MODE_SATURATED ) {
                    let bitOffset = Math.ceil(bitlen % 8);
                    let bitPosition = 0;
                    if (bitOffset !== 0) {
                        bitPosition = 8 - bitOffset;
                    }
                    for (let i = 0; i < bitlen; i++) {
                        if (bitlen < 8 || i > Math.floor(bitlen/8) *8) {
                            buffer.setBit(i + bitPosition, bits[i]); //handle last byte
                        } else {
                            buffer.setBit(i, bits[i]);
                        }
                    }
                }
                if (bitlen <= 8) {
                    value = buffer.readUInt8(0);
                } else if (bitlen <= 16) {
                    value = buffer.readUInt16LE(0);
                } else if (bitlen <= 32) {
                    value = buffer.readUInt32LE(0);
                } else if (bitlen <= 64) {
                    value = Number(buffer.readBigUInt64LE(0));
                } else {
                    throw new Error(`Unsupported bitlen for unsigned int: ${bitlen}`);
                }
                break;
            }
            case PrimitiveType.KIND_SIGNED_INT: {
                let buffer;
                let MSB_index = Math.floor(bitlen/8) * 8;
                let MSB = bits[MSB_index];
                if (MSB === 1) {
                    buffer = Buffer.alloc(8, 0xFF); // Negative number
                } else {
                    buffer = Buffer.alloc(8, 0); // Positive number
                }
                if (castMode == PrimitiveType.CAST_MODE_TRUNCATED) {
                    for (let i = 0; i < bitlen; i++) {
                        buffer.setBit(i, bits[i]);
                    }
                } else if (castMode == PrimitiveType.CAST_MODE_SATURATED ) {
                    let bitOffset =  8 - Math.ceil(bitlen%8)
                    for (let i = 0; i < bitlen; i++) {
                        if ( i > Math.floor(bitlen/8) *8) {
                            buffer.setBit(i + bitOffset, bits[i]); //handle last byte
                        } else {
                            buffer.setBit(i, bits[i]);
                        }
                    }
                }
                if (bitlen <= 8) {
                    value = buffer.readUInt8(0);
                } else if (bitlen <= 16) {
                    value = buffer.readInt16LE(0);
                } else if (bitlen <= 32) {
                    value = buffer.readInt32LE(0);
                } else if (bitlen <= 64) {
                    value = Number(buffer.readBigInt64LE(0));
                } else {
                    throw new Error(`Unsupported bitlen for unsigned int: ${bitlen}`);
                }
                break;
            }
            default:
                throw new Error("Unsupported kind for decoding");
        }
        return new PrimitiveType(value, kind, bitlen);
    }

    toString() {
        return `PrimitiveType(${this.kind}): ${this.value}`;
    }
}

module.exports = PrimitiveType;