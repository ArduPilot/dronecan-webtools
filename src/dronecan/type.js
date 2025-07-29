/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

class Type {
    static CATEGORY_PRIMITIVE = 0;
    static CATEGORY_ARRAY = 1;
    static CATEGORY_COMPOUND = 2;
    static CATEGORY_VOID = 3;

    constructor(full_name, category) {
        this.full_name = String(full_name);
        this.category = category;
    }

    getNormalizedDefinition() {
        throw new Error('Pure virtual method: getNormalizedDefinition() must be implemented by subclass.');
    }

    getDataTypeSignature() {
        return null;
    }

    getMaxBitlen() {
        throw new Error('Pure virtual method: getMaxBitlen() must be implemented by subclass.');
    }

    getMinBitlen() {
        throw new Error('Pure virtual method: getMinBitlen() must be implemented by subclass.');
    }

    toString() {
        return this.getNormalizedDefinition();
    }
}

module.exports = Type;