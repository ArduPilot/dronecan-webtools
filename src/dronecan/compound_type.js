/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

const Type = require('./type');

class CompoundType extends Type {
    static KIND_SERVICE = 0;
    static KIND_MESSAGE = 1;

    constructor(msg, version = null) {
        super(msg.name, Type.CATEGORY_COMPOUND);
        this.default_dtid = msg.dataTypeId ?? msg.id ?? null;
        this.version = version;
        this.msg = msg;
        this.override_signature = null;
    }

    toObj() {
        return this.msg.toObj();
    }

    get fieldNames() {
        return this.msg.fieldNames;
    }

    get fields() {
        return this.msg.fields;
    }

    get kind() {
        return this.msg.kind;
    }

    get union() {
        return this.msg.union;
    }

    get unionFieldIndex() {
        return this.msg.unionFieldIndex;
    }

    pack(tao = true) {
        return this.msg.pack(tao);
    }

    _instantiate(...args) {
        return new CompoundType(new this.msg.constructor(...args), this.version);
    }

    call(...args) {
        return this._instantiate(...args);
    }

    getDsdlSignatureSourceDefinition() {
        return this.msg.getDsdlSignatureSourceDefinition();
    }

    getDsdlSignature() {
        return this.override_signature ?? this.msg.getDsdlSignature();
    }

    getNormalizedDefinition() {
        return this.full_name;
    }

    getDataTypeSignature() {
        return this.msg.getDataTypeSignature();
    }

    getMaxBitlen() {
        return this.msg.constructor.MAX_BIT_LEN;
    }

    getMinBitlen() {
        return this.msg.constructor.MIN_BIT_LEN;
    }
}

module.exports = CompoundType;
