
/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

const Type = require('./type');

class VoidType extends Type {
    constructor(bitlen) {
        const normalizedDefinition = `void${bitlen}`;
        super(normalizedDefinition, Type.CATEGORY_VOID);
        this.bitlen = bitlen;
    }

    getNormalizedDefinition() {
        return `void${this.bitlen}`;
    }

    getMaxBitlen() {
        return this.bitlen;
    }

    getMinBitlen() {
        return this.bitlen;
    }
}

module.exports = VoidType;