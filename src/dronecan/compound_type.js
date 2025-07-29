/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

const Type = require('./type');

function computeSignature(text) {
    return text.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0).toString();
}

function bytesFromCRC64(val) {
    return Buffer.from(val);
}

class Signature {
    constructor(value) {
        this._value = value;
    }
    getValue() {
        return this._value;
    }
    add(bytesBuffer) {
        this._value += bytesBuffer.toString('hex');
    }
}

class CompoundType extends Type {
    static KIND_SERVICE = 0;
    static KIND_MESSAGE = 1;

    constructor(msg, version=null) {
        super(msg.name, Type.CATEGORY_COMPOUND);
        this.default_dtid = msg.id;
        this.version = version;
        this.msg = msg;
        this._data_type_signature = null;
        this.override_signature = null; // Optional override
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

    get unionFieldIndex() {
        return this.msg.unionFieldIndex;
    }

    pack(tao=true) {
        return this.msg.pack(tao);
    }

    _instantiate(...args) {
        return null;
    }

    call(...args) {
        return this._instantiate(...args);
    }

    getDsdlSignatureSourceDefinition() {
        let lines = [];
        lines.push(this.full_name);

        const adjoin = (attrs) => {
            if (attrs.length > 0) {
                lines.push(attrs.map(x => x.getNormalizedDefinition()).join('\n'));
            }
        };

        if (this.kind === CompoundType.KIND_SERVICE) {
            if (this.request_union) {
                lines.push('@union');
            }
            adjoin(this.request_fields);
            lines.push('---');
            if (this.response_union) {
                lines.push('@union');
            }
            adjoin(this.response_fields);
        } else if (this.kind === CompoundType.KIND_MESSAGE) {
            if (this.union) {
                lines.push('@union');
            }
            adjoin(this.fields);
        } else {
            throw new Error(`Compound type of unknown kind [${this.kind}]`);
        }

        return lines.join('\n').replace(/\n{3,}/g, '\n').trim();
    }

    getDsdlSignature() {
        if (this.override_signature !== null) {
            return this.override_signature;
        }
        return computeSignature(this.getDsdlSignatureSourceDefinition());
    }

    getNormalizedDefinition() {
        return this.full_name;
    }

    getDataTypeSignature() {
        if (this._data_type_signature === null) {
            let sig = new Signature(this.getDsdlSignature());
            let fields = (this.kind === CompoundType.KIND_SERVICE)
                ? (this.request_fields.concat(this.response_fields))
                : this.fields;
            for (const field of fields) {
                const fieldSig = field.type.getDataTypeSignature();
                if (fieldSig !== null) {
                    const sigValue = sig.getValue();
                    sig.add(bytesFromCRC64(fieldSig));
                    sig.add(bytesFromCRC64(sigValue));
                }
            }
            this._data_type_signature = sig.getValue();
        }
        return this._data_type_signature;
    }
}

module.exports = CompoundType;