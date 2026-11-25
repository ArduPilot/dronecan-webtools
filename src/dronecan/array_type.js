/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

const { Buffer } = require('buffer');
const Type = require('./type');
const PrimitiveType = require('./primitive_type');
const CompoundType = require('./compound_type');

function arrayDefinition(valueType, mode, maxSize) {
    const itemName = valueType.getNormalizedDefinition?.() ?? valueType.name;
    const length = mode === ArrayType.MODE_DYNAMIC ? '<=' + maxSize : maxSize;
    return `${itemName}[${length}]`;
}

function makeItem(sample) {
    if (sample instanceof PrimitiveType) {
        return new PrimitiveType(null, sample.kind, sample.bitlen, sample.cast_mode);
    }
    if (sample instanceof ArrayType) {
        return new ArrayType(sample.value_type, sample.mode, sample.max_size);
    }
    if (sample instanceof CompoundType) return sample.call();
    return new CompoundType(new sample.constructor());
}

class ArrayType extends Type {
    static MODE_STATIC = 0;
    static MODE_DYNAMIC = 1;

    constructor(value_type, mode, max_size) {
        super(arrayDefinition(value_type, mode, max_size), Type.CATEGORY_ARRAY);
        this.value_type = value_type;
        this.mode = mode;
        this.max_size = max_size;
        this.items = mode === ArrayType.MODE_STATIC
            ? Array.from({ length: max_size }, () => makeItem(value_type))
            : [];
    }

    get length() {
        return this.items.length;
    }

    toString() {
        return this.isByteArray ? this.toBytes().toString('utf8') : this.getNormalizedDefinition();
    }

    fromString(str) {
        if (typeof str !== 'string') throw new TypeError('Expected a UTF-8 string');
        this.fromBytes(Buffer.from(str, 'utf8'));
    }

    toBytes() {
        if (!this.isByteArray) throw new TypeError('Expected an 8-bit integer array');
        return Buffer.from(this.items.map(item => Number(item.value)));
    }

    fromBytes(bytes) {
        if (!this.isByteArray) throw new TypeError('Expected an 8-bit integer array');
        if (!Array.isArray(bytes) && !(bytes instanceof Uint8Array)) {
            throw new TypeError('Expected an array of bytes or a Uint8Array');
        }
        if (bytes.length > this.max_size) throw new RangeError('Array is full');
        if (this.mode === ArrayType.MODE_STATIC && bytes.length !== this.max_size) {
            throw new RangeError(`Expected exactly ${this.max_size} bytes`);
        }
        const { kind, cast_mode } = this.value_type;
        this.items = Array.from(bytes, byte => {
            if (!Number.isInteger(byte) || byte < 0 || byte > 255) {
                throw new RangeError('Array bytes must be integers between 0 and 255');
            }
            const value = kind === PrimitiveType.KIND_SIGNED_INT && byte > 127 ? byte - 256 : byte;
            return new PrimitiveType(value, kind, 8, cast_mode);
        });
    }

    toObj(forceArray = false) {
        if (!forceArray && this.isStringLike) return this.toString();
        return this.items.map(item => item.toObj());
    }

    getNormalizedDefinition() {
        return arrayDefinition(this.value_type, this.mode, this.max_size);
    }

    static bitLength(n) {
        return n > 0 ? Math.floor(Math.log2(n)) + 1 : 0;
    }

    push(item) {
        if (this.items.length >= this.max_size) throw new RangeError('Array is full');
        this.items.push(item);
    }

    getMaxBitlen() {
        const itemBits = this.value_type.getMaxBitlen?.() ?? this.value_type.constructor.MAX_BIT_LEN;
        const lengthBits = this.mode === ArrayType.MODE_DYNAMIC ? ArrayType.bitLength(this.max_size) : 0;
        return this.max_size * itemBits + lengthBits;
    }

    getMinBitlen() {
        if (this.mode === ArrayType.MODE_DYNAMIC) return 0;
        const itemBits = this.value_type.getMinBitlen?.() ?? this.value_type.constructor.MIN_BIT_LEN;
        return this.max_size * itemBits;
    }

    getDataTypeSignature() {
        return this.value_type.getDataTypeSignature();
    }

    get isByteArray() {
        return this.value_type.bitlen === 8 && (
            this.value_type.kind === PrimitiveType.KIND_UNSIGNED_INT ||
            this.value_type.kind === PrimitiveType.KIND_SIGNED_INT
        );
    }

    get isStringLike() {
        return this.mode === ArrayType.MODE_DYNAMIC && this.isByteArray;
    }
}

module.exports = ArrayType;
