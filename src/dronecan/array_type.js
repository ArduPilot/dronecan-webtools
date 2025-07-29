/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

const Type = require('./type');
const PrimitiveType = require('./primitive_type'); 

class ArrayType extends Type {
    static MODE_STATIC = 0;
    static MODE_DYNAMIC = 1;

    constructor(value_type, mode, max_size) {
        let normalizedDefinition;
        if (mode === ArrayType.MODE_DYNAMIC) {
            if (value_type.category === Type.CATEGORY_PRIMITIVE) {
                normalizedDefinition = `${value_type.getNormalizedDefinition()}[<=${max_size}]`;
            } else {
                //TODO
            }
        } else {
            if (value_type.category === Type.CATEGORY_PRIMITIVE) {
                normalizedDefinition = `${value_type.getNormalizedDefinition()}[${max_size}]`;
            } else {
                //TODO
            }
        }
        // Call parent constructor with the normalized definition and the CATEGORY_ARRAY constant.
        super(normalizedDefinition, Type.CATEGORY_ARRAY);
        this.value_type = value_type;
        this.mode = mode;
        this.max_size = max_size;
        this.items = [];
    }

    get length() {
        return this.items.length;
    }

    toString() {
        const buf = this.items.map((item) => { return item.value });
        return String.fromCharCode(...buf);
    }

    fromString(str) {
        this.items = str.split('').map((char) => {
            return new PrimitiveType(char.charCodeAt(0), PrimitiveType.KIND_UNSIGNED_INT, 8);
        });
    }

    toObj(forceArray = false) {
        if (!forceArray && this.isStringLike) {
            return this.toString();
        } else {
            let obj = [];
            for (let item of this.items) {
                if (item.category === Type.CATEGORY_PRIMITIVE) {
                    obj.push(Number(item.value));
                } else if (item.category === Type.CATEGORY_COMPOUND) {
                    obj.push(item.toObj());
                } else {
                    new Error('Unknown type category in ArrayType item');
                }
            }
            return obj;
        }
    }

    getNormalizedDefinition() {
        const typedef = this.value_type.getNormalizedDefinition();
        if (this.mode === ArrayType.MODE_DYNAMIC) {
            return `${typedef}[<=${this.max_size}]`;
        } else {
            return `${typedef}[${this.max_size}]`;
        }
    }

    static bitLength(n) {
        return n > 0 ? Math.floor(Math.log2(n)) + 1 : 0;
    }

    push(item) {
        if (this.items.length >= this.max_size) {
            throw new Error("Array is full");
        }
        this.items.push(item);
    }

    getMaxBitlen() {
        const payload_max_bitlen = this.max_size * this.value_type.getMaxBitlen();
        if (this.mode === ArrayType.MODE_DYNAMIC) {
            return payload_max_bitlen + ArrayType.bitLength(this.max_size);
        } else {
            return payload_max_bitlen;
        }
    }

    getMinBitlen() {
        if (this.mode === ArrayType.MODE_STATIC) {
            return this.value_type.getMinBitlen() * this.max_size;
        } else {
            return 0;
        }
    }

    getDataTypeSignature() {
        return this.value_type.getDataTypeSignature();
    }

    get isStringLike() {
        return this.mode === ArrayType.MODE_DYNAMIC &&
            this.value_type.category === Type.CATEGORY_PRIMITIVE &&
            this.value_type.bitlen === 8;
    }
}

module.exports = ArrayType;