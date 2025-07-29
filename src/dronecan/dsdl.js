// DroneCAN Generated JavaScript bindings via dronecan_dsdljs


const Type = require('./type');
const PrimitiveType = require('./primitive_type');
const ArrayType = require('./array_type');
const CompoundType = require('./compound_type');
const VoidType = require('./void_type');
var Buffer = require('buffer').Buffer;

Buffer.prototype.getBit = function (bitOffset) {
    const byteIndex = Math.floor(bitOffset / 8);
    const bitPosition = bitOffset % 8;

    if (byteIndex >= this.length) {
        throw new RangeError("getBit: bitOffset out of range");
    }

    return (this[byteIndex] >> (7 - bitPosition)) & 1;
};

Buffer.prototype.getBitsString = function (bitOffset, bitlen) {
    if (bitlen <= 0 || bitlen > 64) {
        throw new RangeError("getBits: bitlen out of range, must be 1-64");
    }
    let bitsString = "";

    for (let i = 0; i < bitlen; i++) {
        bitsString += this.getBit(bitOffset + i).toString();
    }

    return bitsString;
};

Buffer.prototype.getBits = function (bitOffset, bitlen) {
    if (bitlen <= 0 || bitlen > 64) {
        throw new RangeError("getBits: bitlen out of range, must be 1-64");
    }
    let bits = new Uint8Array(bitlen);

    for (let i = 0; i < bitlen; i++) {
        bits[i] = this.getBit(bitOffset + i);
    }
    return bits;
}

function bitsToArrayLength(bits) {
    let length = 0;
    for (let i = 0; i < bits.length; i++) {
        length = (length << 1) | bits[i];
    }
    return length;
}

function arrayLengthToBits(length, bitlen) {
    let bits = [];
    for (let i = 0; i < bitlen; i++) {
        bits[bitlen - i - 1] = (length >> i) & 1;
    }
    return bits;
}
// JavaScript binding for dronecan.sensors.hygrometer.Hygrometer
// Auto Generated Code, DO NOT MODIFY
const dronecan_sensors_hygrometer_Hygrometer = class {
    static DTID = 1032;
    static FULL_NAME = 'dronecan.sensors.hygrometer.Hygrometer';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 40;
    static MIN_BIT_LEN = 40;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['temperature'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['humidity'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['temperature'].value = temperature_field.value
        msg.bitOffset += 16;
        let humidity_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['humidity'].value = humidity_field.value
        msg.bitOffset += 16;
        let id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['id'].value = id_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let temperature_bits = this.fields.temperature.pack();
        bits = bits.concat(temperature_bits);
        let humidity_bits = this.fields.humidity.pack();
        bits = bits.concat(humidity_bits);
        let id_bits = this.fields.id.pack();
        bits = bits.concat(id_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['temperature'] = Number(this.fields['temperature'].value);
        obj['humidity'] = Number(this.fields['humidity'].value);
        obj['id'] = Number(this.fields['id'].value);
        obj.getConstant = function(fieldName) {
            const constants = dronecan_sensors_hygrometer_Hygrometer.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_sensors_hygrometer_Hygrometer.DTID;
    }

    get name() {
        return dronecan_sensors_hygrometer_Hygrometer.FULL_NAME;
    }

    get fieldNames() {
        return [
            'temperature',
            'humidity',
            'id',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_sensors_hygrometer_Hygrometer();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 14894257777885144040n;
    }

    getDataTypeSignature() {
        return 14894257777885144040n;
    }

};
module.exports.dronecan_sensors_hygrometer_Hygrometer = dronecan_sensors_hygrometer_Hygrometer;

// JavaScript binding for dronecan.sensors.magnetometer.MagneticFieldStrengthHiRes
// Auto Generated Code, DO NOT MODIFY
const dronecan_sensors_magnetometer_MagneticFieldStrengthHiRes = class {
    static DTID = 1043;
    static FULL_NAME = 'dronecan.sensors.magnetometer.MagneticFieldStrengthHiRes';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 104;
    static MIN_BIT_LEN = 104;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['sensor_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['magnetic_field_ga'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32), ArrayType.MODE_STATIC, 3 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let sensor_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sensor_id'].value = sensor_id_field.value
        msg.bitOffset += 8;
        // Decode static array field magnetic_field_ga
        const magnetic_field_ga_length = 3;
        for (let i = 0; i < magnetic_field_ga_length; i++) {
            msg.fields['magnetic_field_ga'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32));
            msg.bitOffset += 32;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let sensor_id_bits = this.fields.sensor_id.pack();
        bits = bits.concat(sensor_id_bits);
        // Encode static array field magnetic_field_ga
        const magnetic_field_ga_length = 3;
        for (let i = 0; i < magnetic_field_ga_length; i++) {
            let magnetic_field_ga_bits = this.fields.magnetic_field_ga.items[i].pack();
            bits = bits.concat(magnetic_field_ga_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['sensor_id'] = Number(this.fields['sensor_id'].value);
        obj['magnetic_field_ga'] = this.fields['magnetic_field_ga'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = dronecan_sensors_magnetometer_MagneticFieldStrengthHiRes.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_sensors_magnetometer_MagneticFieldStrengthHiRes.DTID;
    }

    get name() {
        return dronecan_sensors_magnetometer_MagneticFieldStrengthHiRes.FULL_NAME;
    }

    get fieldNames() {
        return [
            'sensor_id',
            'magnetic_field_ga',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_sensors_magnetometer_MagneticFieldStrengthHiRes();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 3482386300689983599n;
    }

    getDataTypeSignature() {
        return 3482386300689983599n;
    }

};
module.exports.dronecan_sensors_magnetometer_MagneticFieldStrengthHiRes = dronecan_sensors_magnetometer_MagneticFieldStrengthHiRes;

// JavaScript binding for dronecan.sensors.rpm.RPM
// Auto Generated Code, DO NOT MODIFY
const dronecan_sensors_rpm_RPM = class {
    static DTID = 1045;
    static FULL_NAME = 'dronecan.sensors.rpm.RPM';
    static CONSTANTS = {'flags': {'UNHEALTHY': 1}};
    static MAX_BIT_LEN = 56;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['sensor_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['flags'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['rpm'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let sensor_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sensor_id'].value = sensor_id_field.value
        msg.bitOffset += 8;
        let flags_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['flags'].value = flags_field.value
        msg.bitOffset += 16;
        let rpm_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['rpm'].value = rpm_field.value
        msg.bitOffset += 32;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let sensor_id_bits = this.fields.sensor_id.pack();
        bits = bits.concat(sensor_id_bits);
        let flags_bits = this.fields.flags.pack();
        bits = bits.concat(flags_bits);
        let rpm_bits = this.fields.rpm.pack();
        bits = bits.concat(rpm_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['sensor_id'] = Number(this.fields['sensor_id'].value);
        obj['flags'] = Number(this.fields['flags'].value);
        obj['rpm'] = Number(this.fields['rpm'].value);
        obj.getConstant = function(fieldName) {
            const constants = dronecan_sensors_rpm_RPM.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_sensors_rpm_RPM.DTID;
    }

    get name() {
        return dronecan_sensors_rpm_RPM.FULL_NAME;
    }

    get fieldNames() {
        return [
            'sensor_id',
            'flags',
            'rpm',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_sensors_rpm_RPM();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 1443130729267787495n;
    }

    getDataTypeSignature() {
        return 1443130729267787495n;
    }

};
module.exports.dronecan_sensors_rpm_RPM = dronecan_sensors_rpm_RPM;

// JavaScript binding for dronecan.sensors.rc.RCInput
// Auto Generated Code, DO NOT MODIFY
const dronecan_sensors_rc_RCInput = class {
    static DTID = 1140;
    static FULL_NAME = 'dronecan.sensors.rc.RCInput';
    static CONSTANTS = {'status': {'QUALITY_VALID': 1, 'FAILSAFE': 2}};
    static MAX_BIT_LEN = 418;
    static MIN_BIT_LEN = 28;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['status'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['quality'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 4);
        this.fields['rcin'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 12), ArrayType.MODE_DYNAMIC, 32 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let status_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'].value = status_field.value
        msg.bitOffset += 16;
        let quality_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['quality'].value = quality_field.value
        msg.bitOffset += 8;
        let id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 4), 4, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['id'].value = id_field.value
        msg.bitOffset += 4;
        // Decode dynamic array field rcin
        let rcin_length = 0;
        if (tao) {
            rcin_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 12);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                rcin_length = bitsToArrayLength(data.getBits(msg.bitOffset, 6));
                msg.bitOffset += 6;
            } else {
                throw new RangeError('Array length exceeds maximum size: 32');
            }
        }
        if (rcin_length > 32) {
            throw new RangeError('rcin_length length exceeds maximum size: 32');
        }
        for (let i = 0; i < rcin_length; i++) {
            msg.fields['rcin'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 12), 12, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 12;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let status_bits = this.fields.status.pack();
        bits = bits.concat(status_bits);
        let quality_bits = this.fields.quality.pack();
        bits = bits.concat(quality_bits);
        let id_bits = this.fields.id.pack();
        bits = bits.concat(id_bits);
        // Encode dynamic array field rcin
        const rcin_length = this.fields.rcin.length;
        if (this.fields.rcin.length > rcin_length) {
            throw new Error(`Array length of rcin exceeds maximum length of rcin_length`);
        }
        if (!tao) {
           let rcin_length_bits = arrayLengthToBits(this.fields.rcin.length, 6);
           bits = bits.concat(rcin_length_bits);
        }
        for (let i = 0; i < rcin_length; i++) {
            let rcin_bits = this.fields.rcin.items[i].pack();
            bits = bits.concat(rcin_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['status'] = Number(this.fields['status'].value);
        obj['quality'] = Number(this.fields['quality'].value);
        obj['id'] = Number(this.fields['id'].value);
        obj['rcin'] = this.fields['rcin'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = dronecan_sensors_rc_RCInput.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_sensors_rc_RCInput.DTID;
    }

    get name() {
        return dronecan_sensors_rc_RCInput.FULL_NAME;
    }

    get fieldNames() {
        return [
            'status',
            'quality',
            'id',
            'rcin',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_sensors_rc_RCInput();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 8580859109587989711n;
    }

    getDataTypeSignature() {
        return 8580859109587989711n;
    }

};
module.exports.dronecan_sensors_rc_RCInput = dronecan_sensors_rc_RCInput;

// JavaScript binding for dronecan.protocol.FlexDebug
// Auto Generated Code, DO NOT MODIFY
const dronecan_protocol_FlexDebug = class {
    static DTID = 16371;
    static FULL_NAME = 'dronecan.protocol.FlexDebug';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 2064;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['u8'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 255 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['id'].value = id_field.value
        msg.bitOffset += 16;
        // Decode dynamic array field u8
        let u8_length = 0;
        if (tao) {
            u8_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                u8_length = bitsToArrayLength(data.getBits(msg.bitOffset, 8));
                msg.bitOffset += 8;
            } else {
                throw new RangeError('Array length exceeds maximum size: 255');
            }
        }
        if (u8_length > 255) {
            throw new RangeError('u8_length length exceeds maximum size: 255');
        }
        for (let i = 0; i < u8_length; i++) {
            msg.fields['u8'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let id_bits = this.fields.id.pack();
        bits = bits.concat(id_bits);
        // Encode dynamic array field u8
        const u8_length = this.fields.u8.length;
        if (this.fields.u8.length > u8_length) {
            throw new Error(`Array length of u8 exceeds maximum length of u8_length`);
        }
        if (!tao) {
           let u8_length_bits = arrayLengthToBits(this.fields.u8.length, 8);
           bits = bits.concat(u8_length_bits);
        }
        for (let i = 0; i < u8_length; i++) {
            let u8_bits = this.fields.u8.items[i].pack();
            bits = bits.concat(u8_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['id'] = Number(this.fields['id'].value);
        obj['u8'] = this.fields['u8'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = dronecan_protocol_FlexDebug.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_protocol_FlexDebug.DTID;
    }

    get name() {
        return dronecan_protocol_FlexDebug.FULL_NAME;
    }

    get fieldNames() {
        return [
            'id',
            'u8',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_protocol_FlexDebug();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 17052320900244016953n;
    }

    getDataTypeSignature() {
        return 17052320900244016953n;
    }

};
module.exports.dronecan_protocol_FlexDebug = dronecan_protocol_FlexDebug;

// JavaScript binding for dronecan.protocol.CanStats
// Auto Generated Code, DO NOT MODIFY
const dronecan_protocol_CanStats = class {
    static DTID = 343;
    static FULL_NAME = 'dronecan.protocol.CanStats';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 200;
    static MIN_BIT_LEN = 200;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['interface'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['tx_requests'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['tx_rejected'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['tx_overflow'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['tx_success'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['tx_timedout'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['tx_abort'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['rx_received'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['rx_overflow'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['rx_errors'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['busoff_errors'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let interface_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['interface'].value = interface_field.value
        msg.bitOffset += 8;
        let tx_requests_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tx_requests'].value = tx_requests_field.value
        msg.bitOffset += 32;
        let tx_rejected_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tx_rejected'].value = tx_rejected_field.value
        msg.bitOffset += 16;
        let tx_overflow_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tx_overflow'].value = tx_overflow_field.value
        msg.bitOffset += 16;
        let tx_success_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tx_success'].value = tx_success_field.value
        msg.bitOffset += 16;
        let tx_timedout_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tx_timedout'].value = tx_timedout_field.value
        msg.bitOffset += 16;
        let tx_abort_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tx_abort'].value = tx_abort_field.value
        msg.bitOffset += 16;
        let rx_received_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_received'].value = rx_received_field.value
        msg.bitOffset += 32;
        let rx_overflow_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_overflow'].value = rx_overflow_field.value
        msg.bitOffset += 16;
        let rx_errors_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_errors'].value = rx_errors_field.value
        msg.bitOffset += 16;
        let busoff_errors_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['busoff_errors'].value = busoff_errors_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let interface_bits = this.fields.interface.pack();
        bits = bits.concat(interface_bits);
        let tx_requests_bits = this.fields.tx_requests.pack();
        bits = bits.concat(tx_requests_bits);
        let tx_rejected_bits = this.fields.tx_rejected.pack();
        bits = bits.concat(tx_rejected_bits);
        let tx_overflow_bits = this.fields.tx_overflow.pack();
        bits = bits.concat(tx_overflow_bits);
        let tx_success_bits = this.fields.tx_success.pack();
        bits = bits.concat(tx_success_bits);
        let tx_timedout_bits = this.fields.tx_timedout.pack();
        bits = bits.concat(tx_timedout_bits);
        let tx_abort_bits = this.fields.tx_abort.pack();
        bits = bits.concat(tx_abort_bits);
        let rx_received_bits = this.fields.rx_received.pack();
        bits = bits.concat(rx_received_bits);
        let rx_overflow_bits = this.fields.rx_overflow.pack();
        bits = bits.concat(rx_overflow_bits);
        let rx_errors_bits = this.fields.rx_errors.pack();
        bits = bits.concat(rx_errors_bits);
        let busoff_errors_bits = this.fields.busoff_errors.pack();
        bits = bits.concat(busoff_errors_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['interface'] = Number(this.fields['interface'].value);
        obj['tx_requests'] = Number(this.fields['tx_requests'].value);
        obj['tx_rejected'] = Number(this.fields['tx_rejected'].value);
        obj['tx_overflow'] = Number(this.fields['tx_overflow'].value);
        obj['tx_success'] = Number(this.fields['tx_success'].value);
        obj['tx_timedout'] = Number(this.fields['tx_timedout'].value);
        obj['tx_abort'] = Number(this.fields['tx_abort'].value);
        obj['rx_received'] = Number(this.fields['rx_received'].value);
        obj['rx_overflow'] = Number(this.fields['rx_overflow'].value);
        obj['rx_errors'] = Number(this.fields['rx_errors'].value);
        obj['busoff_errors'] = Number(this.fields['busoff_errors'].value);
        obj.getConstant = function(fieldName) {
            const constants = dronecan_protocol_CanStats.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_protocol_CanStats.DTID;
    }

    get name() {
        return dronecan_protocol_CanStats.FULL_NAME;
    }

    get fieldNames() {
        return [
            'interface',
            'tx_requests',
            'tx_rejected',
            'tx_overflow',
            'tx_success',
            'tx_timedout',
            'tx_abort',
            'rx_received',
            'rx_overflow',
            'rx_errors',
            'busoff_errors',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_protocol_CanStats();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 14846130114108013685n;
    }

    getDataTypeSignature() {
        return 14846130114108013685n;
    }

};
module.exports.dronecan_protocol_CanStats = dronecan_protocol_CanStats;

// JavaScript binding for dronecan.protocol.Stats
// Auto Generated Code, DO NOT MODIFY
const dronecan_protocol_Stats = class {
    static DTID = 342;
    static FULL_NAME = 'dronecan.protocol.Stats';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 224;
    static MIN_BIT_LEN = 224;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['tx_frames'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['tx_errors'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['rx_frames'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['rx_error_oom'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['rx_error_internal'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['rx_error_missed_start'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['rx_error_wrong_toggle'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['rx_error_short_frame'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['rx_error_bad_crc'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['rx_ignored_wrong_address'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['rx_ignored_not_wanted'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['rx_ignored_unexpected_tid'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let tx_frames_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tx_frames'].value = tx_frames_field.value
        msg.bitOffset += 32;
        let tx_errors_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tx_errors'].value = tx_errors_field.value
        msg.bitOffset += 16;
        let rx_frames_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_frames'].value = rx_frames_field.value
        msg.bitOffset += 32;
        let rx_error_oom_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_error_oom'].value = rx_error_oom_field.value
        msg.bitOffset += 16;
        let rx_error_internal_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_error_internal'].value = rx_error_internal_field.value
        msg.bitOffset += 16;
        let rx_error_missed_start_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_error_missed_start'].value = rx_error_missed_start_field.value
        msg.bitOffset += 16;
        let rx_error_wrong_toggle_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_error_wrong_toggle'].value = rx_error_wrong_toggle_field.value
        msg.bitOffset += 16;
        let rx_error_short_frame_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_error_short_frame'].value = rx_error_short_frame_field.value
        msg.bitOffset += 16;
        let rx_error_bad_crc_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_error_bad_crc'].value = rx_error_bad_crc_field.value
        msg.bitOffset += 16;
        let rx_ignored_wrong_address_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_ignored_wrong_address'].value = rx_ignored_wrong_address_field.value
        msg.bitOffset += 16;
        let rx_ignored_not_wanted_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_ignored_not_wanted'].value = rx_ignored_not_wanted_field.value
        msg.bitOffset += 16;
        let rx_ignored_unexpected_tid_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_ignored_unexpected_tid'].value = rx_ignored_unexpected_tid_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let tx_frames_bits = this.fields.tx_frames.pack();
        bits = bits.concat(tx_frames_bits);
        let tx_errors_bits = this.fields.tx_errors.pack();
        bits = bits.concat(tx_errors_bits);
        let rx_frames_bits = this.fields.rx_frames.pack();
        bits = bits.concat(rx_frames_bits);
        let rx_error_oom_bits = this.fields.rx_error_oom.pack();
        bits = bits.concat(rx_error_oom_bits);
        let rx_error_internal_bits = this.fields.rx_error_internal.pack();
        bits = bits.concat(rx_error_internal_bits);
        let rx_error_missed_start_bits = this.fields.rx_error_missed_start.pack();
        bits = bits.concat(rx_error_missed_start_bits);
        let rx_error_wrong_toggle_bits = this.fields.rx_error_wrong_toggle.pack();
        bits = bits.concat(rx_error_wrong_toggle_bits);
        let rx_error_short_frame_bits = this.fields.rx_error_short_frame.pack();
        bits = bits.concat(rx_error_short_frame_bits);
        let rx_error_bad_crc_bits = this.fields.rx_error_bad_crc.pack();
        bits = bits.concat(rx_error_bad_crc_bits);
        let rx_ignored_wrong_address_bits = this.fields.rx_ignored_wrong_address.pack();
        bits = bits.concat(rx_ignored_wrong_address_bits);
        let rx_ignored_not_wanted_bits = this.fields.rx_ignored_not_wanted.pack();
        bits = bits.concat(rx_ignored_not_wanted_bits);
        let rx_ignored_unexpected_tid_bits = this.fields.rx_ignored_unexpected_tid.pack();
        bits = bits.concat(rx_ignored_unexpected_tid_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['tx_frames'] = Number(this.fields['tx_frames'].value);
        obj['tx_errors'] = Number(this.fields['tx_errors'].value);
        obj['rx_frames'] = Number(this.fields['rx_frames'].value);
        obj['rx_error_oom'] = Number(this.fields['rx_error_oom'].value);
        obj['rx_error_internal'] = Number(this.fields['rx_error_internal'].value);
        obj['rx_error_missed_start'] = Number(this.fields['rx_error_missed_start'].value);
        obj['rx_error_wrong_toggle'] = Number(this.fields['rx_error_wrong_toggle'].value);
        obj['rx_error_short_frame'] = Number(this.fields['rx_error_short_frame'].value);
        obj['rx_error_bad_crc'] = Number(this.fields['rx_error_bad_crc'].value);
        obj['rx_ignored_wrong_address'] = Number(this.fields['rx_ignored_wrong_address'].value);
        obj['rx_ignored_not_wanted'] = Number(this.fields['rx_ignored_not_wanted'].value);
        obj['rx_ignored_unexpected_tid'] = Number(this.fields['rx_ignored_unexpected_tid'].value);
        obj.getConstant = function(fieldName) {
            const constants = dronecan_protocol_Stats.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_protocol_Stats.DTID;
    }

    get name() {
        return dronecan_protocol_Stats.FULL_NAME;
    }

    get fieldNames() {
        return [
            'tx_frames',
            'tx_errors',
            'rx_frames',
            'rx_error_oom',
            'rx_error_internal',
            'rx_error_missed_start',
            'rx_error_wrong_toggle',
            'rx_error_short_frame',
            'rx_error_bad_crc',
            'rx_ignored_wrong_address',
            'rx_ignored_not_wanted',
            'rx_ignored_unexpected_tid',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_protocol_Stats();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 8519372027382397137n;
    }

    getDataTypeSignature() {
        return 8519372027382397137n;
    }

};
module.exports.dronecan_protocol_Stats = dronecan_protocol_Stats;

// JavaScript binding for dronecan.remoteid.System
// Auto Generated Code, DO NOT MODIFY
const dronecan_remoteid_System = class {
    static DTID = 20033;
    static FULL_NAME = 'dronecan.remoteid.System';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 421;
    static MIN_BIT_LEN = 256;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['id_or_mac'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 20 );
        this.fields['operator_location_type'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['classification_type'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['operator_latitude'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 32);
        this.fields['operator_longitude'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 32);
        this.fields['area_count'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['area_radius'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['area_ceiling'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['area_floor'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['category_eu'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['class_eu'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['operator_altitude_geo'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['timestamp'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field id_or_mac
        let id_or_mac_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            id_or_mac_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
            msg.bitOffset += 5;
        } else {
            throw new RangeError('Array length exceeds maximum size: 20');
        }
        if (id_or_mac_length > 20) {
            throw new RangeError('id_or_mac_length length exceeds maximum size: 20');
        }
        for (let i = 0; i < id_or_mac_length; i++) {
            msg.fields['id_or_mac'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        let operator_location_type_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['operator_location_type'].value = operator_location_type_field.value
        msg.bitOffset += 8;
        let classification_type_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['classification_type'].value = classification_type_field.value
        msg.bitOffset += 8;
        let operator_latitude_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['operator_latitude'].value = operator_latitude_field.value
        msg.bitOffset += 32;
        let operator_longitude_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['operator_longitude'].value = operator_longitude_field.value
        msg.bitOffset += 32;
        let area_count_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['area_count'].value = area_count_field.value
        msg.bitOffset += 16;
        let area_radius_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['area_radius'].value = area_radius_field.value
        msg.bitOffset += 16;
        let area_ceiling_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['area_ceiling'].value = area_ceiling_field.value
        msg.bitOffset += 32;
        let area_floor_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['area_floor'].value = area_floor_field.value
        msg.bitOffset += 32;
        let category_eu_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['category_eu'].value = category_eu_field.value
        msg.bitOffset += 8;
        let class_eu_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['class_eu'].value = class_eu_field.value
        msg.bitOffset += 8;
        let operator_altitude_geo_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['operator_altitude_geo'].value = operator_altitude_geo_field.value
        msg.bitOffset += 32;
        let timestamp_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['timestamp'].value = timestamp_field.value
        msg.bitOffset += 32;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field id_or_mac
        const id_or_mac_length = this.fields.id_or_mac.length;
        if (this.fields.id_or_mac.length > id_or_mac_length) {
            throw new Error(`Array length of id_or_mac exceeds maximum length of id_or_mac_length`);
        }
        let id_or_mac_length_bits = arrayLengthToBits(this.fields.id_or_mac.length, 5);
        bits = bits.concat(id_or_mac_length_bits);
        for (let i = 0; i < id_or_mac_length; i++) {
            let id_or_mac_bits = this.fields.id_or_mac.items[i].pack();
            bits = bits.concat(id_or_mac_bits);
        }

        let operator_location_type_bits = this.fields.operator_location_type.pack();
        bits = bits.concat(operator_location_type_bits);
        let classification_type_bits = this.fields.classification_type.pack();
        bits = bits.concat(classification_type_bits);
        let operator_latitude_bits = this.fields.operator_latitude.pack();
        bits = bits.concat(operator_latitude_bits);
        let operator_longitude_bits = this.fields.operator_longitude.pack();
        bits = bits.concat(operator_longitude_bits);
        let area_count_bits = this.fields.area_count.pack();
        bits = bits.concat(area_count_bits);
        let area_radius_bits = this.fields.area_radius.pack();
        bits = bits.concat(area_radius_bits);
        let area_ceiling_bits = this.fields.area_ceiling.pack();
        bits = bits.concat(area_ceiling_bits);
        let area_floor_bits = this.fields.area_floor.pack();
        bits = bits.concat(area_floor_bits);
        let category_eu_bits = this.fields.category_eu.pack();
        bits = bits.concat(category_eu_bits);
        let class_eu_bits = this.fields.class_eu.pack();
        bits = bits.concat(class_eu_bits);
        let operator_altitude_geo_bits = this.fields.operator_altitude_geo.pack();
        bits = bits.concat(operator_altitude_geo_bits);
        let timestamp_bits = this.fields.timestamp.pack();
        bits = bits.concat(timestamp_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['id_or_mac'] = this.fields['id_or_mac'].toObj(true);
        obj['operator_location_type'] = Number(this.fields['operator_location_type'].value);
        obj['classification_type'] = Number(this.fields['classification_type'].value);
        obj['operator_latitude'] = Number(this.fields['operator_latitude'].value);
        obj['operator_longitude'] = Number(this.fields['operator_longitude'].value);
        obj['area_count'] = Number(this.fields['area_count'].value);
        obj['area_radius'] = Number(this.fields['area_radius'].value);
        obj['area_ceiling'] = Number(this.fields['area_ceiling'].value);
        obj['area_floor'] = Number(this.fields['area_floor'].value);
        obj['category_eu'] = Number(this.fields['category_eu'].value);
        obj['class_eu'] = Number(this.fields['class_eu'].value);
        obj['operator_altitude_geo'] = Number(this.fields['operator_altitude_geo'].value);
        obj['timestamp'] = Number(this.fields['timestamp'].value);
        obj.getConstant = function(fieldName) {
            const constants = dronecan_remoteid_System.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_remoteid_System.DTID;
    }

    get name() {
        return dronecan_remoteid_System.FULL_NAME;
    }

    get fieldNames() {
        return [
            'id_or_mac',
            'operator_location_type',
            'classification_type',
            'operator_latitude',
            'operator_longitude',
            'area_count',
            'area_radius',
            'area_ceiling',
            'area_floor',
            'category_eu',
            'class_eu',
            'operator_altitude_geo',
            'timestamp',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_remoteid_System();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 11153290872097023031n;
    }

    getDataTypeSignature() {
        return 11153290872097023031n;
    }

};
module.exports.dronecan_remoteid_System = dronecan_remoteid_System;

// JavaScript binding for dronecan.remoteid.OperatorID
// Auto Generated Code, DO NOT MODIFY
const dronecan_remoteid_OperatorID = class {
    static DTID = 20034;
    static FULL_NAME = 'dronecan.remoteid.OperatorID';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 338;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['id_or_mac'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 20 );
        this.fields['operator_id_type'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['operator_id'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 20 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field id_or_mac
        let id_or_mac_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            id_or_mac_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
            msg.bitOffset += 5;
        } else {
            throw new RangeError('Array length exceeds maximum size: 20');
        }
        if (id_or_mac_length > 20) {
            throw new RangeError('id_or_mac_length length exceeds maximum size: 20');
        }
        for (let i = 0; i < id_or_mac_length; i++) {
            msg.fields['id_or_mac'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        let operator_id_type_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['operator_id_type'].value = operator_id_type_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field operator_id
        let operator_id_length = 0;
        if (tao) {
            operator_id_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                operator_id_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
                msg.bitOffset += 5;
            } else {
                throw new RangeError('Array length exceeds maximum size: 20');
            }
        }
        if (operator_id_length > 20) {
            throw new RangeError('operator_id_length length exceeds maximum size: 20');
        }
        for (let i = 0; i < operator_id_length; i++) {
            msg.fields['operator_id'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field id_or_mac
        const id_or_mac_length = this.fields.id_or_mac.length;
        if (this.fields.id_or_mac.length > id_or_mac_length) {
            throw new Error(`Array length of id_or_mac exceeds maximum length of id_or_mac_length`);
        }
        let id_or_mac_length_bits = arrayLengthToBits(this.fields.id_or_mac.length, 5);
        bits = bits.concat(id_or_mac_length_bits);
        for (let i = 0; i < id_or_mac_length; i++) {
            let id_or_mac_bits = this.fields.id_or_mac.items[i].pack();
            bits = bits.concat(id_or_mac_bits);
        }

        let operator_id_type_bits = this.fields.operator_id_type.pack();
        bits = bits.concat(operator_id_type_bits);
        // Encode dynamic array field operator_id
        const operator_id_length = this.fields.operator_id.length;
        if (this.fields.operator_id.length > operator_id_length) {
            throw new Error(`Array length of operator_id exceeds maximum length of operator_id_length`);
        }
        if (!tao) {
           let operator_id_length_bits = arrayLengthToBits(this.fields.operator_id.length, 5);
           bits = bits.concat(operator_id_length_bits);
        }
        for (let i = 0; i < operator_id_length; i++) {
            let operator_id_bits = this.fields.operator_id.items[i].pack();
            bits = bits.concat(operator_id_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['id_or_mac'] = this.fields['id_or_mac'].toObj(true);
        obj['operator_id_type'] = Number(this.fields['operator_id_type'].value);
        obj['operator_id'] = this.fields['operator_id'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = dronecan_remoteid_OperatorID.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_remoteid_OperatorID.DTID;
    }

    get name() {
        return dronecan_remoteid_OperatorID.FULL_NAME;
    }

    get fieldNames() {
        return [
            'id_or_mac',
            'operator_id_type',
            'operator_id',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_remoteid_OperatorID();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 6349653021344594229n;
    }

    getDataTypeSignature() {
        return 6349653021344594229n;
    }

};
module.exports.dronecan_remoteid_OperatorID = dronecan_remoteid_OperatorID;

// JavaScript binding for dronecan.remoteid.Location
// Auto Generated Code, DO NOT MODIFY
const dronecan_remoteid_Location = class {
    static DTID = 20031;
    static FULL_NAME = 'dronecan.remoteid.Location';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 461;
    static MIN_BIT_LEN = 296;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['id_or_mac'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 20 );
        this.fields['status'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['direction'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['speed_horizontal'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['speed_vertical'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 16);
        this.fields['latitude'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 32);
        this.fields['longitude'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 32);
        this.fields['altitude_barometric'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['altitude_geodetic'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['height_reference'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['height'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['horizontal_accuracy'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['vertical_accuracy'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['barometer_accuracy'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['speed_accuracy'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['timestamp'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['timestamp_accuracy'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field id_or_mac
        let id_or_mac_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            id_or_mac_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
            msg.bitOffset += 5;
        } else {
            throw new RangeError('Array length exceeds maximum size: 20');
        }
        if (id_or_mac_length > 20) {
            throw new RangeError('id_or_mac_length length exceeds maximum size: 20');
        }
        for (let i = 0; i < id_or_mac_length; i++) {
            msg.fields['id_or_mac'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        let status_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'].value = status_field.value
        msg.bitOffset += 8;
        let direction_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['direction'].value = direction_field.value
        msg.bitOffset += 16;
        let speed_horizontal_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['speed_horizontal'].value = speed_horizontal_field.value
        msg.bitOffset += 16;
        let speed_vertical_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['speed_vertical'].value = speed_vertical_field.value
        msg.bitOffset += 16;
        let latitude_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['latitude'].value = latitude_field.value
        msg.bitOffset += 32;
        let longitude_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['longitude'].value = longitude_field.value
        msg.bitOffset += 32;
        let altitude_barometric_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['altitude_barometric'].value = altitude_barometric_field.value
        msg.bitOffset += 32;
        let altitude_geodetic_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['altitude_geodetic'].value = altitude_geodetic_field.value
        msg.bitOffset += 32;
        let height_reference_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_reference'].value = height_reference_field.value
        msg.bitOffset += 8;
        let height_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['height'].value = height_field.value
        msg.bitOffset += 32;
        let horizontal_accuracy_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['horizontal_accuracy'].value = horizontal_accuracy_field.value
        msg.bitOffset += 8;
        let vertical_accuracy_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['vertical_accuracy'].value = vertical_accuracy_field.value
        msg.bitOffset += 8;
        let barometer_accuracy_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['barometer_accuracy'].value = barometer_accuracy_field.value
        msg.bitOffset += 8;
        let speed_accuracy_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['speed_accuracy'].value = speed_accuracy_field.value
        msg.bitOffset += 8;
        let timestamp_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['timestamp'].value = timestamp_field.value
        msg.bitOffset += 32;
        let timestamp_accuracy_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['timestamp_accuracy'].value = timestamp_accuracy_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field id_or_mac
        const id_or_mac_length = this.fields.id_or_mac.length;
        if (this.fields.id_or_mac.length > id_or_mac_length) {
            throw new Error(`Array length of id_or_mac exceeds maximum length of id_or_mac_length`);
        }
        let id_or_mac_length_bits = arrayLengthToBits(this.fields.id_or_mac.length, 5);
        bits = bits.concat(id_or_mac_length_bits);
        for (let i = 0; i < id_or_mac_length; i++) {
            let id_or_mac_bits = this.fields.id_or_mac.items[i].pack();
            bits = bits.concat(id_or_mac_bits);
        }

        let status_bits = this.fields.status.pack();
        bits = bits.concat(status_bits);
        let direction_bits = this.fields.direction.pack();
        bits = bits.concat(direction_bits);
        let speed_horizontal_bits = this.fields.speed_horizontal.pack();
        bits = bits.concat(speed_horizontal_bits);
        let speed_vertical_bits = this.fields.speed_vertical.pack();
        bits = bits.concat(speed_vertical_bits);
        let latitude_bits = this.fields.latitude.pack();
        bits = bits.concat(latitude_bits);
        let longitude_bits = this.fields.longitude.pack();
        bits = bits.concat(longitude_bits);
        let altitude_barometric_bits = this.fields.altitude_barometric.pack();
        bits = bits.concat(altitude_barometric_bits);
        let altitude_geodetic_bits = this.fields.altitude_geodetic.pack();
        bits = bits.concat(altitude_geodetic_bits);
        let height_reference_bits = this.fields.height_reference.pack();
        bits = bits.concat(height_reference_bits);
        let height_bits = this.fields.height.pack();
        bits = bits.concat(height_bits);
        let horizontal_accuracy_bits = this.fields.horizontal_accuracy.pack();
        bits = bits.concat(horizontal_accuracy_bits);
        let vertical_accuracy_bits = this.fields.vertical_accuracy.pack();
        bits = bits.concat(vertical_accuracy_bits);
        let barometer_accuracy_bits = this.fields.barometer_accuracy.pack();
        bits = bits.concat(barometer_accuracy_bits);
        let speed_accuracy_bits = this.fields.speed_accuracy.pack();
        bits = bits.concat(speed_accuracy_bits);
        let timestamp_bits = this.fields.timestamp.pack();
        bits = bits.concat(timestamp_bits);
        let timestamp_accuracy_bits = this.fields.timestamp_accuracy.pack();
        bits = bits.concat(timestamp_accuracy_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['id_or_mac'] = this.fields['id_or_mac'].toObj(true);
        obj['status'] = Number(this.fields['status'].value);
        obj['direction'] = Number(this.fields['direction'].value);
        obj['speed_horizontal'] = Number(this.fields['speed_horizontal'].value);
        obj['speed_vertical'] = Number(this.fields['speed_vertical'].value);
        obj['latitude'] = Number(this.fields['latitude'].value);
        obj['longitude'] = Number(this.fields['longitude'].value);
        obj['altitude_barometric'] = Number(this.fields['altitude_barometric'].value);
        obj['altitude_geodetic'] = Number(this.fields['altitude_geodetic'].value);
        obj['height_reference'] = Number(this.fields['height_reference'].value);
        obj['height'] = Number(this.fields['height'].value);
        obj['horizontal_accuracy'] = Number(this.fields['horizontal_accuracy'].value);
        obj['vertical_accuracy'] = Number(this.fields['vertical_accuracy'].value);
        obj['barometer_accuracy'] = Number(this.fields['barometer_accuracy'].value);
        obj['speed_accuracy'] = Number(this.fields['speed_accuracy'].value);
        obj['timestamp'] = Number(this.fields['timestamp'].value);
        obj['timestamp_accuracy'] = Number(this.fields['timestamp_accuracy'].value);
        obj.getConstant = function(fieldName) {
            const constants = dronecan_remoteid_Location.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_remoteid_Location.DTID;
    }

    get name() {
        return dronecan_remoteid_Location.FULL_NAME;
    }

    get fieldNames() {
        return [
            'id_or_mac',
            'status',
            'direction',
            'speed_horizontal',
            'speed_vertical',
            'latitude',
            'longitude',
            'altitude_barometric',
            'altitude_geodetic',
            'height_reference',
            'height',
            'horizontal_accuracy',
            'vertical_accuracy',
            'barometer_accuracy',
            'speed_accuracy',
            'timestamp',
            'timestamp_accuracy',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_remoteid_Location();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 16907536396236967082n;
    }

    getDataTypeSignature() {
        return 16907536396236967082n;
    }

};
module.exports.dronecan_remoteid_Location = dronecan_remoteid_Location;

// JavaScript binding for dronecan.remoteid.SelfID
// Auto Generated Code, DO NOT MODIFY
const dronecan_remoteid_SelfID = class {
    static DTID = 20032;
    static FULL_NAME = 'dronecan.remoteid.SelfID';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 362;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['id_or_mac'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 20 );
        this.fields['description_type'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['description'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 23 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field id_or_mac
        let id_or_mac_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            id_or_mac_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
            msg.bitOffset += 5;
        } else {
            throw new RangeError('Array length exceeds maximum size: 20');
        }
        if (id_or_mac_length > 20) {
            throw new RangeError('id_or_mac_length length exceeds maximum size: 20');
        }
        for (let i = 0; i < id_or_mac_length; i++) {
            msg.fields['id_or_mac'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        let description_type_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['description_type'].value = description_type_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field description
        let description_length = 0;
        if (tao) {
            description_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                description_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
                msg.bitOffset += 5;
            } else {
                throw new RangeError('Array length exceeds maximum size: 23');
            }
        }
        if (description_length > 23) {
            throw new RangeError('description_length length exceeds maximum size: 23');
        }
        for (let i = 0; i < description_length; i++) {
            msg.fields['description'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field id_or_mac
        const id_or_mac_length = this.fields.id_or_mac.length;
        if (this.fields.id_or_mac.length > id_or_mac_length) {
            throw new Error(`Array length of id_or_mac exceeds maximum length of id_or_mac_length`);
        }
        let id_or_mac_length_bits = arrayLengthToBits(this.fields.id_or_mac.length, 5);
        bits = bits.concat(id_or_mac_length_bits);
        for (let i = 0; i < id_or_mac_length; i++) {
            let id_or_mac_bits = this.fields.id_or_mac.items[i].pack();
            bits = bits.concat(id_or_mac_bits);
        }

        let description_type_bits = this.fields.description_type.pack();
        bits = bits.concat(description_type_bits);
        // Encode dynamic array field description
        const description_length = this.fields.description.length;
        if (this.fields.description.length > description_length) {
            throw new Error(`Array length of description exceeds maximum length of description_length`);
        }
        if (!tao) {
           let description_length_bits = arrayLengthToBits(this.fields.description.length, 5);
           bits = bits.concat(description_length_bits);
        }
        for (let i = 0; i < description_length; i++) {
            let description_bits = this.fields.description.items[i].pack();
            bits = bits.concat(description_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['id_or_mac'] = this.fields['id_or_mac'].toObj(true);
        obj['description_type'] = Number(this.fields['description_type'].value);
        obj['description'] = this.fields['description'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = dronecan_remoteid_SelfID.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_remoteid_SelfID.DTID;
    }

    get name() {
        return dronecan_remoteid_SelfID.FULL_NAME;
    }

    get fieldNames() {
        return [
            'id_or_mac',
            'description_type',
            'description',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_remoteid_SelfID();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 6466748898118902149n;
    }

    getDataTypeSignature() {
        return 6466748898118902149n;
    }

};
module.exports.dronecan_remoteid_SelfID = dronecan_remoteid_SelfID;

// JavaScript binding for dronecan.remoteid.BasicID
// Auto Generated Code, DO NOT MODIFY
const dronecan_remoteid_BasicID = class {
    static DTID = 20030;
    static FULL_NAME = 'dronecan.remoteid.BasicID';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 346;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['id_or_mac'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 20 );
        this.fields['id_type'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['ua_type'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['uas_id'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 20 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field id_or_mac
        let id_or_mac_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            id_or_mac_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
            msg.bitOffset += 5;
        } else {
            throw new RangeError('Array length exceeds maximum size: 20');
        }
        if (id_or_mac_length > 20) {
            throw new RangeError('id_or_mac_length length exceeds maximum size: 20');
        }
        for (let i = 0; i < id_or_mac_length; i++) {
            msg.fields['id_or_mac'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        let id_type_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['id_type'].value = id_type_field.value
        msg.bitOffset += 8;
        let ua_type_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['ua_type'].value = ua_type_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field uas_id
        let uas_id_length = 0;
        if (tao) {
            uas_id_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                uas_id_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
                msg.bitOffset += 5;
            } else {
                throw new RangeError('Array length exceeds maximum size: 20');
            }
        }
        if (uas_id_length > 20) {
            throw new RangeError('uas_id_length length exceeds maximum size: 20');
        }
        for (let i = 0; i < uas_id_length; i++) {
            msg.fields['uas_id'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field id_or_mac
        const id_or_mac_length = this.fields.id_or_mac.length;
        if (this.fields.id_or_mac.length > id_or_mac_length) {
            throw new Error(`Array length of id_or_mac exceeds maximum length of id_or_mac_length`);
        }
        let id_or_mac_length_bits = arrayLengthToBits(this.fields.id_or_mac.length, 5);
        bits = bits.concat(id_or_mac_length_bits);
        for (let i = 0; i < id_or_mac_length; i++) {
            let id_or_mac_bits = this.fields.id_or_mac.items[i].pack();
            bits = bits.concat(id_or_mac_bits);
        }

        let id_type_bits = this.fields.id_type.pack();
        bits = bits.concat(id_type_bits);
        let ua_type_bits = this.fields.ua_type.pack();
        bits = bits.concat(ua_type_bits);
        // Encode dynamic array field uas_id
        const uas_id_length = this.fields.uas_id.length;
        if (this.fields.uas_id.length > uas_id_length) {
            throw new Error(`Array length of uas_id exceeds maximum length of uas_id_length`);
        }
        if (!tao) {
           let uas_id_length_bits = arrayLengthToBits(this.fields.uas_id.length, 5);
           bits = bits.concat(uas_id_length_bits);
        }
        for (let i = 0; i < uas_id_length; i++) {
            let uas_id_bits = this.fields.uas_id.items[i].pack();
            bits = bits.concat(uas_id_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['id_or_mac'] = this.fields['id_or_mac'].toObj(true);
        obj['id_type'] = Number(this.fields['id_type'].value);
        obj['ua_type'] = Number(this.fields['ua_type'].value);
        obj['uas_id'] = this.fields['uas_id'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = dronecan_remoteid_BasicID.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_remoteid_BasicID.DTID;
    }

    get name() {
        return dronecan_remoteid_BasicID.FULL_NAME;
    }

    get fieldNames() {
        return [
            'id_or_mac',
            'id_type',
            'ua_type',
            'uas_id',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_remoteid_BasicID();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 6565230429154034995n;
    }

    getDataTypeSignature() {
        return 6565230429154034995n;
    }

};
module.exports.dronecan_remoteid_BasicID = dronecan_remoteid_BasicID;

// JavaScript binding for dronecan.remoteid.ArmStatus
// Auto Generated Code, DO NOT MODIFY
const dronecan_remoteid_ArmStatus = class {
    static DTID = 20035;
    static FULL_NAME = 'dronecan.remoteid.ArmStatus';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 414;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['status'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['error'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 50 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let status_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'].value = status_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field error
        let error_length = 0;
        if (tao) {
            error_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                error_length = bitsToArrayLength(data.getBits(msg.bitOffset, 6));
                msg.bitOffset += 6;
            } else {
                throw new RangeError('Array length exceeds maximum size: 50');
            }
        }
        if (error_length > 50) {
            throw new RangeError('error_length length exceeds maximum size: 50');
        }
        for (let i = 0; i < error_length; i++) {
            msg.fields['error'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let status_bits = this.fields.status.pack();
        bits = bits.concat(status_bits);
        // Encode dynamic array field error
        const error_length = this.fields.error.length;
        if (this.fields.error.length > error_length) {
            throw new Error(`Array length of error exceeds maximum length of error_length`);
        }
        if (!tao) {
           let error_length_bits = arrayLengthToBits(this.fields.error.length, 6);
           bits = bits.concat(error_length_bits);
        }
        for (let i = 0; i < error_length; i++) {
            let error_bits = this.fields.error.items[i].pack();
            bits = bits.concat(error_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['status'] = Number(this.fields['status'].value);
        obj['error'] = this.fields['error'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = dronecan_remoteid_ArmStatus.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_remoteid_ArmStatus.DTID;
    }

    get name() {
        return dronecan_remoteid_ArmStatus.FULL_NAME;
    }

    get fieldNames() {
        return [
            'status',
            'error',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_remoteid_ArmStatus();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 18365524029972888541n;
    }

    getDataTypeSignature() {
        return 18365524029972888541n;
    }

};
module.exports.dronecan_remoteid_ArmStatus = dronecan_remoteid_ArmStatus;

// JavaScript binding for dronecan.remoteid.SecureCommand
// Auto Generated Code, DO NOT MODIFY
const dronecan_remoteid_SecureCommand_Request = class {
    static DTID = 64;
    static FULL_NAME = 'dronecan.remoteid.SecureCommand';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1840;
    static MIN_BIT_LEN = 72;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['sequence'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['operation'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['sig_length'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['data'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 220 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let sequence_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sequence'].value = sequence_field.value
        msg.bitOffset += 32;
        let operation_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['operation'].value = operation_field.value
        msg.bitOffset += 32;
        let sig_length_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sig_length'].value = sig_length_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field data
        let data_length = 0;
        if (tao) {
            data_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                data_length = bitsToArrayLength(data.getBits(msg.bitOffset, 8));
                msg.bitOffset += 8;
            } else {
                throw new RangeError('Array length exceeds maximum size: 220');
            }
        }
        if (data_length > 220) {
            throw new RangeError('data_length length exceeds maximum size: 220');
        }
        for (let i = 0; i < data_length; i++) {
            msg.fields['data'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let sequence_bits = this.fields.sequence.pack();
        bits = bits.concat(sequence_bits);
        let operation_bits = this.fields.operation.pack();
        bits = bits.concat(operation_bits);
        let sig_length_bits = this.fields.sig_length.pack();
        bits = bits.concat(sig_length_bits);
        // Encode dynamic array field data
        const data_length = this.fields.data.length;
        if (this.fields.data.length > data_length) {
            throw new Error(`Array length of data exceeds maximum length of data_length`);
        }
        if (!tao) {
           let data_length_bits = arrayLengthToBits(this.fields.data.length, 8);
           bits = bits.concat(data_length_bits);
        }
        for (let i = 0; i < data_length; i++) {
            let data_bits = this.fields.data.items[i].pack();
            bits = bits.concat(data_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['sequence'] = Number(this.fields['sequence'].value);
        obj['operation'] = Number(this.fields['operation'].value);
        obj['sig_length'] = Number(this.fields['sig_length'].value);
        obj['data'] = this.fields['data'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = dronecan_remoteid_SecureCommand_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_remoteid_SecureCommand_Request.DTID;
    }

    get name() {
        return dronecan_remoteid_SecureCommand_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'sequence',
            'operation',
            'sig_length',
            'data',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_remoteid_SecureCommand_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 1326951972074064855n;
    }

    getDataTypeSignature() {
        return 1326951972074064855n;
    }

};
module.exports.dronecan_remoteid_SecureCommand_Request = dronecan_remoteid_SecureCommand_Request;

// JavaScript binding for dronecan.remoteid.SecureCommand
// Auto Generated Code, DO NOT MODIFY
const dronecan_remoteid_SecureCommand_Response = class {
    static DTID = 64;
    static FULL_NAME = 'dronecan.remoteid.SecureCommand';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1840;
    static MIN_BIT_LEN = 72;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['sequence'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['operation'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['result'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['data'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 220 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let sequence_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sequence'].value = sequence_field.value
        msg.bitOffset += 32;
        let operation_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['operation'].value = operation_field.value
        msg.bitOffset += 32;
        let result_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['result'].value = result_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field data
        let data_length = 0;
        if (tao) {
            data_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                data_length = bitsToArrayLength(data.getBits(msg.bitOffset, 8));
                msg.bitOffset += 8;
            } else {
                throw new RangeError('Array length exceeds maximum size: 220');
            }
        }
        if (data_length > 220) {
            throw new RangeError('data_length length exceeds maximum size: 220');
        }
        for (let i = 0; i < data_length; i++) {
            msg.fields['data'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let sequence_bits = this.fields.sequence.pack();
        bits = bits.concat(sequence_bits);
        let operation_bits = this.fields.operation.pack();
        bits = bits.concat(operation_bits);
        let result_bits = this.fields.result.pack();
        bits = bits.concat(result_bits);
        // Encode dynamic array field data
        const data_length = this.fields.data.length;
        if (this.fields.data.length > data_length) {
            throw new Error(`Array length of data exceeds maximum length of data_length`);
        }
        if (!tao) {
           let data_length_bits = arrayLengthToBits(this.fields.data.length, 8);
           bits = bits.concat(data_length_bits);
        }
        for (let i = 0; i < data_length; i++) {
            let data_bits = this.fields.data.items[i].pack();
            bits = bits.concat(data_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['sequence'] = Number(this.fields['sequence'].value);
        obj['operation'] = Number(this.fields['operation'].value);
        obj['result'] = Number(this.fields['result'].value);
        obj['data'] = this.fields['data'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = dronecan_remoteid_SecureCommand_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_remoteid_SecureCommand_Response.DTID;
    }

    get name() {
        return dronecan_remoteid_SecureCommand_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'sequence',
            'operation',
            'result',
            'data',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_remoteid_SecureCommand_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 1326951972074064855n;
    }

    getDataTypeSignature() {
        return 1326951972074064855n;
    }

};
module.exports.dronecan_remoteid_SecureCommand_Response = dronecan_remoteid_SecureCommand_Response;

// JavaScript binding for ardupilot.indication.Button
// Auto Generated Code, DO NOT MODIFY
const ardupilot_indication_Button = class {
    static DTID = 20001;
    static FULL_NAME = 'ardupilot.indication.Button';
    static CONSTANTS = {'button': {'SAFETY': 1}};
    static MAX_BIT_LEN = 16;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['button'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['press_time'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let button_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['button'].value = button_field.value
        msg.bitOffset += 8;
        let press_time_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['press_time'].value = press_time_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let button_bits = this.fields.button.pack();
        bits = bits.concat(button_bits);
        let press_time_bits = this.fields.press_time.pack();
        bits = bits.concat(press_time_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['button'] = Number(this.fields['button'].value);
        obj['press_time'] = Number(this.fields['press_time'].value);
        obj.getConstant = function(fieldName) {
            const constants = ardupilot_indication_Button.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return ardupilot_indication_Button.DTID;
    }

    get name() {
        return ardupilot_indication_Button.FULL_NAME;
    }

    get fieldNames() {
        return [
            'button',
            'press_time',
        ];
    }

    static sampleMessage() {
        const msg = new ardupilot_indication_Button();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 451948134196004462n;
    }

    getDataTypeSignature() {
        return 451948134196004462n;
    }

};
module.exports.ardupilot_indication_Button = ardupilot_indication_Button;

// JavaScript binding for ardupilot.indication.SafetyState
// Auto Generated Code, DO NOT MODIFY
const ardupilot_indication_SafetyState = class {
    static DTID = 20000;
    static FULL_NAME = 'ardupilot.indication.SafetyState';
    static CONSTANTS = {'status': {'STATUS_SAFETY_ON': 0, 'STATUS_SAFETY_OFF': 255}};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['status'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let status_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'].value = status_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let status_bits = this.fields.status.pack();
        bits = bits.concat(status_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['status'] = Number(this.fields['status'].value);
        obj.getConstant = function(fieldName) {
            const constants = ardupilot_indication_SafetyState.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return ardupilot_indication_SafetyState.DTID;
    }

    get name() {
        return ardupilot_indication_SafetyState.FULL_NAME;
    }

    get fieldNames() {
        return [
            'status',
        ];
    }

    static sampleMessage() {
        const msg = new ardupilot_indication_SafetyState();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 16817971642966845089n;
    }

    getDataTypeSignature() {
        return 16817971642966845089n;
    }

};
module.exports.ardupilot_indication_SafetyState = ardupilot_indication_SafetyState;

// JavaScript binding for ardupilot.indication.NotifyState
// Auto Generated Code, DO NOT MODIFY
const ardupilot_indication_NotifyState = class {
    static DTID = 20007;
    static FULL_NAME = 'ardupilot.indication.NotifyState';
    static CONSTANTS = {'vehicle_state': {'INITIALISING': 0, 'ARMED': 1, 'FLYING': 2, 'PREARM': 3, 'PREARM_GPS': 4, 'SAVE_TRIM': 5, 'ESC_CALIBRATION': 6, 'FAILSAFE_RADIO': 7, 'FAILSAFE_BATT': 8, 'FAILSAFE_GCS': 9, 'CHUTE_RELEASED': 10, 'EKF_BAD': 11, 'FW_UPDATE': 12, 'MAGCAL_RUN': 13, 'LEAK_DET': 14, 'GPS_FUSION': 15, 'GPS_GLITCH': 16, 'POS_ABS_AVAIL': 17, 'LOST': 18, 'THROW_READY': 19, 'POWERING_OFF': 20, 'VIDEO_RECORDING': 21, 'IS_LANDING': 22, 'IS_TAKING_OFF': 23}};
    static MAX_BIT_LEN = 2120;
    static MIN_BIT_LEN = 72;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['aux_data_type'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['aux_data'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 255 );
        this.fields['vehicle_state'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 64);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let aux_data_type_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['aux_data_type'].value = aux_data_type_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field aux_data
        let aux_data_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            aux_data_length = bitsToArrayLength(data.getBits(msg.bitOffset, 8));
            msg.bitOffset += 8;
        } else {
            throw new RangeError('Array length exceeds maximum size: 255');
        }
        if (aux_data_length > 255) {
            throw new RangeError('aux_data_length length exceeds maximum size: 255');
        }
        for (let i = 0; i < aux_data_length; i++) {
            msg.fields['aux_data'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        let vehicle_state_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 64), 64, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['vehicle_state'].value = vehicle_state_field.value
        msg.bitOffset += 64;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let aux_data_type_bits = this.fields.aux_data_type.pack();
        bits = bits.concat(aux_data_type_bits);
        // Encode dynamic array field aux_data
        const aux_data_length = this.fields.aux_data.length;
        if (this.fields.aux_data.length > aux_data_length) {
            throw new Error(`Array length of aux_data exceeds maximum length of aux_data_length`);
        }
        let aux_data_length_bits = arrayLengthToBits(this.fields.aux_data.length, 8);
        bits = bits.concat(aux_data_length_bits);
        for (let i = 0; i < aux_data_length; i++) {
            let aux_data_bits = this.fields.aux_data.items[i].pack();
            bits = bits.concat(aux_data_bits);
        }

        let vehicle_state_bits = this.fields.vehicle_state.pack();
        bits = bits.concat(vehicle_state_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['aux_data_type'] = Number(this.fields['aux_data_type'].value);
        obj['aux_data'] = this.fields['aux_data'].toObj(true);
        obj['vehicle_state'] = Number(this.fields['vehicle_state'].value);
        obj.getConstant = function(fieldName) {
            const constants = ardupilot_indication_NotifyState.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return ardupilot_indication_NotifyState.DTID;
    }

    get name() {
        return ardupilot_indication_NotifyState.FULL_NAME;
    }

    get fieldNames() {
        return [
            'aux_data_type',
            'aux_data',
            'vehicle_state',
        ];
    }

    static sampleMessage() {
        const msg = new ardupilot_indication_NotifyState();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 7142474383910632940n;
    }

    getDataTypeSignature() {
        return 7142474383910632940n;
    }

};
module.exports.ardupilot_indication_NotifyState = ardupilot_indication_NotifyState;

// JavaScript binding for ardupilot.gnss.MovingBaselineData
// Auto Generated Code, DO NOT MODIFY
const ardupilot_gnss_MovingBaselineData = class {
    static DTID = 20005;
    static FULL_NAME = 'ardupilot.gnss.MovingBaselineData';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 2409;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['data'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 300 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field data
        let data_length = 0;
        if (tao) {
            data_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                data_length = bitsToArrayLength(data.getBits(msg.bitOffset, 9));
                msg.bitOffset += 9;
            } else {
                throw new RangeError('Array length exceeds maximum size: 300');
            }
        }
        if (data_length > 300) {
            throw new RangeError('data_length length exceeds maximum size: 300');
        }
        for (let i = 0; i < data_length; i++) {
            msg.fields['data'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field data
        const data_length = this.fields.data.length;
        if (this.fields.data.length > data_length) {
            throw new Error(`Array length of data exceeds maximum length of data_length`);
        }
        if (!tao) {
           let data_length_bits = arrayLengthToBits(this.fields.data.length, 9);
           bits = bits.concat(data_length_bits);
        }
        for (let i = 0; i < data_length; i++) {
            let data_bits = this.fields.data.items[i].pack();
            bits = bits.concat(data_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['data'] = this.fields['data'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = ardupilot_gnss_MovingBaselineData.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return ardupilot_gnss_MovingBaselineData.DTID;
    }

    get name() {
        return ardupilot_gnss_MovingBaselineData.FULL_NAME;
    }

    get fieldNames() {
        return [
            'data',
        ];
    }

    static sampleMessage() {
        const msg = new ardupilot_gnss_MovingBaselineData();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 716955749157311290n;
    }

    getDataTypeSignature() {
        return 716955749157311290n;
    }

};
module.exports.ardupilot_gnss_MovingBaselineData = ardupilot_gnss_MovingBaselineData;

// JavaScript binding for ardupilot.gnss.Heading
// Auto Generated Code, DO NOT MODIFY
const ardupilot_gnss_Heading = class {
    static DTID = 20002;
    static FULL_NAME = 'ardupilot.gnss.Heading';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 34;
    static MIN_BIT_LEN = 34;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['heading_valid'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['heading_accuracy_valid'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['heading_rad'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['heading_accuracy_rad'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let heading_valid_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['heading_valid'].value = heading_valid_field.value
        msg.bitOffset += 1;
        let heading_accuracy_valid_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['heading_accuracy_valid'].value = heading_accuracy_valid_field.value
        msg.bitOffset += 1;
        let heading_rad_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['heading_rad'].value = heading_rad_field.value
        msg.bitOffset += 16;
        let heading_accuracy_rad_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['heading_accuracy_rad'].value = heading_accuracy_rad_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let heading_valid_bits = this.fields.heading_valid.pack();
        bits = bits.concat(heading_valid_bits);
        let heading_accuracy_valid_bits = this.fields.heading_accuracy_valid.pack();
        bits = bits.concat(heading_accuracy_valid_bits);
        let heading_rad_bits = this.fields.heading_rad.pack();
        bits = bits.concat(heading_rad_bits);
        let heading_accuracy_rad_bits = this.fields.heading_accuracy_rad.pack();
        bits = bits.concat(heading_accuracy_rad_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['heading_valid'] = Number(this.fields['heading_valid'].value);
        obj['heading_accuracy_valid'] = Number(this.fields['heading_accuracy_valid'].value);
        obj['heading_rad'] = Number(this.fields['heading_rad'].value);
        obj['heading_accuracy_rad'] = Number(this.fields['heading_accuracy_rad'].value);
        obj.getConstant = function(fieldName) {
            const constants = ardupilot_gnss_Heading.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return ardupilot_gnss_Heading.DTID;
    }

    get name() {
        return ardupilot_gnss_Heading.FULL_NAME;
    }

    get fieldNames() {
        return [
            'heading_valid',
            'heading_accuracy_valid',
            'heading_rad',
            'heading_accuracy_rad',
        ];
    }

    static sampleMessage() {
        const msg = new ardupilot_gnss_Heading();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 3556909369527186450n;
    }

    getDataTypeSignature() {
        return 3556909369527186450n;
    }

};
module.exports.ardupilot_gnss_Heading = ardupilot_gnss_Heading;

// JavaScript binding for ardupilot.gnss.RelPosHeading
// Auto Generated Code, DO NOT MODIFY
const ardupilot_gnss_RelPosHeading = class {
    static DTID = 20006;
    static FULL_NAME = 'ardupilot.gnss.RelPosHeading';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 153;
    static MIN_BIT_LEN = 153;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['timestamp'] = new CompoundType(uavcan_Timestamp.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['reported_heading_acc_available'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['reported_heading_deg'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['reported_heading_acc_deg'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['relative_distance_m'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['relative_down_pos_m'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let timestampMsg = uavcan_Timestamp.unpack(data, false, msg.bitOffset)
        msg.fields['timestamp'].msg = timestampMsg;
        msg.bitOffset = timestampMsg.bitOffset;
        let reported_heading_acc_available_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['reported_heading_acc_available'].value = reported_heading_acc_available_field.value
        msg.bitOffset += 1;
        let reported_heading_deg_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['reported_heading_deg'].value = reported_heading_deg_field.value
        msg.bitOffset += 32;
        let reported_heading_acc_deg_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['reported_heading_acc_deg'].value = reported_heading_acc_deg_field.value
        msg.bitOffset += 32;
        let relative_distance_m_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['relative_distance_m'].value = relative_distance_m_field.value
        msg.bitOffset += 16;
        let relative_down_pos_m_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['relative_down_pos_m'].value = relative_down_pos_m_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let timestampMsg_bits = this.fields.timestamp.pack(false);
        bits = bits.concat(timestampMsg_bits);
        let reported_heading_acc_available_bits = this.fields.reported_heading_acc_available.pack();
        bits = bits.concat(reported_heading_acc_available_bits);
        let reported_heading_deg_bits = this.fields.reported_heading_deg.pack();
        bits = bits.concat(reported_heading_deg_bits);
        let reported_heading_acc_deg_bits = this.fields.reported_heading_acc_deg.pack();
        bits = bits.concat(reported_heading_acc_deg_bits);
        let relative_distance_m_bits = this.fields.relative_distance_m.pack();
        bits = bits.concat(relative_distance_m_bits);
        let relative_down_pos_m_bits = this.fields.relative_down_pos_m.pack();
        bits = bits.concat(relative_down_pos_m_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['reported_heading_acc_available'] = Number(this.fields['reported_heading_acc_available'].value);
        obj['reported_heading_deg'] = Number(this.fields['reported_heading_deg'].value);
        obj['reported_heading_acc_deg'] = Number(this.fields['reported_heading_acc_deg'].value);
        obj['relative_distance_m'] = Number(this.fields['relative_distance_m'].value);
        obj['relative_down_pos_m'] = Number(this.fields['relative_down_pos_m'].value);
        obj.getConstant = function(fieldName) {
            const constants = ardupilot_gnss_RelPosHeading.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return ardupilot_gnss_RelPosHeading.DTID;
    }

    get name() {
        return ardupilot_gnss_RelPosHeading.FULL_NAME;
    }

    get fieldNames() {
        return [
            'timestamp',
            'reported_heading_acc_available',
            'reported_heading_deg',
            'reported_heading_acc_deg',
            'relative_distance_m',
            'relative_down_pos_m',
        ];
    }

    static sampleMessage() {
        const msg = new ardupilot_gnss_RelPosHeading();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 11633495969768227960n;
    }

    getDataTypeSignature() {
        return 11633495969768227960n;
    }

};
module.exports.ardupilot_gnss_RelPosHeading = ardupilot_gnss_RelPosHeading;

// JavaScript binding for ardupilot.gnss.Status
// Auto Generated Code, DO NOT MODIFY
const ardupilot_gnss_Status = class {
    static DTID = 20003;
    static FULL_NAME = 'ardupilot.gnss.Status';
    static CONSTANTS = {'status': {'LOGGING': 1, 'ARMABLE': 2}};
    static MAX_BIT_LEN = 56;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['error_codes'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['healthy'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['status'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 23);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let error_codes_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['error_codes'].value = error_codes_field.value
        msg.bitOffset += 32;
        let healthy_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['healthy'].value = healthy_field.value
        msg.bitOffset += 1;
        let status_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 23), 23, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'].value = status_field.value
        msg.bitOffset += 23;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let error_codes_bits = this.fields.error_codes.pack();
        bits = bits.concat(error_codes_bits);
        let healthy_bits = this.fields.healthy.pack();
        bits = bits.concat(healthy_bits);
        let status_bits = this.fields.status.pack();
        bits = bits.concat(status_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['error_codes'] = Number(this.fields['error_codes'].value);
        obj['healthy'] = Number(this.fields['healthy'].value);
        obj['status'] = Number(this.fields['status'].value);
        obj.getConstant = function(fieldName) {
            const constants = ardupilot_gnss_Status.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return ardupilot_gnss_Status.DTID;
    }

    get name() {
        return ardupilot_gnss_Status.FULL_NAME;
    }

    get fieldNames() {
        return [
            'error_codes',
            'healthy',
            'status',
        ];
    }

    static sampleMessage() {
        const msg = new ardupilot_gnss_Status();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 13419799639327014761n;
    }

    getDataTypeSignature() {
        return 13419799639327014761n;
    }

};
module.exports.ardupilot_gnss_Status = ardupilot_gnss_Status;

// JavaScript binding for ardupilot.equipment.power.BatteryContinuous
// Auto Generated Code, DO NOT MODIFY
const ardupilot_equipment_power_BatteryContinuous = class {
    static DTID = 20010;
    static FULL_NAME = 'ardupilot.equipment.power.BatteryContinuous';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 200;
    static MIN_BIT_LEN = 200;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['temperature_cells'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['temperature_pcb'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['temperature_other'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['current'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['voltage'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['state_of_charge'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['slot_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['capacity_consumed'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['status_flags'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let temperature_cells_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['temperature_cells'].value = temperature_cells_field.value
        msg.bitOffset += 16;
        let temperature_pcb_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['temperature_pcb'].value = temperature_pcb_field.value
        msg.bitOffset += 16;
        let temperature_other_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['temperature_other'].value = temperature_other_field.value
        msg.bitOffset += 16;
        let current_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['current'].value = current_field.value
        msg.bitOffset += 32;
        let voltage_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['voltage'].value = voltage_field.value
        msg.bitOffset += 32;
        let state_of_charge_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['state_of_charge'].value = state_of_charge_field.value
        msg.bitOffset += 16;
        let slot_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['slot_id'].value = slot_id_field.value
        msg.bitOffset += 8;
        let capacity_consumed_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['capacity_consumed'].value = capacity_consumed_field.value
        msg.bitOffset += 32;
        let status_flags_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status_flags'].value = status_flags_field.value
        msg.bitOffset += 32;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let temperature_cells_bits = this.fields.temperature_cells.pack();
        bits = bits.concat(temperature_cells_bits);
        let temperature_pcb_bits = this.fields.temperature_pcb.pack();
        bits = bits.concat(temperature_pcb_bits);
        let temperature_other_bits = this.fields.temperature_other.pack();
        bits = bits.concat(temperature_other_bits);
        let current_bits = this.fields.current.pack();
        bits = bits.concat(current_bits);
        let voltage_bits = this.fields.voltage.pack();
        bits = bits.concat(voltage_bits);
        let state_of_charge_bits = this.fields.state_of_charge.pack();
        bits = bits.concat(state_of_charge_bits);
        let slot_id_bits = this.fields.slot_id.pack();
        bits = bits.concat(slot_id_bits);
        let capacity_consumed_bits = this.fields.capacity_consumed.pack();
        bits = bits.concat(capacity_consumed_bits);
        let status_flags_bits = this.fields.status_flags.pack();
        bits = bits.concat(status_flags_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['temperature_cells'] = Number(this.fields['temperature_cells'].value);
        obj['temperature_pcb'] = Number(this.fields['temperature_pcb'].value);
        obj['temperature_other'] = Number(this.fields['temperature_other'].value);
        obj['current'] = Number(this.fields['current'].value);
        obj['voltage'] = Number(this.fields['voltage'].value);
        obj['state_of_charge'] = Number(this.fields['state_of_charge'].value);
        obj['slot_id'] = Number(this.fields['slot_id'].value);
        obj['capacity_consumed'] = Number(this.fields['capacity_consumed'].value);
        obj['status_flags'] = Number(this.fields['status_flags'].value);
        obj.getConstant = function(fieldName) {
            const constants = ardupilot_equipment_power_BatteryContinuous.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return ardupilot_equipment_power_BatteryContinuous.DTID;
    }

    get name() {
        return ardupilot_equipment_power_BatteryContinuous.FULL_NAME;
    }

    get fieldNames() {
        return [
            'temperature_cells',
            'temperature_pcb',
            'temperature_other',
            'current',
            'voltage',
            'state_of_charge',
            'slot_id',
            'capacity_consumed',
            'status_flags',
        ];
    }

    static sampleMessage() {
        const msg = new ardupilot_equipment_power_BatteryContinuous();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 8460950965637735598n;
    }

    getDataTypeSignature() {
        return 8460950965637735598n;
    }

};
module.exports.ardupilot_equipment_power_BatteryContinuous = ardupilot_equipment_power_BatteryContinuous;

// JavaScript binding for ardupilot.equipment.power.BatteryCells
// Auto Generated Code, DO NOT MODIFY
const ardupilot_equipment_power_BatteryCells = class {
    static DTID = 20012;
    static FULL_NAME = 'ardupilot.equipment.power.BatteryCells';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 405;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['voltages'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 24 );
        this.fields['index'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field voltages
        let voltages_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            voltages_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
            msg.bitOffset += 5;
        } else {
            throw new RangeError('Array length exceeds maximum size: 24');
        }
        if (voltages_length > 24) {
            throw new RangeError('voltages_length length exceeds maximum size: 24');
        }
        for (let i = 0; i < voltages_length; i++) {
            msg.fields['voltages'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        let index_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['index'].value = index_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field voltages
        const voltages_length = this.fields.voltages.length;
        if (this.fields.voltages.length > voltages_length) {
            throw new Error(`Array length of voltages exceeds maximum length of voltages_length`);
        }
        let voltages_length_bits = arrayLengthToBits(this.fields.voltages.length, 5);
        bits = bits.concat(voltages_length_bits);
        for (let i = 0; i < voltages_length; i++) {
            let voltages_bits = this.fields.voltages.items[i].pack();
            bits = bits.concat(voltages_bits);
        }

        let index_bits = this.fields.index.pack();
        bits = bits.concat(index_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['voltages'] = this.fields['voltages'].toObj(true);
        obj['index'] = Number(this.fields['index'].value);
        obj.getConstant = function(fieldName) {
            const constants = ardupilot_equipment_power_BatteryCells.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return ardupilot_equipment_power_BatteryCells.DTID;
    }

    get name() {
        return ardupilot_equipment_power_BatteryCells.FULL_NAME;
    }

    get fieldNames() {
        return [
            'voltages',
            'index',
        ];
    }

    static sampleMessage() {
        const msg = new ardupilot_equipment_power_BatteryCells();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 6668453072664596132n;
    }

    getDataTypeSignature() {
        return 6668453072664596132n;
    }

};
module.exports.ardupilot_equipment_power_BatteryCells = ardupilot_equipment_power_BatteryCells;

// JavaScript binding for ardupilot.equipment.power.BatteryInfoAux
// Auto Generated Code, DO NOT MODIFY
const ardupilot_equipment_power_BatteryInfoAux = class {
    static DTID = 20004;
    static FULL_NAME = 'ardupilot.equipment.power.BatteryInfoAux';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 4217;
    static MIN_BIT_LEN = 129;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['timestamp'] = new CompoundType(uavcan_Timestamp.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['voltage_cell'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 255 );
        this.fields['cycle_count'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['over_discharge_count'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['max_current'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['nominal_voltage'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['is_powering_off'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['battery_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let timestampMsg = uavcan_Timestamp.unpack(data, false, msg.bitOffset)
        msg.fields['timestamp'].msg = timestampMsg;
        msg.bitOffset = timestampMsg.bitOffset;
        // Decode dynamic array field voltage_cell
        let voltage_cell_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            voltage_cell_length = bitsToArrayLength(data.getBits(msg.bitOffset, 8));
            msg.bitOffset += 8;
        } else {
            throw new RangeError('Array length exceeds maximum size: 255');
        }
        if (voltage_cell_length > 255) {
            throw new RangeError('voltage_cell_length length exceeds maximum size: 255');
        }
        for (let i = 0; i < voltage_cell_length; i++) {
            msg.fields['voltage_cell'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        let cycle_count_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['cycle_count'].value = cycle_count_field.value
        msg.bitOffset += 16;
        let over_discharge_count_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['over_discharge_count'].value = over_discharge_count_field.value
        msg.bitOffset += 16;
        let max_current_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['max_current'].value = max_current_field.value
        msg.bitOffset += 16;
        let nominal_voltage_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['nominal_voltage'].value = nominal_voltage_field.value
        msg.bitOffset += 16;
        let is_powering_off_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['is_powering_off'].value = is_powering_off_field.value
        msg.bitOffset += 1;
        let battery_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['battery_id'].value = battery_id_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let timestampMsg_bits = this.fields.timestamp.pack(false);
        bits = bits.concat(timestampMsg_bits);
        // Encode dynamic array field voltage_cell
        const voltage_cell_length = this.fields.voltage_cell.length;
        if (this.fields.voltage_cell.length > voltage_cell_length) {
            throw new Error(`Array length of voltage_cell exceeds maximum length of voltage_cell_length`);
        }
        let voltage_cell_length_bits = arrayLengthToBits(this.fields.voltage_cell.length, 8);
        bits = bits.concat(voltage_cell_length_bits);
        for (let i = 0; i < voltage_cell_length; i++) {
            let voltage_cell_bits = this.fields.voltage_cell.items[i].pack();
            bits = bits.concat(voltage_cell_bits);
        }

        let cycle_count_bits = this.fields.cycle_count.pack();
        bits = bits.concat(cycle_count_bits);
        let over_discharge_count_bits = this.fields.over_discharge_count.pack();
        bits = bits.concat(over_discharge_count_bits);
        let max_current_bits = this.fields.max_current.pack();
        bits = bits.concat(max_current_bits);
        let nominal_voltage_bits = this.fields.nominal_voltage.pack();
        bits = bits.concat(nominal_voltage_bits);
        let is_powering_off_bits = this.fields.is_powering_off.pack();
        bits = bits.concat(is_powering_off_bits);
        let battery_id_bits = this.fields.battery_id.pack();
        bits = bits.concat(battery_id_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['voltage_cell'] = this.fields['voltage_cell'].toObj(true);
        obj['cycle_count'] = Number(this.fields['cycle_count'].value);
        obj['over_discharge_count'] = Number(this.fields['over_discharge_count'].value);
        obj['max_current'] = Number(this.fields['max_current'].value);
        obj['nominal_voltage'] = Number(this.fields['nominal_voltage'].value);
        obj['is_powering_off'] = Number(this.fields['is_powering_off'].value);
        obj['battery_id'] = Number(this.fields['battery_id'].value);
        obj.getConstant = function(fieldName) {
            const constants = ardupilot_equipment_power_BatteryInfoAux.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return ardupilot_equipment_power_BatteryInfoAux.DTID;
    }

    get name() {
        return ardupilot_equipment_power_BatteryInfoAux.FULL_NAME;
    }

    get fieldNames() {
        return [
            'timestamp',
            'voltage_cell',
            'cycle_count',
            'over_discharge_count',
            'max_current',
            'nominal_voltage',
            'is_powering_off',
            'battery_id',
        ];
    }

    static sampleMessage() {
        const msg = new ardupilot_equipment_power_BatteryInfoAux();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 9043027925431502978n;
    }

    getDataTypeSignature() {
        return 9043027925431502978n;
    }

};
module.exports.ardupilot_equipment_power_BatteryInfoAux = ardupilot_equipment_power_BatteryInfoAux;

// JavaScript binding for ardupilot.equipment.power.BatteryPeriodic
// Auto Generated Code, DO NOT MODIFY
const ardupilot_equipment_power_BatteryPeriodic = class {
    static DTID = 20011;
    static FULL_NAME = 'ardupilot.equipment.power.BatteryPeriodic';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1000;
    static MIN_BIT_LEN = 256;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['name'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 50 );
        this.fields['serial_number'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 32 );
        this.fields['manufacture_date'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 9 );
        this.fields['design_capacity'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['cells_in_series'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['nominal_voltage'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['discharge_minimum_voltage'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['charging_minimum_voltage'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['charging_maximum_voltage'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['charging_maximum_current'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['discharge_maximum_current'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['discharge_maximum_burst_current'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['full_charge_capacity'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['cycle_count'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['state_of_health'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field name
        let name_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            name_length = bitsToArrayLength(data.getBits(msg.bitOffset, 6));
            msg.bitOffset += 6;
        } else {
            throw new RangeError('Array length exceeds maximum size: 50');
        }
        if (name_length > 50) {
            throw new RangeError('name_length length exceeds maximum size: 50');
        }
        for (let i = 0; i < name_length; i++) {
            msg.fields['name'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        // Decode dynamic array field serial_number
        let serial_number_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            serial_number_length = bitsToArrayLength(data.getBits(msg.bitOffset, 6));
            msg.bitOffset += 6;
        } else {
            throw new RangeError('Array length exceeds maximum size: 32');
        }
        if (serial_number_length > 32) {
            throw new RangeError('serial_number_length length exceeds maximum size: 32');
        }
        for (let i = 0; i < serial_number_length; i++) {
            msg.fields['serial_number'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        // Decode dynamic array field manufacture_date
        let manufacture_date_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            manufacture_date_length = bitsToArrayLength(data.getBits(msg.bitOffset, 4));
            msg.bitOffset += 4;
        } else {
            throw new RangeError('Array length exceeds maximum size: 9');
        }
        if (manufacture_date_length > 9) {
            throw new RangeError('manufacture_date_length length exceeds maximum size: 9');
        }
        for (let i = 0; i < manufacture_date_length; i++) {
            msg.fields['manufacture_date'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        let design_capacity_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['design_capacity'].value = design_capacity_field.value
        msg.bitOffset += 32;
        let cells_in_series_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['cells_in_series'].value = cells_in_series_field.value
        msg.bitOffset += 8;
        let nominal_voltage_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['nominal_voltage'].value = nominal_voltage_field.value
        msg.bitOffset += 16;
        let discharge_minimum_voltage_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['discharge_minimum_voltage'].value = discharge_minimum_voltage_field.value
        msg.bitOffset += 16;
        let charging_minimum_voltage_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['charging_minimum_voltage'].value = charging_minimum_voltage_field.value
        msg.bitOffset += 16;
        let charging_maximum_voltage_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['charging_maximum_voltage'].value = charging_maximum_voltage_field.value
        msg.bitOffset += 16;
        let charging_maximum_current_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['charging_maximum_current'].value = charging_maximum_current_field.value
        msg.bitOffset += 32;
        let discharge_maximum_current_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['discharge_maximum_current'].value = discharge_maximum_current_field.value
        msg.bitOffset += 32;
        let discharge_maximum_burst_current_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['discharge_maximum_burst_current'].value = discharge_maximum_burst_current_field.value
        msg.bitOffset += 32;
        let full_charge_capacity_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['full_charge_capacity'].value = full_charge_capacity_field.value
        msg.bitOffset += 32;
        let cycle_count_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['cycle_count'].value = cycle_count_field.value
        msg.bitOffset += 16;
        let state_of_health_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['state_of_health'].value = state_of_health_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field name
        const name_length = this.fields.name.length;
        if (this.fields.name.length > name_length) {
            throw new Error(`Array length of name exceeds maximum length of name_length`);
        }
        let name_length_bits = arrayLengthToBits(this.fields.name.length, 6);
        bits = bits.concat(name_length_bits);
        for (let i = 0; i < name_length; i++) {
            let name_bits = this.fields.name.items[i].pack();
            bits = bits.concat(name_bits);
        }

        // Encode dynamic array field serial_number
        const serial_number_length = this.fields.serial_number.length;
        if (this.fields.serial_number.length > serial_number_length) {
            throw new Error(`Array length of serial_number exceeds maximum length of serial_number_length`);
        }
        let serial_number_length_bits = arrayLengthToBits(this.fields.serial_number.length, 6);
        bits = bits.concat(serial_number_length_bits);
        for (let i = 0; i < serial_number_length; i++) {
            let serial_number_bits = this.fields.serial_number.items[i].pack();
            bits = bits.concat(serial_number_bits);
        }

        // Encode dynamic array field manufacture_date
        const manufacture_date_length = this.fields.manufacture_date.length;
        if (this.fields.manufacture_date.length > manufacture_date_length) {
            throw new Error(`Array length of manufacture_date exceeds maximum length of manufacture_date_length`);
        }
        let manufacture_date_length_bits = arrayLengthToBits(this.fields.manufacture_date.length, 4);
        bits = bits.concat(manufacture_date_length_bits);
        for (let i = 0; i < manufacture_date_length; i++) {
            let manufacture_date_bits = this.fields.manufacture_date.items[i].pack();
            bits = bits.concat(manufacture_date_bits);
        }

        let design_capacity_bits = this.fields.design_capacity.pack();
        bits = bits.concat(design_capacity_bits);
        let cells_in_series_bits = this.fields.cells_in_series.pack();
        bits = bits.concat(cells_in_series_bits);
        let nominal_voltage_bits = this.fields.nominal_voltage.pack();
        bits = bits.concat(nominal_voltage_bits);
        let discharge_minimum_voltage_bits = this.fields.discharge_minimum_voltage.pack();
        bits = bits.concat(discharge_minimum_voltage_bits);
        let charging_minimum_voltage_bits = this.fields.charging_minimum_voltage.pack();
        bits = bits.concat(charging_minimum_voltage_bits);
        let charging_maximum_voltage_bits = this.fields.charging_maximum_voltage.pack();
        bits = bits.concat(charging_maximum_voltage_bits);
        let charging_maximum_current_bits = this.fields.charging_maximum_current.pack();
        bits = bits.concat(charging_maximum_current_bits);
        let discharge_maximum_current_bits = this.fields.discharge_maximum_current.pack();
        bits = bits.concat(discharge_maximum_current_bits);
        let discharge_maximum_burst_current_bits = this.fields.discharge_maximum_burst_current.pack();
        bits = bits.concat(discharge_maximum_burst_current_bits);
        let full_charge_capacity_bits = this.fields.full_charge_capacity.pack();
        bits = bits.concat(full_charge_capacity_bits);
        let cycle_count_bits = this.fields.cycle_count.pack();
        bits = bits.concat(cycle_count_bits);
        let state_of_health_bits = this.fields.state_of_health.pack();
        bits = bits.concat(state_of_health_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['name'] = this.fields['name'].toObj(false);
        obj['serial_number'] = this.fields['serial_number'].toObj(true);
        obj['manufacture_date'] = this.fields['manufacture_date'].toObj(true);
        obj['design_capacity'] = Number(this.fields['design_capacity'].value);
        obj['cells_in_series'] = Number(this.fields['cells_in_series'].value);
        obj['nominal_voltage'] = Number(this.fields['nominal_voltage'].value);
        obj['discharge_minimum_voltage'] = Number(this.fields['discharge_minimum_voltage'].value);
        obj['charging_minimum_voltage'] = Number(this.fields['charging_minimum_voltage'].value);
        obj['charging_maximum_voltage'] = Number(this.fields['charging_maximum_voltage'].value);
        obj['charging_maximum_current'] = Number(this.fields['charging_maximum_current'].value);
        obj['discharge_maximum_current'] = Number(this.fields['discharge_maximum_current'].value);
        obj['discharge_maximum_burst_current'] = Number(this.fields['discharge_maximum_burst_current'].value);
        obj['full_charge_capacity'] = Number(this.fields['full_charge_capacity'].value);
        obj['cycle_count'] = Number(this.fields['cycle_count'].value);
        obj['state_of_health'] = Number(this.fields['state_of_health'].value);
        obj.getConstant = function(fieldName) {
            const constants = ardupilot_equipment_power_BatteryPeriodic.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return ardupilot_equipment_power_BatteryPeriodic.DTID;
    }

    get name() {
        return ardupilot_equipment_power_BatteryPeriodic.FULL_NAME;
    }

    get fieldNames() {
        return [
            'name',
            'serial_number',
            'manufacture_date',
            'design_capacity',
            'cells_in_series',
            'nominal_voltage',
            'discharge_minimum_voltage',
            'charging_minimum_voltage',
            'charging_maximum_voltage',
            'charging_maximum_current',
            'discharge_maximum_current',
            'discharge_maximum_burst_current',
            'full_charge_capacity',
            'cycle_count',
            'state_of_health',
        ];
    }

    static sampleMessage() {
        const msg = new ardupilot_equipment_power_BatteryPeriodic();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 1081185607536040146n;
    }

    getDataTypeSignature() {
        return 1081185607536040146n;
    }

};
module.exports.ardupilot_equipment_power_BatteryPeriodic = ardupilot_equipment_power_BatteryPeriodic;

// JavaScript binding for ardupilot.equipment.proximity_sensor.Proximity
// Auto Generated Code, DO NOT MODIFY
const ardupilot_equipment_proximity_sensor_Proximity = class {
    static DTID = 21910;
    static FULL_NAME = 'ardupilot.equipment.proximity_sensor.Proximity';
    static CONSTANTS = {'reading_type': {'NO_DATA': 0, 'NOT_CONNECTED': 1, 'GOOD': 2}, 'flags': {'NONE': 0}};
    static MAX_BIT_LEN = 64;
    static MIN_BIT_LEN = 64;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['sensor_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['reading_type'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 3);
        this.fields['flags'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 5);
        this.fields['yaw'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['pitch'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['distance'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let sensor_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sensor_id'].value = sensor_id_field.value
        msg.bitOffset += 8;
        let reading_type_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 3), 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['reading_type'].value = reading_type_field.value
        msg.bitOffset += 3;
        let flags_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 5), 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['flags'].value = flags_field.value
        msg.bitOffset += 5;
        let yaw_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['yaw'].value = yaw_field.value
        msg.bitOffset += 16;
        let pitch_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['pitch'].value = pitch_field.value
        msg.bitOffset += 16;
        let distance_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['distance'].value = distance_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let sensor_id_bits = this.fields.sensor_id.pack();
        bits = bits.concat(sensor_id_bits);
        let reading_type_bits = this.fields.reading_type.pack();
        bits = bits.concat(reading_type_bits);
        let flags_bits = this.fields.flags.pack();
        bits = bits.concat(flags_bits);
        let yaw_bits = this.fields.yaw.pack();
        bits = bits.concat(yaw_bits);
        let pitch_bits = this.fields.pitch.pack();
        bits = bits.concat(pitch_bits);
        let distance_bits = this.fields.distance.pack();
        bits = bits.concat(distance_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['sensor_id'] = Number(this.fields['sensor_id'].value);
        obj['reading_type'] = Number(this.fields['reading_type'].value);
        obj['flags'] = Number(this.fields['flags'].value);
        obj['yaw'] = Number(this.fields['yaw'].value);
        obj['pitch'] = Number(this.fields['pitch'].value);
        obj['distance'] = Number(this.fields['distance'].value);
        obj.getConstant = function(fieldName) {
            const constants = ardupilot_equipment_proximity_sensor_Proximity.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return ardupilot_equipment_proximity_sensor_Proximity.DTID;
    }

    get name() {
        return ardupilot_equipment_proximity_sensor_Proximity.FULL_NAME;
    }

    get fieldNames() {
        return [
            'sensor_id',
            'reading_type',
            'flags',
            'yaw',
            'pitch',
            'distance',
        ];
    }

    static sampleMessage() {
        const msg = new ardupilot_equipment_proximity_sensor_Proximity();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 11087081105263829710n;
    }

    getDataTypeSignature() {
        return 11087081105263829710n;
    }

};
module.exports.ardupilot_equipment_proximity_sensor_Proximity = ardupilot_equipment_proximity_sensor_Proximity;

// JavaScript binding for ardupilot.equipment.trafficmonitor.TrafficReport
// Auto Generated Code, DO NOT MODIFY
const ardupilot_equipment_trafficmonitor_TrafficReport = class {
    static DTID = 20790;
    static FULL_NAME = 'ardupilot.equipment.trafficmonitor.TrafficReport';
    static CONSTANTS = {'source': {'ADSB': 0, 'ADSB_UAT': 1, 'FLARM': 2}, 'traffic_type': {'UNKNOWN': 0, 'LIGHT': 1, 'SMALL': 2, 'LARGE': 3, 'HIGH_VORTEX_LARGE': 4, 'HEAVY': 5, 'HIGHLY_MANUV': 6, 'ROTOCRAFT': 7, 'GLIDER': 9, 'LIGHTER_THAN_AIR': 10, 'PARACHUTE': 11, 'ULTRA_LIGHT': 12, 'UAV': 14, 'SPACE': 15, 'EMERGENCY_SURFACE': 17, 'SERVICE_SURFACE': 18, 'POINT_OBSTACLE': 19}, 'alt_type': {'ALT_UNKNOWN': 0, 'PRESSURE_AMSL': 1, 'WGS84': 2}};
    static MAX_BIT_LEN = 375;
    static MIN_BIT_LEN = 375;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['timestamp'] = new CompoundType(uavcan_Timestamp.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['icao_address'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['tslc'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['latitude_deg_1e7'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 32);
        this.fields['longitude_deg_1e7'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 32);
        this.fields['alt_m'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['heading'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['velocity'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_STATIC, 3 );
        this.fields['squawk'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['callsign'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_STATIC, 9 );
        this.fields['source'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 3);
        this.fields['traffic_type'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 5);
        this.fields['alt_type'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
        this.fields['lat_lon_valid'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['heading_valid'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['velocity_valid'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['callsign_valid'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['ident_valid'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['simulated_report'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['vertical_velocity_valid'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['baro_valid'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let timestampMsg = uavcan_Timestamp.unpack(data, false, msg.bitOffset)
        msg.fields['timestamp'].msg = timestampMsg;
        msg.bitOffset = timestampMsg.bitOffset;
        let icao_address_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['icao_address'].value = icao_address_field.value
        msg.bitOffset += 32;
        let tslc_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tslc'].value = tslc_field.value
        msg.bitOffset += 16;
        let latitude_deg_1e7_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['latitude_deg_1e7'].value = latitude_deg_1e7_field.value
        msg.bitOffset += 32;
        let longitude_deg_1e7_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['longitude_deg_1e7'].value = longitude_deg_1e7_field.value
        msg.bitOffset += 32;
        let alt_m_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['alt_m'].value = alt_m_field.value
        msg.bitOffset += 32;
        let heading_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['heading'].value = heading_field.value
        msg.bitOffset += 16;
        // Decode static array field velocity
        const velocity_length = 3;
        for (let i = 0; i < velocity_length; i++) {
            msg.fields['velocity'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        let squawk_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['squawk'].value = squawk_field.value
        msg.bitOffset += 16;
        // Decode static array field callsign
        const callsign_length = 9;
        for (let i = 0; i < callsign_length; i++) {
            msg.fields['callsign'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        let source_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 3), 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['source'].value = source_field.value
        msg.bitOffset += 3;
        let traffic_type_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 5), 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['traffic_type'].value = traffic_type_field.value
        msg.bitOffset += 5;
        let alt_type_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['alt_type'].value = alt_type_field.value
        msg.bitOffset += 7;
        let lat_lon_valid_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['lat_lon_valid'].value = lat_lon_valid_field.value
        msg.bitOffset += 1;
        let heading_valid_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['heading_valid'].value = heading_valid_field.value
        msg.bitOffset += 1;
        let velocity_valid_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['velocity_valid'].value = velocity_valid_field.value
        msg.bitOffset += 1;
        let callsign_valid_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['callsign_valid'].value = callsign_valid_field.value
        msg.bitOffset += 1;
        let ident_valid_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['ident_valid'].value = ident_valid_field.value
        msg.bitOffset += 1;
        let simulated_report_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['simulated_report'].value = simulated_report_field.value
        msg.bitOffset += 1;
        let vertical_velocity_valid_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['vertical_velocity_valid'].value = vertical_velocity_valid_field.value
        msg.bitOffset += 1;
        let baro_valid_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['baro_valid'].value = baro_valid_field.value
        msg.bitOffset += 1;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let timestampMsg_bits = this.fields.timestamp.pack(false);
        bits = bits.concat(timestampMsg_bits);
        let icao_address_bits = this.fields.icao_address.pack();
        bits = bits.concat(icao_address_bits);
        let tslc_bits = this.fields.tslc.pack();
        bits = bits.concat(tslc_bits);
        let latitude_deg_1e7_bits = this.fields.latitude_deg_1e7.pack();
        bits = bits.concat(latitude_deg_1e7_bits);
        let longitude_deg_1e7_bits = this.fields.longitude_deg_1e7.pack();
        bits = bits.concat(longitude_deg_1e7_bits);
        let alt_m_bits = this.fields.alt_m.pack();
        bits = bits.concat(alt_m_bits);
        let heading_bits = this.fields.heading.pack();
        bits = bits.concat(heading_bits);
        // Encode static array field velocity
        const velocity_length = 3;
        for (let i = 0; i < velocity_length; i++) {
            let velocity_bits = this.fields.velocity.items[i].pack();
            bits = bits.concat(velocity_bits);
        }

        let squawk_bits = this.fields.squawk.pack();
        bits = bits.concat(squawk_bits);
        // Encode static array field callsign
        const callsign_length = 9;
        for (let i = 0; i < callsign_length; i++) {
            let callsign_bits = this.fields.callsign.items[i].pack();
            bits = bits.concat(callsign_bits);
        }

        let source_bits = this.fields.source.pack();
        bits = bits.concat(source_bits);
        let traffic_type_bits = this.fields.traffic_type.pack();
        bits = bits.concat(traffic_type_bits);
        let alt_type_bits = this.fields.alt_type.pack();
        bits = bits.concat(alt_type_bits);
        let lat_lon_valid_bits = this.fields.lat_lon_valid.pack();
        bits = bits.concat(lat_lon_valid_bits);
        let heading_valid_bits = this.fields.heading_valid.pack();
        bits = bits.concat(heading_valid_bits);
        let velocity_valid_bits = this.fields.velocity_valid.pack();
        bits = bits.concat(velocity_valid_bits);
        let callsign_valid_bits = this.fields.callsign_valid.pack();
        bits = bits.concat(callsign_valid_bits);
        let ident_valid_bits = this.fields.ident_valid.pack();
        bits = bits.concat(ident_valid_bits);
        let simulated_report_bits = this.fields.simulated_report.pack();
        bits = bits.concat(simulated_report_bits);
        let vertical_velocity_valid_bits = this.fields.vertical_velocity_valid.pack();
        bits = bits.concat(vertical_velocity_valid_bits);
        let baro_valid_bits = this.fields.baro_valid.pack();
        bits = bits.concat(baro_valid_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['icao_address'] = Number(this.fields['icao_address'].value);
        obj['tslc'] = Number(this.fields['tslc'].value);
        obj['latitude_deg_1e7'] = Number(this.fields['latitude_deg_1e7'].value);
        obj['longitude_deg_1e7'] = Number(this.fields['longitude_deg_1e7'].value);
        obj['alt_m'] = Number(this.fields['alt_m'].value);
        obj['heading'] = Number(this.fields['heading'].value);
        obj['velocity'] = this.fields['velocity'].toObj(true);
        obj['squawk'] = Number(this.fields['squawk'].value);
        obj['callsign'] = this.fields['callsign'].toObj(true);
        obj['source'] = Number(this.fields['source'].value);
        obj['traffic_type'] = Number(this.fields['traffic_type'].value);
        obj['alt_type'] = Number(this.fields['alt_type'].value);
        obj['lat_lon_valid'] = Number(this.fields['lat_lon_valid'].value);
        obj['heading_valid'] = Number(this.fields['heading_valid'].value);
        obj['velocity_valid'] = Number(this.fields['velocity_valid'].value);
        obj['callsign_valid'] = Number(this.fields['callsign_valid'].value);
        obj['ident_valid'] = Number(this.fields['ident_valid'].value);
        obj['simulated_report'] = Number(this.fields['simulated_report'].value);
        obj['vertical_velocity_valid'] = Number(this.fields['vertical_velocity_valid'].value);
        obj['baro_valid'] = Number(this.fields['baro_valid'].value);
        obj.getConstant = function(fieldName) {
            const constants = ardupilot_equipment_trafficmonitor_TrafficReport.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return ardupilot_equipment_trafficmonitor_TrafficReport.DTID;
    }

    get name() {
        return ardupilot_equipment_trafficmonitor_TrafficReport.FULL_NAME;
    }

    get fieldNames() {
        return [
            'timestamp',
            'icao_address',
            'tslc',
            'latitude_deg_1e7',
            'longitude_deg_1e7',
            'alt_m',
            'heading',
            'velocity',
            'squawk',
            'callsign',
            'source',
            'traffic_type',
            'alt_type',
            'lat_lon_valid',
            'heading_valid',
            'velocity_valid',
            'callsign_valid',
            'ident_valid',
            'simulated_report',
            'vertical_velocity_valid',
            'baro_valid',
        ];
    }

    static sampleMessage() {
        const msg = new ardupilot_equipment_trafficmonitor_TrafficReport();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 7558269111091429880n;
    }

    getDataTypeSignature() {
        return 7558269111091429880n;
    }

};
module.exports.ardupilot_equipment_trafficmonitor_TrafficReport = ardupilot_equipment_trafficmonitor_TrafficReport;

// JavaScript binding for uavcan.CoarseOrientation
// Auto Generated Code, DO NOT MODIFY
const uavcan_CoarseOrientation = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.CoarseOrientation';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 16;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['fixed_axis_roll_pitch_yaw'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 5), ArrayType.MODE_STATIC, 3 );
        this.fields['orientation_defined'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode static array field fixed_axis_roll_pitch_yaw
        const fixed_axis_roll_pitch_yaw_length = 3;
        for (let i = 0; i < fixed_axis_roll_pitch_yaw_length; i++) {
            msg.fields['fixed_axis_roll_pitch_yaw'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 5), 5, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 5;
        }

        let orientation_defined_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['orientation_defined'].value = orientation_defined_field.value
        msg.bitOffset += 1;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode static array field fixed_axis_roll_pitch_yaw
        const fixed_axis_roll_pitch_yaw_length = 3;
        for (let i = 0; i < fixed_axis_roll_pitch_yaw_length; i++) {
            let fixed_axis_roll_pitch_yaw_bits = this.fields.fixed_axis_roll_pitch_yaw.items[i].pack();
            bits = bits.concat(fixed_axis_roll_pitch_yaw_bits);
        }

        let orientation_defined_bits = this.fields.orientation_defined.pack();
        bits = bits.concat(orientation_defined_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['fixed_axis_roll_pitch_yaw'] = this.fields['fixed_axis_roll_pitch_yaw'].toObj(true);
        obj['orientation_defined'] = Number(this.fields['orientation_defined'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_CoarseOrientation.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_CoarseOrientation.DTID;
    }

    get name() {
        return uavcan_CoarseOrientation.FULL_NAME;
    }

    get fieldNames() {
        return [
            'fixed_axis_roll_pitch_yaw',
            'orientation_defined',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_CoarseOrientation();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 2818023060696505938n;
    }

    getDataTypeSignature() {
        return 2818023060696505938n;
    }

};
module.exports.uavcan_CoarseOrientation = uavcan_CoarseOrientation;

// JavaScript binding for uavcan.Timestamp
// Auto Generated Code, DO NOT MODIFY
const uavcan_Timestamp = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.Timestamp';
    static CONSTANTS = {'usec': {'UNKNOWN': 0}};
    static MAX_BIT_LEN = 56;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['usec'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 56);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let usec_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 56), 56, PrimitiveType.CAST_MODE_TRUNCATED);
        msg.fields['usec'].value = usec_field.value
        msg.bitOffset += 56;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let usec_bits = this.fields.usec.pack();
        bits = bits.concat(usec_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['usec'] = Number(this.fields['usec'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_Timestamp.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_Timestamp.DTID;
    }

    get name() {
        return uavcan_Timestamp.FULL_NAME;
    }

    get fieldNames() {
        return [
            'usec',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_Timestamp();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 413499232717667853n;
    }

    getDataTypeSignature() {
        return 413499232717667853n;
    }

};
module.exports.uavcan_Timestamp = uavcan_Timestamp;

// JavaScript binding for uavcan.navigation.GlobalNavigationSolution
// Auto Generated Code, DO NOT MODIFY
const uavcan_navigation_GlobalNavigationSolution = class {
    static DTID = 2000;
    static FULL_NAME = 'uavcan.navigation.GlobalNavigationSolution';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1860;
    static MIN_BIT_LEN = 696;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['timestamp'] = new CompoundType(uavcan_Timestamp.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['longitude'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 64);
        this.fields['latitude'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 64);
        this.fields['height_ellipsoid'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['height_msl'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['height_agl'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['height_baro'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['qnh_hpa'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['orientation_xyzw'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32), ArrayType.MODE_STATIC, 4 );
        this.fields['pose_covariance'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 36 );
        this.fields['linear_velocity_body'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32), ArrayType.MODE_STATIC, 3 );
        this.fields['angular_velocity_body'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32), ArrayType.MODE_STATIC, 3 );
        this.fields['linear_acceleration_body'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_STATIC, 3 );
        this.fields['velocity_covariance'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 36 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let timestampMsg = uavcan_Timestamp.unpack(data, false, msg.bitOffset)
        msg.fields['timestamp'].msg = timestampMsg;
        msg.bitOffset = timestampMsg.bitOffset;
        let longitude_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 64), 64);
        msg.fields['longitude'].value = longitude_field.value
        msg.bitOffset += 64;
        let latitude_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 64), 64);
        msg.fields['latitude'].value = latitude_field.value
        msg.bitOffset += 64;
        let height_ellipsoid_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['height_ellipsoid'].value = height_ellipsoid_field.value
        msg.bitOffset += 32;
        let height_msl_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['height_msl'].value = height_msl_field.value
        msg.bitOffset += 32;
        let height_agl_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['height_agl'].value = height_agl_field.value
        msg.bitOffset += 32;
        let height_baro_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['height_baro'].value = height_baro_field.value
        msg.bitOffset += 32;
        let qnh_hpa_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['qnh_hpa'].value = qnh_hpa_field.value
        msg.bitOffset += 16;
        // Decode static array field orientation_xyzw
        const orientation_xyzw_length = 4;
        for (let i = 0; i < orientation_xyzw_length; i++) {
            msg.fields['orientation_xyzw'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32));
            msg.bitOffset += 32;
        }

        // Decode dynamic array field pose_covariance
        let pose_covariance_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            pose_covariance_length = bitsToArrayLength(data.getBits(msg.bitOffset, 6));
            msg.bitOffset += 6;
        } else {
            throw new RangeError('Array length exceeds maximum size: 36');
        }
        if (pose_covariance_length > 36) {
            throw new RangeError('pose_covariance_length length exceeds maximum size: 36');
        }
        for (let i = 0; i < pose_covariance_length; i++) {
            msg.fields['pose_covariance'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        // Decode static array field linear_velocity_body
        const linear_velocity_body_length = 3;
        for (let i = 0; i < linear_velocity_body_length; i++) {
            msg.fields['linear_velocity_body'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32));
            msg.bitOffset += 32;
        }

        // Decode static array field angular_velocity_body
        const angular_velocity_body_length = 3;
        for (let i = 0; i < angular_velocity_body_length; i++) {
            msg.fields['angular_velocity_body'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32));
            msg.bitOffset += 32;
        }

        // Decode static array field linear_acceleration_body
        const linear_acceleration_body_length = 3;
        for (let i = 0; i < linear_acceleration_body_length; i++) {
            msg.fields['linear_acceleration_body'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        // Decode dynamic array field velocity_covariance
        let velocity_covariance_length = 0;
        if (tao) {
            velocity_covariance_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 16);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                velocity_covariance_length = bitsToArrayLength(data.getBits(msg.bitOffset, 6));
                msg.bitOffset += 6;
            } else {
                throw new RangeError('Array length exceeds maximum size: 36');
            }
        }
        if (velocity_covariance_length > 36) {
            throw new RangeError('velocity_covariance_length length exceeds maximum size: 36');
        }
        for (let i = 0; i < velocity_covariance_length; i++) {
            msg.fields['velocity_covariance'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let timestampMsg_bits = this.fields.timestamp.pack(false);
        bits = bits.concat(timestampMsg_bits);
        let longitude_bits = this.fields.longitude.pack();
        bits = bits.concat(longitude_bits);
        let latitude_bits = this.fields.latitude.pack();
        bits = bits.concat(latitude_bits);
        let height_ellipsoid_bits = this.fields.height_ellipsoid.pack();
        bits = bits.concat(height_ellipsoid_bits);
        let height_msl_bits = this.fields.height_msl.pack();
        bits = bits.concat(height_msl_bits);
        let height_agl_bits = this.fields.height_agl.pack();
        bits = bits.concat(height_agl_bits);
        let height_baro_bits = this.fields.height_baro.pack();
        bits = bits.concat(height_baro_bits);
        let qnh_hpa_bits = this.fields.qnh_hpa.pack();
        bits = bits.concat(qnh_hpa_bits);
        // Encode static array field orientation_xyzw
        const orientation_xyzw_length = 4;
        for (let i = 0; i < orientation_xyzw_length; i++) {
            let orientation_xyzw_bits = this.fields.orientation_xyzw.items[i].pack();
            bits = bits.concat(orientation_xyzw_bits);
        }

        // Encode dynamic array field pose_covariance
        const pose_covariance_length = this.fields.pose_covariance.length;
        if (this.fields.pose_covariance.length > pose_covariance_length) {
            throw new Error(`Array length of pose_covariance exceeds maximum length of pose_covariance_length`);
        }
        let pose_covariance_length_bits = arrayLengthToBits(this.fields.pose_covariance.length, 6);
        bits = bits.concat(pose_covariance_length_bits);
        for (let i = 0; i < pose_covariance_length; i++) {
            let pose_covariance_bits = this.fields.pose_covariance.items[i].pack();
            bits = bits.concat(pose_covariance_bits);
        }

        // Encode static array field linear_velocity_body
        const linear_velocity_body_length = 3;
        for (let i = 0; i < linear_velocity_body_length; i++) {
            let linear_velocity_body_bits = this.fields.linear_velocity_body.items[i].pack();
            bits = bits.concat(linear_velocity_body_bits);
        }

        // Encode static array field angular_velocity_body
        const angular_velocity_body_length = 3;
        for (let i = 0; i < angular_velocity_body_length; i++) {
            let angular_velocity_body_bits = this.fields.angular_velocity_body.items[i].pack();
            bits = bits.concat(angular_velocity_body_bits);
        }

        // Encode static array field linear_acceleration_body
        const linear_acceleration_body_length = 3;
        for (let i = 0; i < linear_acceleration_body_length; i++) {
            let linear_acceleration_body_bits = this.fields.linear_acceleration_body.items[i].pack();
            bits = bits.concat(linear_acceleration_body_bits);
        }

        // Encode dynamic array field velocity_covariance
        const velocity_covariance_length = this.fields.velocity_covariance.length;
        if (this.fields.velocity_covariance.length > velocity_covariance_length) {
            throw new Error(`Array length of velocity_covariance exceeds maximum length of velocity_covariance_length`);
        }
        if (!tao) {
           let velocity_covariance_length_bits = arrayLengthToBits(this.fields.velocity_covariance.length, 6);
           bits = bits.concat(velocity_covariance_length_bits);
        }
        for (let i = 0; i < velocity_covariance_length; i++) {
            let velocity_covariance_bits = this.fields.velocity_covariance.items[i].pack();
            bits = bits.concat(velocity_covariance_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['longitude'] = Number(this.fields['longitude'].value);
        obj['latitude'] = Number(this.fields['latitude'].value);
        obj['height_ellipsoid'] = Number(this.fields['height_ellipsoid'].value);
        obj['height_msl'] = Number(this.fields['height_msl'].value);
        obj['height_agl'] = Number(this.fields['height_agl'].value);
        obj['height_baro'] = Number(this.fields['height_baro'].value);
        obj['qnh_hpa'] = Number(this.fields['qnh_hpa'].value);
        obj['orientation_xyzw'] = this.fields['orientation_xyzw'].toObj(true);
        obj['pose_covariance'] = this.fields['pose_covariance'].toObj(true);
        obj['linear_velocity_body'] = this.fields['linear_velocity_body'].toObj(true);
        obj['angular_velocity_body'] = this.fields['angular_velocity_body'].toObj(true);
        obj['linear_acceleration_body'] = this.fields['linear_acceleration_body'].toObj(true);
        obj['velocity_covariance'] = this.fields['velocity_covariance'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_navigation_GlobalNavigationSolution.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_navigation_GlobalNavigationSolution.DTID;
    }

    get name() {
        return uavcan_navigation_GlobalNavigationSolution.FULL_NAME;
    }

    get fieldNames() {
        return [
            'timestamp',
            'longitude',
            'latitude',
            'height_ellipsoid',
            'height_msl',
            'height_agl',
            'height_baro',
            'qnh_hpa',
            'orientation_xyzw',
            'pose_covariance',
            'linear_velocity_body',
            'angular_velocity_body',
            'linear_acceleration_body',
            'velocity_covariance',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_navigation_GlobalNavigationSolution();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 5060657078061046845n;
    }

    getDataTypeSignature() {
        return 5060657078061046845n;
    }

};
module.exports.uavcan_navigation_GlobalNavigationSolution = uavcan_navigation_GlobalNavigationSolution;

// JavaScript binding for uavcan.protocol.GetNodeInfo
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_GetNodeInfo_Request = class {
    static DTID = 1;
    static FULL_NAME = 'uavcan.protocol.GetNodeInfo';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 0;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_GetNodeInfo_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_GetNodeInfo_Request.DTID;
    }

    get name() {
        return uavcan_protocol_GetNodeInfo_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_GetNodeInfo_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 17169562916618529438n;
    }

    getDataTypeSignature() {
        return 17169562916618529438n;
    }

};
module.exports.uavcan_protocol_GetNodeInfo_Request = uavcan_protocol_GetNodeInfo_Request;

// JavaScript binding for uavcan.protocol.GetNodeInfo
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_GetNodeInfo_Response = class {
    static DTID = 1;
    static FULL_NAME = 'uavcan.protocol.GetNodeInfo';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 0;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['status'] = new CompoundType(uavcan_protocol_NodeStatus.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['software_version'] = new CompoundType(uavcan_protocol_SoftwareVersion.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['hardware_version'] = new CompoundType(uavcan_protocol_HardwareVersion.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['name'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 80 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let statusMsg = uavcan_protocol_NodeStatus.unpack(data, false, msg.bitOffset)
        msg.fields['status'].msg = statusMsg;
        msg.bitOffset = statusMsg.bitOffset;
        let software_versionMsg = uavcan_protocol_SoftwareVersion.unpack(data, false, msg.bitOffset)
        msg.fields['software_version'].msg = software_versionMsg;
        msg.bitOffset = software_versionMsg.bitOffset;
        let hardware_versionMsg = uavcan_protocol_HardwareVersion.unpack(data, false, msg.bitOffset)
        msg.fields['hardware_version'].msg = hardware_versionMsg;
        msg.bitOffset = hardware_versionMsg.bitOffset;
        // Decode dynamic array field name
        let name_length = 0;
        if (tao) {
            name_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                name_length = bitsToArrayLength(data.getBits(msg.bitOffset, 7));
                msg.bitOffset += 7;
            } else {
                throw new RangeError('Array length exceeds maximum size: 80');
            }
        }
        if (name_length > 80) {
            throw new RangeError('name_length length exceeds maximum size: 80');
        }
        for (let i = 0; i < name_length; i++) {
            msg.fields['name'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let statusMsg_bits = this.fields.status.pack(false);
        bits = bits.concat(statusMsg_bits);
        let software_versionMsg_bits = this.fields.software_version.pack(false);
        bits = bits.concat(software_versionMsg_bits);
        let hardware_versionMsg_bits = this.fields.hardware_version.pack(false);
        bits = bits.concat(hardware_versionMsg_bits);
        // Encode dynamic array field name
        const name_length = this.fields.name.length;
        if (this.fields.name.length > name_length) {
            throw new Error(`Array length of name exceeds maximum length of name_length`);
        }
        if (!tao) {
           let name_length_bits = arrayLengthToBits(this.fields.name.length, 7);
           bits = bits.concat(name_length_bits);
        }
        for (let i = 0; i < name_length; i++) {
            let name_bits = this.fields.name.items[i].pack();
            bits = bits.concat(name_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['status'] = this.fields['status'].toObj();
        obj['software_version'] = this.fields['software_version'].toObj();
        obj['hardware_version'] = this.fields['hardware_version'].toObj();
        obj['name'] = this.fields['name'].toObj(false);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_GetNodeInfo_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_GetNodeInfo_Response.DTID;
    }

    get name() {
        return uavcan_protocol_GetNodeInfo_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'status',
            'software_version',
            'hardware_version',
            'name',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_GetNodeInfo_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 17169562916618529438n;
    }

    getDataTypeSignature() {
        return 17169562916618529438n;
    }

};
module.exports.uavcan_protocol_GetNodeInfo_Response = uavcan_protocol_GetNodeInfo_Response;

// JavaScript binding for uavcan.protocol.AccessCommandShell
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_AccessCommandShell_Request = class {
    static DTID = 6;
    static FULL_NAME = 'uavcan.protocol.AccessCommandShell';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1040;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['flags'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['input'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 128 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let flags_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['flags'].value = flags_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field input
        let input_length = 0;
        if (tao) {
            input_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                input_length = bitsToArrayLength(data.getBits(msg.bitOffset, 8));
                msg.bitOffset += 8;
            } else {
                throw new RangeError('Array length exceeds maximum size: 128');
            }
        }
        if (input_length > 128) {
            throw new RangeError('input_length length exceeds maximum size: 128');
        }
        for (let i = 0; i < input_length; i++) {
            msg.fields['input'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let flags_bits = this.fields.flags.pack();
        bits = bits.concat(flags_bits);
        // Encode dynamic array field input
        const input_length = this.fields.input.length;
        if (this.fields.input.length > input_length) {
            throw new Error(`Array length of input exceeds maximum length of input_length`);
        }
        if (!tao) {
           let input_length_bits = arrayLengthToBits(this.fields.input.length, 8);
           bits = bits.concat(input_length_bits);
        }
        for (let i = 0; i < input_length; i++) {
            let input_bits = this.fields.input.items[i].pack();
            bits = bits.concat(input_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['flags'] = Number(this.fields['flags'].value);
        obj['input'] = this.fields['input'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_AccessCommandShell_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_AccessCommandShell_Request.DTID;
    }

    get name() {
        return uavcan_protocol_AccessCommandShell_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'flags',
            'input',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_AccessCommandShell_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 6424221424030393454n;
    }

    getDataTypeSignature() {
        return 6424221424030393454n;
    }

};
module.exports.uavcan_protocol_AccessCommandShell_Request = uavcan_protocol_AccessCommandShell_Request;

// JavaScript binding for uavcan.protocol.AccessCommandShell
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_AccessCommandShell_Response = class {
    static DTID = 6;
    static FULL_NAME = 'uavcan.protocol.AccessCommandShell';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1040;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['last_exit_status'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 32);
        this.fields['flags'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['output'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 256 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let last_exit_status_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['last_exit_status'].value = last_exit_status_field.value
        msg.bitOffset += 32;
        let flags_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['flags'].value = flags_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field output
        let output_length = 0;
        if (tao) {
            output_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                output_length = bitsToArrayLength(data.getBits(msg.bitOffset, 9));
                msg.bitOffset += 9;
            } else {
                throw new RangeError('Array length exceeds maximum size: 256');
            }
        }
        if (output_length > 256) {
            throw new RangeError('output_length length exceeds maximum size: 256');
        }
        for (let i = 0; i < output_length; i++) {
            msg.fields['output'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let last_exit_status_bits = this.fields.last_exit_status.pack();
        bits = bits.concat(last_exit_status_bits);
        let flags_bits = this.fields.flags.pack();
        bits = bits.concat(flags_bits);
        // Encode dynamic array field output
        const output_length = this.fields.output.length;
        if (this.fields.output.length > output_length) {
            throw new Error(`Array length of output exceeds maximum length of output_length`);
        }
        if (!tao) {
           let output_length_bits = arrayLengthToBits(this.fields.output.length, 9);
           bits = bits.concat(output_length_bits);
        }
        for (let i = 0; i < output_length; i++) {
            let output_bits = this.fields.output.items[i].pack();
            bits = bits.concat(output_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['last_exit_status'] = Number(this.fields['last_exit_status'].value);
        obj['flags'] = Number(this.fields['flags'].value);
        obj['output'] = this.fields['output'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_AccessCommandShell_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_AccessCommandShell_Response.DTID;
    }

    get name() {
        return uavcan_protocol_AccessCommandShell_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'last_exit_status',
            'flags',
            'output',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_AccessCommandShell_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 6424221424030393454n;
    }

    getDataTypeSignature() {
        return 6424221424030393454n;
    }

};
module.exports.uavcan_protocol_AccessCommandShell_Response = uavcan_protocol_AccessCommandShell_Response;

// JavaScript binding for uavcan.protocol.NodeStatus
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_NodeStatus = class {
    static DTID = 341;
    static FULL_NAME = 'uavcan.protocol.NodeStatus';
    static CONSTANTS = {'health': {'OK': 0, 'WARNING': 1, 'ERROR': 2, 'CRITICAL': 3}, 'mode': {'OPERATIONAL': 0, 'INITIALIZATION': 1, 'MAINTENANCE': 2, 'SOFTWARE_UPDATE': 3, 'OFFLINE': 7}};
    static MAX_BIT_LEN = 56;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['uptime_sec'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['health'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 2);
        this.fields['mode'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 3);
        this.fields['sub_mode'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 3);
        this.fields['vendor_specific_status_code'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let uptime_sec_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['uptime_sec'].value = uptime_sec_field.value
        msg.bitOffset += 32;
        let health_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 2), 2, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['health'].value = health_field.value
        msg.bitOffset += 2;
        let mode_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 3), 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['mode'].value = mode_field.value
        msg.bitOffset += 3;
        let sub_mode_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 3), 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sub_mode'].value = sub_mode_field.value
        msg.bitOffset += 3;
        let vendor_specific_status_code_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['vendor_specific_status_code'].value = vendor_specific_status_code_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let uptime_sec_bits = this.fields.uptime_sec.pack();
        bits = bits.concat(uptime_sec_bits);
        let health_bits = this.fields.health.pack();
        bits = bits.concat(health_bits);
        let mode_bits = this.fields.mode.pack();
        bits = bits.concat(mode_bits);
        let sub_mode_bits = this.fields.sub_mode.pack();
        bits = bits.concat(sub_mode_bits);
        let vendor_specific_status_code_bits = this.fields.vendor_specific_status_code.pack();
        bits = bits.concat(vendor_specific_status_code_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['uptime_sec'] = Number(this.fields['uptime_sec'].value);
        obj['health'] = Number(this.fields['health'].value);
        obj['mode'] = Number(this.fields['mode'].value);
        obj['sub_mode'] = Number(this.fields['sub_mode'].value);
        obj['vendor_specific_status_code'] = Number(this.fields['vendor_specific_status_code'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_NodeStatus.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_NodeStatus.DTID;
    }

    get name() {
        return uavcan_protocol_NodeStatus.FULL_NAME;
    }

    get fieldNames() {
        return [
            'uptime_sec',
            'health',
            'mode',
            'sub_mode',
            'vendor_specific_status_code',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_NodeStatus();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 1083230956194088689n;
    }

    getDataTypeSignature() {
        return 1083230956194088689n;
    }

};
module.exports.uavcan_protocol_NodeStatus = uavcan_protocol_NodeStatus;

// JavaScript binding for uavcan.protocol.DataTypeKind
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_DataTypeKind = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.protocol.DataTypeKind';
    static CONSTANTS = {'value': {'SERVICE': 0, 'MESSAGE': 1}};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['value'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let value_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['value'].value = value_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let value_bits = this.fields.value.pack();
        bits = bits.concat(value_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['value'] = Number(this.fields['value'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_DataTypeKind.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_DataTypeKind.DTID;
    }

    get name() {
        return uavcan_protocol_DataTypeKind.FULL_NAME;
    }

    get fieldNames() {
        return [
            'value',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_DataTypeKind();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 10673715001607215408n;
    }

    getDataTypeSignature() {
        return 10673715001607215408n;
    }

};
module.exports.uavcan_protocol_DataTypeKind = uavcan_protocol_DataTypeKind;

// JavaScript binding for uavcan.protocol.Panic
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_Panic = class {
    static DTID = 5;
    static FULL_NAME = 'uavcan.protocol.Panic';
    static CONSTANTS = {'reason_text': {'MIN_MESSAGES': 3, 'MAX_INTERVAL_MS': 500}};
    static MAX_BIT_LEN = 59;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['reason_text'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 7 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field reason_text
        let reason_text_length = 0;
        if (tao) {
            reason_text_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                reason_text_length = bitsToArrayLength(data.getBits(msg.bitOffset, 3));
                msg.bitOffset += 3;
            } else {
                throw new RangeError('Array length exceeds maximum size: 7');
            }
        }
        if (reason_text_length > 7) {
            throw new RangeError('reason_text_length length exceeds maximum size: 7');
        }
        for (let i = 0; i < reason_text_length; i++) {
            msg.fields['reason_text'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field reason_text
        const reason_text_length = this.fields.reason_text.length;
        if (this.fields.reason_text.length > reason_text_length) {
            throw new Error(`Array length of reason_text exceeds maximum length of reason_text_length`);
        }
        if (!tao) {
           let reason_text_length_bits = arrayLengthToBits(this.fields.reason_text.length, 3);
           bits = bits.concat(reason_text_length_bits);
        }
        for (let i = 0; i < reason_text_length; i++) {
            let reason_text_bits = this.fields.reason_text.items[i].pack();
            bits = bits.concat(reason_text_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['reason_text'] = this.fields['reason_text'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_Panic.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_Panic.DTID;
    }

    get name() {
        return uavcan_protocol_Panic.FULL_NAME;
    }

    get fieldNames() {
        return [
            'reason_text',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_Panic();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 10050262024670265815n;
    }

    getDataTypeSignature() {
        return 10050262024670265815n;
    }

};
module.exports.uavcan_protocol_Panic = uavcan_protocol_Panic;

// JavaScript binding for uavcan.protocol.SoftwareVersion
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_SoftwareVersion = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.protocol.SoftwareVersion';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 120;
    static MIN_BIT_LEN = 120;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['major'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['minor'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['optional_field_flags'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['vcs_commit'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['image_crc'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 64);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let major_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['major'].value = major_field.value
        msg.bitOffset += 8;
        let minor_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['minor'].value = minor_field.value
        msg.bitOffset += 8;
        let optional_field_flags_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['optional_field_flags'].value = optional_field_flags_field.value
        msg.bitOffset += 8;
        let vcs_commit_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['vcs_commit'].value = vcs_commit_field.value
        msg.bitOffset += 32;
        let image_crc_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 64), 64, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['image_crc'].value = image_crc_field.value
        msg.bitOffset += 64;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let major_bits = this.fields.major.pack();
        bits = bits.concat(major_bits);
        let minor_bits = this.fields.minor.pack();
        bits = bits.concat(minor_bits);
        let optional_field_flags_bits = this.fields.optional_field_flags.pack();
        bits = bits.concat(optional_field_flags_bits);
        let vcs_commit_bits = this.fields.vcs_commit.pack();
        bits = bits.concat(vcs_commit_bits);
        let image_crc_bits = this.fields.image_crc.pack();
        bits = bits.concat(image_crc_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['major'] = Number(this.fields['major'].value);
        obj['minor'] = Number(this.fields['minor'].value);
        obj['optional_field_flags'] = Number(this.fields['optional_field_flags'].value);
        obj['vcs_commit'] = Number(this.fields['vcs_commit'].value);
        obj['image_crc'] = Number(this.fields['image_crc'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_SoftwareVersion.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_SoftwareVersion.DTID;
    }

    get name() {
        return uavcan_protocol_SoftwareVersion.FULL_NAME;
    }

    get fieldNames() {
        return [
            'major',
            'minor',
            'optional_field_flags',
            'vcs_commit',
            'image_crc',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_SoftwareVersion();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 15944709945113968289n;
    }

    getDataTypeSignature() {
        return 15944709945113968289n;
    }

};
module.exports.uavcan_protocol_SoftwareVersion = uavcan_protocol_SoftwareVersion;

// JavaScript binding for uavcan.protocol.GlobalTimeSync
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_GlobalTimeSync = class {
    static DTID = 4;
    static FULL_NAME = 'uavcan.protocol.GlobalTimeSync';
    static CONSTANTS = {'previous_transmission_timestamp_usec': {'MAX_BROADCASTING_PERIOD_MS': 1100, 'MIN_BROADCASTING_PERIOD_MS': 40, 'RECOMMENDED_BROADCASTER_TIMEOUT_MS': 2200}};
    static MAX_BIT_LEN = 56;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['previous_transmission_timestamp_usec'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 56);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let previous_transmission_timestamp_usec_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 56), 56, PrimitiveType.CAST_MODE_TRUNCATED);
        msg.fields['previous_transmission_timestamp_usec'].value = previous_transmission_timestamp_usec_field.value
        msg.bitOffset += 56;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let previous_transmission_timestamp_usec_bits = this.fields.previous_transmission_timestamp_usec.pack();
        bits = bits.concat(previous_transmission_timestamp_usec_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['previous_transmission_timestamp_usec'] = Number(this.fields['previous_transmission_timestamp_usec'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_GlobalTimeSync.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_GlobalTimeSync.DTID;
    }

    get name() {
        return uavcan_protocol_GlobalTimeSync.FULL_NAME;
    }

    get fieldNames() {
        return [
            'previous_transmission_timestamp_usec',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_GlobalTimeSync();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 2316839322303840987n;
    }

    getDataTypeSignature() {
        return 2316839322303840987n;
    }

};
module.exports.uavcan_protocol_GlobalTimeSync = uavcan_protocol_GlobalTimeSync;

// JavaScript binding for uavcan.protocol.GetDataTypeInfo
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_GetDataTypeInfo_Request = class {
    static DTID = 2;
    static FULL_NAME = 'uavcan.protocol.GetDataTypeInfo';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 671;
    static MIN_BIT_LEN = 24;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['kind'] = new CompoundType(uavcan_protocol_DataTypeKind.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['name'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 80 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['id'].value = id_field.value
        msg.bitOffset += 16;
        let kindMsg = uavcan_protocol_DataTypeKind.unpack(data, false, msg.bitOffset)
        msg.fields['kind'].msg = kindMsg;
        msg.bitOffset = kindMsg.bitOffset;
        // Decode dynamic array field name
        let name_length = 0;
        if (tao) {
            name_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                name_length = bitsToArrayLength(data.getBits(msg.bitOffset, 7));
                msg.bitOffset += 7;
            } else {
                throw new RangeError('Array length exceeds maximum size: 80');
            }
        }
        if (name_length > 80) {
            throw new RangeError('name_length length exceeds maximum size: 80');
        }
        for (let i = 0; i < name_length; i++) {
            msg.fields['name'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let id_bits = this.fields.id.pack();
        bits = bits.concat(id_bits);
        let kindMsg_bits = this.fields.kind.pack(false);
        bits = bits.concat(kindMsg_bits);
        // Encode dynamic array field name
        const name_length = this.fields.name.length;
        if (this.fields.name.length > name_length) {
            throw new Error(`Array length of name exceeds maximum length of name_length`);
        }
        if (!tao) {
           let name_length_bits = arrayLengthToBits(this.fields.name.length, 7);
           bits = bits.concat(name_length_bits);
        }
        for (let i = 0; i < name_length; i++) {
            let name_bits = this.fields.name.items[i].pack();
            bits = bits.concat(name_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['id'] = Number(this.fields['id'].value);
        obj['kind'] = this.fields['kind'].toObj();
        obj['name'] = this.fields['name'].toObj(false);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_GetDataTypeInfo_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_GetDataTypeInfo_Request.DTID;
    }

    get name() {
        return uavcan_protocol_GetDataTypeInfo_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'id',
            'kind',
            'name',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_GetDataTypeInfo_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 1956870356517966552n;
    }

    getDataTypeSignature() {
        return 1956870356517966552n;
    }

};
module.exports.uavcan_protocol_GetDataTypeInfo_Request = uavcan_protocol_GetDataTypeInfo_Request;

// JavaScript binding for uavcan.protocol.GetDataTypeInfo
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_GetDataTypeInfo_Response = class {
    static DTID = 2;
    static FULL_NAME = 'uavcan.protocol.GetDataTypeInfo';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 671;
    static MIN_BIT_LEN = 24;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['signature'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 64);
        this.fields['id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['kind'] = new CompoundType(uavcan_protocol_DataTypeKind.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['flags'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['name'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 80 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let signature_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 64), 64, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['signature'].value = signature_field.value
        msg.bitOffset += 64;
        let id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['id'].value = id_field.value
        msg.bitOffset += 16;
        let kindMsg = uavcan_protocol_DataTypeKind.unpack(data, false, msg.bitOffset)
        msg.fields['kind'].msg = kindMsg;
        msg.bitOffset = kindMsg.bitOffset;
        let flags_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['flags'].value = flags_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field name
        let name_length = 0;
        if (tao) {
            name_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                name_length = bitsToArrayLength(data.getBits(msg.bitOffset, 7));
                msg.bitOffset += 7;
            } else {
                throw new RangeError('Array length exceeds maximum size: 80');
            }
        }
        if (name_length > 80) {
            throw new RangeError('name_length length exceeds maximum size: 80');
        }
        for (let i = 0; i < name_length; i++) {
            msg.fields['name'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let signature_bits = this.fields.signature.pack();
        bits = bits.concat(signature_bits);
        let id_bits = this.fields.id.pack();
        bits = bits.concat(id_bits);
        let kindMsg_bits = this.fields.kind.pack(false);
        bits = bits.concat(kindMsg_bits);
        let flags_bits = this.fields.flags.pack();
        bits = bits.concat(flags_bits);
        // Encode dynamic array field name
        const name_length = this.fields.name.length;
        if (this.fields.name.length > name_length) {
            throw new Error(`Array length of name exceeds maximum length of name_length`);
        }
        if (!tao) {
           let name_length_bits = arrayLengthToBits(this.fields.name.length, 7);
           bits = bits.concat(name_length_bits);
        }
        for (let i = 0; i < name_length; i++) {
            let name_bits = this.fields.name.items[i].pack();
            bits = bits.concat(name_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['signature'] = Number(this.fields['signature'].value);
        obj['id'] = Number(this.fields['id'].value);
        obj['kind'] = this.fields['kind'].toObj();
        obj['flags'] = Number(this.fields['flags'].value);
        obj['name'] = this.fields['name'].toObj(false);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_GetDataTypeInfo_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_GetDataTypeInfo_Response.DTID;
    }

    get name() {
        return uavcan_protocol_GetDataTypeInfo_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'signature',
            'id',
            'kind',
            'flags',
            'name',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_GetDataTypeInfo_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 1956870356517966552n;
    }

    getDataTypeSignature() {
        return 1956870356517966552n;
    }

};
module.exports.uavcan_protocol_GetDataTypeInfo_Response = uavcan_protocol_GetDataTypeInfo_Response;

// JavaScript binding for uavcan.protocol.HardwareVersion
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_HardwareVersion = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.protocol.HardwareVersion';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 2192;
    static MIN_BIT_LEN = 144;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['major'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['minor'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['unique_id'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_STATIC, 16 );
        this.fields['certificate_of_authenticity'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 255 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let major_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['major'].value = major_field.value
        msg.bitOffset += 8;
        let minor_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['minor'].value = minor_field.value
        msg.bitOffset += 8;
        // Decode static array field unique_id
        const unique_id_length = 16;
        for (let i = 0; i < unique_id_length; i++) {
            msg.fields['unique_id'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        // Decode dynamic array field certificate_of_authenticity
        let certificate_of_authenticity_length = 0;
        if (tao) {
            certificate_of_authenticity_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                certificate_of_authenticity_length = bitsToArrayLength(data.getBits(msg.bitOffset, 8));
                msg.bitOffset += 8;
            } else {
                throw new RangeError('Array length exceeds maximum size: 255');
            }
        }
        if (certificate_of_authenticity_length > 255) {
            throw new RangeError('certificate_of_authenticity_length length exceeds maximum size: 255');
        }
        for (let i = 0; i < certificate_of_authenticity_length; i++) {
            msg.fields['certificate_of_authenticity'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let major_bits = this.fields.major.pack();
        bits = bits.concat(major_bits);
        let minor_bits = this.fields.minor.pack();
        bits = bits.concat(minor_bits);
        // Encode static array field unique_id
        const unique_id_length = 16;
        for (let i = 0; i < unique_id_length; i++) {
            let unique_id_bits = this.fields.unique_id.items[i].pack();
            bits = bits.concat(unique_id_bits);
        }

        // Encode dynamic array field certificate_of_authenticity
        const certificate_of_authenticity_length = this.fields.certificate_of_authenticity.length;
        if (this.fields.certificate_of_authenticity.length > certificate_of_authenticity_length) {
            throw new Error(`Array length of certificate_of_authenticity exceeds maximum length of certificate_of_authenticity_length`);
        }
        if (!tao) {
           let certificate_of_authenticity_length_bits = arrayLengthToBits(this.fields.certificate_of_authenticity.length, 8);
           bits = bits.concat(certificate_of_authenticity_length_bits);
        }
        for (let i = 0; i < certificate_of_authenticity_length; i++) {
            let certificate_of_authenticity_bits = this.fields.certificate_of_authenticity.items[i].pack();
            bits = bits.concat(certificate_of_authenticity_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['major'] = Number(this.fields['major'].value);
        obj['minor'] = Number(this.fields['minor'].value);
        obj['unique_id'] = this.fields['unique_id'].toObj(true);
        obj['certificate_of_authenticity'] = this.fields['certificate_of_authenticity'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_HardwareVersion.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_HardwareVersion.DTID;
    }

    get name() {
        return uavcan_protocol_HardwareVersion.FULL_NAME;
    }

    get fieldNames() {
        return [
            'major',
            'minor',
            'unique_id',
            'certificate_of_authenticity',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_HardwareVersion();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 780746478857789636n;
    }

    getDataTypeSignature() {
        return 780746478857789636n;
    }

};
module.exports.uavcan_protocol_HardwareVersion = uavcan_protocol_HardwareVersion;

// JavaScript binding for uavcan.protocol.CANIfaceStats
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_CANIfaceStats = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.protocol.CANIfaceStats';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 144;
    static MIN_BIT_LEN = 144;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['frames_tx'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 48);
        this.fields['frames_rx'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 48);
        this.fields['errors'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 48);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let frames_tx_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 48), 48, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['frames_tx'].value = frames_tx_field.value
        msg.bitOffset += 48;
        let frames_rx_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 48), 48, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['frames_rx'].value = frames_rx_field.value
        msg.bitOffset += 48;
        let errors_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 48), 48, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['errors'].value = errors_field.value
        msg.bitOffset += 48;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let frames_tx_bits = this.fields.frames_tx.pack();
        bits = bits.concat(frames_tx_bits);
        let frames_rx_bits = this.fields.frames_rx.pack();
        bits = bits.concat(frames_rx_bits);
        let errors_bits = this.fields.errors.pack();
        bits = bits.concat(errors_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['frames_tx'] = Number(this.fields['frames_tx'].value);
        obj['frames_rx'] = Number(this.fields['frames_rx'].value);
        obj['errors'] = Number(this.fields['errors'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_CANIfaceStats.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_CANIfaceStats.DTID;
    }

    get name() {
        return uavcan_protocol_CANIfaceStats.FULL_NAME;
    }

    get fieldNames() {
        return [
            'frames_tx',
            'frames_rx',
            'errors',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_CANIfaceStats();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 1418922988753691472n;
    }

    getDataTypeSignature() {
        return 1418922988753691472n;
    }

};
module.exports.uavcan_protocol_CANIfaceStats = uavcan_protocol_CANIfaceStats;

// JavaScript binding for uavcan.protocol.RestartNode
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_RestartNode_Request = class {
    static DTID = 5;
    static FULL_NAME = 'uavcan.protocol.RestartNode';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 40;
    static MIN_BIT_LEN = 40;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['magic_number'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 40);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let magic_number_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 40), 40, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['magic_number'].value = magic_number_field.value
        msg.bitOffset += 40;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let magic_number_bits = this.fields.magic_number.pack();
        bits = bits.concat(magic_number_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['magic_number'] = Number(this.fields['magic_number'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_RestartNode_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_RestartNode_Request.DTID;
    }

    get name() {
        return uavcan_protocol_RestartNode_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'magic_number',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_RestartNode_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 6241431877198026736n;
    }

    getDataTypeSignature() {
        return 6241431877198026736n;
    }

};
module.exports.uavcan_protocol_RestartNode_Request = uavcan_protocol_RestartNode_Request;

// JavaScript binding for uavcan.protocol.RestartNode
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_RestartNode_Response = class {
    static DTID = 5;
    static FULL_NAME = 'uavcan.protocol.RestartNode';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 40;
    static MIN_BIT_LEN = 40;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['ok'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let ok_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['ok'].value = ok_field.value
        msg.bitOffset += 1;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let ok_bits = this.fields.ok.pack();
        bits = bits.concat(ok_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['ok'] = Number(this.fields['ok'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_RestartNode_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_RestartNode_Response.DTID;
    }

    get name() {
        return uavcan_protocol_RestartNode_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'ok',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_RestartNode_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 6241431877198026736n;
    }

    getDataTypeSignature() {
        return 6241431877198026736n;
    }

};
module.exports.uavcan_protocol_RestartNode_Response = uavcan_protocol_RestartNode_Response;

// JavaScript binding for uavcan.protocol.GetTransportStats
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_GetTransportStats_Request = class {
    static DTID = 4;
    static FULL_NAME = 'uavcan.protocol.GetTransportStats';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 0;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_GetTransportStats_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_GetTransportStats_Request.DTID;
    }

    get name() {
        return uavcan_protocol_GetTransportStats_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_GetTransportStats_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 13722317053215451908n;
    }

    getDataTypeSignature() {
        return 13722317053215451908n;
    }

};
module.exports.uavcan_protocol_GetTransportStats_Request = uavcan_protocol_GetTransportStats_Request;

// JavaScript binding for uavcan.protocol.GetTransportStats
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_GetTransportStats_Response = class {
    static DTID = 4;
    static FULL_NAME = 'uavcan.protocol.GetTransportStats';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 0;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['transfers_tx'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 48);
        this.fields['transfers_rx'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 48);
        this.fields['transfer_errors'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 48);
        this.fields['can_iface_stats'] = new ArrayType(uavcan_protocol_CANIfaceStats.sampleMessage(), ArrayType.MODE_DYNAMIC, 3);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let transfers_tx_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 48), 48, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['transfers_tx'].value = transfers_tx_field.value
        msg.bitOffset += 48;
        let transfers_rx_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 48), 48, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['transfers_rx'].value = transfers_rx_field.value
        msg.bitOffset += 48;
        let transfer_errors_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 48), 48, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['transfer_errors'].value = transfer_errors_field.value
        msg.bitOffset += 48;
        // Decode dynamic array field can_iface_stats
        let can_iface_stats_length = 0;
        if (tao) {
            can_iface_stats_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 144);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                can_iface_stats_length = bitsToArrayLength(data.getBits(msg.bitOffset, 2));
                msg.bitOffset += 2;
            } else {
                throw new RangeError('Array length exceeds maximum size: 3');
            }
        }
        if (can_iface_stats_length > 3) {
            throw new RangeError('can_iface_stats_length length exceeds maximum size: 3');
        }
        for (let i = 0; i < can_iface_stats_length; i++) {
            let can_iface_statsMsg = uavcan_protocol_CANIfaceStats.unpack(data, false, msg.bitOffset)
            msg.fields['can_iface_stats'].items.push(new CompoundType(can_iface_statsMsg, null));
            msg.bitOffset = can_iface_statsMsg.bitOffset;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let transfers_tx_bits = this.fields.transfers_tx.pack();
        bits = bits.concat(transfers_tx_bits);
        let transfers_rx_bits = this.fields.transfers_rx.pack();
        bits = bits.concat(transfers_rx_bits);
        let transfer_errors_bits = this.fields.transfer_errors.pack();
        bits = bits.concat(transfer_errors_bits);
        // Encode dynamic array field can_iface_stats
        const can_iface_stats_length = this.fields.can_iface_stats.length;
        if (this.fields.can_iface_stats.length > can_iface_stats_length) {
            throw new Error(`Array length of can_iface_stats exceeds maximum length of can_iface_stats_length`);
        }
        if (!tao) {
           let can_iface_stats_length_bits = arrayLengthToBits(this.fields.can_iface_stats.length, 2);
           bits = bits.concat(can_iface_stats_length_bits);
        }
        for (let i = 0; i < can_iface_stats_length; i++) {
            let can_iface_statsMsg_bits = this.fields.can_iface_stats.items[i].pack();
            bits = bits.concat(can_iface_statsMsg_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['transfers_tx'] = Number(this.fields['transfers_tx'].value);
        obj['transfers_rx'] = Number(this.fields['transfers_rx'].value);
        obj['transfer_errors'] = Number(this.fields['transfer_errors'].value);
        obj['can_iface_stats'] = this.fields['can_iface_stats'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_GetTransportStats_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_GetTransportStats_Response.DTID;
    }

    get name() {
        return uavcan_protocol_GetTransportStats_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'transfers_tx',
            'transfers_rx',
            'transfer_errors',
            'can_iface_stats',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_GetTransportStats_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 13722317053215451908n;
    }

    getDataTypeSignature() {
        return 13722317053215451908n;
    }

};
module.exports.uavcan_protocol_GetTransportStats_Response = uavcan_protocol_GetTransportStats_Response;

// JavaScript binding for uavcan.protocol.file.EntryType
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_file_EntryType = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.protocol.file.EntryType';
    static CONSTANTS = {'flags': {'FLAG_FILE': 1, 'FLAG_DIRECTORY': 2, 'FLAG_SYMLINK': 4, 'FLAG_READABLE': 8, 'FLAG_WRITEABLE': 16}};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['flags'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let flags_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['flags'].value = flags_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let flags_bits = this.fields.flags.pack();
        bits = bits.concat(flags_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['flags'] = Number(this.fields['flags'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_file_EntryType.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_file_EntryType.DTID;
    }

    get name() {
        return uavcan_protocol_file_EntryType.FULL_NAME;
    }

    get fieldNames() {
        return [
            'flags',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_file_EntryType();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 7576276335658567397n;
    }

    getDataTypeSignature() {
        return 7576276335658567397n;
    }

};
module.exports.uavcan_protocol_file_EntryType = uavcan_protocol_file_EntryType;

// JavaScript binding for uavcan.protocol.file.Write
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_file_Write_Request = class {
    static DTID = 49;
    static FULL_NAME = 'uavcan.protocol.file.Write';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 3192;
    static MIN_BIT_LEN = 40;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['offset'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 40);
        this.fields['path'] = new CompoundType(uavcan_protocol_file_Path.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['data'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 192 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let offset_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 40), 40, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['offset'].value = offset_field.value
        msg.bitOffset += 40;
        let pathMsg = uavcan_protocol_file_Path.unpack(data, false, msg.bitOffset)
        msg.fields['path'].msg = pathMsg;
        msg.bitOffset = pathMsg.bitOffset;
        // Decode dynamic array field data
        let data_length = 0;
        if (tao) {
            data_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                data_length = bitsToArrayLength(data.getBits(msg.bitOffset, 8));
                msg.bitOffset += 8;
            } else {
                throw new RangeError('Array length exceeds maximum size: 192');
            }
        }
        if (data_length > 192) {
            throw new RangeError('data_length length exceeds maximum size: 192');
        }
        for (let i = 0; i < data_length; i++) {
            msg.fields['data'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let offset_bits = this.fields.offset.pack();
        bits = bits.concat(offset_bits);
        let pathMsg_bits = this.fields.path.pack(false);
        bits = bits.concat(pathMsg_bits);
        // Encode dynamic array field data
        const data_length = this.fields.data.length;
        if (this.fields.data.length > data_length) {
            throw new Error(`Array length of data exceeds maximum length of data_length`);
        }
        if (!tao) {
           let data_length_bits = arrayLengthToBits(this.fields.data.length, 8);
           bits = bits.concat(data_length_bits);
        }
        for (let i = 0; i < data_length; i++) {
            let data_bits = this.fields.data.items[i].pack();
            bits = bits.concat(data_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['offset'] = Number(this.fields['offset'].value);
        obj['path'] = this.fields['path'].toObj();
        obj['data'] = this.fields['data'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_file_Write_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_file_Write_Request.DTID;
    }

    get name() {
        return uavcan_protocol_file_Write_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'offset',
            'path',
            'data',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_file_Write_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 5862175833252529193n;
    }

    getDataTypeSignature() {
        return 5862175833252529193n;
    }

};
module.exports.uavcan_protocol_file_Write_Request = uavcan_protocol_file_Write_Request;

// JavaScript binding for uavcan.protocol.file.Write
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_file_Write_Response = class {
    static DTID = 49;
    static FULL_NAME = 'uavcan.protocol.file.Write';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 3192;
    static MIN_BIT_LEN = 40;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['error'] = new CompoundType(uavcan_protocol_file_Error.sampleMessage(), CompoundType.KIND_MESSAGE, null);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let errorMsg = uavcan_protocol_file_Error.unpack(data, true, msg.bitOffset)
        msg.fields['error'].msg = errorMsg;
        msg.bitOffset = errorMsg.bitOffset;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let errorMsg_bits = this.fields.error.pack();
        bits = bits.concat(errorMsg_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['error'] = this.fields['error'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_file_Write_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_file_Write_Response.DTID;
    }

    get name() {
        return uavcan_protocol_file_Write_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'error',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_file_Write_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 5862175833252529193n;
    }

    getDataTypeSignature() {
        return 5862175833252529193n;
    }

};
module.exports.uavcan_protocol_file_Write_Response = uavcan_protocol_file_Write_Response;

// JavaScript binding for uavcan.protocol.file.Path
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_file_Path = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.protocol.file.Path';
    static CONSTANTS = {'path': {'SEPARATOR': 47}};
    static MAX_BIT_LEN = 1608;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['path'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 200 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field path
        let path_length = 0;
        if (tao) {
            path_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                path_length = bitsToArrayLength(data.getBits(msg.bitOffset, 8));
                msg.bitOffset += 8;
            } else {
                throw new RangeError('Array length exceeds maximum size: 200');
            }
        }
        if (path_length > 200) {
            throw new RangeError('path_length length exceeds maximum size: 200');
        }
        for (let i = 0; i < path_length; i++) {
            msg.fields['path'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field path
        const path_length = this.fields.path.length;
        if (this.fields.path.length > path_length) {
            throw new Error(`Array length of path exceeds maximum length of path_length`);
        }
        if (!tao) {
           let path_length_bits = arrayLengthToBits(this.fields.path.length, 8);
           bits = bits.concat(path_length_bits);
        }
        for (let i = 0; i < path_length; i++) {
            let path_bits = this.fields.path.items[i].pack();
            bits = bits.concat(path_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['path'] = this.fields['path'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_file_Path.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_file_Path.DTID;
    }

    get name() {
        return uavcan_protocol_file_Path.FULL_NAME;
    }

    get fieldNames() {
        return [
            'path',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_file_Path();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 1346290761431925730n;
    }

    getDataTypeSignature() {
        return 1346290761431925730n;
    }

};
module.exports.uavcan_protocol_file_Path = uavcan_protocol_file_Path;

// JavaScript binding for uavcan.protocol.file.GetDirectoryEntryInfo
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_file_GetDirectoryEntryInfo_Request = class {
    static DTID = 46;
    static FULL_NAME = 'uavcan.protocol.file.GetDirectoryEntryInfo';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1640;
    static MIN_BIT_LEN = 32;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['entry_index'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['directory_path'] = new CompoundType(uavcan_protocol_file_Path.sampleMessage(), CompoundType.KIND_MESSAGE, null);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let entry_index_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['entry_index'].value = entry_index_field.value
        msg.bitOffset += 32;
        let directory_pathMsg = uavcan_protocol_file_Path.unpack(data, true, msg.bitOffset)
        msg.fields['directory_path'].msg = directory_pathMsg;
        msg.bitOffset = directory_pathMsg.bitOffset;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let entry_index_bits = this.fields.entry_index.pack();
        bits = bits.concat(entry_index_bits);
        let directory_pathMsg_bits = this.fields.directory_path.pack();
        bits = bits.concat(directory_pathMsg_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['entry_index'] = Number(this.fields['entry_index'].value);
        obj['directory_path'] = this.fields['directory_path'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_file_GetDirectoryEntryInfo_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_file_GetDirectoryEntryInfo_Request.DTID;
    }

    get name() {
        return uavcan_protocol_file_GetDirectoryEntryInfo_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'entry_index',
            'directory_path',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_file_GetDirectoryEntryInfo_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 10108022236268714617n;
    }

    getDataTypeSignature() {
        return 10108022236268714617n;
    }

};
module.exports.uavcan_protocol_file_GetDirectoryEntryInfo_Request = uavcan_protocol_file_GetDirectoryEntryInfo_Request;

// JavaScript binding for uavcan.protocol.file.GetDirectoryEntryInfo
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_file_GetDirectoryEntryInfo_Response = class {
    static DTID = 46;
    static FULL_NAME = 'uavcan.protocol.file.GetDirectoryEntryInfo';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1640;
    static MIN_BIT_LEN = 32;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['error'] = new CompoundType(uavcan_protocol_file_Error.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['entry_type'] = new CompoundType(uavcan_protocol_file_EntryType.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['entry_full_path'] = new CompoundType(uavcan_protocol_file_Path.sampleMessage(), CompoundType.KIND_MESSAGE, null);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let errorMsg = uavcan_protocol_file_Error.unpack(data, false, msg.bitOffset)
        msg.fields['error'].msg = errorMsg;
        msg.bitOffset = errorMsg.bitOffset;
        let entry_typeMsg = uavcan_protocol_file_EntryType.unpack(data, false, msg.bitOffset)
        msg.fields['entry_type'].msg = entry_typeMsg;
        msg.bitOffset = entry_typeMsg.bitOffset;
        let entry_full_pathMsg = uavcan_protocol_file_Path.unpack(data, true, msg.bitOffset)
        msg.fields['entry_full_path'].msg = entry_full_pathMsg;
        msg.bitOffset = entry_full_pathMsg.bitOffset;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let errorMsg_bits = this.fields.error.pack(false);
        bits = bits.concat(errorMsg_bits);
        let entry_typeMsg_bits = this.fields.entry_type.pack(false);
        bits = bits.concat(entry_typeMsg_bits);
        let entry_full_pathMsg_bits = this.fields.entry_full_path.pack();
        bits = bits.concat(entry_full_pathMsg_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['error'] = this.fields['error'].toObj();
        obj['entry_type'] = this.fields['entry_type'].toObj();
        obj['entry_full_path'] = this.fields['entry_full_path'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_file_GetDirectoryEntryInfo_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_file_GetDirectoryEntryInfo_Response.DTID;
    }

    get name() {
        return uavcan_protocol_file_GetDirectoryEntryInfo_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'error',
            'entry_type',
            'entry_full_path',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_file_GetDirectoryEntryInfo_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 10108022236268714617n;
    }

    getDataTypeSignature() {
        return 10108022236268714617n;
    }

};
module.exports.uavcan_protocol_file_GetDirectoryEntryInfo_Response = uavcan_protocol_file_GetDirectoryEntryInfo_Response;

// JavaScript binding for uavcan.protocol.file.GetInfo
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_file_GetInfo_Request = class {
    static DTID = 45;
    static FULL_NAME = 'uavcan.protocol.file.GetInfo';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1608;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['path'] = new CompoundType(uavcan_protocol_file_Path.sampleMessage(), CompoundType.KIND_MESSAGE, null);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let pathMsg = uavcan_protocol_file_Path.unpack(data, true, msg.bitOffset)
        msg.fields['path'].msg = pathMsg;
        msg.bitOffset = pathMsg.bitOffset;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let pathMsg_bits = this.fields.path.pack();
        bits = bits.concat(pathMsg_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['path'] = this.fields['path'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_file_GetInfo_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_file_GetInfo_Request.DTID;
    }

    get name() {
        return uavcan_protocol_file_GetInfo_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'path',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_file_GetInfo_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 5765884188786062641n;
    }

    getDataTypeSignature() {
        return 5765884188786062641n;
    }

};
module.exports.uavcan_protocol_file_GetInfo_Request = uavcan_protocol_file_GetInfo_Request;

// JavaScript binding for uavcan.protocol.file.GetInfo
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_file_GetInfo_Response = class {
    static DTID = 45;
    static FULL_NAME = 'uavcan.protocol.file.GetInfo';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1608;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['size'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 40);
        this.fields['error'] = new CompoundType(uavcan_protocol_file_Error.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['entry_type'] = new CompoundType(uavcan_protocol_file_EntryType.sampleMessage(), CompoundType.KIND_MESSAGE, null);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let size_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 40), 40, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['size'].value = size_field.value
        msg.bitOffset += 40;
        let errorMsg = uavcan_protocol_file_Error.unpack(data, false, msg.bitOffset)
        msg.fields['error'].msg = errorMsg;
        msg.bitOffset = errorMsg.bitOffset;
        let entry_typeMsg = uavcan_protocol_file_EntryType.unpack(data, true, msg.bitOffset)
        msg.fields['entry_type'].msg = entry_typeMsg;
        msg.bitOffset = entry_typeMsg.bitOffset;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let size_bits = this.fields.size.pack();
        bits = bits.concat(size_bits);
        let errorMsg_bits = this.fields.error.pack(false);
        bits = bits.concat(errorMsg_bits);
        let entry_typeMsg_bits = this.fields.entry_type.pack();
        bits = bits.concat(entry_typeMsg_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['size'] = Number(this.fields['size'].value);
        obj['error'] = this.fields['error'].toObj();
        obj['entry_type'] = this.fields['entry_type'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_file_GetInfo_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_file_GetInfo_Response.DTID;
    }

    get name() {
        return uavcan_protocol_file_GetInfo_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'size',
            'error',
            'entry_type',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_file_GetInfo_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 5765884188786062641n;
    }

    getDataTypeSignature() {
        return 5765884188786062641n;
    }

};
module.exports.uavcan_protocol_file_GetInfo_Response = uavcan_protocol_file_GetInfo_Response;

// JavaScript binding for uavcan.protocol.file.Delete
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_file_Delete_Request = class {
    static DTID = 47;
    static FULL_NAME = 'uavcan.protocol.file.Delete';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1608;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['path'] = new CompoundType(uavcan_protocol_file_Path.sampleMessage(), CompoundType.KIND_MESSAGE, null);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let pathMsg = uavcan_protocol_file_Path.unpack(data, true, msg.bitOffset)
        msg.fields['path'].msg = pathMsg;
        msg.bitOffset = pathMsg.bitOffset;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let pathMsg_bits = this.fields.path.pack();
        bits = bits.concat(pathMsg_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['path'] = this.fields['path'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_file_Delete_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_file_Delete_Request.DTID;
    }

    get name() {
        return uavcan_protocol_file_Delete_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'path',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_file_Delete_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 8675213371366918058n;
    }

    getDataTypeSignature() {
        return 8675213371366918058n;
    }

};
module.exports.uavcan_protocol_file_Delete_Request = uavcan_protocol_file_Delete_Request;

// JavaScript binding for uavcan.protocol.file.Delete
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_file_Delete_Response = class {
    static DTID = 47;
    static FULL_NAME = 'uavcan.protocol.file.Delete';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1608;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['error'] = new CompoundType(uavcan_protocol_file_Error.sampleMessage(), CompoundType.KIND_MESSAGE, null);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let errorMsg = uavcan_protocol_file_Error.unpack(data, true, msg.bitOffset)
        msg.fields['error'].msg = errorMsg;
        msg.bitOffset = errorMsg.bitOffset;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let errorMsg_bits = this.fields.error.pack();
        bits = bits.concat(errorMsg_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['error'] = this.fields['error'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_file_Delete_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_file_Delete_Response.DTID;
    }

    get name() {
        return uavcan_protocol_file_Delete_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'error',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_file_Delete_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 8675213371366918058n;
    }

    getDataTypeSignature() {
        return 8675213371366918058n;
    }

};
module.exports.uavcan_protocol_file_Delete_Response = uavcan_protocol_file_Delete_Response;

// JavaScript binding for uavcan.protocol.file.Error
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_file_Error = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.protocol.file.Error';
    static CONSTANTS = {'value': {'OK': 0, 'UNKNOWN_ERROR': 32767, 'NOT_FOUND': 2, 'IO_ERROR': 5, 'ACCESS_DENIED': 13, 'IS_DIRECTORY': 21, 'INVALID_VALUE': 22, 'FILE_TOO_LARGE': 27, 'OUT_OF_SPACE': 28, 'NOT_IMPLEMENTED': 38}};
    static MAX_BIT_LEN = 16;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['value'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let value_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['value'].value = value_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let value_bits = this.fields.value.pack();
        bits = bits.concat(value_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['value'] = Number(this.fields['value'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_file_Error.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_file_Error.DTID;
    }

    get name() {
        return uavcan_protocol_file_Error.FULL_NAME;
    }

    get fieldNames() {
        return [
            'value',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_file_Error();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 12119311941215694357n;
    }

    getDataTypeSignature() {
        return 12119311941215694357n;
    }

};
module.exports.uavcan_protocol_file_Error = uavcan_protocol_file_Error;

// JavaScript binding for uavcan.protocol.file.BeginFirmwareUpdate
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_file_BeginFirmwareUpdate_Request = class {
    static DTID = 40;
    static FULL_NAME = 'uavcan.protocol.file.BeginFirmwareUpdate';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1616;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['source_node_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['image_file_remote_path'] = new CompoundType(uavcan_protocol_file_Path.sampleMessage(), CompoundType.KIND_MESSAGE, null);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let source_node_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['source_node_id'].value = source_node_id_field.value
        msg.bitOffset += 8;
        let image_file_remote_pathMsg = uavcan_protocol_file_Path.unpack(data, true, msg.bitOffset)
        msg.fields['image_file_remote_path'].msg = image_file_remote_pathMsg;
        msg.bitOffset = image_file_remote_pathMsg.bitOffset;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let source_node_id_bits = this.fields.source_node_id.pack();
        bits = bits.concat(source_node_id_bits);
        let image_file_remote_pathMsg_bits = this.fields.image_file_remote_path.pack();
        bits = bits.concat(image_file_remote_pathMsg_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['source_node_id'] = Number(this.fields['source_node_id'].value);
        obj['image_file_remote_path'] = this.fields['image_file_remote_path'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_file_BeginFirmwareUpdate_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_file_BeginFirmwareUpdate_Request.DTID;
    }

    get name() {
        return uavcan_protocol_file_BeginFirmwareUpdate_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'source_node_id',
            'image_file_remote_path',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_file_BeginFirmwareUpdate_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 13247098470561628454n;
    }

    getDataTypeSignature() {
        return 13247098470561628454n;
    }

};
module.exports.uavcan_protocol_file_BeginFirmwareUpdate_Request = uavcan_protocol_file_BeginFirmwareUpdate_Request;

// JavaScript binding for uavcan.protocol.file.BeginFirmwareUpdate
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_file_BeginFirmwareUpdate_Response = class {
    static DTID = 40;
    static FULL_NAME = 'uavcan.protocol.file.BeginFirmwareUpdate';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1616;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['error'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['optional_error_message'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 127 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let error_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['error'].value = error_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field optional_error_message
        let optional_error_message_length = 0;
        if (tao) {
            optional_error_message_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                optional_error_message_length = bitsToArrayLength(data.getBits(msg.bitOffset, 7));
                msg.bitOffset += 7;
            } else {
                throw new RangeError('Array length exceeds maximum size: 127');
            }
        }
        if (optional_error_message_length > 127) {
            throw new RangeError('optional_error_message_length length exceeds maximum size: 127');
        }
        for (let i = 0; i < optional_error_message_length; i++) {
            msg.fields['optional_error_message'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let error_bits = this.fields.error.pack();
        bits = bits.concat(error_bits);
        // Encode dynamic array field optional_error_message
        const optional_error_message_length = this.fields.optional_error_message.length;
        if (this.fields.optional_error_message.length > optional_error_message_length) {
            throw new Error(`Array length of optional_error_message exceeds maximum length of optional_error_message_length`);
        }
        if (!tao) {
           let optional_error_message_length_bits = arrayLengthToBits(this.fields.optional_error_message.length, 7);
           bits = bits.concat(optional_error_message_length_bits);
        }
        for (let i = 0; i < optional_error_message_length; i++) {
            let optional_error_message_bits = this.fields.optional_error_message.items[i].pack();
            bits = bits.concat(optional_error_message_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['error'] = Number(this.fields['error'].value);
        obj['optional_error_message'] = this.fields['optional_error_message'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_file_BeginFirmwareUpdate_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_file_BeginFirmwareUpdate_Response.DTID;
    }

    get name() {
        return uavcan_protocol_file_BeginFirmwareUpdate_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'error',
            'optional_error_message',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_file_BeginFirmwareUpdate_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 13247098470561628454n;
    }

    getDataTypeSignature() {
        return 13247098470561628454n;
    }

};
module.exports.uavcan_protocol_file_BeginFirmwareUpdate_Response = uavcan_protocol_file_BeginFirmwareUpdate_Response;

// JavaScript binding for uavcan.protocol.file.Read
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_file_Read_Request = class {
    static DTID = 48;
    static FULL_NAME = 'uavcan.protocol.file.Read';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1648;
    static MIN_BIT_LEN = 40;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['offset'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 40);
        this.fields['path'] = new CompoundType(uavcan_protocol_file_Path.sampleMessage(), CompoundType.KIND_MESSAGE, null);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let offset_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 40), 40, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['offset'].value = offset_field.value
        msg.bitOffset += 40;
        let pathMsg = uavcan_protocol_file_Path.unpack(data, true, msg.bitOffset)
        msg.fields['path'].msg = pathMsg;
        msg.bitOffset = pathMsg.bitOffset;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let offset_bits = this.fields.offset.pack();
        bits = bits.concat(offset_bits);
        let pathMsg_bits = this.fields.path.pack();
        bits = bits.concat(pathMsg_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['offset'] = Number(this.fields['offset'].value);
        obj['path'] = this.fields['path'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_file_Read_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_file_Read_Request.DTID;
    }

    get name() {
        return uavcan_protocol_file_Read_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'offset',
            'path',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_file_Read_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 10218045864953509496n;
    }

    getDataTypeSignature() {
        return 10218045864953509496n;
    }

};
module.exports.uavcan_protocol_file_Read_Request = uavcan_protocol_file_Read_Request;

// JavaScript binding for uavcan.protocol.file.Read
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_file_Read_Response = class {
    static DTID = 48;
    static FULL_NAME = 'uavcan.protocol.file.Read';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1648;
    static MIN_BIT_LEN = 40;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['error'] = new CompoundType(uavcan_protocol_file_Error.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['data'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 256 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let errorMsg = uavcan_protocol_file_Error.unpack(data, false, msg.bitOffset)
        msg.fields['error'].msg = errorMsg;
        msg.bitOffset = errorMsg.bitOffset;
        // Decode dynamic array field data
        let data_length = 0;
        if (tao) {
            data_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                data_length = bitsToArrayLength(data.getBits(msg.bitOffset, 9));
                msg.bitOffset += 9;
            } else {
                throw new RangeError('Array length exceeds maximum size: 256');
            }
        }
        if (data_length > 256) {
            throw new RangeError('data_length length exceeds maximum size: 256');
        }
        for (let i = 0; i < data_length; i++) {
            msg.fields['data'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let errorMsg_bits = this.fields.error.pack(false);
        bits = bits.concat(errorMsg_bits);
        // Encode dynamic array field data
        const data_length = this.fields.data.length;
        if (this.fields.data.length > data_length) {
            throw new Error(`Array length of data exceeds maximum length of data_length`);
        }
        if (!tao) {
           let data_length_bits = arrayLengthToBits(this.fields.data.length, 9);
           bits = bits.concat(data_length_bits);
        }
        for (let i = 0; i < data_length; i++) {
            let data_bits = this.fields.data.items[i].pack();
            bits = bits.concat(data_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['error'] = this.fields['error'].toObj();
        obj['data'] = this.fields['data'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_file_Read_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_file_Read_Response.DTID;
    }

    get name() {
        return uavcan_protocol_file_Read_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'error',
            'data',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_file_Read_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 10218045864953509496n;
    }

    getDataTypeSignature() {
        return 10218045864953509496n;
    }

};
module.exports.uavcan_protocol_file_Read_Response = uavcan_protocol_file_Read_Response;

// JavaScript binding for uavcan.protocol.dynamic_node_id.Allocation
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_dynamic_node_id_Allocation = class {
    static DTID = 1;
    static FULL_NAME = 'uavcan.protocol.dynamic_node_id.Allocation';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 141;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['node_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
        this.fields['first_part_of_unique_id'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['unique_id'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 16 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let node_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['node_id'].value = node_id_field.value
        msg.bitOffset += 7;
        let first_part_of_unique_id_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['first_part_of_unique_id'].value = first_part_of_unique_id_field.value
        msg.bitOffset += 1;
        // Decode dynamic array field unique_id
        let unique_id_length = 0;
        if (tao) {
            unique_id_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                unique_id_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
                msg.bitOffset += 5;
            } else {
                throw new RangeError('Array length exceeds maximum size: 16');
            }
        }
        if (unique_id_length > 16) {
            throw new RangeError('unique_id_length length exceeds maximum size: 16');
        }
        for (let i = 0; i < unique_id_length; i++) {
            msg.fields['unique_id'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let node_id_bits = this.fields.node_id.pack();
        bits = bits.concat(node_id_bits);
        let first_part_of_unique_id_bits = this.fields.first_part_of_unique_id.pack();
        bits = bits.concat(first_part_of_unique_id_bits);
        // Encode dynamic array field unique_id
        const unique_id_length = this.fields.unique_id.length;
        if (this.fields.unique_id.length > unique_id_length) {
            throw new Error(`Array length of unique_id exceeds maximum length of unique_id_length`);
        }
        if (!tao) {
           let unique_id_length_bits = arrayLengthToBits(this.fields.unique_id.length, 5);
           bits = bits.concat(unique_id_length_bits);
        }
        for (let i = 0; i < unique_id_length; i++) {
            let unique_id_bits = this.fields.unique_id.items[i].pack();
            bits = bits.concat(unique_id_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['node_id'] = Number(this.fields['node_id'].value);
        obj['first_part_of_unique_id'] = Number(this.fields['first_part_of_unique_id'].value);
        obj['unique_id'] = this.fields['unique_id'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_dynamic_node_id_Allocation.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_dynamic_node_id_Allocation.DTID;
    }

    get name() {
        return uavcan_protocol_dynamic_node_id_Allocation.FULL_NAME;
    }

    get fieldNames() {
        return [
            'node_id',
            'first_part_of_unique_id',
            'unique_id',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_dynamic_node_id_Allocation();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 804597484195224896n;
    }

    getDataTypeSignature() {
        return 804597484195224896n;
    }

};
module.exports.uavcan_protocol_dynamic_node_id_Allocation = uavcan_protocol_dynamic_node_id_Allocation;

// JavaScript binding for uavcan.protocol.dynamic_node_id.server.RequestVote
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_dynamic_node_id_server_RequestVote_Request = class {
    static DTID = 31;
    static FULL_NAME = 'uavcan.protocol.dynamic_node_id.server.RequestVote';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 72;
    static MIN_BIT_LEN = 72;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['term'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['last_log_term'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['last_log_index'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let term_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['term'].value = term_field.value
        msg.bitOffset += 32;
        let last_log_term_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['last_log_term'].value = last_log_term_field.value
        msg.bitOffset += 32;
        let last_log_index_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['last_log_index'].value = last_log_index_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let term_bits = this.fields.term.pack();
        bits = bits.concat(term_bits);
        let last_log_term_bits = this.fields.last_log_term.pack();
        bits = bits.concat(last_log_term_bits);
        let last_log_index_bits = this.fields.last_log_index.pack();
        bits = bits.concat(last_log_index_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['term'] = Number(this.fields['term'].value);
        obj['last_log_term'] = Number(this.fields['last_log_term'].value);
        obj['last_log_index'] = Number(this.fields['last_log_index'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_dynamic_node_id_server_RequestVote_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_dynamic_node_id_server_RequestVote_Request.DTID;
    }

    get name() {
        return uavcan_protocol_dynamic_node_id_server_RequestVote_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'term',
            'last_log_term',
            'last_log_index',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_dynamic_node_id_server_RequestVote_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 14834302724654588758n;
    }

    getDataTypeSignature() {
        return 14834302724654588758n;
    }

};
module.exports.uavcan_protocol_dynamic_node_id_server_RequestVote_Request = uavcan_protocol_dynamic_node_id_server_RequestVote_Request;

// JavaScript binding for uavcan.protocol.dynamic_node_id.server.RequestVote
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_dynamic_node_id_server_RequestVote_Response = class {
    static DTID = 31;
    static FULL_NAME = 'uavcan.protocol.dynamic_node_id.server.RequestVote';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 72;
    static MIN_BIT_LEN = 72;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['term'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['vote_granted'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let term_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['term'].value = term_field.value
        msg.bitOffset += 32;
        let vote_granted_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['vote_granted'].value = vote_granted_field.value
        msg.bitOffset += 1;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let term_bits = this.fields.term.pack();
        bits = bits.concat(term_bits);
        let vote_granted_bits = this.fields.vote_granted.pack();
        bits = bits.concat(vote_granted_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['term'] = Number(this.fields['term'].value);
        obj['vote_granted'] = Number(this.fields['vote_granted'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_dynamic_node_id_server_RequestVote_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_dynamic_node_id_server_RequestVote_Response.DTID;
    }

    get name() {
        return uavcan_protocol_dynamic_node_id_server_RequestVote_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'term',
            'vote_granted',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_dynamic_node_id_server_RequestVote_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 14834302724654588758n;
    }

    getDataTypeSignature() {
        return 14834302724654588758n;
    }

};
module.exports.uavcan_protocol_dynamic_node_id_server_RequestVote_Response = uavcan_protocol_dynamic_node_id_server_RequestVote_Response;

// JavaScript binding for uavcan.protocol.dynamic_node_id.server.Discovery
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_dynamic_node_id_server_Discovery = class {
    static DTID = 390;
    static FULL_NAME = 'uavcan.protocol.dynamic_node_id.server.Discovery';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 51;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['configured_cluster_size'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['known_nodes'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 5 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let configured_cluster_size_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['configured_cluster_size'].value = configured_cluster_size_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field known_nodes
        let known_nodes_length = 0;
        if (tao) {
            known_nodes_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                known_nodes_length = bitsToArrayLength(data.getBits(msg.bitOffset, 3));
                msg.bitOffset += 3;
            } else {
                throw new RangeError('Array length exceeds maximum size: 5');
            }
        }
        if (known_nodes_length > 5) {
            throw new RangeError('known_nodes_length length exceeds maximum size: 5');
        }
        for (let i = 0; i < known_nodes_length; i++) {
            msg.fields['known_nodes'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let configured_cluster_size_bits = this.fields.configured_cluster_size.pack();
        bits = bits.concat(configured_cluster_size_bits);
        // Encode dynamic array field known_nodes
        const known_nodes_length = this.fields.known_nodes.length;
        if (this.fields.known_nodes.length > known_nodes_length) {
            throw new Error(`Array length of known_nodes exceeds maximum length of known_nodes_length`);
        }
        if (!tao) {
           let known_nodes_length_bits = arrayLengthToBits(this.fields.known_nodes.length, 3);
           bits = bits.concat(known_nodes_length_bits);
        }
        for (let i = 0; i < known_nodes_length; i++) {
            let known_nodes_bits = this.fields.known_nodes.items[i].pack();
            bits = bits.concat(known_nodes_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['configured_cluster_size'] = Number(this.fields['configured_cluster_size'].value);
        obj['known_nodes'] = this.fields['known_nodes'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_dynamic_node_id_server_Discovery.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_dynamic_node_id_server_Discovery.DTID;
    }

    get name() {
        return uavcan_protocol_dynamic_node_id_server_Discovery.FULL_NAME;
    }

    get fieldNames() {
        return [
            'configured_cluster_size',
            'known_nodes',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_dynamic_node_id_server_Discovery();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 9375055116856893217n;
    }

    getDataTypeSignature() {
        return 9375055116856893217n;
    }

};
module.exports.uavcan_protocol_dynamic_node_id_server_Discovery = uavcan_protocol_dynamic_node_id_server_Discovery;

// JavaScript binding for uavcan.protocol.dynamic_node_id.server.AppendEntries
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_dynamic_node_id_server_AppendEntries_Request = class {
    static DTID = 30;
    static FULL_NAME = 'uavcan.protocol.dynamic_node_id.server.AppendEntries';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 249;
    static MIN_BIT_LEN = 80;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['term'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['prev_log_term'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['prev_log_index'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['leader_commit'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['entries'] = new ArrayType(uavcan_protocol_dynamic_node_id_server_Entry.sampleMessage(), ArrayType.MODE_DYNAMIC, 1);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let term_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['term'].value = term_field.value
        msg.bitOffset += 32;
        let prev_log_term_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['prev_log_term'].value = prev_log_term_field.value
        msg.bitOffset += 32;
        let prev_log_index_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['prev_log_index'].value = prev_log_index_field.value
        msg.bitOffset += 8;
        let leader_commit_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['leader_commit'].value = leader_commit_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field entries
        let entries_length = 0;
        if (tao) {
            entries_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 168);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                entries_length = bitsToArrayLength(data.getBits(msg.bitOffset, 1));
                msg.bitOffset += 1;
            } else {
                throw new RangeError('Array length exceeds maximum size: 1');
            }
        }
        if (entries_length > 1) {
            throw new RangeError('entries_length length exceeds maximum size: 1');
        }
        for (let i = 0; i < entries_length; i++) {
            let entriesMsg = uavcan_protocol_dynamic_node_id_server_Entry.unpack(data, false, msg.bitOffset)
            msg.fields['entries'].items.push(new CompoundType(entriesMsg, null));
            msg.bitOffset = entriesMsg.bitOffset;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let term_bits = this.fields.term.pack();
        bits = bits.concat(term_bits);
        let prev_log_term_bits = this.fields.prev_log_term.pack();
        bits = bits.concat(prev_log_term_bits);
        let prev_log_index_bits = this.fields.prev_log_index.pack();
        bits = bits.concat(prev_log_index_bits);
        let leader_commit_bits = this.fields.leader_commit.pack();
        bits = bits.concat(leader_commit_bits);
        // Encode dynamic array field entries
        const entries_length = this.fields.entries.length;
        if (this.fields.entries.length > entries_length) {
            throw new Error(`Array length of entries exceeds maximum length of entries_length`);
        }
        if (!tao) {
           let entries_length_bits = arrayLengthToBits(this.fields.entries.length, 1);
           bits = bits.concat(entries_length_bits);
        }
        for (let i = 0; i < entries_length; i++) {
            let entriesMsg_bits = this.fields.entries.items[i].pack();
            bits = bits.concat(entriesMsg_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['term'] = Number(this.fields['term'].value);
        obj['prev_log_term'] = Number(this.fields['prev_log_term'].value);
        obj['prev_log_index'] = Number(this.fields['prev_log_index'].value);
        obj['leader_commit'] = Number(this.fields['leader_commit'].value);
        obj['entries'] = this.fields['entries'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_dynamic_node_id_server_AppendEntries_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_dynamic_node_id_server_AppendEntries_Request.DTID;
    }

    get name() {
        return uavcan_protocol_dynamic_node_id_server_AppendEntries_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'term',
            'prev_log_term',
            'prev_log_index',
            'leader_commit',
            'entries',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_dynamic_node_id_server_AppendEntries_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 9237664629227299788n;
    }

    getDataTypeSignature() {
        return 9237664629227299788n;
    }

};
module.exports.uavcan_protocol_dynamic_node_id_server_AppendEntries_Request = uavcan_protocol_dynamic_node_id_server_AppendEntries_Request;

// JavaScript binding for uavcan.protocol.dynamic_node_id.server.AppendEntries
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_dynamic_node_id_server_AppendEntries_Response = class {
    static DTID = 30;
    static FULL_NAME = 'uavcan.protocol.dynamic_node_id.server.AppendEntries';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 249;
    static MIN_BIT_LEN = 80;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['term'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['success'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let term_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['term'].value = term_field.value
        msg.bitOffset += 32;
        let success_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['success'].value = success_field.value
        msg.bitOffset += 1;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let term_bits = this.fields.term.pack();
        bits = bits.concat(term_bits);
        let success_bits = this.fields.success.pack();
        bits = bits.concat(success_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['term'] = Number(this.fields['term'].value);
        obj['success'] = Number(this.fields['success'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_dynamic_node_id_server_AppendEntries_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_dynamic_node_id_server_AppendEntries_Response.DTID;
    }

    get name() {
        return uavcan_protocol_dynamic_node_id_server_AppendEntries_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'term',
            'success',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_dynamic_node_id_server_AppendEntries_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 9237664629227299788n;
    }

    getDataTypeSignature() {
        return 9237664629227299788n;
    }

};
module.exports.uavcan_protocol_dynamic_node_id_server_AppendEntries_Response = uavcan_protocol_dynamic_node_id_server_AppendEntries_Response;

// JavaScript binding for uavcan.protocol.dynamic_node_id.server.Entry
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_dynamic_node_id_server_Entry = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.protocol.dynamic_node_id.server.Entry';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 168;
    static MIN_BIT_LEN = 168;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['term'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['unique_id'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_STATIC, 16 );
        this.fields['node_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let term_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['term'].value = term_field.value
        msg.bitOffset += 32;
        // Decode static array field unique_id
        const unique_id_length = 16;
        for (let i = 0; i < unique_id_length; i++) {
            msg.fields['unique_id'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        msg.bitOffset += 1; //field.type.CATEGORY_VOID void1 for Reserved space
        let node_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['node_id'].value = node_id_field.value
        msg.bitOffset += 7;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let term_bits = this.fields.term.pack();
        bits = bits.concat(term_bits);
        // Encode static array field unique_id
        const unique_id_length = 16;
        for (let i = 0; i < unique_id_length; i++) {
            let unique_id_bits = this.fields.unique_id.items[i].pack();
            bits = bits.concat(unique_id_bits);
        }

        for (let j = 0; j < 1; j++) {
            bits.push(0);
        }
        let node_id_bits = this.fields.node_id.pack();
        bits = bits.concat(node_id_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['term'] = Number(this.fields['term'].value);
        obj['unique_id'] = this.fields['unique_id'].toObj(true);
        obj['node_id'] = Number(this.fields['node_id'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_dynamic_node_id_server_Entry.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_dynamic_node_id_server_Entry.DTID;
    }

    get name() {
        return uavcan_protocol_dynamic_node_id_server_Entry.FULL_NAME;
    }

    get fieldNames() {
        return [
            'term',
            'unique_id',
            'node_id',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_dynamic_node_id_server_Entry();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 9199296706745365954n;
    }

    getDataTypeSignature() {
        return 9199296706745365954n;
    }

};
module.exports.uavcan_protocol_dynamic_node_id_server_Entry = uavcan_protocol_dynamic_node_id_server_Entry;

// JavaScript binding for uavcan.protocol.enumeration.Begin
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_enumeration_Begin_Request = class {
    static DTID = 15;
    static FULL_NAME = 'uavcan.protocol.enumeration.Begin';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 759;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['timeout_sec'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['parameter_name'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 92 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let timeout_sec_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['timeout_sec'].value = timeout_sec_field.value
        msg.bitOffset += 16;
        // Decode dynamic array field parameter_name
        let parameter_name_length = 0;
        if (tao) {
            parameter_name_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                parameter_name_length = bitsToArrayLength(data.getBits(msg.bitOffset, 7));
                msg.bitOffset += 7;
            } else {
                throw new RangeError('Array length exceeds maximum size: 92');
            }
        }
        if (parameter_name_length > 92) {
            throw new RangeError('parameter_name_length length exceeds maximum size: 92');
        }
        for (let i = 0; i < parameter_name_length; i++) {
            msg.fields['parameter_name'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let timeout_sec_bits = this.fields.timeout_sec.pack();
        bits = bits.concat(timeout_sec_bits);
        // Encode dynamic array field parameter_name
        const parameter_name_length = this.fields.parameter_name.length;
        if (this.fields.parameter_name.length > parameter_name_length) {
            throw new Error(`Array length of parameter_name exceeds maximum length of parameter_name_length`);
        }
        if (!tao) {
           let parameter_name_length_bits = arrayLengthToBits(this.fields.parameter_name.length, 7);
           bits = bits.concat(parameter_name_length_bits);
        }
        for (let i = 0; i < parameter_name_length; i++) {
            let parameter_name_bits = this.fields.parameter_name.items[i].pack();
            bits = bits.concat(parameter_name_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['timeout_sec'] = Number(this.fields['timeout_sec'].value);
        obj['parameter_name'] = this.fields['parameter_name'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_enumeration_Begin_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_enumeration_Begin_Request.DTID;
    }

    get name() {
        return uavcan_protocol_enumeration_Begin_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'timeout_sec',
            'parameter_name',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_enumeration_Begin_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 1831522919229142488n;
    }

    getDataTypeSignature() {
        return 1831522919229142488n;
    }

};
module.exports.uavcan_protocol_enumeration_Begin_Request = uavcan_protocol_enumeration_Begin_Request;

// JavaScript binding for uavcan.protocol.enumeration.Begin
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_enumeration_Begin_Response = class {
    static DTID = 15;
    static FULL_NAME = 'uavcan.protocol.enumeration.Begin';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 759;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['error'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let error_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['error'].value = error_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let error_bits = this.fields.error.pack();
        bits = bits.concat(error_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['error'] = Number(this.fields['error'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_enumeration_Begin_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_enumeration_Begin_Response.DTID;
    }

    get name() {
        return uavcan_protocol_enumeration_Begin_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'error',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_enumeration_Begin_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 1831522919229142488n;
    }

    getDataTypeSignature() {
        return 1831522919229142488n;
    }

};
module.exports.uavcan_protocol_enumeration_Begin_Response = uavcan_protocol_enumeration_Begin_Response;

// JavaScript binding for uavcan.protocol.enumeration.Indication
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_enumeration_Indication = class {
    static DTID = 380;
    static FULL_NAME = 'uavcan.protocol.enumeration.Indication';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 815;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['value'] = new CompoundType(uavcan_protocol_param_NumericValue.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['parameter_name'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 92 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.bitOffset += 6; //field.type.CATEGORY_VOID void6 for Reserved space
        let valueMsg = uavcan_protocol_param_NumericValue.unpack(data, false, msg.bitOffset)
        msg.fields['value'].msg = valueMsg;
        msg.bitOffset = valueMsg.bitOffset;
        // Decode dynamic array field parameter_name
        let parameter_name_length = 0;
        if (tao) {
            parameter_name_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                parameter_name_length = bitsToArrayLength(data.getBits(msg.bitOffset, 7));
                msg.bitOffset += 7;
            } else {
                throw new RangeError('Array length exceeds maximum size: 92');
            }
        }
        if (parameter_name_length > 92) {
            throw new RangeError('parameter_name_length length exceeds maximum size: 92');
        }
        for (let i = 0; i < parameter_name_length; i++) {
            msg.fields['parameter_name'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        for (let j = 0; j < 6; j++) {
            bits.push(0);
        }
        let valueMsg_bits = this.fields.value.pack(false);
        bits = bits.concat(valueMsg_bits);
        // Encode dynamic array field parameter_name
        const parameter_name_length = this.fields.parameter_name.length;
        if (this.fields.parameter_name.length > parameter_name_length) {
            throw new Error(`Array length of parameter_name exceeds maximum length of parameter_name_length`);
        }
        if (!tao) {
           let parameter_name_length_bits = arrayLengthToBits(this.fields.parameter_name.length, 7);
           bits = bits.concat(parameter_name_length_bits);
        }
        for (let i = 0; i < parameter_name_length; i++) {
            let parameter_name_bits = this.fields.parameter_name.items[i].pack();
            bits = bits.concat(parameter_name_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['value'] = this.fields['value'].toObj();
        obj['parameter_name'] = this.fields['parameter_name'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_enumeration_Indication.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_enumeration_Indication.DTID;
    }

    get name() {
        return uavcan_protocol_enumeration_Indication.FULL_NAME;
    }

    get fieldNames() {
        return [
            'value',
            'parameter_name',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_enumeration_Indication();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 9821425206016102197n;
    }

    getDataTypeSignature() {
        return 9821425206016102197n;
    }

};
module.exports.uavcan_protocol_enumeration_Indication = uavcan_protocol_enumeration_Indication;

// JavaScript binding for uavcan.protocol.param.GetSet
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_param_GetSet_Request = class {
    static DTID = 11;
    static FULL_NAME = 'uavcan.protocol.param.GetSet';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1791;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['index'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 13);
        this.fields['value'] = new CompoundType(uavcan_protocol_param_Value.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['name'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 92 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let index_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 13), 13, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['index'].value = index_field.value
        msg.bitOffset += 13;
        let valueMsg = uavcan_protocol_param_Value.unpack(data, false, msg.bitOffset)
        msg.fields['value'].msg = valueMsg;
        msg.bitOffset = valueMsg.bitOffset;
        // Decode dynamic array field name
        let name_length = 0;
        if (tao) {
            name_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                name_length = bitsToArrayLength(data.getBits(msg.bitOffset, 7));
                msg.bitOffset += 7;
            } else {
                throw new RangeError('Array length exceeds maximum size: 92');
            }
        }
        if (name_length > 92) {
            throw new RangeError('name_length length exceeds maximum size: 92');
        }
        for (let i = 0; i < name_length; i++) {
            msg.fields['name'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let index_bits = this.fields.index.pack();
        bits = bits.concat(index_bits);
        let valueMsg_bits = this.fields.value.pack(false);
        bits = bits.concat(valueMsg_bits);
        // Encode dynamic array field name
        const name_length = this.fields.name.length;
        if (this.fields.name.length > name_length) {
            throw new Error(`Array length of name exceeds maximum length of name_length`);
        }
        if (!tao) {
           let name_length_bits = arrayLengthToBits(this.fields.name.length, 7);
           bits = bits.concat(name_length_bits);
        }
        for (let i = 0; i < name_length; i++) {
            let name_bits = this.fields.name.items[i].pack();
            bits = bits.concat(name_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['index'] = Number(this.fields['index'].value);
        obj['value'] = this.fields['value'].toObj();
        obj['name'] = this.fields['name'].toObj(false);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_param_GetSet_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_param_GetSet_Request.DTID;
    }

    get name() {
        return uavcan_protocol_param_GetSet_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'index',
            'value',
            'name',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_param_GetSet_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 12084885103907546325n;
    }

    getDataTypeSignature() {
        return 12084885103907546325n;
    }

};
module.exports.uavcan_protocol_param_GetSet_Request = uavcan_protocol_param_GetSet_Request;

// JavaScript binding for uavcan.protocol.param.GetSet
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_param_GetSet_Response = class {
    static DTID = 11;
    static FULL_NAME = 'uavcan.protocol.param.GetSet';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1791;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['value'] = new CompoundType(uavcan_protocol_param_Value.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['default_value'] = new CompoundType(uavcan_protocol_param_Value.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['max_value'] = new CompoundType(uavcan_protocol_param_NumericValue.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['min_value'] = new CompoundType(uavcan_protocol_param_NumericValue.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['name'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 92 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.bitOffset += 5; //field.type.CATEGORY_VOID void5 for Reserved space
        let valueMsg = uavcan_protocol_param_Value.unpack(data, false, msg.bitOffset)
        msg.fields['value'].msg = valueMsg;
        msg.bitOffset = valueMsg.bitOffset;
        msg.bitOffset += 5; //field.type.CATEGORY_VOID void5 for Reserved space
        let default_valueMsg = uavcan_protocol_param_Value.unpack(data, false, msg.bitOffset)
        msg.fields['default_value'].msg = default_valueMsg;
        msg.bitOffset = default_valueMsg.bitOffset;
        msg.bitOffset += 6; //field.type.CATEGORY_VOID void6 for Reserved space
        let max_valueMsg = uavcan_protocol_param_NumericValue.unpack(data, false, msg.bitOffset)
        msg.fields['max_value'].msg = max_valueMsg;
        msg.bitOffset = max_valueMsg.bitOffset;
        msg.bitOffset += 6; //field.type.CATEGORY_VOID void6 for Reserved space
        let min_valueMsg = uavcan_protocol_param_NumericValue.unpack(data, false, msg.bitOffset)
        msg.fields['min_value'].msg = min_valueMsg;
        msg.bitOffset = min_valueMsg.bitOffset;
        // Decode dynamic array field name
        let name_length = 0;
        if (tao) {
            name_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                name_length = bitsToArrayLength(data.getBits(msg.bitOffset, 7));
                msg.bitOffset += 7;
            } else {
                throw new RangeError('Array length exceeds maximum size: 92');
            }
        }
        if (name_length > 92) {
            throw new RangeError('name_length length exceeds maximum size: 92');
        }
        for (let i = 0; i < name_length; i++) {
            msg.fields['name'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        for (let j = 0; j < 5; j++) {
            bits.push(0);
        }
        let valueMsg_bits = this.fields.value.pack(false);
        bits = bits.concat(valueMsg_bits);
        for (let j = 0; j < 5; j++) {
            bits.push(0);
        }
        let default_valueMsg_bits = this.fields.default_value.pack(false);
        bits = bits.concat(default_valueMsg_bits);
        for (let j = 0; j < 6; j++) {
            bits.push(0);
        }
        let max_valueMsg_bits = this.fields.max_value.pack(false);
        bits = bits.concat(max_valueMsg_bits);
        for (let j = 0; j < 6; j++) {
            bits.push(0);
        }
        let min_valueMsg_bits = this.fields.min_value.pack(false);
        bits = bits.concat(min_valueMsg_bits);
        // Encode dynamic array field name
        const name_length = this.fields.name.length;
        if (this.fields.name.length > name_length) {
            throw new Error(`Array length of name exceeds maximum length of name_length`);
        }
        if (!tao) {
           let name_length_bits = arrayLengthToBits(this.fields.name.length, 7);
           bits = bits.concat(name_length_bits);
        }
        for (let i = 0; i < name_length; i++) {
            let name_bits = this.fields.name.items[i].pack();
            bits = bits.concat(name_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['value'] = this.fields['value'].toObj();
        obj['default_value'] = this.fields['default_value'].toObj();
        obj['max_value'] = this.fields['max_value'].toObj();
        obj['min_value'] = this.fields['min_value'].toObj();
        obj['name'] = this.fields['name'].toObj(false);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_param_GetSet_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_param_GetSet_Response.DTID;
    }

    get name() {
        return uavcan_protocol_param_GetSet_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'value',
            'default_value',
            'max_value',
            'min_value',
            'name',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_param_GetSet_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 12084885103907546325n;
    }

    getDataTypeSignature() {
        return 12084885103907546325n;
    }

};
module.exports.uavcan_protocol_param_GetSet_Response = uavcan_protocol_param_GetSet_Response;

// JavaScript binding for uavcan.protocol.param.Empty
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_param_Empty = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.protocol.param.Empty';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 0;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_param_Empty.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_param_Empty.DTID;
    }

    get name() {
        return uavcan_protocol_param_Empty.FULL_NAME;
    }

    get fieldNames() {
        return [
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_param_Empty();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 7803909736435507679n;
    }

    getDataTypeSignature() {
        return 7803909736435507679n;
    }

};
module.exports.uavcan_protocol_param_Empty = uavcan_protocol_param_Empty;

// JavaScript binding for uavcan.protocol.param.Value
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_param_Value = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.protocol.param.Value';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1035;
    static MIN_BIT_LEN = 3;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = true;
        this.fields = {};
        this.unionFieldIndex = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 3 );
        this.unionFields = ['empty','integer_value','real_value','boolean_value','string_value'];
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.unionFieldIndex = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 3), 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.bitOffset += 3;
        switch(msg.unionFieldIndex.value) {
            case 0:
                msg.fields['empty'] = uavcan_protocol_param_Empty.unpack(data, false, msg.bitOffset);
                msg.bitOffset = msg.fields['empty'].bitOffset;
                break;
            case 1:
                msg.fields['integer_value'] = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 64), 64, PrimitiveType.CAST_MODE_SATURATED);
                msg.bitOffset += 64;
                break;
            case 2:
                msg.fields['real_value'] = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
                msg.bitOffset += 32;
                break;
            case 3:
                msg.fields['boolean_value'] = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
                msg.bitOffset += 8;
                break;
            case 4:
                let string_value_length = 0;
                if (tao) {
                    string_value_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
                } else {
                    string_value_length = bitsToArrayLength(data.getBits(msg.bitOffset, 8));
                }
                msg.bitOffset += 8;
                if (string_value_length > 128) {
                    throw new RangeError('string_value_length length exceeds maximum size: 128');
                }
                msg.fields['string_value'] = new ArrayType([]);
                for (let i = 0; i < string_value_length; i++) {
                    msg.fields['string_value'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
                    msg.bitOffset += 8;
                }
                break;
            default:
                throw new Error(`Invalid union field value: ${msg.unionField.value}`);
        }
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let unionFieldLength = 3;
        let unionFieldBits = arrayLengthToBits(this.unionFieldIndex.value, unionFieldLength);
        bits = bits.concat(unionFieldBits);
        switch (this.unionFieldIndex.value) {
        case 0:
            let emptyMsg_bits = this.fields.empty.pack();
            bits = bits.concat(emptyMsg_bits);
                break;
        case 1:
            let integer_value_bits = this.fields.integer_value.pack();
            bits = bits.concat(integer_value_bits);
                break;
        case 2:
            let real_value_bits = this.fields.real_value.pack();
            bits = bits.concat(real_value_bits);
                break;
        case 3:
            let boolean_value_bits = this.fields.boolean_value.pack();
            bits = bits.concat(boolean_value_bits);
                break;
        case 4:
            const string_value_length = this.fields.string_value.length;
            if (this.fields.string_value.length > string_value_length) {
                throw new Error(`Array length of string_value exceeds maximum length of string_value_length`);
            }
            if (!tao) {
                let string_value_length_bits = arrayLengthToBits(this.fields.string_value.length, 8);
                bits = bits.concat(string_value_length_bits);
            }
            for (let i = 0; i < string_value_length; i++) {
                let string_value_bits = this.fields.string_value.items[i].pack();
                bits = bits.concat(string_value_bits);
            }

                break;
        default:
            throw new Error(`Invalid union field index: ${this.unionFieldIndex.value}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['empty'] = this.fields['empty'].toObj();
        obj['integer_value'] = Number(this.fields['integer_value'].value);
        obj['real_value'] = Number(this.fields['real_value'].value);
        obj['boolean_value'] = Number(this.fields['boolean_value'].value);
        obj['string_value'] = this.fields['string_value'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_param_Value.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_param_Value.DTID;
    }

    get name() {
        return uavcan_protocol_param_Value.FULL_NAME;
    }

    get fieldNames() {
        return [
            'empty',
            'integer_value',
            'real_value',
            'boolean_value',
            'string_value',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_param_Value();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 3022280338508509799n;
    }

    getDataTypeSignature() {
        return 3022280338508509799n;
    }

};
module.exports.uavcan_protocol_param_Value = uavcan_protocol_param_Value;

// JavaScript binding for uavcan.protocol.param.NumericValue
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_param_NumericValue = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.protocol.param.NumericValue';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 66;
    static MIN_BIT_LEN = 2;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = true;
        this.fields = {};
        this.unionFieldIndex = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 2 );
        this.unionFields = ['empty','integer_value','real_value'];
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.unionFieldIndex = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 2), 2, PrimitiveType.CAST_MODE_SATURATED);
        msg.bitOffset += 2;
        switch(msg.unionFieldIndex.value) {
            case 0:
                msg.fields['empty'] = uavcan_protocol_param_Empty.unpack(data, false, msg.bitOffset);
                msg.bitOffset = msg.fields['empty'].bitOffset;
                break;
            case 1:
                msg.fields['integer_value'] = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 64), 64, PrimitiveType.CAST_MODE_SATURATED);
                msg.bitOffset += 64;
                break;
            case 2:
                msg.fields['real_value'] = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
                msg.bitOffset += 32;
                break;
            default:
                throw new Error(`Invalid union field value: ${msg.unionField.value}`);
        }
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let unionFieldLength = 2;
        let unionFieldBits = arrayLengthToBits(this.unionFieldIndex.value, unionFieldLength);
        bits = bits.concat(unionFieldBits);
        switch (this.unionFieldIndex.value) {
        case 0:
            let emptyMsg_bits = this.fields.empty.pack();
            bits = bits.concat(emptyMsg_bits);
                break;
        case 1:
            let integer_value_bits = this.fields.integer_value.pack();
            bits = bits.concat(integer_value_bits);
                break;
        case 2:
            let real_value_bits = this.fields.real_value.pack();
            bits = bits.concat(real_value_bits);
                break;
        default:
            throw new Error(`Invalid union field index: ${this.unionFieldIndex.value}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['empty'] = this.fields['empty'].toObj();
        obj['integer_value'] = Number(this.fields['integer_value'].value);
        obj['real_value'] = Number(this.fields['real_value'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_param_NumericValue.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_param_NumericValue.DTID;
    }

    get name() {
        return uavcan_protocol_param_NumericValue.FULL_NAME;
    }

    get fieldNames() {
        return [
            'empty',
            'integer_value',
            'real_value',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_param_NumericValue();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 983709957758006663n;
    }

    getDataTypeSignature() {
        return 983709957758006663n;
    }

};
module.exports.uavcan_protocol_param_NumericValue = uavcan_protocol_param_NumericValue;

// JavaScript binding for uavcan.protocol.param.ExecuteOpcode
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_param_ExecuteOpcode_Request = class {
    static DTID = 10;
    static FULL_NAME = 'uavcan.protocol.param.ExecuteOpcode';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 56;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['opcode'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['argument'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 48);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let opcode_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['opcode'].value = opcode_field.value
        msg.bitOffset += 8;
        let argument_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 48), 48, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['argument'].value = argument_field.value
        msg.bitOffset += 48;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let opcode_bits = this.fields.opcode.pack();
        bits = bits.concat(opcode_bits);
        let argument_bits = this.fields.argument.pack();
        bits = bits.concat(argument_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['opcode'] = Number(this.fields['opcode'].value);
        obj['argument'] = Number(this.fields['argument'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_param_ExecuteOpcode_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_param_ExecuteOpcode_Request.DTID;
    }

    get name() {
        return uavcan_protocol_param_ExecuteOpcode_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'opcode',
            'argument',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_param_ExecuteOpcode_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 4256775510155711181n;
    }

    getDataTypeSignature() {
        return 4256775510155711181n;
    }

};
module.exports.uavcan_protocol_param_ExecuteOpcode_Request = uavcan_protocol_param_ExecuteOpcode_Request;

// JavaScript binding for uavcan.protocol.param.ExecuteOpcode
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_param_ExecuteOpcode_Response = class {
    static DTID = 10;
    static FULL_NAME = 'uavcan.protocol.param.ExecuteOpcode';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 56;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['argument'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 48);
        this.fields['ok'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let argument_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 48), 48, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['argument'].value = argument_field.value
        msg.bitOffset += 48;
        let ok_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['ok'].value = ok_field.value
        msg.bitOffset += 1;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let argument_bits = this.fields.argument.pack();
        bits = bits.concat(argument_bits);
        let ok_bits = this.fields.ok.pack();
        bits = bits.concat(ok_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['argument'] = Number(this.fields['argument'].value);
        obj['ok'] = Number(this.fields['ok'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_param_ExecuteOpcode_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_param_ExecuteOpcode_Response.DTID;
    }

    get name() {
        return uavcan_protocol_param_ExecuteOpcode_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'argument',
            'ok',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_param_ExecuteOpcode_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 4256775510155711181n;
    }

    getDataTypeSignature() {
        return 4256775510155711181n;
    }

};
module.exports.uavcan_protocol_param_ExecuteOpcode_Response = uavcan_protocol_param_ExecuteOpcode_Response;

// JavaScript binding for uavcan.protocol.debug.LogLevel
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_debug_LogLevel = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.protocol.debug.LogLevel';
    static CONSTANTS = {'value': {'DEBUG': 0, 'INFO': 1, 'WARNING': 2, 'ERROR': 3}};
    static MAX_BIT_LEN = 3;
    static MIN_BIT_LEN = 3;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['value'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 3);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let value_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 3), 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['value'].value = value_field.value
        msg.bitOffset += 3;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let value_bits = this.fields.value.pack();
        bits = bits.concat(value_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['value'] = Number(this.fields['value'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_debug_LogLevel.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_debug_LogLevel.DTID;
    }

    get name() {
        return uavcan_protocol_debug_LogLevel.FULL_NAME;
    }

    get fieldNames() {
        return [
            'value',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_debug_LogLevel();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 8150373215073936198n;
    }

    getDataTypeSignature() {
        return 8150373215073936198n;
    }

};
module.exports.uavcan_protocol_debug_LogLevel = uavcan_protocol_debug_LogLevel;

// JavaScript binding for uavcan.protocol.debug.KeyValue
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_debug_KeyValue = class {
    static DTID = 16370;
    static FULL_NAME = 'uavcan.protocol.debug.KeyValue';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 502;
    static MIN_BIT_LEN = 32;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['value'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['key'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 58 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let value_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['value'].value = value_field.value
        msg.bitOffset += 32;
        // Decode dynamic array field key
        let key_length = 0;
        if (tao) {
            key_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                key_length = bitsToArrayLength(data.getBits(msg.bitOffset, 6));
                msg.bitOffset += 6;
            } else {
                throw new RangeError('Array length exceeds maximum size: 58');
            }
        }
        if (key_length > 58) {
            throw new RangeError('key_length length exceeds maximum size: 58');
        }
        for (let i = 0; i < key_length; i++) {
            msg.fields['key'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let value_bits = this.fields.value.pack();
        bits = bits.concat(value_bits);
        // Encode dynamic array field key
        const key_length = this.fields.key.length;
        if (this.fields.key.length > key_length) {
            throw new Error(`Array length of key exceeds maximum length of key_length`);
        }
        if (!tao) {
           let key_length_bits = arrayLengthToBits(this.fields.key.length, 6);
           bits = bits.concat(key_length_bits);
        }
        for (let i = 0; i < key_length; i++) {
            let key_bits = this.fields.key.items[i].pack();
            bits = bits.concat(key_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['value'] = Number(this.fields['value'].value);
        obj['key'] = this.fields['key'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_debug_KeyValue.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_debug_KeyValue.DTID;
    }

    get name() {
        return uavcan_protocol_debug_KeyValue.FULL_NAME;
    }

    get fieldNames() {
        return [
            'value',
            'key',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_debug_KeyValue();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 16154171993225792224n;
    }

    getDataTypeSignature() {
        return 16154171993225792224n;
    }

};
module.exports.uavcan_protocol_debug_KeyValue = uavcan_protocol_debug_KeyValue;

// JavaScript binding for uavcan.protocol.debug.LogMessage
// Auto Generated Code, DO NOT MODIFY
const uavcan_protocol_debug_LogMessage = class {
    static DTID = 16383;
    static FULL_NAME = 'uavcan.protocol.debug.LogMessage';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 983;
    static MIN_BIT_LEN = 3;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['level'] = new CompoundType(uavcan_protocol_debug_LogLevel.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['source'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 31 );
        this.fields['text'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 90 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let levelMsg = uavcan_protocol_debug_LogLevel.unpack(data, false, msg.bitOffset)
        msg.fields['level'].msg = levelMsg;
        msg.bitOffset = levelMsg.bitOffset;
        // Decode dynamic array field source
        let source_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            source_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
            msg.bitOffset += 5;
        } else {
            throw new RangeError('Array length exceeds maximum size: 31');
        }
        if (source_length > 31) {
            throw new RangeError('source_length length exceeds maximum size: 31');
        }
        for (let i = 0; i < source_length; i++) {
            msg.fields['source'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        // Decode dynamic array field text
        let text_length = 0;
        if (tao) {
            text_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                text_length = bitsToArrayLength(data.getBits(msg.bitOffset, 7));
                msg.bitOffset += 7;
            } else {
                throw new RangeError('Array length exceeds maximum size: 90');
            }
        }
        if (text_length > 90) {
            throw new RangeError('text_length length exceeds maximum size: 90');
        }
        for (let i = 0; i < text_length; i++) {
            msg.fields['text'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let levelMsg_bits = this.fields.level.pack(false);
        bits = bits.concat(levelMsg_bits);
        // Encode dynamic array field source
        const source_length = this.fields.source.length;
        if (this.fields.source.length > source_length) {
            throw new Error(`Array length of source exceeds maximum length of source_length`);
        }
        let source_length_bits = arrayLengthToBits(this.fields.source.length, 5);
        bits = bits.concat(source_length_bits);
        for (let i = 0; i < source_length; i++) {
            let source_bits = this.fields.source.items[i].pack();
            bits = bits.concat(source_bits);
        }

        // Encode dynamic array field text
        const text_length = this.fields.text.length;
        if (this.fields.text.length > text_length) {
            throw new Error(`Array length of text exceeds maximum length of text_length`);
        }
        if (!tao) {
           let text_length_bits = arrayLengthToBits(this.fields.text.length, 7);
           bits = bits.concat(text_length_bits);
        }
        for (let i = 0; i < text_length; i++) {
            let text_bits = this.fields.text.items[i].pack();
            bits = bits.concat(text_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['level'] = this.fields['level'].toObj();
        obj['source'] = this.fields['source'].toObj(true);
        obj['text'] = this.fields['text'].toObj(false);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_protocol_debug_LogMessage.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_protocol_debug_LogMessage.DTID;
    }

    get name() {
        return uavcan_protocol_debug_LogMessage.FULL_NAME;
    }

    get fieldNames() {
        return [
            'level',
            'source',
            'text',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_protocol_debug_LogMessage();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 15444149952154213749n;
    }

    getDataTypeSignature() {
        return 15444149952154213749n;
    }

};
module.exports.uavcan_protocol_debug_LogMessage = uavcan_protocol_debug_LogMessage;

// JavaScript binding for uavcan.tunnel.Call
// Auto Generated Code, DO NOT MODIFY
const uavcan_tunnel_Call_Request = class {
    static DTID = 63;
    static FULL_NAME = 'uavcan.tunnel.Call';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 502;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['protocol'] = new CompoundType(uavcan_tunnel_Protocol.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['channel_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['buffer'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 60 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let protocolMsg = uavcan_tunnel_Protocol.unpack(data, false, msg.bitOffset)
        msg.fields['protocol'].msg = protocolMsg;
        msg.bitOffset = protocolMsg.bitOffset;
        let channel_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['channel_id'].value = channel_id_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field buffer
        let buffer_length = 0;
        if (tao) {
            buffer_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                buffer_length = bitsToArrayLength(data.getBits(msg.bitOffset, 6));
                msg.bitOffset += 6;
            } else {
                throw new RangeError('Array length exceeds maximum size: 60');
            }
        }
        if (buffer_length > 60) {
            throw new RangeError('buffer_length length exceeds maximum size: 60');
        }
        for (let i = 0; i < buffer_length; i++) {
            msg.fields['buffer'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let protocolMsg_bits = this.fields.protocol.pack(false);
        bits = bits.concat(protocolMsg_bits);
        let channel_id_bits = this.fields.channel_id.pack();
        bits = bits.concat(channel_id_bits);
        // Encode dynamic array field buffer
        const buffer_length = this.fields.buffer.length;
        if (this.fields.buffer.length > buffer_length) {
            throw new Error(`Array length of buffer exceeds maximum length of buffer_length`);
        }
        if (!tao) {
           let buffer_length_bits = arrayLengthToBits(this.fields.buffer.length, 6);
           bits = bits.concat(buffer_length_bits);
        }
        for (let i = 0; i < buffer_length; i++) {
            let buffer_bits = this.fields.buffer.items[i].pack();
            bits = bits.concat(buffer_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['protocol'] = this.fields['protocol'].toObj();
        obj['channel_id'] = Number(this.fields['channel_id'].value);
        obj['buffer'] = this.fields['buffer'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_tunnel_Call_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_tunnel_Call_Request.DTID;
    }

    get name() {
        return uavcan_tunnel_Call_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'protocol',
            'channel_id',
            'buffer',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_tunnel_Call_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 15785659599548327512n;
    }

    getDataTypeSignature() {
        return 15785659599548327512n;
    }

};
module.exports.uavcan_tunnel_Call_Request = uavcan_tunnel_Call_Request;

// JavaScript binding for uavcan.tunnel.Call
// Auto Generated Code, DO NOT MODIFY
const uavcan_tunnel_Call_Response = class {
    static DTID = 63;
    static FULL_NAME = 'uavcan.tunnel.Call';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 502;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['buffer'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 60 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field buffer
        let buffer_length = 0;
        if (tao) {
            buffer_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                buffer_length = bitsToArrayLength(data.getBits(msg.bitOffset, 6));
                msg.bitOffset += 6;
            } else {
                throw new RangeError('Array length exceeds maximum size: 60');
            }
        }
        if (buffer_length > 60) {
            throw new RangeError('buffer_length length exceeds maximum size: 60');
        }
        for (let i = 0; i < buffer_length; i++) {
            msg.fields['buffer'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field buffer
        const buffer_length = this.fields.buffer.length;
        if (this.fields.buffer.length > buffer_length) {
            throw new Error(`Array length of buffer exceeds maximum length of buffer_length`);
        }
        if (!tao) {
           let buffer_length_bits = arrayLengthToBits(this.fields.buffer.length, 6);
           bits = bits.concat(buffer_length_bits);
        }
        for (let i = 0; i < buffer_length; i++) {
            let buffer_bits = this.fields.buffer.items[i].pack();
            bits = bits.concat(buffer_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['buffer'] = this.fields['buffer'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_tunnel_Call_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_tunnel_Call_Response.DTID;
    }

    get name() {
        return uavcan_tunnel_Call_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'buffer',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_tunnel_Call_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 15785659599548327512n;
    }

    getDataTypeSignature() {
        return 15785659599548327512n;
    }

};
module.exports.uavcan_tunnel_Call_Response = uavcan_tunnel_Call_Response;

// JavaScript binding for uavcan.tunnel.SerialConfig
// Auto Generated Code, DO NOT MODIFY
const uavcan_tunnel_SerialConfig = class {
    static DTID = 2011;
    static FULL_NAME = 'uavcan.tunnel.SerialConfig';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 64;
    static MIN_BIT_LEN = 64;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['channel_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['baud'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['options'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 24);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let channel_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['channel_id'].value = channel_id_field.value
        msg.bitOffset += 8;
        let baud_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['baud'].value = baud_field.value
        msg.bitOffset += 32;
        let options_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 24), 24, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['options'].value = options_field.value
        msg.bitOffset += 24;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let channel_id_bits = this.fields.channel_id.pack();
        bits = bits.concat(channel_id_bits);
        let baud_bits = this.fields.baud.pack();
        bits = bits.concat(baud_bits);
        let options_bits = this.fields.options.pack();
        bits = bits.concat(options_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['channel_id'] = Number(this.fields['channel_id'].value);
        obj['baud'] = Number(this.fields['baud'].value);
        obj['options'] = Number(this.fields['options'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_tunnel_SerialConfig.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_tunnel_SerialConfig.DTID;
    }

    get name() {
        return uavcan_tunnel_SerialConfig.FULL_NAME;
    }

    get fieldNames() {
        return [
            'channel_id',
            'baud',
            'options',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_tunnel_SerialConfig();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 4771470135862919853n;
    }

    getDataTypeSignature() {
        return 4771470135862919853n;
    }

};
module.exports.uavcan_tunnel_SerialConfig = uavcan_tunnel_SerialConfig;

// JavaScript binding for uavcan.tunnel.Broadcast
// Auto Generated Code, DO NOT MODIFY
const uavcan_tunnel_Broadcast = class {
    static DTID = 2010;
    static FULL_NAME = 'uavcan.tunnel.Broadcast';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 502;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['protocol'] = new CompoundType(uavcan_tunnel_Protocol.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['channel_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['buffer'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 60 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let protocolMsg = uavcan_tunnel_Protocol.unpack(data, false, msg.bitOffset)
        msg.fields['protocol'].msg = protocolMsg;
        msg.bitOffset = protocolMsg.bitOffset;
        let channel_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['channel_id'].value = channel_id_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field buffer
        let buffer_length = 0;
        if (tao) {
            buffer_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                buffer_length = bitsToArrayLength(data.getBits(msg.bitOffset, 6));
                msg.bitOffset += 6;
            } else {
                throw new RangeError('Array length exceeds maximum size: 60');
            }
        }
        if (buffer_length > 60) {
            throw new RangeError('buffer_length length exceeds maximum size: 60');
        }
        for (let i = 0; i < buffer_length; i++) {
            msg.fields['buffer'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let protocolMsg_bits = this.fields.protocol.pack(false);
        bits = bits.concat(protocolMsg_bits);
        let channel_id_bits = this.fields.channel_id.pack();
        bits = bits.concat(channel_id_bits);
        // Encode dynamic array field buffer
        const buffer_length = this.fields.buffer.length;
        if (this.fields.buffer.length > buffer_length) {
            throw new Error(`Array length of buffer exceeds maximum length of buffer_length`);
        }
        if (!tao) {
           let buffer_length_bits = arrayLengthToBits(this.fields.buffer.length, 6);
           bits = bits.concat(buffer_length_bits);
        }
        for (let i = 0; i < buffer_length; i++) {
            let buffer_bits = this.fields.buffer.items[i].pack();
            bits = bits.concat(buffer_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['protocol'] = this.fields['protocol'].toObj();
        obj['channel_id'] = Number(this.fields['channel_id'].value);
        obj['buffer'] = this.fields['buffer'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_tunnel_Broadcast.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_tunnel_Broadcast.DTID;
    }

    get name() {
        return uavcan_tunnel_Broadcast.FULL_NAME;
    }

    get fieldNames() {
        return [
            'protocol',
            'channel_id',
            'buffer',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_tunnel_Broadcast();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 6531016441591438981n;
    }

    getDataTypeSignature() {
        return 6531016441591438981n;
    }

};
module.exports.uavcan_tunnel_Broadcast = uavcan_tunnel_Broadcast;

// JavaScript binding for uavcan.tunnel.Protocol
// Auto Generated Code, DO NOT MODIFY
const uavcan_tunnel_Protocol = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.tunnel.Protocol';
    static CONSTANTS = {'protocol': {'MAVLINK': 0, 'MAVLINK2': 1, 'GPS_GENERIC': 2, 'UNDEFINED': 255}};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['protocol'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let protocol_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['protocol'].value = protocol_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let protocol_bits = this.fields.protocol.pack();
        bits = bits.concat(protocol_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['protocol'] = Number(this.fields['protocol'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_tunnel_Protocol.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_tunnel_Protocol.DTID;
    }

    get name() {
        return uavcan_tunnel_Protocol.FULL_NAME;
    }

    get fieldNames() {
        return [
            'protocol',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_tunnel_Protocol();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 11774459175928729161n;
    }

    getDataTypeSignature() {
        return 11774459175928729161n;
    }

};
module.exports.uavcan_tunnel_Protocol = uavcan_tunnel_Protocol;

// JavaScript binding for uavcan.tunnel.Targetted
// Auto Generated Code, DO NOT MODIFY
const uavcan_tunnel_Targetted = class {
    static DTID = 3001;
    static FULL_NAME = 'uavcan.tunnel.Targetted';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 1015;
    static MIN_BIT_LEN = 48;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['protocol'] = new CompoundType(uavcan_tunnel_Protocol.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['target_node'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
        this.fields['serial_id'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 5);
        this.fields['options'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 4);
        this.fields['baudrate'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 24);
        this.fields['buffer'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 120 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let protocolMsg = uavcan_tunnel_Protocol.unpack(data, false, msg.bitOffset)
        msg.fields['protocol'].msg = protocolMsg;
        msg.bitOffset = protocolMsg.bitOffset;
        let target_node_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['target_node'].value = target_node_field.value
        msg.bitOffset += 7;
        let serial_id_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 5), 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['serial_id'].value = serial_id_field.value
        msg.bitOffset += 5;
        let options_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 4), 4, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['options'].value = options_field.value
        msg.bitOffset += 4;
        let baudrate_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 24), 24, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['baudrate'].value = baudrate_field.value
        msg.bitOffset += 24;
        // Decode dynamic array field buffer
        let buffer_length = 0;
        if (tao) {
            buffer_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                buffer_length = bitsToArrayLength(data.getBits(msg.bitOffset, 7));
                msg.bitOffset += 7;
            } else {
                throw new RangeError('Array length exceeds maximum size: 120');
            }
        }
        if (buffer_length > 120) {
            throw new RangeError('buffer_length length exceeds maximum size: 120');
        }
        for (let i = 0; i < buffer_length; i++) {
            msg.fields['buffer'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let protocolMsg_bits = this.fields.protocol.pack(false);
        bits = bits.concat(protocolMsg_bits);
        let target_node_bits = this.fields.target_node.pack();
        bits = bits.concat(target_node_bits);
        let serial_id_bits = this.fields.serial_id.pack();
        bits = bits.concat(serial_id_bits);
        let options_bits = this.fields.options.pack();
        bits = bits.concat(options_bits);
        let baudrate_bits = this.fields.baudrate.pack();
        bits = bits.concat(baudrate_bits);
        // Encode dynamic array field buffer
        const buffer_length = this.fields.buffer.length;
        if (this.fields.buffer.length > buffer_length) {
            throw new Error(`Array length of buffer exceeds maximum length of buffer_length`);
        }
        if (!tao) {
           let buffer_length_bits = arrayLengthToBits(this.fields.buffer.length, 7);
           bits = bits.concat(buffer_length_bits);
        }
        for (let i = 0; i < buffer_length; i++) {
            let buffer_bits = this.fields.buffer.items[i].pack();
            bits = bits.concat(buffer_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['protocol'] = this.fields['protocol'].toObj();
        obj['target_node'] = Number(this.fields['target_node'].value);
        obj['serial_id'] = Number(this.fields['serial_id'].value);
        obj['options'] = Number(this.fields['options'].value);
        obj['baudrate'] = Number(this.fields['baudrate'].value);
        obj['buffer'] = this.fields['buffer'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_tunnel_Targetted.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_tunnel_Targetted.DTID;
    }

    get name() {
        return uavcan_tunnel_Targetted.FULL_NAME;
    }

    get fieldNames() {
        return [
            'protocol',
            'target_node',
            'serial_id',
            'options',
            'baudrate',
            'buffer',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_tunnel_Targetted();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 12770211737540666089n;
    }

    getDataTypeSignature() {
        return 12770211737540666089n;
    }

};
module.exports.uavcan_tunnel_Targetted = uavcan_tunnel_Targetted;

// JavaScript binding for uavcan.equipment.power.CircuitStatus
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_power_CircuitStatus = class {
    static DTID = 1091;
    static FULL_NAME = 'uavcan.equipment.power.CircuitStatus';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 56;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['circuit_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['voltage'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['current'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['error_flags'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let circuit_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['circuit_id'].value = circuit_id_field.value
        msg.bitOffset += 16;
        let voltage_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['voltage'].value = voltage_field.value
        msg.bitOffset += 16;
        let current_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['current'].value = current_field.value
        msg.bitOffset += 16;
        let error_flags_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['error_flags'].value = error_flags_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let circuit_id_bits = this.fields.circuit_id.pack();
        bits = bits.concat(circuit_id_bits);
        let voltage_bits = this.fields.voltage.pack();
        bits = bits.concat(voltage_bits);
        let current_bits = this.fields.current.pack();
        bits = bits.concat(current_bits);
        let error_flags_bits = this.fields.error_flags.pack();
        bits = bits.concat(error_flags_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['circuit_id'] = Number(this.fields['circuit_id'].value);
        obj['voltage'] = Number(this.fields['voltage'].value);
        obj['current'] = Number(this.fields['current'].value);
        obj['error_flags'] = Number(this.fields['error_flags'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_power_CircuitStatus.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_power_CircuitStatus.DTID;
    }

    get name() {
        return uavcan_equipment_power_CircuitStatus.FULL_NAME;
    }

    get fieldNames() {
        return [
            'circuit_id',
            'voltage',
            'current',
            'error_flags',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_power_CircuitStatus();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 9445125102705156373n;
    }

    getDataTypeSignature() {
        return 9445125102705156373n;
    }

};
module.exports.uavcan_equipment_power_CircuitStatus = uavcan_equipment_power_CircuitStatus;

// JavaScript binding for uavcan.equipment.power.PrimaryPowerSupplyStatus
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_power_PrimaryPowerSupplyStatus = class {
    static DTID = 1090;
    static FULL_NAME = 'uavcan.equipment.power.PrimaryPowerSupplyStatus';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 47;
    static MIN_BIT_LEN = 47;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['hours_to_empty_at_10sec_avg_power'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['hours_to_empty_at_10sec_avg_power_variance'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['external_power_available'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['remaining_energy_pct'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
        this.fields['remaining_energy_pct_stdev'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let hours_to_empty_at_10sec_avg_power_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['hours_to_empty_at_10sec_avg_power'].value = hours_to_empty_at_10sec_avg_power_field.value
        msg.bitOffset += 16;
        let hours_to_empty_at_10sec_avg_power_variance_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['hours_to_empty_at_10sec_avg_power_variance'].value = hours_to_empty_at_10sec_avg_power_variance_field.value
        msg.bitOffset += 16;
        let external_power_available_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['external_power_available'].value = external_power_available_field.value
        msg.bitOffset += 1;
        let remaining_energy_pct_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['remaining_energy_pct'].value = remaining_energy_pct_field.value
        msg.bitOffset += 7;
        let remaining_energy_pct_stdev_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['remaining_energy_pct_stdev'].value = remaining_energy_pct_stdev_field.value
        msg.bitOffset += 7;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let hours_to_empty_at_10sec_avg_power_bits = this.fields.hours_to_empty_at_10sec_avg_power.pack();
        bits = bits.concat(hours_to_empty_at_10sec_avg_power_bits);
        let hours_to_empty_at_10sec_avg_power_variance_bits = this.fields.hours_to_empty_at_10sec_avg_power_variance.pack();
        bits = bits.concat(hours_to_empty_at_10sec_avg_power_variance_bits);
        let external_power_available_bits = this.fields.external_power_available.pack();
        bits = bits.concat(external_power_available_bits);
        let remaining_energy_pct_bits = this.fields.remaining_energy_pct.pack();
        bits = bits.concat(remaining_energy_pct_bits);
        let remaining_energy_pct_stdev_bits = this.fields.remaining_energy_pct_stdev.pack();
        bits = bits.concat(remaining_energy_pct_stdev_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['hours_to_empty_at_10sec_avg_power'] = Number(this.fields['hours_to_empty_at_10sec_avg_power'].value);
        obj['hours_to_empty_at_10sec_avg_power_variance'] = Number(this.fields['hours_to_empty_at_10sec_avg_power_variance'].value);
        obj['external_power_available'] = Number(this.fields['external_power_available'].value);
        obj['remaining_energy_pct'] = Number(this.fields['remaining_energy_pct'].value);
        obj['remaining_energy_pct_stdev'] = Number(this.fields['remaining_energy_pct_stdev'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_power_PrimaryPowerSupplyStatus.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_power_PrimaryPowerSupplyStatus.DTID;
    }

    get name() {
        return uavcan_equipment_power_PrimaryPowerSupplyStatus.FULL_NAME;
    }

    get fieldNames() {
        return [
            'hours_to_empty_at_10sec_avg_power',
            'hours_to_empty_at_10sec_avg_power_variance',
            'external_power_available',
            'remaining_energy_pct',
            'remaining_energy_pct_stdev',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_power_PrimaryPowerSupplyStatus();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 13519894543422813312n;
    }

    getDataTypeSignature() {
        return 13519894543422813312n;
    }

};
module.exports.uavcan_equipment_power_PrimaryPowerSupplyStatus = uavcan_equipment_power_PrimaryPowerSupplyStatus;

// JavaScript binding for uavcan.equipment.power.BatteryInfo
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_power_BatteryInfo = class {
    static DTID = 1092;
    static FULL_NAME = 'uavcan.equipment.power.BatteryInfo';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 437;
    static MIN_BIT_LEN = 184;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['temperature'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['voltage'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['current'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['average_power_10sec'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['remaining_capacity_wh'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['full_charge_capacity_wh'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['hours_to_full_charge'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['status_flags'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 11);
        this.fields['state_of_health_pct'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
        this.fields['state_of_charge_pct'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
        this.fields['state_of_charge_pct_stdev'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
        this.fields['battery_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['model_instance_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['model_name'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 31 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['temperature'].value = temperature_field.value
        msg.bitOffset += 16;
        let voltage_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['voltage'].value = voltage_field.value
        msg.bitOffset += 16;
        let current_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['current'].value = current_field.value
        msg.bitOffset += 16;
        let average_power_10sec_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['average_power_10sec'].value = average_power_10sec_field.value
        msg.bitOffset += 16;
        let remaining_capacity_wh_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['remaining_capacity_wh'].value = remaining_capacity_wh_field.value
        msg.bitOffset += 16;
        let full_charge_capacity_wh_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['full_charge_capacity_wh'].value = full_charge_capacity_wh_field.value
        msg.bitOffset += 16;
        let hours_to_full_charge_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['hours_to_full_charge'].value = hours_to_full_charge_field.value
        msg.bitOffset += 16;
        let status_flags_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 11), 11, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status_flags'].value = status_flags_field.value
        msg.bitOffset += 11;
        let state_of_health_pct_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['state_of_health_pct'].value = state_of_health_pct_field.value
        msg.bitOffset += 7;
        let state_of_charge_pct_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['state_of_charge_pct'].value = state_of_charge_pct_field.value
        msg.bitOffset += 7;
        let state_of_charge_pct_stdev_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['state_of_charge_pct_stdev'].value = state_of_charge_pct_stdev_field.value
        msg.bitOffset += 7;
        let battery_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['battery_id'].value = battery_id_field.value
        msg.bitOffset += 8;
        let model_instance_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['model_instance_id'].value = model_instance_id_field.value
        msg.bitOffset += 32;
        // Decode dynamic array field model_name
        let model_name_length = 0;
        if (tao) {
            model_name_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                model_name_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
                msg.bitOffset += 5;
            } else {
                throw new RangeError('Array length exceeds maximum size: 31');
            }
        }
        if (model_name_length > 31) {
            throw new RangeError('model_name_length length exceeds maximum size: 31');
        }
        for (let i = 0; i < model_name_length; i++) {
            msg.fields['model_name'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let temperature_bits = this.fields.temperature.pack();
        bits = bits.concat(temperature_bits);
        let voltage_bits = this.fields.voltage.pack();
        bits = bits.concat(voltage_bits);
        let current_bits = this.fields.current.pack();
        bits = bits.concat(current_bits);
        let average_power_10sec_bits = this.fields.average_power_10sec.pack();
        bits = bits.concat(average_power_10sec_bits);
        let remaining_capacity_wh_bits = this.fields.remaining_capacity_wh.pack();
        bits = bits.concat(remaining_capacity_wh_bits);
        let full_charge_capacity_wh_bits = this.fields.full_charge_capacity_wh.pack();
        bits = bits.concat(full_charge_capacity_wh_bits);
        let hours_to_full_charge_bits = this.fields.hours_to_full_charge.pack();
        bits = bits.concat(hours_to_full_charge_bits);
        let status_flags_bits = this.fields.status_flags.pack();
        bits = bits.concat(status_flags_bits);
        let state_of_health_pct_bits = this.fields.state_of_health_pct.pack();
        bits = bits.concat(state_of_health_pct_bits);
        let state_of_charge_pct_bits = this.fields.state_of_charge_pct.pack();
        bits = bits.concat(state_of_charge_pct_bits);
        let state_of_charge_pct_stdev_bits = this.fields.state_of_charge_pct_stdev.pack();
        bits = bits.concat(state_of_charge_pct_stdev_bits);
        let battery_id_bits = this.fields.battery_id.pack();
        bits = bits.concat(battery_id_bits);
        let model_instance_id_bits = this.fields.model_instance_id.pack();
        bits = bits.concat(model_instance_id_bits);
        // Encode dynamic array field model_name
        const model_name_length = this.fields.model_name.length;
        if (this.fields.model_name.length > model_name_length) {
            throw new Error(`Array length of model_name exceeds maximum length of model_name_length`);
        }
        if (!tao) {
           let model_name_length_bits = arrayLengthToBits(this.fields.model_name.length, 5);
           bits = bits.concat(model_name_length_bits);
        }
        for (let i = 0; i < model_name_length; i++) {
            let model_name_bits = this.fields.model_name.items[i].pack();
            bits = bits.concat(model_name_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['temperature'] = Number(this.fields['temperature'].value);
        obj['voltage'] = Number(this.fields['voltage'].value);
        obj['current'] = Number(this.fields['current'].value);
        obj['average_power_10sec'] = Number(this.fields['average_power_10sec'].value);
        obj['remaining_capacity_wh'] = Number(this.fields['remaining_capacity_wh'].value);
        obj['full_charge_capacity_wh'] = Number(this.fields['full_charge_capacity_wh'].value);
        obj['hours_to_full_charge'] = Number(this.fields['hours_to_full_charge'].value);
        obj['status_flags'] = Number(this.fields['status_flags'].value);
        obj['state_of_health_pct'] = Number(this.fields['state_of_health_pct'].value);
        obj['state_of_charge_pct'] = Number(this.fields['state_of_charge_pct'].value);
        obj['state_of_charge_pct_stdev'] = Number(this.fields['state_of_charge_pct_stdev'].value);
        obj['battery_id'] = Number(this.fields['battery_id'].value);
        obj['model_instance_id'] = Number(this.fields['model_instance_id'].value);
        obj['model_name'] = this.fields['model_name'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_power_BatteryInfo.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_power_BatteryInfo.DTID;
    }

    get name() {
        return uavcan_equipment_power_BatteryInfo.FULL_NAME;
    }

    get fieldNames() {
        return [
            'temperature',
            'voltage',
            'current',
            'average_power_10sec',
            'remaining_capacity_wh',
            'full_charge_capacity_wh',
            'hours_to_full_charge',
            'status_flags',
            'state_of_health_pct',
            'state_of_charge_pct',
            'state_of_charge_pct_stdev',
            'battery_id',
            'model_instance_id',
            'model_name',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_power_BatteryInfo();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 2638025626274044262n;
    }

    getDataTypeSignature() {
        return 2638025626274044262n;
    }

};
module.exports.uavcan_equipment_power_BatteryInfo = uavcan_equipment_power_BatteryInfo;

// JavaScript binding for uavcan.equipment.ahrs.MagneticFieldStrength2
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_ahrs_MagneticFieldStrength2 = class {
    static DTID = 1002;
    static FULL_NAME = 'uavcan.equipment.ahrs.MagneticFieldStrength2';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 204;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['sensor_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['magnetic_field_ga'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_STATIC, 3 );
        this.fields['magnetic_field_covariance'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 9 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let sensor_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sensor_id'].value = sensor_id_field.value
        msg.bitOffset += 8;
        // Decode static array field magnetic_field_ga
        const magnetic_field_ga_length = 3;
        for (let i = 0; i < magnetic_field_ga_length; i++) {
            msg.fields['magnetic_field_ga'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        // Decode dynamic array field magnetic_field_covariance
        let magnetic_field_covariance_length = 0;
        if (tao) {
            magnetic_field_covariance_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 16);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                magnetic_field_covariance_length = bitsToArrayLength(data.getBits(msg.bitOffset, 4));
                msg.bitOffset += 4;
            } else {
                throw new RangeError('Array length exceeds maximum size: 9');
            }
        }
        if (magnetic_field_covariance_length > 9) {
            throw new RangeError('magnetic_field_covariance_length length exceeds maximum size: 9');
        }
        for (let i = 0; i < magnetic_field_covariance_length; i++) {
            msg.fields['magnetic_field_covariance'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let sensor_id_bits = this.fields.sensor_id.pack();
        bits = bits.concat(sensor_id_bits);
        // Encode static array field magnetic_field_ga
        const magnetic_field_ga_length = 3;
        for (let i = 0; i < magnetic_field_ga_length; i++) {
            let magnetic_field_ga_bits = this.fields.magnetic_field_ga.items[i].pack();
            bits = bits.concat(magnetic_field_ga_bits);
        }

        // Encode dynamic array field magnetic_field_covariance
        const magnetic_field_covariance_length = this.fields.magnetic_field_covariance.length;
        if (this.fields.magnetic_field_covariance.length > magnetic_field_covariance_length) {
            throw new Error(`Array length of magnetic_field_covariance exceeds maximum length of magnetic_field_covariance_length`);
        }
        if (!tao) {
           let magnetic_field_covariance_length_bits = arrayLengthToBits(this.fields.magnetic_field_covariance.length, 4);
           bits = bits.concat(magnetic_field_covariance_length_bits);
        }
        for (let i = 0; i < magnetic_field_covariance_length; i++) {
            let magnetic_field_covariance_bits = this.fields.magnetic_field_covariance.items[i].pack();
            bits = bits.concat(magnetic_field_covariance_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['sensor_id'] = Number(this.fields['sensor_id'].value);
        obj['magnetic_field_ga'] = this.fields['magnetic_field_ga'].toObj(true);
        obj['magnetic_field_covariance'] = this.fields['magnetic_field_covariance'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_ahrs_MagneticFieldStrength2.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_ahrs_MagneticFieldStrength2.DTID;
    }

    get name() {
        return uavcan_equipment_ahrs_MagneticFieldStrength2.FULL_NAME;
    }

    get fieldNames() {
        return [
            'sensor_id',
            'magnetic_field_ga',
            'magnetic_field_covariance',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_ahrs_MagneticFieldStrength2();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 13162909297701562750n;
    }

    getDataTypeSignature() {
        return 13162909297701562750n;
    }

};
module.exports.uavcan_equipment_ahrs_MagneticFieldStrength2 = uavcan_equipment_ahrs_MagneticFieldStrength2;

// JavaScript binding for uavcan.equipment.ahrs.RawIMU
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_ahrs_RawIMU = class {
    static DTID = 1003;
    static FULL_NAME = 'uavcan.equipment.ahrs.RawIMU';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 958;
    static MIN_BIT_LEN = 376;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['timestamp'] = new CompoundType(uavcan_Timestamp.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['integration_interval'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['rate_gyro_latest'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_STATIC, 3 );
        this.fields['rate_gyro_integral'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32), ArrayType.MODE_STATIC, 3 );
        this.fields['accelerometer_latest'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_STATIC, 3 );
        this.fields['accelerometer_integral'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32), ArrayType.MODE_STATIC, 3 );
        this.fields['covariance'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 36 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let timestampMsg = uavcan_Timestamp.unpack(data, false, msg.bitOffset)
        msg.fields['timestamp'].msg = timestampMsg;
        msg.bitOffset = timestampMsg.bitOffset;
        let integration_interval_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['integration_interval'].value = integration_interval_field.value
        msg.bitOffset += 32;
        // Decode static array field rate_gyro_latest
        const rate_gyro_latest_length = 3;
        for (let i = 0; i < rate_gyro_latest_length; i++) {
            msg.fields['rate_gyro_latest'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        // Decode static array field rate_gyro_integral
        const rate_gyro_integral_length = 3;
        for (let i = 0; i < rate_gyro_integral_length; i++) {
            msg.fields['rate_gyro_integral'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32));
            msg.bitOffset += 32;
        }

        // Decode static array field accelerometer_latest
        const accelerometer_latest_length = 3;
        for (let i = 0; i < accelerometer_latest_length; i++) {
            msg.fields['accelerometer_latest'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        // Decode static array field accelerometer_integral
        const accelerometer_integral_length = 3;
        for (let i = 0; i < accelerometer_integral_length; i++) {
            msg.fields['accelerometer_integral'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32));
            msg.bitOffset += 32;
        }

        // Decode dynamic array field covariance
        let covariance_length = 0;
        if (tao) {
            covariance_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 16);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                covariance_length = bitsToArrayLength(data.getBits(msg.bitOffset, 6));
                msg.bitOffset += 6;
            } else {
                throw new RangeError('Array length exceeds maximum size: 36');
            }
        }
        if (covariance_length > 36) {
            throw new RangeError('covariance_length length exceeds maximum size: 36');
        }
        for (let i = 0; i < covariance_length; i++) {
            msg.fields['covariance'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let timestampMsg_bits = this.fields.timestamp.pack(false);
        bits = bits.concat(timestampMsg_bits);
        let integration_interval_bits = this.fields.integration_interval.pack();
        bits = bits.concat(integration_interval_bits);
        // Encode static array field rate_gyro_latest
        const rate_gyro_latest_length = 3;
        for (let i = 0; i < rate_gyro_latest_length; i++) {
            let rate_gyro_latest_bits = this.fields.rate_gyro_latest.items[i].pack();
            bits = bits.concat(rate_gyro_latest_bits);
        }

        // Encode static array field rate_gyro_integral
        const rate_gyro_integral_length = 3;
        for (let i = 0; i < rate_gyro_integral_length; i++) {
            let rate_gyro_integral_bits = this.fields.rate_gyro_integral.items[i].pack();
            bits = bits.concat(rate_gyro_integral_bits);
        }

        // Encode static array field accelerometer_latest
        const accelerometer_latest_length = 3;
        for (let i = 0; i < accelerometer_latest_length; i++) {
            let accelerometer_latest_bits = this.fields.accelerometer_latest.items[i].pack();
            bits = bits.concat(accelerometer_latest_bits);
        }

        // Encode static array field accelerometer_integral
        const accelerometer_integral_length = 3;
        for (let i = 0; i < accelerometer_integral_length; i++) {
            let accelerometer_integral_bits = this.fields.accelerometer_integral.items[i].pack();
            bits = bits.concat(accelerometer_integral_bits);
        }

        // Encode dynamic array field covariance
        const covariance_length = this.fields.covariance.length;
        if (this.fields.covariance.length > covariance_length) {
            throw new Error(`Array length of covariance exceeds maximum length of covariance_length`);
        }
        if (!tao) {
           let covariance_length_bits = arrayLengthToBits(this.fields.covariance.length, 6);
           bits = bits.concat(covariance_length_bits);
        }
        for (let i = 0; i < covariance_length; i++) {
            let covariance_bits = this.fields.covariance.items[i].pack();
            bits = bits.concat(covariance_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['integration_interval'] = Number(this.fields['integration_interval'].value);
        obj['rate_gyro_latest'] = this.fields['rate_gyro_latest'].toObj(true);
        obj['rate_gyro_integral'] = this.fields['rate_gyro_integral'].toObj(true);
        obj['accelerometer_latest'] = this.fields['accelerometer_latest'].toObj(true);
        obj['accelerometer_integral'] = this.fields['accelerometer_integral'].toObj(true);
        obj['covariance'] = this.fields['covariance'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_ahrs_RawIMU.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_ahrs_RawIMU.DTID;
    }

    get name() {
        return uavcan_equipment_ahrs_RawIMU.FULL_NAME;
    }

    get fieldNames() {
        return [
            'timestamp',
            'integration_interval',
            'rate_gyro_latest',
            'rate_gyro_integral',
            'accelerometer_latest',
            'accelerometer_integral',
            'covariance',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_ahrs_RawIMU();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 9403625063668085941n;
    }

    getDataTypeSignature() {
        return 9403625063668085941n;
    }

};
module.exports.uavcan_equipment_ahrs_RawIMU = uavcan_equipment_ahrs_RawIMU;

// JavaScript binding for uavcan.equipment.ahrs.Solution
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_ahrs_Solution = class {
    static DTID = 1000;
    static FULL_NAME = 'uavcan.equipment.ahrs.Solution';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 668;
    static MIN_BIT_LEN = 224;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['timestamp'] = new CompoundType(uavcan_Timestamp.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['orientation_xyzw'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_STATIC, 4 );
        this.fields['orientation_covariance'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 9 );
        this.fields['angular_velocity'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_STATIC, 3 );
        this.fields['angular_velocity_covariance'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 9 );
        this.fields['linear_acceleration'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_STATIC, 3 );
        this.fields['linear_acceleration_covariance'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 9 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let timestampMsg = uavcan_Timestamp.unpack(data, false, msg.bitOffset)
        msg.fields['timestamp'].msg = timestampMsg;
        msg.bitOffset = timestampMsg.bitOffset;
        // Decode static array field orientation_xyzw
        const orientation_xyzw_length = 4;
        for (let i = 0; i < orientation_xyzw_length; i++) {
            msg.fields['orientation_xyzw'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        msg.bitOffset += 4; //field.type.CATEGORY_VOID void4 for Reserved space
        // Decode dynamic array field orientation_covariance
        let orientation_covariance_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            orientation_covariance_length = bitsToArrayLength(data.getBits(msg.bitOffset, 4));
            msg.bitOffset += 4;
        } else {
            throw new RangeError('Array length exceeds maximum size: 9');
        }
        if (orientation_covariance_length > 9) {
            throw new RangeError('orientation_covariance_length length exceeds maximum size: 9');
        }
        for (let i = 0; i < orientation_covariance_length; i++) {
            msg.fields['orientation_covariance'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        // Decode static array field angular_velocity
        const angular_velocity_length = 3;
        for (let i = 0; i < angular_velocity_length; i++) {
            msg.fields['angular_velocity'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        msg.bitOffset += 4; //field.type.CATEGORY_VOID void4 for Reserved space
        // Decode dynamic array field angular_velocity_covariance
        let angular_velocity_covariance_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            angular_velocity_covariance_length = bitsToArrayLength(data.getBits(msg.bitOffset, 4));
            msg.bitOffset += 4;
        } else {
            throw new RangeError('Array length exceeds maximum size: 9');
        }
        if (angular_velocity_covariance_length > 9) {
            throw new RangeError('angular_velocity_covariance_length length exceeds maximum size: 9');
        }
        for (let i = 0; i < angular_velocity_covariance_length; i++) {
            msg.fields['angular_velocity_covariance'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        // Decode static array field linear_acceleration
        const linear_acceleration_length = 3;
        for (let i = 0; i < linear_acceleration_length; i++) {
            msg.fields['linear_acceleration'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        // Decode dynamic array field linear_acceleration_covariance
        let linear_acceleration_covariance_length = 0;
        if (tao) {
            linear_acceleration_covariance_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 16);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                linear_acceleration_covariance_length = bitsToArrayLength(data.getBits(msg.bitOffset, 4));
                msg.bitOffset += 4;
            } else {
                throw new RangeError('Array length exceeds maximum size: 9');
            }
        }
        if (linear_acceleration_covariance_length > 9) {
            throw new RangeError('linear_acceleration_covariance_length length exceeds maximum size: 9');
        }
        for (let i = 0; i < linear_acceleration_covariance_length; i++) {
            msg.fields['linear_acceleration_covariance'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let timestampMsg_bits = this.fields.timestamp.pack(false);
        bits = bits.concat(timestampMsg_bits);
        // Encode static array field orientation_xyzw
        const orientation_xyzw_length = 4;
        for (let i = 0; i < orientation_xyzw_length; i++) {
            let orientation_xyzw_bits = this.fields.orientation_xyzw.items[i].pack();
            bits = bits.concat(orientation_xyzw_bits);
        }

        for (let j = 0; j < 4; j++) {
            bits.push(0);
        }
        // Encode dynamic array field orientation_covariance
        const orientation_covariance_length = this.fields.orientation_covariance.length;
        if (this.fields.orientation_covariance.length > orientation_covariance_length) {
            throw new Error(`Array length of orientation_covariance exceeds maximum length of orientation_covariance_length`);
        }
        let orientation_covariance_length_bits = arrayLengthToBits(this.fields.orientation_covariance.length, 4);
        bits = bits.concat(orientation_covariance_length_bits);
        for (let i = 0; i < orientation_covariance_length; i++) {
            let orientation_covariance_bits = this.fields.orientation_covariance.items[i].pack();
            bits = bits.concat(orientation_covariance_bits);
        }

        // Encode static array field angular_velocity
        const angular_velocity_length = 3;
        for (let i = 0; i < angular_velocity_length; i++) {
            let angular_velocity_bits = this.fields.angular_velocity.items[i].pack();
            bits = bits.concat(angular_velocity_bits);
        }

        for (let j = 0; j < 4; j++) {
            bits.push(0);
        }
        // Encode dynamic array field angular_velocity_covariance
        const angular_velocity_covariance_length = this.fields.angular_velocity_covariance.length;
        if (this.fields.angular_velocity_covariance.length > angular_velocity_covariance_length) {
            throw new Error(`Array length of angular_velocity_covariance exceeds maximum length of angular_velocity_covariance_length`);
        }
        let angular_velocity_covariance_length_bits = arrayLengthToBits(this.fields.angular_velocity_covariance.length, 4);
        bits = bits.concat(angular_velocity_covariance_length_bits);
        for (let i = 0; i < angular_velocity_covariance_length; i++) {
            let angular_velocity_covariance_bits = this.fields.angular_velocity_covariance.items[i].pack();
            bits = bits.concat(angular_velocity_covariance_bits);
        }

        // Encode static array field linear_acceleration
        const linear_acceleration_length = 3;
        for (let i = 0; i < linear_acceleration_length; i++) {
            let linear_acceleration_bits = this.fields.linear_acceleration.items[i].pack();
            bits = bits.concat(linear_acceleration_bits);
        }

        // Encode dynamic array field linear_acceleration_covariance
        const linear_acceleration_covariance_length = this.fields.linear_acceleration_covariance.length;
        if (this.fields.linear_acceleration_covariance.length > linear_acceleration_covariance_length) {
            throw new Error(`Array length of linear_acceleration_covariance exceeds maximum length of linear_acceleration_covariance_length`);
        }
        if (!tao) {
           let linear_acceleration_covariance_length_bits = arrayLengthToBits(this.fields.linear_acceleration_covariance.length, 4);
           bits = bits.concat(linear_acceleration_covariance_length_bits);
        }
        for (let i = 0; i < linear_acceleration_covariance_length; i++) {
            let linear_acceleration_covariance_bits = this.fields.linear_acceleration_covariance.items[i].pack();
            bits = bits.concat(linear_acceleration_covariance_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['orientation_xyzw'] = this.fields['orientation_xyzw'].toObj(true);
        obj['orientation_covariance'] = this.fields['orientation_covariance'].toObj(true);
        obj['angular_velocity'] = this.fields['angular_velocity'].toObj(true);
        obj['angular_velocity_covariance'] = this.fields['angular_velocity_covariance'].toObj(true);
        obj['linear_acceleration'] = this.fields['linear_acceleration'].toObj(true);
        obj['linear_acceleration_covariance'] = this.fields['linear_acceleration_covariance'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_ahrs_Solution.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_ahrs_Solution.DTID;
    }

    get name() {
        return uavcan_equipment_ahrs_Solution.FULL_NAME;
    }

    get fieldNames() {
        return [
            'timestamp',
            'orientation_xyzw',
            'orientation_covariance',
            'angular_velocity',
            'angular_velocity_covariance',
            'linear_acceleration',
            'linear_acceleration_covariance',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_ahrs_Solution();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 8261354597696797339n;
    }

    getDataTypeSignature() {
        return 8261354597696797339n;
    }

};
module.exports.uavcan_equipment_ahrs_Solution = uavcan_equipment_ahrs_Solution;

// JavaScript binding for uavcan.equipment.ahrs.MagneticFieldStrength
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_ahrs_MagneticFieldStrength = class {
    static DTID = 1001;
    static FULL_NAME = 'uavcan.equipment.ahrs.MagneticFieldStrength';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 196;
    static MIN_BIT_LEN = 48;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['magnetic_field_ga'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_STATIC, 3 );
        this.fields['magnetic_field_covariance'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 9 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode static array field magnetic_field_ga
        const magnetic_field_ga_length = 3;
        for (let i = 0; i < magnetic_field_ga_length; i++) {
            msg.fields['magnetic_field_ga'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        // Decode dynamic array field magnetic_field_covariance
        let magnetic_field_covariance_length = 0;
        if (tao) {
            magnetic_field_covariance_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 16);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                magnetic_field_covariance_length = bitsToArrayLength(data.getBits(msg.bitOffset, 4));
                msg.bitOffset += 4;
            } else {
                throw new RangeError('Array length exceeds maximum size: 9');
            }
        }
        if (magnetic_field_covariance_length > 9) {
            throw new RangeError('magnetic_field_covariance_length length exceeds maximum size: 9');
        }
        for (let i = 0; i < magnetic_field_covariance_length; i++) {
            msg.fields['magnetic_field_covariance'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode static array field magnetic_field_ga
        const magnetic_field_ga_length = 3;
        for (let i = 0; i < magnetic_field_ga_length; i++) {
            let magnetic_field_ga_bits = this.fields.magnetic_field_ga.items[i].pack();
            bits = bits.concat(magnetic_field_ga_bits);
        }

        // Encode dynamic array field magnetic_field_covariance
        const magnetic_field_covariance_length = this.fields.magnetic_field_covariance.length;
        if (this.fields.magnetic_field_covariance.length > magnetic_field_covariance_length) {
            throw new Error(`Array length of magnetic_field_covariance exceeds maximum length of magnetic_field_covariance_length`);
        }
        if (!tao) {
           let magnetic_field_covariance_length_bits = arrayLengthToBits(this.fields.magnetic_field_covariance.length, 4);
           bits = bits.concat(magnetic_field_covariance_length_bits);
        }
        for (let i = 0; i < magnetic_field_covariance_length; i++) {
            let magnetic_field_covariance_bits = this.fields.magnetic_field_covariance.items[i].pack();
            bits = bits.concat(magnetic_field_covariance_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['magnetic_field_ga'] = this.fields['magnetic_field_ga'].toObj(true);
        obj['magnetic_field_covariance'] = this.fields['magnetic_field_covariance'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_ahrs_MagneticFieldStrength.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_ahrs_MagneticFieldStrength.DTID;
    }

    get name() {
        return uavcan_equipment_ahrs_MagneticFieldStrength.FULL_NAME;
    }

    get fieldNames() {
        return [
            'magnetic_field_ga',
            'magnetic_field_covariance',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_ahrs_MagneticFieldStrength();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 16332256397172130546n;
    }

    getDataTypeSignature() {
        return 16332256397172130546n;
    }

};
module.exports.uavcan_equipment_ahrs_MagneticFieldStrength = uavcan_equipment_ahrs_MagneticFieldStrength;

// JavaScript binding for uavcan.equipment.esc.RawCommand
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_esc_RawCommand = class {
    static DTID = 1030;
    static FULL_NAME = 'uavcan.equipment.esc.RawCommand';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 285;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['cmd'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 14), ArrayType.MODE_DYNAMIC, 20 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field cmd
        let cmd_length = 0;
        if (tao) {
            cmd_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 14);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                cmd_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
                msg.bitOffset += 5;
            } else {
                throw new RangeError('Array length exceeds maximum size: 20');
            }
        }
        if (cmd_length > 20) {
            throw new RangeError('cmd_length length exceeds maximum size: 20');
        }
        for (let i = 0; i < cmd_length; i++) {
            msg.fields['cmd'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 14), 14, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 14;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field cmd
        const cmd_length = this.fields.cmd.length;
        if (this.fields.cmd.length > cmd_length) {
            throw new Error(`Array length of cmd exceeds maximum length of cmd_length`);
        }
        if (!tao) {
           let cmd_length_bits = arrayLengthToBits(this.fields.cmd.length, 5);
           bits = bits.concat(cmd_length_bits);
        }
        for (let i = 0; i < cmd_length; i++) {
            let cmd_bits = this.fields.cmd.items[i].pack();
            bits = bits.concat(cmd_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['cmd'] = this.fields['cmd'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_esc_RawCommand.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_esc_RawCommand.DTID;
    }

    get name() {
        return uavcan_equipment_esc_RawCommand.FULL_NAME;
    }

    get fieldNames() {
        return [
            'cmd',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_esc_RawCommand();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 2413749663806821661n;
    }

    getDataTypeSignature() {
        return 2413749663806821661n;
    }

};
module.exports.uavcan_equipment_esc_RawCommand = uavcan_equipment_esc_RawCommand;

// JavaScript binding for uavcan.equipment.esc.RPMCommand
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_esc_RPMCommand = class {
    static DTID = 1031;
    static FULL_NAME = 'uavcan.equipment.esc.RPMCommand';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 365;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['rpm'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 18), ArrayType.MODE_DYNAMIC, 20 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field rpm
        let rpm_length = 0;
        if (tao) {
            rpm_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 18);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                rpm_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
                msg.bitOffset += 5;
            } else {
                throw new RangeError('Array length exceeds maximum size: 20');
            }
        }
        if (rpm_length > 20) {
            throw new RangeError('rpm_length length exceeds maximum size: 20');
        }
        for (let i = 0; i < rpm_length; i++) {
            msg.fields['rpm'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 18), 18, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 18;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field rpm
        const rpm_length = this.fields.rpm.length;
        if (this.fields.rpm.length > rpm_length) {
            throw new Error(`Array length of rpm exceeds maximum length of rpm_length`);
        }
        if (!tao) {
           let rpm_length_bits = arrayLengthToBits(this.fields.rpm.length, 5);
           bits = bits.concat(rpm_length_bits);
        }
        for (let i = 0; i < rpm_length; i++) {
            let rpm_bits = this.fields.rpm.items[i].pack();
            bits = bits.concat(rpm_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['rpm'] = this.fields['rpm'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_esc_RPMCommand.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_esc_RPMCommand.DTID;
    }

    get name() {
        return uavcan_equipment_esc_RPMCommand.FULL_NAME;
    }

    get fieldNames() {
        return [
            'rpm',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_esc_RPMCommand();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 14848261740205434635n;
    }

    getDataTypeSignature() {
        return 14848261740205434635n;
    }

};
module.exports.uavcan_equipment_esc_RPMCommand = uavcan_equipment_esc_RPMCommand;

// JavaScript binding for uavcan.equipment.esc.StatusExtended
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_esc_StatusExtended = class {
    static DTID = 1036;
    static FULL_NAME = 'uavcan.equipment.esc.StatusExtended';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 56;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['input_pct'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
        this.fields['output_pct'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
        this.fields['motor_temperature_degC'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 9);
        this.fields['motor_angle'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 9);
        this.fields['status_flags'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 19);
        this.fields['esc_index'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 5);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let input_pct_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['input_pct'].value = input_pct_field.value
        msg.bitOffset += 7;
        let output_pct_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['output_pct'].value = output_pct_field.value
        msg.bitOffset += 7;
        let motor_temperature_degC_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 9), 9, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['motor_temperature_degC'].value = motor_temperature_degC_field.value
        msg.bitOffset += 9;
        let motor_angle_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 9), 9, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['motor_angle'].value = motor_angle_field.value
        msg.bitOffset += 9;
        let status_flags_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 19), 19, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status_flags'].value = status_flags_field.value
        msg.bitOffset += 19;
        let esc_index_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 5), 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_index'].value = esc_index_field.value
        msg.bitOffset += 5;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let input_pct_bits = this.fields.input_pct.pack();
        bits = bits.concat(input_pct_bits);
        let output_pct_bits = this.fields.output_pct.pack();
        bits = bits.concat(output_pct_bits);
        let motor_temperature_degC_bits = this.fields.motor_temperature_degC.pack();
        bits = bits.concat(motor_temperature_degC_bits);
        let motor_angle_bits = this.fields.motor_angle.pack();
        bits = bits.concat(motor_angle_bits);
        let status_flags_bits = this.fields.status_flags.pack();
        bits = bits.concat(status_flags_bits);
        let esc_index_bits = this.fields.esc_index.pack();
        bits = bits.concat(esc_index_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['input_pct'] = Number(this.fields['input_pct'].value);
        obj['output_pct'] = Number(this.fields['output_pct'].value);
        obj['motor_temperature_degC'] = Number(this.fields['motor_temperature_degC'].value);
        obj['motor_angle'] = Number(this.fields['motor_angle'].value);
        obj['status_flags'] = Number(this.fields['status_flags'].value);
        obj['esc_index'] = Number(this.fields['esc_index'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_esc_StatusExtended.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_esc_StatusExtended.DTID;
    }

    get name() {
        return uavcan_equipment_esc_StatusExtended.FULL_NAME;
    }

    get fieldNames() {
        return [
            'input_pct',
            'output_pct',
            'motor_temperature_degC',
            'motor_angle',
            'status_flags',
            'esc_index',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_esc_StatusExtended();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 206075126374338268n;
    }

    getDataTypeSignature() {
        return 206075126374338268n;
    }

};
module.exports.uavcan_equipment_esc_StatusExtended = uavcan_equipment_esc_StatusExtended;

// JavaScript binding for uavcan.equipment.esc.Status
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_esc_Status = class {
    static DTID = 1034;
    static FULL_NAME = 'uavcan.equipment.esc.Status';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 110;
    static MIN_BIT_LEN = 110;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['error_count'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['voltage'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['current'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['temperature'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['rpm'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 18);
        this.fields['power_rating_pct'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
        this.fields['esc_index'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 5);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let error_count_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['error_count'].value = error_count_field.value
        msg.bitOffset += 32;
        let voltage_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['voltage'].value = voltage_field.value
        msg.bitOffset += 16;
        let current_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['current'].value = current_field.value
        msg.bitOffset += 16;
        let temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['temperature'].value = temperature_field.value
        msg.bitOffset += 16;
        let rpm_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 18), 18, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rpm'].value = rpm_field.value
        msg.bitOffset += 18;
        let power_rating_pct_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['power_rating_pct'].value = power_rating_pct_field.value
        msg.bitOffset += 7;
        let esc_index_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 5), 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_index'].value = esc_index_field.value
        msg.bitOffset += 5;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let error_count_bits = this.fields.error_count.pack();
        bits = bits.concat(error_count_bits);
        let voltage_bits = this.fields.voltage.pack();
        bits = bits.concat(voltage_bits);
        let current_bits = this.fields.current.pack();
        bits = bits.concat(current_bits);
        let temperature_bits = this.fields.temperature.pack();
        bits = bits.concat(temperature_bits);
        let rpm_bits = this.fields.rpm.pack();
        bits = bits.concat(rpm_bits);
        let power_rating_pct_bits = this.fields.power_rating_pct.pack();
        bits = bits.concat(power_rating_pct_bits);
        let esc_index_bits = this.fields.esc_index.pack();
        bits = bits.concat(esc_index_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['error_count'] = Number(this.fields['error_count'].value);
        obj['voltage'] = Number(this.fields['voltage'].value);
        obj['current'] = Number(this.fields['current'].value);
        obj['temperature'] = Number(this.fields['temperature'].value);
        obj['rpm'] = Number(this.fields['rpm'].value);
        obj['power_rating_pct'] = Number(this.fields['power_rating_pct'].value);
        obj['esc_index'] = Number(this.fields['esc_index'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_esc_Status.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_esc_Status.DTID;
    }

    get name() {
        return uavcan_equipment_esc_Status.FULL_NAME;
    }

    get fieldNames() {
        return [
            'error_count',
            'voltage',
            'current',
            'temperature',
            'rpm',
            'power_rating_pct',
            'esc_index',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_esc_Status();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 12227036243858010708n;
    }

    getDataTypeSignature() {
        return 12227036243858010708n;
    }

};
module.exports.uavcan_equipment_esc_Status = uavcan_equipment_esc_Status;

// JavaScript binding for uavcan.equipment.range_sensor.Measurement
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_range_sensor_Measurement = class {
    static DTID = 1050;
    static FULL_NAME = 'uavcan.equipment.range_sensor.Measurement';
    static CONSTANTS = {'sensor_type': {'UNDEFINED': 0, 'SONAR': 1, 'LIDAR': 2, 'RADAR': 3}, 'reading_type': {'UNDEFINED': 0, 'VALID_RANGE': 1, 'TOO_CLOSE': 2, 'TOO_FAR': 3}};
    static MAX_BIT_LEN = 120;
    static MIN_BIT_LEN = 120;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['timestamp'] = new CompoundType(uavcan_Timestamp.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['sensor_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['beam_orientation_in_body_frame'] = new CompoundType(uavcan_CoarseOrientation.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['field_of_view'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['sensor_type'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 5);
        this.fields['reading_type'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 3);
        this.fields['range'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let timestampMsg = uavcan_Timestamp.unpack(data, false, msg.bitOffset)
        msg.fields['timestamp'].msg = timestampMsg;
        msg.bitOffset = timestampMsg.bitOffset;
        let sensor_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sensor_id'].value = sensor_id_field.value
        msg.bitOffset += 8;
        let beam_orientation_in_body_frameMsg = uavcan_CoarseOrientation.unpack(data, false, msg.bitOffset)
        msg.fields['beam_orientation_in_body_frame'].msg = beam_orientation_in_body_frameMsg;
        msg.bitOffset = beam_orientation_in_body_frameMsg.bitOffset;
        let field_of_view_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['field_of_view'].value = field_of_view_field.value
        msg.bitOffset += 16;
        let sensor_type_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 5), 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sensor_type'].value = sensor_type_field.value
        msg.bitOffset += 5;
        let reading_type_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 3), 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['reading_type'].value = reading_type_field.value
        msg.bitOffset += 3;
        let range_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['range'].value = range_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let timestampMsg_bits = this.fields.timestamp.pack(false);
        bits = bits.concat(timestampMsg_bits);
        let sensor_id_bits = this.fields.sensor_id.pack();
        bits = bits.concat(sensor_id_bits);
        let beam_orientation_in_body_frameMsg_bits = this.fields.beam_orientation_in_body_frame.pack(false);
        bits = bits.concat(beam_orientation_in_body_frameMsg_bits);
        let field_of_view_bits = this.fields.field_of_view.pack();
        bits = bits.concat(field_of_view_bits);
        let sensor_type_bits = this.fields.sensor_type.pack();
        bits = bits.concat(sensor_type_bits);
        let reading_type_bits = this.fields.reading_type.pack();
        bits = bits.concat(reading_type_bits);
        let range_bits = this.fields.range.pack();
        bits = bits.concat(range_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['sensor_id'] = Number(this.fields['sensor_id'].value);
        obj['beam_orientation_in_body_frame'] = this.fields['beam_orientation_in_body_frame'].toObj();
        obj['field_of_view'] = Number(this.fields['field_of_view'].value);
        obj['sensor_type'] = Number(this.fields['sensor_type'].value);
        obj['reading_type'] = Number(this.fields['reading_type'].value);
        obj['range'] = Number(this.fields['range'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_range_sensor_Measurement.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_range_sensor_Measurement.DTID;
    }

    get name() {
        return uavcan_equipment_range_sensor_Measurement.FULL_NAME;
    }

    get fieldNames() {
        return [
            'timestamp',
            'sensor_id',
            'beam_orientation_in_body_frame',
            'field_of_view',
            'sensor_type',
            'reading_type',
            'range',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_range_sensor_Measurement();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 7566045660231178578n;
    }

    getDataTypeSignature() {
        return 7566045660231178578n;
    }

};
module.exports.uavcan_equipment_range_sensor_Measurement = uavcan_equipment_range_sensor_Measurement;

// JavaScript binding for uavcan.equipment.hardpoint.Status
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_hardpoint_Status = class {
    static DTID = 1071;
    static FULL_NAME = 'uavcan.equipment.hardpoint.Status';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 56;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['hardpoint_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['payload_weight'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['payload_weight_variance'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['status'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let hardpoint_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['hardpoint_id'].value = hardpoint_id_field.value
        msg.bitOffset += 8;
        let payload_weight_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['payload_weight'].value = payload_weight_field.value
        msg.bitOffset += 16;
        let payload_weight_variance_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['payload_weight_variance'].value = payload_weight_variance_field.value
        msg.bitOffset += 16;
        let status_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'].value = status_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let hardpoint_id_bits = this.fields.hardpoint_id.pack();
        bits = bits.concat(hardpoint_id_bits);
        let payload_weight_bits = this.fields.payload_weight.pack();
        bits = bits.concat(payload_weight_bits);
        let payload_weight_variance_bits = this.fields.payload_weight_variance.pack();
        bits = bits.concat(payload_weight_variance_bits);
        let status_bits = this.fields.status.pack();
        bits = bits.concat(status_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['hardpoint_id'] = Number(this.fields['hardpoint_id'].value);
        obj['payload_weight'] = Number(this.fields['payload_weight'].value);
        obj['payload_weight_variance'] = Number(this.fields['payload_weight_variance'].value);
        obj['status'] = Number(this.fields['status'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_hardpoint_Status.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_hardpoint_Status.DTID;
    }

    get name() {
        return uavcan_equipment_hardpoint_Status.FULL_NAME;
    }

    get fieldNames() {
        return [
            'hardpoint_id',
            'payload_weight',
            'payload_weight_variance',
            'status',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_hardpoint_Status();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 7082563099858124162n;
    }

    getDataTypeSignature() {
        return 7082563099858124162n;
    }

};
module.exports.uavcan_equipment_hardpoint_Status = uavcan_equipment_hardpoint_Status;

// JavaScript binding for uavcan.equipment.hardpoint.Command
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_hardpoint_Command = class {
    static DTID = 1070;
    static FULL_NAME = 'uavcan.equipment.hardpoint.Command';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 24;
    static MIN_BIT_LEN = 24;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['hardpoint_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['command'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let hardpoint_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['hardpoint_id'].value = hardpoint_id_field.value
        msg.bitOffset += 8;
        let command_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['command'].value = command_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let hardpoint_id_bits = this.fields.hardpoint_id.pack();
        bits = bits.concat(hardpoint_id_bits);
        let command_bits = this.fields.command.pack();
        bits = bits.concat(command_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['hardpoint_id'] = Number(this.fields['hardpoint_id'].value);
        obj['command'] = Number(this.fields['command'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_hardpoint_Command.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_hardpoint_Command.DTID;
    }

    get name() {
        return uavcan_equipment_hardpoint_Command.FULL_NAME;
    }

    get fieldNames() {
        return [
            'hardpoint_id',
            'command',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_hardpoint_Command();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 11646368175549592661n;
    }

    getDataTypeSignature() {
        return 11646368175549592661n;
    }

};
module.exports.uavcan_equipment_hardpoint_Command = uavcan_equipment_hardpoint_Command;

// JavaScript binding for uavcan.equipment.camera_gimbal.AngularCommand
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_camera_gimbal_AngularCommand = class {
    static DTID = 1040;
    static FULL_NAME = 'uavcan.equipment.camera_gimbal.AngularCommand';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 80;
    static MIN_BIT_LEN = 80;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['gimbal_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['mode'] = new CompoundType(uavcan_equipment_camera_gimbal_Mode.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['quaternion_xyzw'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_STATIC, 4 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let gimbal_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['gimbal_id'].value = gimbal_id_field.value
        msg.bitOffset += 8;
        let modeMsg = uavcan_equipment_camera_gimbal_Mode.unpack(data, false, msg.bitOffset)
        msg.fields['mode'].msg = modeMsg;
        msg.bitOffset = modeMsg.bitOffset;
        // Decode static array field quaternion_xyzw
        const quaternion_xyzw_length = 4;
        for (let i = 0; i < quaternion_xyzw_length; i++) {
            msg.fields['quaternion_xyzw'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let gimbal_id_bits = this.fields.gimbal_id.pack();
        bits = bits.concat(gimbal_id_bits);
        let modeMsg_bits = this.fields.mode.pack(false);
        bits = bits.concat(modeMsg_bits);
        // Encode static array field quaternion_xyzw
        const quaternion_xyzw_length = 4;
        for (let i = 0; i < quaternion_xyzw_length; i++) {
            let quaternion_xyzw_bits = this.fields.quaternion_xyzw.items[i].pack();
            bits = bits.concat(quaternion_xyzw_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['gimbal_id'] = Number(this.fields['gimbal_id'].value);
        obj['mode'] = this.fields['mode'].toObj();
        obj['quaternion_xyzw'] = this.fields['quaternion_xyzw'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_camera_gimbal_AngularCommand.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_camera_gimbal_AngularCommand.DTID;
    }

    get name() {
        return uavcan_equipment_camera_gimbal_AngularCommand.FULL_NAME;
    }

    get fieldNames() {
        return [
            'gimbal_id',
            'mode',
            'quaternion_xyzw',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_camera_gimbal_AngularCommand();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 5401757120245523100n;
    }

    getDataTypeSignature() {
        return 5401757120245523100n;
    }

};
module.exports.uavcan_equipment_camera_gimbal_AngularCommand = uavcan_equipment_camera_gimbal_AngularCommand;

// JavaScript binding for uavcan.equipment.camera_gimbal.GEOPOICommand
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_camera_gimbal_GEOPOICommand = class {
    static DTID = 1041;
    static FULL_NAME = 'uavcan.equipment.camera_gimbal.GEOPOICommand';
    static CONSTANTS = {'height_reference': {'ELLIPSOID': 0, 'MEAN_SEA_LEVEL': 1}};
    static MAX_BIT_LEN = 104;
    static MIN_BIT_LEN = 104;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['gimbal_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['mode'] = new CompoundType(uavcan_equipment_camera_gimbal_Mode.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['longitude_deg_1e7'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 32);
        this.fields['latitude_deg_1e7'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 32);
        this.fields['height_cm'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 22);
        this.fields['height_reference'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 2);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let gimbal_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['gimbal_id'].value = gimbal_id_field.value
        msg.bitOffset += 8;
        let modeMsg = uavcan_equipment_camera_gimbal_Mode.unpack(data, false, msg.bitOffset)
        msg.fields['mode'].msg = modeMsg;
        msg.bitOffset = modeMsg.bitOffset;
        let longitude_deg_1e7_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['longitude_deg_1e7'].value = longitude_deg_1e7_field.value
        msg.bitOffset += 32;
        let latitude_deg_1e7_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['latitude_deg_1e7'].value = latitude_deg_1e7_field.value
        msg.bitOffset += 32;
        let height_cm_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 22), 22, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_cm'].value = height_cm_field.value
        msg.bitOffset += 22;
        let height_reference_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 2), 2, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_reference'].value = height_reference_field.value
        msg.bitOffset += 2;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let gimbal_id_bits = this.fields.gimbal_id.pack();
        bits = bits.concat(gimbal_id_bits);
        let modeMsg_bits = this.fields.mode.pack(false);
        bits = bits.concat(modeMsg_bits);
        let longitude_deg_1e7_bits = this.fields.longitude_deg_1e7.pack();
        bits = bits.concat(longitude_deg_1e7_bits);
        let latitude_deg_1e7_bits = this.fields.latitude_deg_1e7.pack();
        bits = bits.concat(latitude_deg_1e7_bits);
        let height_cm_bits = this.fields.height_cm.pack();
        bits = bits.concat(height_cm_bits);
        let height_reference_bits = this.fields.height_reference.pack();
        bits = bits.concat(height_reference_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['gimbal_id'] = Number(this.fields['gimbal_id'].value);
        obj['mode'] = this.fields['mode'].toObj();
        obj['longitude_deg_1e7'] = Number(this.fields['longitude_deg_1e7'].value);
        obj['latitude_deg_1e7'] = Number(this.fields['latitude_deg_1e7'].value);
        obj['height_cm'] = Number(this.fields['height_cm'].value);
        obj['height_reference'] = Number(this.fields['height_reference'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_camera_gimbal_GEOPOICommand.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_camera_gimbal_GEOPOICommand.DTID;
    }

    get name() {
        return uavcan_equipment_camera_gimbal_GEOPOICommand.FULL_NAME;
    }

    get fieldNames() {
        return [
            'gimbal_id',
            'mode',
            'longitude_deg_1e7',
            'latitude_deg_1e7',
            'height_cm',
            'height_reference',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_camera_gimbal_GEOPOICommand();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 10624346158881841110n;
    }

    getDataTypeSignature() {
        return 10624346158881841110n;
    }

};
module.exports.uavcan_equipment_camera_gimbal_GEOPOICommand = uavcan_equipment_camera_gimbal_GEOPOICommand;

// JavaScript binding for uavcan.equipment.camera_gimbal.Mode
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_camera_gimbal_Mode = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.equipment.camera_gimbal.Mode';
    static CONSTANTS = {'command_mode': {'COMMAND_MODE_ANGULAR_VELOCITY': 0, 'COMMAND_MODE_ORIENTATION_FIXED_FRAME': 1, 'COMMAND_MODE_ORIENTATION_BODY_FRAME': 2, 'COMMAND_MODE_GEO_POI': 3}};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['command_mode'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let command_mode_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['command_mode'].value = command_mode_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let command_mode_bits = this.fields.command_mode.pack();
        bits = bits.concat(command_mode_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['command_mode'] = Number(this.fields['command_mode'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_camera_gimbal_Mode.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_camera_gimbal_Mode.DTID;
    }

    get name() {
        return uavcan_equipment_camera_gimbal_Mode.FULL_NAME;
    }

    get fieldNames() {
        return [
            'command_mode',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_camera_gimbal_Mode();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 10450822255048616388n;
    }

    getDataTypeSignature() {
        return 10450822255048616388n;
    }

};
module.exports.uavcan_equipment_camera_gimbal_Mode = uavcan_equipment_camera_gimbal_Mode;

// JavaScript binding for uavcan.equipment.camera_gimbal.Status
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_camera_gimbal_Status = class {
    static DTID = 1044;
    static FULL_NAME = 'uavcan.equipment.camera_gimbal.Status';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 228;
    static MIN_BIT_LEN = 80;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['gimbal_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['mode'] = new CompoundType(uavcan_equipment_camera_gimbal_Mode.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['camera_orientation_in_body_frame_xyzw'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_STATIC, 4 );
        this.fields['camera_orientation_in_body_frame_covariance'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 9 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let gimbal_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['gimbal_id'].value = gimbal_id_field.value
        msg.bitOffset += 8;
        let modeMsg = uavcan_equipment_camera_gimbal_Mode.unpack(data, false, msg.bitOffset)
        msg.fields['mode'].msg = modeMsg;
        msg.bitOffset = modeMsg.bitOffset;
        // Decode static array field camera_orientation_in_body_frame_xyzw
        const camera_orientation_in_body_frame_xyzw_length = 4;
        for (let i = 0; i < camera_orientation_in_body_frame_xyzw_length; i++) {
            msg.fields['camera_orientation_in_body_frame_xyzw'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        // Decode dynamic array field camera_orientation_in_body_frame_covariance
        let camera_orientation_in_body_frame_covariance_length = 0;
        if (tao) {
            camera_orientation_in_body_frame_covariance_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 16);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                camera_orientation_in_body_frame_covariance_length = bitsToArrayLength(data.getBits(msg.bitOffset, 4));
                msg.bitOffset += 4;
            } else {
                throw new RangeError('Array length exceeds maximum size: 9');
            }
        }
        if (camera_orientation_in_body_frame_covariance_length > 9) {
            throw new RangeError('camera_orientation_in_body_frame_covariance_length length exceeds maximum size: 9');
        }
        for (let i = 0; i < camera_orientation_in_body_frame_covariance_length; i++) {
            msg.fields['camera_orientation_in_body_frame_covariance'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let gimbal_id_bits = this.fields.gimbal_id.pack();
        bits = bits.concat(gimbal_id_bits);
        let modeMsg_bits = this.fields.mode.pack(false);
        bits = bits.concat(modeMsg_bits);
        // Encode static array field camera_orientation_in_body_frame_xyzw
        const camera_orientation_in_body_frame_xyzw_length = 4;
        for (let i = 0; i < camera_orientation_in_body_frame_xyzw_length; i++) {
            let camera_orientation_in_body_frame_xyzw_bits = this.fields.camera_orientation_in_body_frame_xyzw.items[i].pack();
            bits = bits.concat(camera_orientation_in_body_frame_xyzw_bits);
        }

        // Encode dynamic array field camera_orientation_in_body_frame_covariance
        const camera_orientation_in_body_frame_covariance_length = this.fields.camera_orientation_in_body_frame_covariance.length;
        if (this.fields.camera_orientation_in_body_frame_covariance.length > camera_orientation_in_body_frame_covariance_length) {
            throw new Error(`Array length of camera_orientation_in_body_frame_covariance exceeds maximum length of camera_orientation_in_body_frame_covariance_length`);
        }
        if (!tao) {
           let camera_orientation_in_body_frame_covariance_length_bits = arrayLengthToBits(this.fields.camera_orientation_in_body_frame_covariance.length, 4);
           bits = bits.concat(camera_orientation_in_body_frame_covariance_length_bits);
        }
        for (let i = 0; i < camera_orientation_in_body_frame_covariance_length; i++) {
            let camera_orientation_in_body_frame_covariance_bits = this.fields.camera_orientation_in_body_frame_covariance.items[i].pack();
            bits = bits.concat(camera_orientation_in_body_frame_covariance_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['gimbal_id'] = Number(this.fields['gimbal_id'].value);
        obj['mode'] = this.fields['mode'].toObj();
        obj['camera_orientation_in_body_frame_xyzw'] = this.fields['camera_orientation_in_body_frame_xyzw'].toObj(true);
        obj['camera_orientation_in_body_frame_covariance'] = this.fields['camera_orientation_in_body_frame_covariance'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_camera_gimbal_Status.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_camera_gimbal_Status.DTID;
    }

    get name() {
        return uavcan_equipment_camera_gimbal_Status.FULL_NAME;
    }

    get fieldNames() {
        return [
            'gimbal_id',
            'mode',
            'camera_orientation_in_body_frame_xyzw',
            'camera_orientation_in_body_frame_covariance',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_camera_gimbal_Status();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 13398533824424498718n;
    }

    getDataTypeSignature() {
        return 13398533824424498718n;
    }

};
module.exports.uavcan_equipment_camera_gimbal_Status = uavcan_equipment_camera_gimbal_Status;

// JavaScript binding for uavcan.equipment.ice.FuelTankStatus
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_ice_FuelTankStatus = class {
    static DTID = 1129;
    static FULL_NAME = 'uavcan.equipment.ice.FuelTankStatus';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 104;
    static MIN_BIT_LEN = 104;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['available_fuel_volume_percent'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
        this.fields['available_fuel_volume_cm3'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['fuel_consumption_rate_cm3pm'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['fuel_temperature'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['fuel_tank_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.bitOffset += 9; //field.type.CATEGORY_VOID void9 for Reserved space
        let available_fuel_volume_percent_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['available_fuel_volume_percent'].value = available_fuel_volume_percent_field.value
        msg.bitOffset += 7;
        let available_fuel_volume_cm3_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['available_fuel_volume_cm3'].value = available_fuel_volume_cm3_field.value
        msg.bitOffset += 32;
        let fuel_consumption_rate_cm3pm_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['fuel_consumption_rate_cm3pm'].value = fuel_consumption_rate_cm3pm_field.value
        msg.bitOffset += 32;
        let fuel_temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['fuel_temperature'].value = fuel_temperature_field.value
        msg.bitOffset += 16;
        let fuel_tank_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['fuel_tank_id'].value = fuel_tank_id_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        for (let j = 0; j < 9; j++) {
            bits.push(0);
        }
        let available_fuel_volume_percent_bits = this.fields.available_fuel_volume_percent.pack();
        bits = bits.concat(available_fuel_volume_percent_bits);
        let available_fuel_volume_cm3_bits = this.fields.available_fuel_volume_cm3.pack();
        bits = bits.concat(available_fuel_volume_cm3_bits);
        let fuel_consumption_rate_cm3pm_bits = this.fields.fuel_consumption_rate_cm3pm.pack();
        bits = bits.concat(fuel_consumption_rate_cm3pm_bits);
        let fuel_temperature_bits = this.fields.fuel_temperature.pack();
        bits = bits.concat(fuel_temperature_bits);
        let fuel_tank_id_bits = this.fields.fuel_tank_id.pack();
        bits = bits.concat(fuel_tank_id_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['available_fuel_volume_percent'] = Number(this.fields['available_fuel_volume_percent'].value);
        obj['available_fuel_volume_cm3'] = Number(this.fields['available_fuel_volume_cm3'].value);
        obj['fuel_consumption_rate_cm3pm'] = Number(this.fields['fuel_consumption_rate_cm3pm'].value);
        obj['fuel_temperature'] = Number(this.fields['fuel_temperature'].value);
        obj['fuel_tank_id'] = Number(this.fields['fuel_tank_id'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_ice_FuelTankStatus.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_ice_FuelTankStatus.DTID;
    }

    get name() {
        return uavcan_equipment_ice_FuelTankStatus.FULL_NAME;
    }

    get fieldNames() {
        return [
            'available_fuel_volume_percent',
            'available_fuel_volume_cm3',
            'fuel_consumption_rate_cm3pm',
            'fuel_temperature',
            'fuel_tank_id',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_ice_FuelTankStatus();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 2912503190478408644n;
    }

    getDataTypeSignature() {
        return 2912503190478408644n;
    }

};
module.exports.uavcan_equipment_ice_FuelTankStatus = uavcan_equipment_ice_FuelTankStatus;

// JavaScript binding for uavcan.equipment.ice.reciprocating.CylinderStatus
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_ice_reciprocating_CylinderStatus = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.equipment.ice.reciprocating.CylinderStatus';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 80;
    static MIN_BIT_LEN = 80;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['ignition_timing_deg'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['injection_time_ms'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['cylinder_head_temperature'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['exhaust_gas_temperature'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['lambda_coefficient'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let ignition_timing_deg_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['ignition_timing_deg'].value = ignition_timing_deg_field.value
        msg.bitOffset += 16;
        let injection_time_ms_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['injection_time_ms'].value = injection_time_ms_field.value
        msg.bitOffset += 16;
        let cylinder_head_temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['cylinder_head_temperature'].value = cylinder_head_temperature_field.value
        msg.bitOffset += 16;
        let exhaust_gas_temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['exhaust_gas_temperature'].value = exhaust_gas_temperature_field.value
        msg.bitOffset += 16;
        let lambda_coefficient_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['lambda_coefficient'].value = lambda_coefficient_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let ignition_timing_deg_bits = this.fields.ignition_timing_deg.pack();
        bits = bits.concat(ignition_timing_deg_bits);
        let injection_time_ms_bits = this.fields.injection_time_ms.pack();
        bits = bits.concat(injection_time_ms_bits);
        let cylinder_head_temperature_bits = this.fields.cylinder_head_temperature.pack();
        bits = bits.concat(cylinder_head_temperature_bits);
        let exhaust_gas_temperature_bits = this.fields.exhaust_gas_temperature.pack();
        bits = bits.concat(exhaust_gas_temperature_bits);
        let lambda_coefficient_bits = this.fields.lambda_coefficient.pack();
        bits = bits.concat(lambda_coefficient_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['ignition_timing_deg'] = Number(this.fields['ignition_timing_deg'].value);
        obj['injection_time_ms'] = Number(this.fields['injection_time_ms'].value);
        obj['cylinder_head_temperature'] = Number(this.fields['cylinder_head_temperature'].value);
        obj['exhaust_gas_temperature'] = Number(this.fields['exhaust_gas_temperature'].value);
        obj['lambda_coefficient'] = Number(this.fields['lambda_coefficient'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_ice_reciprocating_CylinderStatus.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_ice_reciprocating_CylinderStatus.DTID;
    }

    get name() {
        return uavcan_equipment_ice_reciprocating_CylinderStatus.FULL_NAME;
    }

    get fieldNames() {
        return [
            'ignition_timing_deg',
            'injection_time_ms',
            'cylinder_head_temperature',
            'exhaust_gas_temperature',
            'lambda_coefficient',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_ice_reciprocating_CylinderStatus();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 15459388824648790891n;
    }

    getDataTypeSignature() {
        return 15459388824648790891n;
    }

};
module.exports.uavcan_equipment_ice_reciprocating_CylinderStatus = uavcan_equipment_ice_reciprocating_CylinderStatus;

// JavaScript binding for uavcan.equipment.ice.reciprocating.Status
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_ice_reciprocating_Status = class {
    static DTID = 1120;
    static FULL_NAME = 'uavcan.equipment.ice.reciprocating.Status';
    static CONSTANTS = {'state': {'STOPPED': 0, 'STARTING': 1, 'RUNNING': 2, 'FAULT': 3}};
    static MAX_BIT_LEN = 1565;
    static MIN_BIT_LEN = 280;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['state'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 2);
        this.fields['flags'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 30);
        this.fields['engine_load_percent'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
        this.fields['engine_speed_rpm'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 17);
        this.fields['spark_dwell_time_ms'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['atmospheric_pressure_kpa'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['intake_manifold_pressure_kpa'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['intake_manifold_temperature'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['coolant_temperature'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['oil_pressure'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['oil_temperature'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['fuel_pressure'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['fuel_consumption_rate_cm3pm'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['estimated_consumed_fuel_volume_cm3'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['throttle_position_percent'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
        this.fields['ecu_index'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 6);
        this.fields['spark_plug_usage'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 3);
        this.fields['cylinder_status'] = new ArrayType(uavcan_equipment_ice_reciprocating_CylinderStatus.sampleMessage(), ArrayType.MODE_DYNAMIC, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let state_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 2), 2, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['state'].value = state_field.value
        msg.bitOffset += 2;
        let flags_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 30), 30, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['flags'].value = flags_field.value
        msg.bitOffset += 30;
        msg.bitOffset += 16; //field.type.CATEGORY_VOID void16 for Reserved space
        let engine_load_percent_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['engine_load_percent'].value = engine_load_percent_field.value
        msg.bitOffset += 7;
        let engine_speed_rpm_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 17), 17, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['engine_speed_rpm'].value = engine_speed_rpm_field.value
        msg.bitOffset += 17;
        let spark_dwell_time_ms_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['spark_dwell_time_ms'].value = spark_dwell_time_ms_field.value
        msg.bitOffset += 16;
        let atmospheric_pressure_kpa_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['atmospheric_pressure_kpa'].value = atmospheric_pressure_kpa_field.value
        msg.bitOffset += 16;
        let intake_manifold_pressure_kpa_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['intake_manifold_pressure_kpa'].value = intake_manifold_pressure_kpa_field.value
        msg.bitOffset += 16;
        let intake_manifold_temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['intake_manifold_temperature'].value = intake_manifold_temperature_field.value
        msg.bitOffset += 16;
        let coolant_temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['coolant_temperature'].value = coolant_temperature_field.value
        msg.bitOffset += 16;
        let oil_pressure_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['oil_pressure'].value = oil_pressure_field.value
        msg.bitOffset += 16;
        let oil_temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['oil_temperature'].value = oil_temperature_field.value
        msg.bitOffset += 16;
        let fuel_pressure_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['fuel_pressure'].value = fuel_pressure_field.value
        msg.bitOffset += 16;
        let fuel_consumption_rate_cm3pm_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['fuel_consumption_rate_cm3pm'].value = fuel_consumption_rate_cm3pm_field.value
        msg.bitOffset += 32;
        let estimated_consumed_fuel_volume_cm3_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['estimated_consumed_fuel_volume_cm3'].value = estimated_consumed_fuel_volume_cm3_field.value
        msg.bitOffset += 32;
        let throttle_position_percent_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['throttle_position_percent'].value = throttle_position_percent_field.value
        msg.bitOffset += 7;
        let ecu_index_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 6), 6, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['ecu_index'].value = ecu_index_field.value
        msg.bitOffset += 6;
        let spark_plug_usage_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 3), 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['spark_plug_usage'].value = spark_plug_usage_field.value
        msg.bitOffset += 3;
        // Decode dynamic array field cylinder_status
        let cylinder_status_length = 0;
        if (tao) {
            cylinder_status_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 80);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                cylinder_status_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
                msg.bitOffset += 5;
            } else {
                throw new RangeError('Array length exceeds maximum size: 16');
            }
        }
        if (cylinder_status_length > 16) {
            throw new RangeError('cylinder_status_length length exceeds maximum size: 16');
        }
        for (let i = 0; i < cylinder_status_length; i++) {
            let cylinder_statusMsg = uavcan_equipment_ice_reciprocating_CylinderStatus.unpack(data, false, msg.bitOffset)
            msg.fields['cylinder_status'].items.push(new CompoundType(cylinder_statusMsg, null));
            msg.bitOffset = cylinder_statusMsg.bitOffset;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let state_bits = this.fields.state.pack();
        bits = bits.concat(state_bits);
        let flags_bits = this.fields.flags.pack();
        bits = bits.concat(flags_bits);
        for (let j = 0; j < 16; j++) {
            bits.push(0);
        }
        let engine_load_percent_bits = this.fields.engine_load_percent.pack();
        bits = bits.concat(engine_load_percent_bits);
        let engine_speed_rpm_bits = this.fields.engine_speed_rpm.pack();
        bits = bits.concat(engine_speed_rpm_bits);
        let spark_dwell_time_ms_bits = this.fields.spark_dwell_time_ms.pack();
        bits = bits.concat(spark_dwell_time_ms_bits);
        let atmospheric_pressure_kpa_bits = this.fields.atmospheric_pressure_kpa.pack();
        bits = bits.concat(atmospheric_pressure_kpa_bits);
        let intake_manifold_pressure_kpa_bits = this.fields.intake_manifold_pressure_kpa.pack();
        bits = bits.concat(intake_manifold_pressure_kpa_bits);
        let intake_manifold_temperature_bits = this.fields.intake_manifold_temperature.pack();
        bits = bits.concat(intake_manifold_temperature_bits);
        let coolant_temperature_bits = this.fields.coolant_temperature.pack();
        bits = bits.concat(coolant_temperature_bits);
        let oil_pressure_bits = this.fields.oil_pressure.pack();
        bits = bits.concat(oil_pressure_bits);
        let oil_temperature_bits = this.fields.oil_temperature.pack();
        bits = bits.concat(oil_temperature_bits);
        let fuel_pressure_bits = this.fields.fuel_pressure.pack();
        bits = bits.concat(fuel_pressure_bits);
        let fuel_consumption_rate_cm3pm_bits = this.fields.fuel_consumption_rate_cm3pm.pack();
        bits = bits.concat(fuel_consumption_rate_cm3pm_bits);
        let estimated_consumed_fuel_volume_cm3_bits = this.fields.estimated_consumed_fuel_volume_cm3.pack();
        bits = bits.concat(estimated_consumed_fuel_volume_cm3_bits);
        let throttle_position_percent_bits = this.fields.throttle_position_percent.pack();
        bits = bits.concat(throttle_position_percent_bits);
        let ecu_index_bits = this.fields.ecu_index.pack();
        bits = bits.concat(ecu_index_bits);
        let spark_plug_usage_bits = this.fields.spark_plug_usage.pack();
        bits = bits.concat(spark_plug_usage_bits);
        // Encode dynamic array field cylinder_status
        const cylinder_status_length = this.fields.cylinder_status.length;
        if (this.fields.cylinder_status.length > cylinder_status_length) {
            throw new Error(`Array length of cylinder_status exceeds maximum length of cylinder_status_length`);
        }
        if (!tao) {
           let cylinder_status_length_bits = arrayLengthToBits(this.fields.cylinder_status.length, 5);
           bits = bits.concat(cylinder_status_length_bits);
        }
        for (let i = 0; i < cylinder_status_length; i++) {
            let cylinder_statusMsg_bits = this.fields.cylinder_status.items[i].pack();
            bits = bits.concat(cylinder_statusMsg_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['state'] = Number(this.fields['state'].value);
        obj['flags'] = Number(this.fields['flags'].value);
        obj['engine_load_percent'] = Number(this.fields['engine_load_percent'].value);
        obj['engine_speed_rpm'] = Number(this.fields['engine_speed_rpm'].value);
        obj['spark_dwell_time_ms'] = Number(this.fields['spark_dwell_time_ms'].value);
        obj['atmospheric_pressure_kpa'] = Number(this.fields['atmospheric_pressure_kpa'].value);
        obj['intake_manifold_pressure_kpa'] = Number(this.fields['intake_manifold_pressure_kpa'].value);
        obj['intake_manifold_temperature'] = Number(this.fields['intake_manifold_temperature'].value);
        obj['coolant_temperature'] = Number(this.fields['coolant_temperature'].value);
        obj['oil_pressure'] = Number(this.fields['oil_pressure'].value);
        obj['oil_temperature'] = Number(this.fields['oil_temperature'].value);
        obj['fuel_pressure'] = Number(this.fields['fuel_pressure'].value);
        obj['fuel_consumption_rate_cm3pm'] = Number(this.fields['fuel_consumption_rate_cm3pm'].value);
        obj['estimated_consumed_fuel_volume_cm3'] = Number(this.fields['estimated_consumed_fuel_volume_cm3'].value);
        obj['throttle_position_percent'] = Number(this.fields['throttle_position_percent'].value);
        obj['ecu_index'] = Number(this.fields['ecu_index'].value);
        obj['spark_plug_usage'] = Number(this.fields['spark_plug_usage'].value);
        obj['cylinder_status'] = this.fields['cylinder_status'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_ice_reciprocating_Status.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_ice_reciprocating_Status.DTID;
    }

    get name() {
        return uavcan_equipment_ice_reciprocating_Status.FULL_NAME;
    }

    get fieldNames() {
        return [
            'state',
            'flags',
            'engine_load_percent',
            'engine_speed_rpm',
            'spark_dwell_time_ms',
            'atmospheric_pressure_kpa',
            'intake_manifold_pressure_kpa',
            'intake_manifold_temperature',
            'coolant_temperature',
            'oil_pressure',
            'oil_temperature',
            'fuel_pressure',
            'fuel_consumption_rate_cm3pm',
            'estimated_consumed_fuel_volume_cm3',
            'throttle_position_percent',
            'ecu_index',
            'spark_plug_usage',
            'cylinder_status',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_ice_reciprocating_Status();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 15243176133354815174n;
    }

    getDataTypeSignature() {
        return 15243176133354815174n;
    }

};
module.exports.uavcan_equipment_ice_reciprocating_Status = uavcan_equipment_ice_reciprocating_Status;

// JavaScript binding for uavcan.equipment.indication.SingleLightCommand
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_indication_SingleLightCommand = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.equipment.indication.SingleLightCommand';
    static CONSTANTS = {'light_id': {'ANTI_COLLISION': 246, 'RIGHT_OF_WAY': 247, 'STROBE': 248, 'WING': 249, 'LOGO': 250, 'TAXI': 251, 'TURN_OFF': 252, 'TAKE_OFF': 253, 'LANDING': 254, 'FORMATION': 255}};
    static MAX_BIT_LEN = 24;
    static MIN_BIT_LEN = 24;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['light_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['color'] = new CompoundType(uavcan_equipment_indication_RGB565.sampleMessage(), CompoundType.KIND_MESSAGE, null);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let light_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['light_id'].value = light_id_field.value
        msg.bitOffset += 8;
        let colorMsg = uavcan_equipment_indication_RGB565.unpack(data, true, msg.bitOffset)
        msg.fields['color'].msg = colorMsg;
        msg.bitOffset = colorMsg.bitOffset;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let light_id_bits = this.fields.light_id.pack();
        bits = bits.concat(light_id_bits);
        let colorMsg_bits = this.fields.color.pack();
        bits = bits.concat(colorMsg_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['light_id'] = Number(this.fields['light_id'].value);
        obj['color'] = this.fields['color'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_indication_SingleLightCommand.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_indication_SingleLightCommand.DTID;
    }

    get name() {
        return uavcan_equipment_indication_SingleLightCommand.FULL_NAME;
    }

    get fieldNames() {
        return [
            'light_id',
            'color',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_indication_SingleLightCommand();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 16759223203187945479n;
    }

    getDataTypeSignature() {
        return 16759223203187945479n;
    }

};
module.exports.uavcan_equipment_indication_SingleLightCommand = uavcan_equipment_indication_SingleLightCommand;

// JavaScript binding for uavcan.equipment.indication.BeepCommand
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_indication_BeepCommand = class {
    static DTID = 1080;
    static FULL_NAME = 'uavcan.equipment.indication.BeepCommand';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 32;
    static MIN_BIT_LEN = 32;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['frequency'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['duration'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let frequency_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['frequency'].value = frequency_field.value
        msg.bitOffset += 16;
        let duration_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['duration'].value = duration_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let frequency_bits = this.fields.frequency.pack();
        bits = bits.concat(frequency_bits);
        let duration_bits = this.fields.duration.pack();
        bits = bits.concat(duration_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['frequency'] = Number(this.fields['frequency'].value);
        obj['duration'] = Number(this.fields['duration'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_indication_BeepCommand.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_indication_BeepCommand.DTID;
    }

    get name() {
        return uavcan_equipment_indication_BeepCommand.FULL_NAME;
    }

    get fieldNames() {
        return [
            'frequency',
            'duration',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_indication_BeepCommand();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 13735602825179782482n;
    }

    getDataTypeSignature() {
        return 13735602825179782482n;
    }

};
module.exports.uavcan_equipment_indication_BeepCommand = uavcan_equipment_indication_BeepCommand;

// JavaScript binding for uavcan.equipment.indication.RGB565
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_indication_RGB565 = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.equipment.indication.RGB565';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 16;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['red'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 5);
        this.fields['green'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 6);
        this.fields['blue'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 5);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let red_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 5), 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['red'].value = red_field.value
        msg.bitOffset += 5;
        let green_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 6), 6, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['green'].value = green_field.value
        msg.bitOffset += 6;
        let blue_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 5), 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['blue'].value = blue_field.value
        msg.bitOffset += 5;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let red_bits = this.fields.red.pack();
        bits = bits.concat(red_bits);
        let green_bits = this.fields.green.pack();
        bits = bits.concat(green_bits);
        let blue_bits = this.fields.blue.pack();
        bits = bits.concat(blue_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['red'] = Number(this.fields['red'].value);
        obj['green'] = Number(this.fields['green'].value);
        obj['blue'] = Number(this.fields['blue'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_indication_RGB565.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_indication_RGB565.DTID;
    }

    get name() {
        return uavcan_equipment_indication_RGB565.FULL_NAME;
    }

    get fieldNames() {
        return [
            'red',
            'green',
            'blue',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_indication_RGB565();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 6388302144240479284n;
    }

    getDataTypeSignature() {
        return 6388302144240479284n;
    }

};
module.exports.uavcan_equipment_indication_RGB565 = uavcan_equipment_indication_RGB565;

// JavaScript binding for uavcan.equipment.indication.LightsCommand
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_indication_LightsCommand = class {
    static DTID = 1081;
    static FULL_NAME = 'uavcan.equipment.indication.LightsCommand';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 485;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['commands'] = new ArrayType(uavcan_equipment_indication_SingleLightCommand.sampleMessage(), ArrayType.MODE_DYNAMIC, 20);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field commands
        let commands_length = 0;
        if (tao) {
            commands_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 24);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                commands_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
                msg.bitOffset += 5;
            } else {
                throw new RangeError('Array length exceeds maximum size: 20');
            }
        }
        if (commands_length > 20) {
            throw new RangeError('commands_length length exceeds maximum size: 20');
        }
        for (let i = 0; i < commands_length; i++) {
            let commandsMsg = uavcan_equipment_indication_SingleLightCommand.unpack(data, false, msg.bitOffset)
            msg.fields['commands'].items.push(new CompoundType(commandsMsg, null));
            msg.bitOffset = commandsMsg.bitOffset;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field commands
        const commands_length = this.fields.commands.length;
        if (this.fields.commands.length > commands_length) {
            throw new Error(`Array length of commands exceeds maximum length of commands_length`);
        }
        if (!tao) {
           let commands_length_bits = arrayLengthToBits(this.fields.commands.length, 5);
           bits = bits.concat(commands_length_bits);
        }
        for (let i = 0; i < commands_length; i++) {
            let commandsMsg_bits = this.fields.commands.items[i].pack();
            bits = bits.concat(commandsMsg_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['commands'] = this.fields['commands'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_indication_LightsCommand.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_indication_LightsCommand.DTID;
    }

    get name() {
        return uavcan_equipment_indication_LightsCommand.FULL_NAME;
    }

    get fieldNames() {
        return [
            'commands',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_indication_LightsCommand();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 2319874137140305604n;
    }

    getDataTypeSignature() {
        return 2319874137140305604n;
    }

};
module.exports.uavcan_equipment_indication_LightsCommand = uavcan_equipment_indication_LightsCommand;

// JavaScript binding for uavcan.equipment.safety.ArmingStatus
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_safety_ArmingStatus = class {
    static DTID = 1100;
    static FULL_NAME = 'uavcan.equipment.safety.ArmingStatus';
    static CONSTANTS = {'status': {'STATUS_DISARMED': 0, 'STATUS_FULLY_ARMED': 255}};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['status'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let status_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'].value = status_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let status_bits = this.fields.status.pack();
        bits = bits.concat(status_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['status'] = Number(this.fields['status'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_safety_ArmingStatus.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_safety_ArmingStatus.DTID;
    }

    get name() {
        return uavcan_equipment_safety_ArmingStatus.FULL_NAME;
    }

    get fieldNames() {
        return [
            'status',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_safety_ArmingStatus();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 9728042880390037507n;
    }

    getDataTypeSignature() {
        return 9728042880390037507n;
    }

};
module.exports.uavcan_equipment_safety_ArmingStatus = uavcan_equipment_safety_ArmingStatus;

// JavaScript binding for uavcan.equipment.gnss.RTCMStream
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_gnss_RTCMStream = class {
    static DTID = 1062;
    static FULL_NAME = 'uavcan.equipment.gnss.RTCMStream';
    static CONSTANTS = {'protocol_id': {'UNKNOWN': 0, 'RTCM2': 2, 'RTCM3': 3}};
    static MAX_BIT_LEN = 1040;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['protocol_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['data'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 128 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let protocol_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['protocol_id'].value = protocol_id_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field data
        let data_length = 0;
        if (tao) {
            data_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                data_length = bitsToArrayLength(data.getBits(msg.bitOffset, 8));
                msg.bitOffset += 8;
            } else {
                throw new RangeError('Array length exceeds maximum size: 128');
            }
        }
        if (data_length > 128) {
            throw new RangeError('data_length length exceeds maximum size: 128');
        }
        for (let i = 0; i < data_length; i++) {
            msg.fields['data'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let protocol_id_bits = this.fields.protocol_id.pack();
        bits = bits.concat(protocol_id_bits);
        // Encode dynamic array field data
        const data_length = this.fields.data.length;
        if (this.fields.data.length > data_length) {
            throw new Error(`Array length of data exceeds maximum length of data_length`);
        }
        if (!tao) {
           let data_length_bits = arrayLengthToBits(this.fields.data.length, 8);
           bits = bits.concat(data_length_bits);
        }
        for (let i = 0; i < data_length; i++) {
            let data_bits = this.fields.data.items[i].pack();
            bits = bits.concat(data_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['protocol_id'] = Number(this.fields['protocol_id'].value);
        obj['data'] = this.fields['data'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_gnss_RTCMStream.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_gnss_RTCMStream.DTID;
    }

    get name() {
        return uavcan_equipment_gnss_RTCMStream.FULL_NAME;
    }

    get fieldNames() {
        return [
            'protocol_id',
            'data',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_gnss_RTCMStream();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 2257995625244595457n;
    }

    getDataTypeSignature() {
        return 2257995625244595457n;
    }

};
module.exports.uavcan_equipment_gnss_RTCMStream = uavcan_equipment_gnss_RTCMStream;

// JavaScript binding for uavcan.equipment.gnss.ECEFPositionVelocity
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_gnss_ECEFPositionVelocity = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.equipment.gnss.ECEFPositionVelocity';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 792;
    static MIN_BIT_LEN = 210;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['velocity_xyz'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32), ArrayType.MODE_STATIC, 3 );
        this.fields['position_xyz_mm'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 36), ArrayType.MODE_STATIC, 3 );
        this.fields['covariance'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 36 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode static array field velocity_xyz
        const velocity_xyz_length = 3;
        for (let i = 0; i < velocity_xyz_length; i++) {
            msg.fields['velocity_xyz'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32));
            msg.bitOffset += 32;
        }

        // Decode static array field position_xyz_mm
        const position_xyz_mm_length = 3;
        for (let i = 0; i < position_xyz_mm_length; i++) {
            msg.fields['position_xyz_mm'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 36), 36, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 36;
        }

        msg.bitOffset += 6; //field.type.CATEGORY_VOID void6 for Reserved space
        // Decode dynamic array field covariance
        let covariance_length = 0;
        if (tao) {
            covariance_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 16);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                covariance_length = bitsToArrayLength(data.getBits(msg.bitOffset, 6));
                msg.bitOffset += 6;
            } else {
                throw new RangeError('Array length exceeds maximum size: 36');
            }
        }
        if (covariance_length > 36) {
            throw new RangeError('covariance_length length exceeds maximum size: 36');
        }
        for (let i = 0; i < covariance_length; i++) {
            msg.fields['covariance'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode static array field velocity_xyz
        const velocity_xyz_length = 3;
        for (let i = 0; i < velocity_xyz_length; i++) {
            let velocity_xyz_bits = this.fields.velocity_xyz.items[i].pack();
            bits = bits.concat(velocity_xyz_bits);
        }

        // Encode static array field position_xyz_mm
        const position_xyz_mm_length = 3;
        for (let i = 0; i < position_xyz_mm_length; i++) {
            let position_xyz_mm_bits = this.fields.position_xyz_mm.items[i].pack();
            bits = bits.concat(position_xyz_mm_bits);
        }

        for (let j = 0; j < 6; j++) {
            bits.push(0);
        }
        // Encode dynamic array field covariance
        const covariance_length = this.fields.covariance.length;
        if (this.fields.covariance.length > covariance_length) {
            throw new Error(`Array length of covariance exceeds maximum length of covariance_length`);
        }
        if (!tao) {
           let covariance_length_bits = arrayLengthToBits(this.fields.covariance.length, 6);
           bits = bits.concat(covariance_length_bits);
        }
        for (let i = 0; i < covariance_length; i++) {
            let covariance_bits = this.fields.covariance.items[i].pack();
            bits = bits.concat(covariance_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['velocity_xyz'] = this.fields['velocity_xyz'].toObj(true);
        obj['position_xyz_mm'] = this.fields['position_xyz_mm'].toObj(true);
        obj['covariance'] = this.fields['covariance'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_gnss_ECEFPositionVelocity.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_gnss_ECEFPositionVelocity.DTID;
    }

    get name() {
        return uavcan_equipment_gnss_ECEFPositionVelocity.FULL_NAME;
    }

    get fieldNames() {
        return [
            'velocity_xyz',
            'position_xyz_mm',
            'covariance',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_gnss_ECEFPositionVelocity();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 2640756771087688264n;
    }

    getDataTypeSignature() {
        return 2640756771087688264n;
    }

};
module.exports.uavcan_equipment_gnss_ECEFPositionVelocity = uavcan_equipment_gnss_ECEFPositionVelocity;

// JavaScript binding for uavcan.equipment.gnss.Fix2
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_gnss_Fix2 = class {
    static DTID = 1063;
    static FULL_NAME = 'uavcan.equipment.gnss.Fix2';
    static CONSTANTS = {'gnss_time_standard': {'NONE': 0, 'TAI': 1, 'UTC': 2, 'GPS': 3}, 'num_leap_seconds': {'UNKNOWN': 0}, 'status': {'NO_FIX': 0, 'TIME_ONLY': 1, '2D_FIX': 2, '3D_FIX': 3}, 'mode': {'SINGLE': 0, 'DGPS': 1, 'RTK': 2, 'PPP': 3}, 'sub_mode': {'DGPS_OTHER': 0, 'DGPS_SBAS': 1, 'RTK_FLOAT': 0, 'RTK_FIXED': 1}};
    static MAX_BIT_LEN = 1769;
    static MIN_BIT_LEN = 394;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['timestamp'] = new CompoundType(uavcan_Timestamp.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['gnss_timestamp'] = new CompoundType(uavcan_Timestamp.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['gnss_time_standard'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 3);
        this.fields['num_leap_seconds'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['longitude_deg_1e8'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 37);
        this.fields['latitude_deg_1e8'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 37);
        this.fields['height_ellipsoid_mm'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 27);
        this.fields['height_msl_mm'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 27);
        this.fields['ned_velocity'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32), ArrayType.MODE_STATIC, 3 );
        this.fields['sats_used'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 6);
        this.fields['status'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 2);
        this.fields['mode'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 4);
        this.fields['sub_mode'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 6);
        this.fields['covariance'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 36 );
        this.fields['pdop'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['ecef_position_velocity'] = new ArrayType(uavcan_equipment_gnss_ECEFPositionVelocity.sampleMessage(), ArrayType.MODE_DYNAMIC, 1);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let timestampMsg = uavcan_Timestamp.unpack(data, false, msg.bitOffset)
        msg.fields['timestamp'].msg = timestampMsg;
        msg.bitOffset = timestampMsg.bitOffset;
        let gnss_timestampMsg = uavcan_Timestamp.unpack(data, false, msg.bitOffset)
        msg.fields['gnss_timestamp'].msg = gnss_timestampMsg;
        msg.bitOffset = gnss_timestampMsg.bitOffset;
        let gnss_time_standard_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 3), 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['gnss_time_standard'].value = gnss_time_standard_field.value
        msg.bitOffset += 3;
        msg.bitOffset += 13; //field.type.CATEGORY_VOID void13 for Reserved space
        let num_leap_seconds_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['num_leap_seconds'].value = num_leap_seconds_field.value
        msg.bitOffset += 8;
        let longitude_deg_1e8_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 37), 37, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['longitude_deg_1e8'].value = longitude_deg_1e8_field.value
        msg.bitOffset += 37;
        let latitude_deg_1e8_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 37), 37, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['latitude_deg_1e8'].value = latitude_deg_1e8_field.value
        msg.bitOffset += 37;
        let height_ellipsoid_mm_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 27), 27, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_ellipsoid_mm'].value = height_ellipsoid_mm_field.value
        msg.bitOffset += 27;
        let height_msl_mm_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 27), 27, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_msl_mm'].value = height_msl_mm_field.value
        msg.bitOffset += 27;
        // Decode static array field ned_velocity
        const ned_velocity_length = 3;
        for (let i = 0; i < ned_velocity_length; i++) {
            msg.fields['ned_velocity'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32));
            msg.bitOffset += 32;
        }

        let sats_used_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 6), 6, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sats_used'].value = sats_used_field.value
        msg.bitOffset += 6;
        let status_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 2), 2, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'].value = status_field.value
        msg.bitOffset += 2;
        let mode_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 4), 4, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['mode'].value = mode_field.value
        msg.bitOffset += 4;
        let sub_mode_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 6), 6, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sub_mode'].value = sub_mode_field.value
        msg.bitOffset += 6;
        // Decode dynamic array field covariance
        let covariance_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            covariance_length = bitsToArrayLength(data.getBits(msg.bitOffset, 6));
            msg.bitOffset += 6;
        } else {
            throw new RangeError('Array length exceeds maximum size: 36');
        }
        if (covariance_length > 36) {
            throw new RangeError('covariance_length length exceeds maximum size: 36');
        }
        for (let i = 0; i < covariance_length; i++) {
            msg.fields['covariance'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        let pdop_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['pdop'].value = pdop_field.value
        msg.bitOffset += 16;
        // Decode dynamic array field ecef_position_velocity
        let ecef_position_velocity_length = 0;
        if (tao) {
            ecef_position_velocity_length = (data.byteLength - msg.bitOffset) / 8;
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                ecef_position_velocity_length = bitsToArrayLength(data.getBits(msg.bitOffset, 1));
                msg.bitOffset += 1;
            } else {
                throw new RangeError('Array length exceeds maximum size: 1');
            }
        }
        if (ecef_position_velocity_length > 1) {
            throw new RangeError('ecef_position_velocity_length length exceeds maximum size: 1');
        }
        for (let i = 0; i < ecef_position_velocity_length; i++) {
            let ecef_position_velocityMsg = uavcan_equipment_gnss_ECEFPositionVelocity.unpack(data, false, msg.bitOffset)
            msg.fields['ecef_position_velocity'].items.push(new CompoundType(ecef_position_velocityMsg, null));
            msg.bitOffset = ecef_position_velocityMsg.bitOffset;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let timestampMsg_bits = this.fields.timestamp.pack(false);
        bits = bits.concat(timestampMsg_bits);
        let gnss_timestampMsg_bits = this.fields.gnss_timestamp.pack(false);
        bits = bits.concat(gnss_timestampMsg_bits);
        let gnss_time_standard_bits = this.fields.gnss_time_standard.pack();
        bits = bits.concat(gnss_time_standard_bits);
        for (let j = 0; j < 13; j++) {
            bits.push(0);
        }
        let num_leap_seconds_bits = this.fields.num_leap_seconds.pack();
        bits = bits.concat(num_leap_seconds_bits);
        let longitude_deg_1e8_bits = this.fields.longitude_deg_1e8.pack();
        bits = bits.concat(longitude_deg_1e8_bits);
        let latitude_deg_1e8_bits = this.fields.latitude_deg_1e8.pack();
        bits = bits.concat(latitude_deg_1e8_bits);
        let height_ellipsoid_mm_bits = this.fields.height_ellipsoid_mm.pack();
        bits = bits.concat(height_ellipsoid_mm_bits);
        let height_msl_mm_bits = this.fields.height_msl_mm.pack();
        bits = bits.concat(height_msl_mm_bits);
        // Encode static array field ned_velocity
        const ned_velocity_length = 3;
        for (let i = 0; i < ned_velocity_length; i++) {
            let ned_velocity_bits = this.fields.ned_velocity.items[i].pack();
            bits = bits.concat(ned_velocity_bits);
        }

        let sats_used_bits = this.fields.sats_used.pack();
        bits = bits.concat(sats_used_bits);
        let status_bits = this.fields.status.pack();
        bits = bits.concat(status_bits);
        let mode_bits = this.fields.mode.pack();
        bits = bits.concat(mode_bits);
        let sub_mode_bits = this.fields.sub_mode.pack();
        bits = bits.concat(sub_mode_bits);
        // Encode dynamic array field covariance
        const covariance_length = this.fields.covariance.length;
        if (this.fields.covariance.length > covariance_length) {
            throw new Error(`Array length of covariance exceeds maximum length of covariance_length`);
        }
        let covariance_length_bits = arrayLengthToBits(this.fields.covariance.length, 6);
        bits = bits.concat(covariance_length_bits);
        for (let i = 0; i < covariance_length; i++) {
            let covariance_bits = this.fields.covariance.items[i].pack();
            bits = bits.concat(covariance_bits);
        }

        let pdop_bits = this.fields.pdop.pack();
        bits = bits.concat(pdop_bits);
        // Encode dynamic array field ecef_position_velocity
        const ecef_position_velocity_length = this.fields.ecef_position_velocity.length;
        if (this.fields.ecef_position_velocity.length > ecef_position_velocity_length) {
            throw new Error(`Array length of ecef_position_velocity exceeds maximum length of ecef_position_velocity_length`);
        }
        if (!tao) {
           let ecef_position_velocity_length_bits = arrayLengthToBits(this.fields.ecef_position_velocity.length, 1);
           bits = bits.concat(ecef_position_velocity_length_bits);
        }
        for (let i = 0; i < ecef_position_velocity_length; i++) {
            let ecef_position_velocityMsg_bits = this.fields.ecef_position_velocity.items[i].pack();
            bits = bits.concat(ecef_position_velocityMsg_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['gnss_timestamp'] = this.fields['gnss_timestamp'].toObj();
        obj['gnss_time_standard'] = Number(this.fields['gnss_time_standard'].value);
        obj['num_leap_seconds'] = Number(this.fields['num_leap_seconds'].value);
        obj['longitude_deg_1e8'] = Number(this.fields['longitude_deg_1e8'].value);
        obj['latitude_deg_1e8'] = Number(this.fields['latitude_deg_1e8'].value);
        obj['height_ellipsoid_mm'] = Number(this.fields['height_ellipsoid_mm'].value);
        obj['height_msl_mm'] = Number(this.fields['height_msl_mm'].value);
        obj['ned_velocity'] = this.fields['ned_velocity'].toObj(true);
        obj['sats_used'] = Number(this.fields['sats_used'].value);
        obj['status'] = Number(this.fields['status'].value);
        obj['mode'] = Number(this.fields['mode'].value);
        obj['sub_mode'] = Number(this.fields['sub_mode'].value);
        obj['covariance'] = this.fields['covariance'].toObj(true);
        obj['pdop'] = Number(this.fields['pdop'].value);
        obj['ecef_position_velocity'] = this.fields['ecef_position_velocity'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_gnss_Fix2.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_gnss_Fix2.DTID;
    }

    get name() {
        return uavcan_equipment_gnss_Fix2.FULL_NAME;
    }

    get fieldNames() {
        return [
            'timestamp',
            'gnss_timestamp',
            'gnss_time_standard',
            'num_leap_seconds',
            'longitude_deg_1e8',
            'latitude_deg_1e8',
            'height_ellipsoid_mm',
            'height_msl_mm',
            'ned_velocity',
            'sats_used',
            'status',
            'mode',
            'sub_mode',
            'covariance',
            'pdop',
            'ecef_position_velocity',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_gnss_Fix2();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 14574183856588931935n;
    }

    getDataTypeSignature() {
        return 14574183856588931935n;
    }

};
module.exports.uavcan_equipment_gnss_Fix2 = uavcan_equipment_gnss_Fix2;

// JavaScript binding for uavcan.equipment.gnss.Fix
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_gnss_Fix = class {
    static DTID = 1060;
    static FULL_NAME = 'uavcan.equipment.gnss.Fix';
    static CONSTANTS = {'gnss_time_standard': {'NONE': 0, 'TAI': 1, 'UTC': 2, 'GPS': 3}, 'num_leap_seconds': {'UNKNOWN': 0}, 'status': {'NO_FIX': 0, 'TIME_ONLY': 1, '2D_FIX': 2, '3D_FIX': 3}};
    static MAX_BIT_LEN = 628;
    static MIN_BIT_LEN = 332;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['timestamp'] = new CompoundType(uavcan_Timestamp.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['gnss_timestamp'] = new CompoundType(uavcan_Timestamp.sampleMessage(), CompoundType.KIND_MESSAGE, null);
        this.fields['gnss_time_standard'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 3);
        this.fields['num_leap_seconds'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['longitude_deg_1e8'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 37);
        this.fields['latitude_deg_1e8'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 37);
        this.fields['height_ellipsoid_mm'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 27);
        this.fields['height_msl_mm'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 27);
        this.fields['ned_velocity'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_STATIC, 3 );
        this.fields['sats_used'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 6);
        this.fields['status'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 2);
        this.fields['pdop'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['position_covariance'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 9 );
        this.fields['velocity_covariance'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 9 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let timestampMsg = uavcan_Timestamp.unpack(data, false, msg.bitOffset)
        msg.fields['timestamp'].msg = timestampMsg;
        msg.bitOffset = timestampMsg.bitOffset;
        let gnss_timestampMsg = uavcan_Timestamp.unpack(data, false, msg.bitOffset)
        msg.fields['gnss_timestamp'].msg = gnss_timestampMsg;
        msg.bitOffset = gnss_timestampMsg.bitOffset;
        let gnss_time_standard_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 3), 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['gnss_time_standard'].value = gnss_time_standard_field.value
        msg.bitOffset += 3;
        msg.bitOffset += 5; //field.type.CATEGORY_VOID void5 for Reserved space
        let num_leap_seconds_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['num_leap_seconds'].value = num_leap_seconds_field.value
        msg.bitOffset += 8;
        let longitude_deg_1e8_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 37), 37, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['longitude_deg_1e8'].value = longitude_deg_1e8_field.value
        msg.bitOffset += 37;
        let latitude_deg_1e8_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 37), 37, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['latitude_deg_1e8'].value = latitude_deg_1e8_field.value
        msg.bitOffset += 37;
        let height_ellipsoid_mm_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 27), 27, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_ellipsoid_mm'].value = height_ellipsoid_mm_field.value
        msg.bitOffset += 27;
        let height_msl_mm_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 27), 27, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_msl_mm'].value = height_msl_mm_field.value
        msg.bitOffset += 27;
        // Decode static array field ned_velocity
        const ned_velocity_length = 3;
        for (let i = 0; i < ned_velocity_length; i++) {
            msg.fields['ned_velocity'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        let sats_used_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 6), 6, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sats_used'].value = sats_used_field.value
        msg.bitOffset += 6;
        let status_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 2), 2, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'].value = status_field.value
        msg.bitOffset += 2;
        let pdop_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['pdop'].value = pdop_field.value
        msg.bitOffset += 16;
        msg.bitOffset += 4; //field.type.CATEGORY_VOID void4 for Reserved space
        // Decode dynamic array field position_covariance
        let position_covariance_length = 0;
        if (Math.floor(msg.bitOffset / 8) < buf.length) {
            position_covariance_length = bitsToArrayLength(data.getBits(msg.bitOffset, 4));
            msg.bitOffset += 4;
        } else {
            throw new RangeError('Array length exceeds maximum size: 9');
        }
        if (position_covariance_length > 9) {
            throw new RangeError('position_covariance_length length exceeds maximum size: 9');
        }
        for (let i = 0; i < position_covariance_length; i++) {
            msg.fields['position_covariance'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        // Decode dynamic array field velocity_covariance
        let velocity_covariance_length = 0;
        if (tao) {
            velocity_covariance_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 16);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                velocity_covariance_length = bitsToArrayLength(data.getBits(msg.bitOffset, 4));
                msg.bitOffset += 4;
            } else {
                throw new RangeError('Array length exceeds maximum size: 9');
            }
        }
        if (velocity_covariance_length > 9) {
            throw new RangeError('velocity_covariance_length length exceeds maximum size: 9');
        }
        for (let i = 0; i < velocity_covariance_length; i++) {
            msg.fields['velocity_covariance'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let timestampMsg_bits = this.fields.timestamp.pack(false);
        bits = bits.concat(timestampMsg_bits);
        let gnss_timestampMsg_bits = this.fields.gnss_timestamp.pack(false);
        bits = bits.concat(gnss_timestampMsg_bits);
        let gnss_time_standard_bits = this.fields.gnss_time_standard.pack();
        bits = bits.concat(gnss_time_standard_bits);
        for (let j = 0; j < 5; j++) {
            bits.push(0);
        }
        let num_leap_seconds_bits = this.fields.num_leap_seconds.pack();
        bits = bits.concat(num_leap_seconds_bits);
        let longitude_deg_1e8_bits = this.fields.longitude_deg_1e8.pack();
        bits = bits.concat(longitude_deg_1e8_bits);
        let latitude_deg_1e8_bits = this.fields.latitude_deg_1e8.pack();
        bits = bits.concat(latitude_deg_1e8_bits);
        let height_ellipsoid_mm_bits = this.fields.height_ellipsoid_mm.pack();
        bits = bits.concat(height_ellipsoid_mm_bits);
        let height_msl_mm_bits = this.fields.height_msl_mm.pack();
        bits = bits.concat(height_msl_mm_bits);
        // Encode static array field ned_velocity
        const ned_velocity_length = 3;
        for (let i = 0; i < ned_velocity_length; i++) {
            let ned_velocity_bits = this.fields.ned_velocity.items[i].pack();
            bits = bits.concat(ned_velocity_bits);
        }

        let sats_used_bits = this.fields.sats_used.pack();
        bits = bits.concat(sats_used_bits);
        let status_bits = this.fields.status.pack();
        bits = bits.concat(status_bits);
        let pdop_bits = this.fields.pdop.pack();
        bits = bits.concat(pdop_bits);
        for (let j = 0; j < 4; j++) {
            bits.push(0);
        }
        // Encode dynamic array field position_covariance
        const position_covariance_length = this.fields.position_covariance.length;
        if (this.fields.position_covariance.length > position_covariance_length) {
            throw new Error(`Array length of position_covariance exceeds maximum length of position_covariance_length`);
        }
        let position_covariance_length_bits = arrayLengthToBits(this.fields.position_covariance.length, 4);
        bits = bits.concat(position_covariance_length_bits);
        for (let i = 0; i < position_covariance_length; i++) {
            let position_covariance_bits = this.fields.position_covariance.items[i].pack();
            bits = bits.concat(position_covariance_bits);
        }

        // Encode dynamic array field velocity_covariance
        const velocity_covariance_length = this.fields.velocity_covariance.length;
        if (this.fields.velocity_covariance.length > velocity_covariance_length) {
            throw new Error(`Array length of velocity_covariance exceeds maximum length of velocity_covariance_length`);
        }
        if (!tao) {
           let velocity_covariance_length_bits = arrayLengthToBits(this.fields.velocity_covariance.length, 4);
           bits = bits.concat(velocity_covariance_length_bits);
        }
        for (let i = 0; i < velocity_covariance_length; i++) {
            let velocity_covariance_bits = this.fields.velocity_covariance.items[i].pack();
            bits = bits.concat(velocity_covariance_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['gnss_timestamp'] = this.fields['gnss_timestamp'].toObj();
        obj['gnss_time_standard'] = Number(this.fields['gnss_time_standard'].value);
        obj['num_leap_seconds'] = Number(this.fields['num_leap_seconds'].value);
        obj['longitude_deg_1e8'] = Number(this.fields['longitude_deg_1e8'].value);
        obj['latitude_deg_1e8'] = Number(this.fields['latitude_deg_1e8'].value);
        obj['height_ellipsoid_mm'] = Number(this.fields['height_ellipsoid_mm'].value);
        obj['height_msl_mm'] = Number(this.fields['height_msl_mm'].value);
        obj['ned_velocity'] = this.fields['ned_velocity'].toObj(true);
        obj['sats_used'] = Number(this.fields['sats_used'].value);
        obj['status'] = Number(this.fields['status'].value);
        obj['pdop'] = Number(this.fields['pdop'].value);
        obj['position_covariance'] = this.fields['position_covariance'].toObj(true);
        obj['velocity_covariance'] = this.fields['velocity_covariance'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_gnss_Fix.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_gnss_Fix.DTID;
    }

    get name() {
        return uavcan_equipment_gnss_Fix.FULL_NAME;
    }

    get fieldNames() {
        return [
            'timestamp',
            'gnss_timestamp',
            'gnss_time_standard',
            'num_leap_seconds',
            'longitude_deg_1e8',
            'latitude_deg_1e8',
            'height_ellipsoid_mm',
            'height_msl_mm',
            'ned_velocity',
            'sats_used',
            'status',
            'pdop',
            'position_covariance',
            'velocity_covariance',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_gnss_Fix();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 6107258414537634455n;
    }

    getDataTypeSignature() {
        return 6107258414537634455n;
    }

};
module.exports.uavcan_equipment_gnss_Fix = uavcan_equipment_gnss_Fix;

// JavaScript binding for uavcan.equipment.gnss.Auxiliary
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_gnss_Auxiliary = class {
    static DTID = 1061;
    static FULL_NAME = 'uavcan.equipment.gnss.Auxiliary';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 125;
    static MIN_BIT_LEN = 125;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['gdop'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['pdop'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['hdop'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['vdop'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['tdop'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['ndop'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['edop'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['sats_visible'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
        this.fields['sats_used'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 6);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let gdop_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['gdop'].value = gdop_field.value
        msg.bitOffset += 16;
        let pdop_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['pdop'].value = pdop_field.value
        msg.bitOffset += 16;
        let hdop_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['hdop'].value = hdop_field.value
        msg.bitOffset += 16;
        let vdop_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['vdop'].value = vdop_field.value
        msg.bitOffset += 16;
        let tdop_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['tdop'].value = tdop_field.value
        msg.bitOffset += 16;
        let ndop_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['ndop'].value = ndop_field.value
        msg.bitOffset += 16;
        let edop_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['edop'].value = edop_field.value
        msg.bitOffset += 16;
        let sats_visible_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sats_visible'].value = sats_visible_field.value
        msg.bitOffset += 7;
        let sats_used_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 6), 6, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sats_used'].value = sats_used_field.value
        msg.bitOffset += 6;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let gdop_bits = this.fields.gdop.pack();
        bits = bits.concat(gdop_bits);
        let pdop_bits = this.fields.pdop.pack();
        bits = bits.concat(pdop_bits);
        let hdop_bits = this.fields.hdop.pack();
        bits = bits.concat(hdop_bits);
        let vdop_bits = this.fields.vdop.pack();
        bits = bits.concat(vdop_bits);
        let tdop_bits = this.fields.tdop.pack();
        bits = bits.concat(tdop_bits);
        let ndop_bits = this.fields.ndop.pack();
        bits = bits.concat(ndop_bits);
        let edop_bits = this.fields.edop.pack();
        bits = bits.concat(edop_bits);
        let sats_visible_bits = this.fields.sats_visible.pack();
        bits = bits.concat(sats_visible_bits);
        let sats_used_bits = this.fields.sats_used.pack();
        bits = bits.concat(sats_used_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['gdop'] = Number(this.fields['gdop'].value);
        obj['pdop'] = Number(this.fields['pdop'].value);
        obj['hdop'] = Number(this.fields['hdop'].value);
        obj['vdop'] = Number(this.fields['vdop'].value);
        obj['tdop'] = Number(this.fields['tdop'].value);
        obj['ndop'] = Number(this.fields['ndop'].value);
        obj['edop'] = Number(this.fields['edop'].value);
        obj['sats_visible'] = Number(this.fields['sats_visible'].value);
        obj['sats_used'] = Number(this.fields['sats_used'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_gnss_Auxiliary.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_gnss_Auxiliary.DTID;
    }

    get name() {
        return uavcan_equipment_gnss_Auxiliary.FULL_NAME;
    }

    get fieldNames() {
        return [
            'gdop',
            'pdop',
            'hdop',
            'vdop',
            'tdop',
            'ndop',
            'edop',
            'sats_visible',
            'sats_used',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_gnss_Auxiliary();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 11234437923272900562n;
    }

    getDataTypeSignature() {
        return 11234437923272900562n;
    }

};
module.exports.uavcan_equipment_gnss_Auxiliary = uavcan_equipment_gnss_Auxiliary;

// JavaScript binding for uavcan.equipment.actuator.Command
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_actuator_Command = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.equipment.actuator.Command';
    static CONSTANTS = {'command_type': {'UNITLESS': 0, 'POSITION': 1, 'FORCE': 2, 'SPEED': 3, 'PWM': 4}};
    static MAX_BIT_LEN = 32;
    static MIN_BIT_LEN = 32;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['actuator_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['command_type'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['command_value'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let actuator_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['actuator_id'].value = actuator_id_field.value
        msg.bitOffset += 8;
        let command_type_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['command_type'].value = command_type_field.value
        msg.bitOffset += 8;
        let command_value_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['command_value'].value = command_value_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let actuator_id_bits = this.fields.actuator_id.pack();
        bits = bits.concat(actuator_id_bits);
        let command_type_bits = this.fields.command_type.pack();
        bits = bits.concat(command_type_bits);
        let command_value_bits = this.fields.command_value.pack();
        bits = bits.concat(command_value_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['actuator_id'] = Number(this.fields['actuator_id'].value);
        obj['command_type'] = Number(this.fields['command_type'].value);
        obj['command_value'] = Number(this.fields['command_value'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_actuator_Command.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_actuator_Command.DTID;
    }

    get name() {
        return uavcan_equipment_actuator_Command.FULL_NAME;
    }

    get fieldNames() {
        return [
            'actuator_id',
            'command_type',
            'command_value',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_actuator_Command();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 10203585081262301548n;
    }

    getDataTypeSignature() {
        return 10203585081262301548n;
    }

};
module.exports.uavcan_equipment_actuator_Command = uavcan_equipment_actuator_Command;

// JavaScript binding for uavcan.equipment.actuator.ArrayCommand
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_actuator_ArrayCommand = class {
    static DTID = 1010;
    static FULL_NAME = 'uavcan.equipment.actuator.ArrayCommand';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 484;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['commands'] = new ArrayType(uavcan_equipment_actuator_Command.sampleMessage(), ArrayType.MODE_DYNAMIC, 15);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field commands
        let commands_length = 0;
        if (tao) {
            commands_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 32);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                commands_length = bitsToArrayLength(data.getBits(msg.bitOffset, 4));
                msg.bitOffset += 4;
            } else {
                throw new RangeError('Array length exceeds maximum size: 15');
            }
        }
        if (commands_length > 15) {
            throw new RangeError('commands_length length exceeds maximum size: 15');
        }
        for (let i = 0; i < commands_length; i++) {
            let commandsMsg = uavcan_equipment_actuator_Command.unpack(data, false, msg.bitOffset)
            msg.fields['commands'].items.push(new CompoundType(commandsMsg, null));
            msg.bitOffset = commandsMsg.bitOffset;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field commands
        const commands_length = this.fields.commands.length;
        if (this.fields.commands.length > commands_length) {
            throw new Error(`Array length of commands exceeds maximum length of commands_length`);
        }
        if (!tao) {
           let commands_length_bits = arrayLengthToBits(this.fields.commands.length, 4);
           bits = bits.concat(commands_length_bits);
        }
        for (let i = 0; i < commands_length; i++) {
            let commandsMsg_bits = this.fields.commands.items[i].pack();
            bits = bits.concat(commandsMsg_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['commands'] = this.fields['commands'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_actuator_ArrayCommand.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_actuator_ArrayCommand.DTID;
    }

    get name() {
        return uavcan_equipment_actuator_ArrayCommand.FULL_NAME;
    }

    get fieldNames() {
        return [
            'commands',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_actuator_ArrayCommand();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 15611526220002114291n;
    }

    getDataTypeSignature() {
        return 15611526220002114291n;
    }

};
module.exports.uavcan_equipment_actuator_ArrayCommand = uavcan_equipment_actuator_ArrayCommand;

// JavaScript binding for uavcan.equipment.actuator.Status
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_actuator_Status = class {
    static DTID = 1011;
    static FULL_NAME = 'uavcan.equipment.actuator.Status';
    static CONSTANTS = {'power_rating_pct': {'UNKNOWN': 127}};
    static MAX_BIT_LEN = 64;
    static MIN_BIT_LEN = 64;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['actuator_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['position'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['force'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['speed'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['power_rating_pct'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 7);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let actuator_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['actuator_id'].value = actuator_id_field.value
        msg.bitOffset += 8;
        let position_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['position'].value = position_field.value
        msg.bitOffset += 16;
        let force_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['force'].value = force_field.value
        msg.bitOffset += 16;
        let speed_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['speed'].value = speed_field.value
        msg.bitOffset += 16;
        msg.bitOffset += 1; //field.type.CATEGORY_VOID void1 for Reserved space
        let power_rating_pct_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 7), 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['power_rating_pct'].value = power_rating_pct_field.value
        msg.bitOffset += 7;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let actuator_id_bits = this.fields.actuator_id.pack();
        bits = bits.concat(actuator_id_bits);
        let position_bits = this.fields.position.pack();
        bits = bits.concat(position_bits);
        let force_bits = this.fields.force.pack();
        bits = bits.concat(force_bits);
        let speed_bits = this.fields.speed.pack();
        bits = bits.concat(speed_bits);
        for (let j = 0; j < 1; j++) {
            bits.push(0);
        }
        let power_rating_pct_bits = this.fields.power_rating_pct.pack();
        bits = bits.concat(power_rating_pct_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['actuator_id'] = Number(this.fields['actuator_id'].value);
        obj['position'] = Number(this.fields['position'].value);
        obj['force'] = Number(this.fields['force'].value);
        obj['speed'] = Number(this.fields['speed'].value);
        obj['power_rating_pct'] = Number(this.fields['power_rating_pct'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_actuator_Status.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_actuator_Status.DTID;
    }

    get name() {
        return uavcan_equipment_actuator_Status.FULL_NAME;
    }

    get fieldNames() {
        return [
            'actuator_id',
            'position',
            'force',
            'speed',
            'power_rating_pct',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_actuator_Status();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 6817247266386078212n;
    }

    getDataTypeSignature() {
        return 6817247266386078212n;
    }

};
module.exports.uavcan_equipment_actuator_Status = uavcan_equipment_actuator_Status;

// JavaScript binding for uavcan.equipment.device.Temperature
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_device_Temperature = class {
    static DTID = 1110;
    static FULL_NAME = 'uavcan.equipment.device.Temperature';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 40;
    static MIN_BIT_LEN = 40;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['device_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['temperature'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['error_flags'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let device_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['device_id'].value = device_id_field.value
        msg.bitOffset += 16;
        let temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['temperature'].value = temperature_field.value
        msg.bitOffset += 16;
        let error_flags_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['error_flags'].value = error_flags_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let device_id_bits = this.fields.device_id.pack();
        bits = bits.concat(device_id_bits);
        let temperature_bits = this.fields.temperature.pack();
        bits = bits.concat(temperature_bits);
        let error_flags_bits = this.fields.error_flags.pack();
        bits = bits.concat(error_flags_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['device_id'] = Number(this.fields['device_id'].value);
        obj['temperature'] = Number(this.fields['temperature'].value);
        obj['error_flags'] = Number(this.fields['error_flags'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_device_Temperature.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_device_Temperature.DTID;
    }

    get name() {
        return uavcan_equipment_device_Temperature.FULL_NAME;
    }

    get fieldNames() {
        return [
            'device_id',
            'temperature',
            'error_flags',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_device_Temperature();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 8081177542326830278n;
    }

    getDataTypeSignature() {
        return 8081177542326830278n;
    }

};
module.exports.uavcan_equipment_device_Temperature = uavcan_equipment_device_Temperature;

// JavaScript binding for uavcan.equipment.air_data.RawAirData
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_air_data_RawAirData = class {
    static DTID = 1027;
    static FULL_NAME = 'uavcan.equipment.air_data.RawAirData';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 397;
    static MIN_BIT_LEN = 136;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['flags'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['static_pressure'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['differential_pressure'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['static_pressure_sensor_temperature'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['differential_pressure_sensor_temperature'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['static_air_temperature'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['pitot_temperature'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['covariance'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 16 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let flags_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['flags'].value = flags_field.value
        msg.bitOffset += 8;
        let static_pressure_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['static_pressure'].value = static_pressure_field.value
        msg.bitOffset += 32;
        let differential_pressure_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['differential_pressure'].value = differential_pressure_field.value
        msg.bitOffset += 32;
        let static_pressure_sensor_temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['static_pressure_sensor_temperature'].value = static_pressure_sensor_temperature_field.value
        msg.bitOffset += 16;
        let differential_pressure_sensor_temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['differential_pressure_sensor_temperature'].value = differential_pressure_sensor_temperature_field.value
        msg.bitOffset += 16;
        let static_air_temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['static_air_temperature'].value = static_air_temperature_field.value
        msg.bitOffset += 16;
        let pitot_temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['pitot_temperature'].value = pitot_temperature_field.value
        msg.bitOffset += 16;
        // Decode dynamic array field covariance
        let covariance_length = 0;
        if (tao) {
            covariance_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 16);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                covariance_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
                msg.bitOffset += 5;
            } else {
                throw new RangeError('Array length exceeds maximum size: 16');
            }
        }
        if (covariance_length > 16) {
            throw new RangeError('covariance_length length exceeds maximum size: 16');
        }
        for (let i = 0; i < covariance_length; i++) {
            msg.fields['covariance'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let flags_bits = this.fields.flags.pack();
        bits = bits.concat(flags_bits);
        let static_pressure_bits = this.fields.static_pressure.pack();
        bits = bits.concat(static_pressure_bits);
        let differential_pressure_bits = this.fields.differential_pressure.pack();
        bits = bits.concat(differential_pressure_bits);
        let static_pressure_sensor_temperature_bits = this.fields.static_pressure_sensor_temperature.pack();
        bits = bits.concat(static_pressure_sensor_temperature_bits);
        let differential_pressure_sensor_temperature_bits = this.fields.differential_pressure_sensor_temperature.pack();
        bits = bits.concat(differential_pressure_sensor_temperature_bits);
        let static_air_temperature_bits = this.fields.static_air_temperature.pack();
        bits = bits.concat(static_air_temperature_bits);
        let pitot_temperature_bits = this.fields.pitot_temperature.pack();
        bits = bits.concat(pitot_temperature_bits);
        // Encode dynamic array field covariance
        const covariance_length = this.fields.covariance.length;
        if (this.fields.covariance.length > covariance_length) {
            throw new Error(`Array length of covariance exceeds maximum length of covariance_length`);
        }
        if (!tao) {
           let covariance_length_bits = arrayLengthToBits(this.fields.covariance.length, 5);
           bits = bits.concat(covariance_length_bits);
        }
        for (let i = 0; i < covariance_length; i++) {
            let covariance_bits = this.fields.covariance.items[i].pack();
            bits = bits.concat(covariance_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['flags'] = Number(this.fields['flags'].value);
        obj['static_pressure'] = Number(this.fields['static_pressure'].value);
        obj['differential_pressure'] = Number(this.fields['differential_pressure'].value);
        obj['static_pressure_sensor_temperature'] = Number(this.fields['static_pressure_sensor_temperature'].value);
        obj['differential_pressure_sensor_temperature'] = Number(this.fields['differential_pressure_sensor_temperature'].value);
        obj['static_air_temperature'] = Number(this.fields['static_air_temperature'].value);
        obj['pitot_temperature'] = Number(this.fields['pitot_temperature'].value);
        obj['covariance'] = this.fields['covariance'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_air_data_RawAirData.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_air_data_RawAirData.DTID;
    }

    get name() {
        return uavcan_equipment_air_data_RawAirData.FULL_NAME;
    }

    get fieldNames() {
        return [
            'flags',
            'static_pressure',
            'differential_pressure',
            'static_pressure_sensor_temperature',
            'differential_pressure_sensor_temperature',
            'static_air_temperature',
            'pitot_temperature',
            'covariance',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_air_data_RawAirData();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 14374913366665917914n;
    }

    getDataTypeSignature() {
        return 14374913366665917914n;
    }

};
module.exports.uavcan_equipment_air_data_RawAirData = uavcan_equipment_air_data_RawAirData;

// JavaScript binding for uavcan.equipment.air_data.StaticTemperature
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_air_data_StaticTemperature = class {
    static DTID = 1029;
    static FULL_NAME = 'uavcan.equipment.air_data.StaticTemperature';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 32;
    static MIN_BIT_LEN = 32;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['static_temperature'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['static_temperature_variance'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let static_temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['static_temperature'].value = static_temperature_field.value
        msg.bitOffset += 16;
        let static_temperature_variance_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['static_temperature_variance'].value = static_temperature_variance_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let static_temperature_bits = this.fields.static_temperature.pack();
        bits = bits.concat(static_temperature_bits);
        let static_temperature_variance_bits = this.fields.static_temperature_variance.pack();
        bits = bits.concat(static_temperature_variance_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['static_temperature'] = Number(this.fields['static_temperature'].value);
        obj['static_temperature_variance'] = Number(this.fields['static_temperature_variance'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_air_data_StaticTemperature.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_air_data_StaticTemperature.DTID;
    }

    get name() {
        return uavcan_equipment_air_data_StaticTemperature.FULL_NAME;
    }

    get fieldNames() {
        return [
            'static_temperature',
            'static_temperature_variance',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_air_data_StaticTemperature();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 5271228499856286321n;
    }

    getDataTypeSignature() {
        return 5271228499856286321n;
    }

};
module.exports.uavcan_equipment_air_data_StaticTemperature = uavcan_equipment_air_data_StaticTemperature;

// JavaScript binding for uavcan.equipment.air_data.StaticPressure
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_air_data_StaticPressure = class {
    static DTID = 1028;
    static FULL_NAME = 'uavcan.equipment.air_data.StaticPressure';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 48;
    static MIN_BIT_LEN = 48;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['static_pressure'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['static_pressure_variance'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let static_pressure_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['static_pressure'].value = static_pressure_field.value
        msg.bitOffset += 32;
        let static_pressure_variance_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['static_pressure_variance'].value = static_pressure_variance_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let static_pressure_bits = this.fields.static_pressure.pack();
        bits = bits.concat(static_pressure_bits);
        let static_pressure_variance_bits = this.fields.static_pressure_variance.pack();
        bits = bits.concat(static_pressure_variance_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['static_pressure'] = Number(this.fields['static_pressure'].value);
        obj['static_pressure_variance'] = Number(this.fields['static_pressure_variance'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_air_data_StaticPressure.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_air_data_StaticPressure.DTID;
    }

    get name() {
        return uavcan_equipment_air_data_StaticPressure.FULL_NAME;
    }

    get fieldNames() {
        return [
            'static_pressure',
            'static_pressure_variance',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_air_data_StaticPressure();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 14828036026072418458n;
    }

    getDataTypeSignature() {
        return 14828036026072418458n;
    }

};
module.exports.uavcan_equipment_air_data_StaticPressure = uavcan_equipment_air_data_StaticPressure;

// JavaScript binding for uavcan.equipment.air_data.TrueAirspeed
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_air_data_TrueAirspeed = class {
    static DTID = 1020;
    static FULL_NAME = 'uavcan.equipment.air_data.TrueAirspeed';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 32;
    static MIN_BIT_LEN = 32;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['true_airspeed'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['true_airspeed_variance'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let true_airspeed_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['true_airspeed'].value = true_airspeed_field.value
        msg.bitOffset += 16;
        let true_airspeed_variance_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['true_airspeed_variance'].value = true_airspeed_variance_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let true_airspeed_bits = this.fields.true_airspeed.pack();
        bits = bits.concat(true_airspeed_bits);
        let true_airspeed_variance_bits = this.fields.true_airspeed_variance.pack();
        bits = bits.concat(true_airspeed_variance_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['true_airspeed'] = Number(this.fields['true_airspeed'].value);
        obj['true_airspeed_variance'] = Number(this.fields['true_airspeed_variance'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_air_data_TrueAirspeed.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_air_data_TrueAirspeed.DTID;
    }

    get name() {
        return uavcan_equipment_air_data_TrueAirspeed.FULL_NAME;
    }

    get fieldNames() {
        return [
            'true_airspeed',
            'true_airspeed_variance',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_air_data_TrueAirspeed();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 3490124649806802858n;
    }

    getDataTypeSignature() {
        return 3490124649806802858n;
    }

};
module.exports.uavcan_equipment_air_data_TrueAirspeed = uavcan_equipment_air_data_TrueAirspeed;

// JavaScript binding for uavcan.equipment.air_data.Sideslip
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_air_data_Sideslip = class {
    static DTID = 1026;
    static FULL_NAME = 'uavcan.equipment.air_data.Sideslip';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 32;
    static MIN_BIT_LEN = 32;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['sideslip_angle'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['sideslip_angle_variance'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let sideslip_angle_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['sideslip_angle'].value = sideslip_angle_field.value
        msg.bitOffset += 16;
        let sideslip_angle_variance_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['sideslip_angle_variance'].value = sideslip_angle_variance_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let sideslip_angle_bits = this.fields.sideslip_angle.pack();
        bits = bits.concat(sideslip_angle_bits);
        let sideslip_angle_variance_bits = this.fields.sideslip_angle_variance.pack();
        bits = bits.concat(sideslip_angle_variance_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['sideslip_angle'] = Number(this.fields['sideslip_angle'].value);
        obj['sideslip_angle_variance'] = Number(this.fields['sideslip_angle_variance'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_air_data_Sideslip.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_air_data_Sideslip.DTID;
    }

    get name() {
        return uavcan_equipment_air_data_Sideslip.FULL_NAME;
    }

    get fieldNames() {
        return [
            'sideslip_angle',
            'sideslip_angle_variance',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_air_data_Sideslip();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 8883602464661842519n;
    }

    getDataTypeSignature() {
        return 8883602464661842519n;
    }

};
module.exports.uavcan_equipment_air_data_Sideslip = uavcan_equipment_air_data_Sideslip;

// JavaScript binding for uavcan.equipment.air_data.AngleOfAttack
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_air_data_AngleOfAttack = class {
    static DTID = 1025;
    static FULL_NAME = 'uavcan.equipment.air_data.AngleOfAttack';
    static CONSTANTS = {'sensor_id': {'LEFT': 254, 'RIGHT': 255}};
    static MAX_BIT_LEN = 40;
    static MIN_BIT_LEN = 40;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['sensor_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['aoa'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['aoa_variance'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let sensor_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sensor_id'].value = sensor_id_field.value
        msg.bitOffset += 8;
        let aoa_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['aoa'].value = aoa_field.value
        msg.bitOffset += 16;
        let aoa_variance_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['aoa_variance'].value = aoa_variance_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let sensor_id_bits = this.fields.sensor_id.pack();
        bits = bits.concat(sensor_id_bits);
        let aoa_bits = this.fields.aoa.pack();
        bits = bits.concat(aoa_bits);
        let aoa_variance_bits = this.fields.aoa_variance.pack();
        bits = bits.concat(aoa_variance_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['sensor_id'] = Number(this.fields['sensor_id'].value);
        obj['aoa'] = Number(this.fields['aoa'].value);
        obj['aoa_variance'] = Number(this.fields['aoa_variance'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_air_data_AngleOfAttack.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_air_data_AngleOfAttack.DTID;
    }

    get name() {
        return uavcan_equipment_air_data_AngleOfAttack.FULL_NAME;
    }

    get fieldNames() {
        return [
            'sensor_id',
            'aoa',
            'aoa_variance',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_air_data_AngleOfAttack();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 15371133246536075086n;
    }

    getDataTypeSignature() {
        return 15371133246536075086n;
    }

};
module.exports.uavcan_equipment_air_data_AngleOfAttack = uavcan_equipment_air_data_AngleOfAttack;

// JavaScript binding for uavcan.equipment.air_data.IndicatedAirspeed
// Auto Generated Code, DO NOT MODIFY
const uavcan_equipment_air_data_IndicatedAirspeed = class {
    static DTID = 1021;
    static FULL_NAME = 'uavcan.equipment.air_data.IndicatedAirspeed';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 32;
    static MIN_BIT_LEN = 32;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['indicated_airspeed'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['indicated_airspeed_variance'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let indicated_airspeed_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['indicated_airspeed'].value = indicated_airspeed_field.value
        msg.bitOffset += 16;
        let indicated_airspeed_variance_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['indicated_airspeed_variance'].value = indicated_airspeed_variance_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let indicated_airspeed_bits = this.fields.indicated_airspeed.pack();
        bits = bits.concat(indicated_airspeed_bits);
        let indicated_airspeed_variance_bits = this.fields.indicated_airspeed_variance.pack();
        bits = bits.concat(indicated_airspeed_variance_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['indicated_airspeed'] = Number(this.fields['indicated_airspeed'].value);
        obj['indicated_airspeed_variance'] = Number(this.fields['indicated_airspeed_variance'].value);
        obj.getConstant = function(fieldName) {
            const constants = uavcan_equipment_air_data_IndicatedAirspeed.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return uavcan_equipment_air_data_IndicatedAirspeed.DTID;
    }

    get name() {
        return uavcan_equipment_air_data_IndicatedAirspeed.FULL_NAME;
    }

    get fieldNames() {
        return [
            'indicated_airspeed',
            'indicated_airspeed_variance',
        ];
    }

    static sampleMessage() {
        const msg = new uavcan_equipment_air_data_IndicatedAirspeed();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 727492792652698719n;
    }

    getDataTypeSignature() {
        return 727492792652698719n;
    }

};
module.exports.uavcan_equipment_air_data_IndicatedAirspeed = uavcan_equipment_air_data_IndicatedAirspeed;

// JavaScript binding for com.xacti.CopterAttStatus
// Auto Generated Code, DO NOT MODIFY
const com_xacti_CopterAttStatus = class {
    static DTID = 20407;
    static FULL_NAME = 'com.xacti.CopterAttStatus';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 98;
    static MIN_BIT_LEN = 64;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['quaternion_wxyz_e4'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 16), ArrayType.MODE_STATIC, 4 );
        this.fields['reserved'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16), ArrayType.MODE_DYNAMIC, 2 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode static array field quaternion_wxyz_e4
        const quaternion_wxyz_e4_length = 4;
        for (let i = 0; i < quaternion_wxyz_e4_length; i++) {
            msg.fields['quaternion_wxyz_e4'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 16;
        }

        // Decode dynamic array field reserved
        let reserved_length = 0;
        if (tao) {
            reserved_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 16);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                reserved_length = bitsToArrayLength(data.getBits(msg.bitOffset, 2));
                msg.bitOffset += 2;
            } else {
                throw new RangeError('Array length exceeds maximum size: 2');
            }
        }
        if (reserved_length > 2) {
            throw new RangeError('reserved_length length exceeds maximum size: 2');
        }
        for (let i = 0; i < reserved_length; i++) {
            msg.fields['reserved'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16));
            msg.bitOffset += 16;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode static array field quaternion_wxyz_e4
        const quaternion_wxyz_e4_length = 4;
        for (let i = 0; i < quaternion_wxyz_e4_length; i++) {
            let quaternion_wxyz_e4_bits = this.fields.quaternion_wxyz_e4.items[i].pack();
            bits = bits.concat(quaternion_wxyz_e4_bits);
        }

        // Encode dynamic array field reserved
        const reserved_length = this.fields.reserved.length;
        if (this.fields.reserved.length > reserved_length) {
            throw new Error(`Array length of reserved exceeds maximum length of reserved_length`);
        }
        if (!tao) {
           let reserved_length_bits = arrayLengthToBits(this.fields.reserved.length, 2);
           bits = bits.concat(reserved_length_bits);
        }
        for (let i = 0; i < reserved_length; i++) {
            let reserved_bits = this.fields.reserved.items[i].pack();
            bits = bits.concat(reserved_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['quaternion_wxyz_e4'] = this.fields['quaternion_wxyz_e4'].toObj(true);
        obj['reserved'] = this.fields['reserved'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = com_xacti_CopterAttStatus.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_xacti_CopterAttStatus.DTID;
    }

    get name() {
        return com_xacti_CopterAttStatus.FULL_NAME;
    }

    get fieldNames() {
        return [
            'quaternion_wxyz_e4',
            'reserved',
        ];
    }

    static sampleMessage() {
        const msg = new com_xacti_CopterAttStatus();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 7790999694321607601n;
    }

    getDataTypeSignature() {
        return 7790999694321607601n;
    }

};
module.exports.com_xacti_CopterAttStatus = com_xacti_CopterAttStatus;

// JavaScript binding for com.xacti.GimbalControlData
// Auto Generated Code, DO NOT MODIFY
const com_xacti_GimbalControlData = class {
    static DTID = 20554;
    static FULL_NAME = 'com.xacti.GimbalControlData';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 48;
    static MIN_BIT_LEN = 48;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['pitch_cmd_type'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['yaw_cmd_type'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['pitch_cmd_value'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['yaw_cmd_value'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let pitch_cmd_type_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pitch_cmd_type'].value = pitch_cmd_type_field.value
        msg.bitOffset += 8;
        let yaw_cmd_type_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['yaw_cmd_type'].value = yaw_cmd_type_field.value
        msg.bitOffset += 8;
        let pitch_cmd_value_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pitch_cmd_value'].value = pitch_cmd_value_field.value
        msg.bitOffset += 16;
        let yaw_cmd_value_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['yaw_cmd_value'].value = yaw_cmd_value_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let pitch_cmd_type_bits = this.fields.pitch_cmd_type.pack();
        bits = bits.concat(pitch_cmd_type_bits);
        let yaw_cmd_type_bits = this.fields.yaw_cmd_type.pack();
        bits = bits.concat(yaw_cmd_type_bits);
        let pitch_cmd_value_bits = this.fields.pitch_cmd_value.pack();
        bits = bits.concat(pitch_cmd_value_bits);
        let yaw_cmd_value_bits = this.fields.yaw_cmd_value.pack();
        bits = bits.concat(yaw_cmd_value_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['pitch_cmd_type'] = Number(this.fields['pitch_cmd_type'].value);
        obj['yaw_cmd_type'] = Number(this.fields['yaw_cmd_type'].value);
        obj['pitch_cmd_value'] = Number(this.fields['pitch_cmd_value'].value);
        obj['yaw_cmd_value'] = Number(this.fields['yaw_cmd_value'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_xacti_GimbalControlData.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_xacti_GimbalControlData.DTID;
    }

    get name() {
        return com_xacti_GimbalControlData.FULL_NAME;
    }

    get fieldNames() {
        return [
            'pitch_cmd_type',
            'yaw_cmd_type',
            'pitch_cmd_value',
            'yaw_cmd_value',
        ];
    }

    static sampleMessage() {
        const msg = new com_xacti_GimbalControlData();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 4252963364928538046n;
    }

    getDataTypeSignature() {
        return 4252963364928538046n;
    }

};
module.exports.com_xacti_GimbalControlData = com_xacti_GimbalControlData;

// JavaScript binding for com.xacti.GnssStatus
// Auto Generated Code, DO NOT MODIFY
const com_xacti_GnssStatus = class {
    static DTID = 20305;
    static FULL_NAME = 'com.xacti.GnssStatus';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 264;
    static MIN_BIT_LEN = 264;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['gps_status'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['order'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['remain_buffer'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['utc_year'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['utc_month'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['utc_day'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['utc_hour'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['utc_minute'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['utc_seconds'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['latitude'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 64);
        this.fields['longitude'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 64);
        this.fields['altitude'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let gps_status_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['gps_status'].value = gps_status_field.value
        msg.bitOffset += 8;
        let order_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['order'].value = order_field.value
        msg.bitOffset += 8;
        let remain_buffer_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['remain_buffer'].value = remain_buffer_field.value
        msg.bitOffset += 8;
        let utc_year_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['utc_year'].value = utc_year_field.value
        msg.bitOffset += 16;
        let utc_month_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['utc_month'].value = utc_month_field.value
        msg.bitOffset += 8;
        let utc_day_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['utc_day'].value = utc_day_field.value
        msg.bitOffset += 8;
        let utc_hour_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['utc_hour'].value = utc_hour_field.value
        msg.bitOffset += 8;
        let utc_minute_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['utc_minute'].value = utc_minute_field.value
        msg.bitOffset += 8;
        let utc_seconds_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['utc_seconds'].value = utc_seconds_field.value
        msg.bitOffset += 32;
        let latitude_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 64), 64);
        msg.fields['latitude'].value = latitude_field.value
        msg.bitOffset += 64;
        let longitude_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 64), 64);
        msg.fields['longitude'].value = longitude_field.value
        msg.bitOffset += 64;
        let altitude_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['altitude'].value = altitude_field.value
        msg.bitOffset += 32;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let gps_status_bits = this.fields.gps_status.pack();
        bits = bits.concat(gps_status_bits);
        let order_bits = this.fields.order.pack();
        bits = bits.concat(order_bits);
        let remain_buffer_bits = this.fields.remain_buffer.pack();
        bits = bits.concat(remain_buffer_bits);
        let utc_year_bits = this.fields.utc_year.pack();
        bits = bits.concat(utc_year_bits);
        let utc_month_bits = this.fields.utc_month.pack();
        bits = bits.concat(utc_month_bits);
        let utc_day_bits = this.fields.utc_day.pack();
        bits = bits.concat(utc_day_bits);
        let utc_hour_bits = this.fields.utc_hour.pack();
        bits = bits.concat(utc_hour_bits);
        let utc_minute_bits = this.fields.utc_minute.pack();
        bits = bits.concat(utc_minute_bits);
        let utc_seconds_bits = this.fields.utc_seconds.pack();
        bits = bits.concat(utc_seconds_bits);
        let latitude_bits = this.fields.latitude.pack();
        bits = bits.concat(latitude_bits);
        let longitude_bits = this.fields.longitude.pack();
        bits = bits.concat(longitude_bits);
        let altitude_bits = this.fields.altitude.pack();
        bits = bits.concat(altitude_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['gps_status'] = Number(this.fields['gps_status'].value);
        obj['order'] = Number(this.fields['order'].value);
        obj['remain_buffer'] = Number(this.fields['remain_buffer'].value);
        obj['utc_year'] = Number(this.fields['utc_year'].value);
        obj['utc_month'] = Number(this.fields['utc_month'].value);
        obj['utc_day'] = Number(this.fields['utc_day'].value);
        obj['utc_hour'] = Number(this.fields['utc_hour'].value);
        obj['utc_minute'] = Number(this.fields['utc_minute'].value);
        obj['utc_seconds'] = Number(this.fields['utc_seconds'].value);
        obj['latitude'] = Number(this.fields['latitude'].value);
        obj['longitude'] = Number(this.fields['longitude'].value);
        obj['altitude'] = Number(this.fields['altitude'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_xacti_GnssStatus.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_xacti_GnssStatus.DTID;
    }

    get name() {
        return com_xacti_GnssStatus.FULL_NAME;
    }

    get fieldNames() {
        return [
            'gps_status',
            'order',
            'remain_buffer',
            'utc_year',
            'utc_month',
            'utc_day',
            'utc_hour',
            'utc_minute',
            'utc_seconds',
            'latitude',
            'longitude',
            'altitude',
        ];
    }

    static sampleMessage() {
        const msg = new com_xacti_GnssStatus();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 3752532431003831267n;
    }

    getDataTypeSignature() {
        return 3752532431003831267n;
    }

};
module.exports.com_xacti_GnssStatus = com_xacti_GnssStatus;

// JavaScript binding for com.xacti.GimbalAttitudeStatus
// Auto Generated Code, DO NOT MODIFY
const com_xacti_GimbalAttitudeStatus = class {
    static DTID = 20402;
    static FULL_NAME = 'com.xacti.GimbalAttitudeStatus';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 96;
    static MIN_BIT_LEN = 96;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['gimbal_roll'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 16);
        this.fields['gimbal_pitch'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 16);
        this.fields['gimbal_yaw'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 16);
        this.fields['magneticencoder_roll'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 16);
        this.fields['magneticencoder_pitch'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 16);
        this.fields['magneticencoder_yaw'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let gimbal_roll_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['gimbal_roll'].value = gimbal_roll_field.value
        msg.bitOffset += 16;
        let gimbal_pitch_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['gimbal_pitch'].value = gimbal_pitch_field.value
        msg.bitOffset += 16;
        let gimbal_yaw_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['gimbal_yaw'].value = gimbal_yaw_field.value
        msg.bitOffset += 16;
        let magneticencoder_roll_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['magneticencoder_roll'].value = magneticencoder_roll_field.value
        msg.bitOffset += 16;
        let magneticencoder_pitch_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['magneticencoder_pitch'].value = magneticencoder_pitch_field.value
        msg.bitOffset += 16;
        let magneticencoder_yaw_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['magneticencoder_yaw'].value = magneticencoder_yaw_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let gimbal_roll_bits = this.fields.gimbal_roll.pack();
        bits = bits.concat(gimbal_roll_bits);
        let gimbal_pitch_bits = this.fields.gimbal_pitch.pack();
        bits = bits.concat(gimbal_pitch_bits);
        let gimbal_yaw_bits = this.fields.gimbal_yaw.pack();
        bits = bits.concat(gimbal_yaw_bits);
        let magneticencoder_roll_bits = this.fields.magneticencoder_roll.pack();
        bits = bits.concat(magneticencoder_roll_bits);
        let magneticencoder_pitch_bits = this.fields.magneticencoder_pitch.pack();
        bits = bits.concat(magneticencoder_pitch_bits);
        let magneticencoder_yaw_bits = this.fields.magneticencoder_yaw.pack();
        bits = bits.concat(magneticencoder_yaw_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['gimbal_roll'] = Number(this.fields['gimbal_roll'].value);
        obj['gimbal_pitch'] = Number(this.fields['gimbal_pitch'].value);
        obj['gimbal_yaw'] = Number(this.fields['gimbal_yaw'].value);
        obj['magneticencoder_roll'] = Number(this.fields['magneticencoder_roll'].value);
        obj['magneticencoder_pitch'] = Number(this.fields['magneticencoder_pitch'].value);
        obj['magneticencoder_yaw'] = Number(this.fields['magneticencoder_yaw'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_xacti_GimbalAttitudeStatus.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_xacti_GimbalAttitudeStatus.DTID;
    }

    get name() {
        return com_xacti_GimbalAttitudeStatus.FULL_NAME;
    }

    get fieldNames() {
        return [
            'gimbal_roll',
            'gimbal_pitch',
            'gimbal_yaw',
            'magneticencoder_roll',
            'magneticencoder_pitch',
            'magneticencoder_yaw',
        ];
    }

    static sampleMessage() {
        const msg = new com_xacti_GimbalAttitudeStatus();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 16952265243978049170n;
    }

    getDataTypeSignature() {
        return 16952265243978049170n;
    }

};
module.exports.com_xacti_GimbalAttitudeStatus = com_xacti_GimbalAttitudeStatus;

// JavaScript binding for com.xacti.GnssStatusReq
// Auto Generated Code, DO NOT MODIFY
const com_xacti_GnssStatusReq = class {
    static DTID = 20306;
    static FULL_NAME = 'com.xacti.GnssStatusReq';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['requirement'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let requirement_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['requirement'].value = requirement_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let requirement_bits = this.fields.requirement.pack();
        bits = bits.concat(requirement_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['requirement'] = Number(this.fields['requirement'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_xacti_GnssStatusReq.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_xacti_GnssStatusReq.DTID;
    }

    get name() {
        return com_xacti_GnssStatusReq.FULL_NAME;
    }

    get fieldNames() {
        return [
            'requirement',
        ];
    }

    static sampleMessage() {
        const msg = new com_xacti_GnssStatusReq();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 6986567698236847177n;
    }

    getDataTypeSignature() {
        return 6986567698236847177n;
    }

};
module.exports.com_xacti_GnssStatusReq = com_xacti_GnssStatusReq;

// JavaScript binding for com.hex.equipment.flow.Measurement
// Auto Generated Code, DO NOT MODIFY
const com_hex_equipment_flow_Measurement = class {
    static DTID = 20200;
    static FULL_NAME = 'com.hex.equipment.flow.Measurement';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 168;
    static MIN_BIT_LEN = 168;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['integration_interval'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32);
        this.fields['rate_gyro_integral'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32), ArrayType.MODE_STATIC, 2 );
        this.fields['flow_integral'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 32), ArrayType.MODE_STATIC, 2 );
        this.fields['quality'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let integration_interval_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32);
        msg.fields['integration_interval'].value = integration_interval_field.value
        msg.bitOffset += 32;
        // Decode static array field rate_gyro_integral
        const rate_gyro_integral_length = 2;
        for (let i = 0; i < rate_gyro_integral_length; i++) {
            msg.fields['rate_gyro_integral'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32));
            msg.bitOffset += 32;
        }

        // Decode static array field flow_integral
        const flow_integral_length = 2;
        for (let i = 0; i < flow_integral_length; i++) {
            msg.fields['flow_integral'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 32), 32));
            msg.bitOffset += 32;
        }

        let quality_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['quality'].value = quality_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let integration_interval_bits = this.fields.integration_interval.pack();
        bits = bits.concat(integration_interval_bits);
        // Encode static array field rate_gyro_integral
        const rate_gyro_integral_length = 2;
        for (let i = 0; i < rate_gyro_integral_length; i++) {
            let rate_gyro_integral_bits = this.fields.rate_gyro_integral.items[i].pack();
            bits = bits.concat(rate_gyro_integral_bits);
        }

        // Encode static array field flow_integral
        const flow_integral_length = 2;
        for (let i = 0; i < flow_integral_length; i++) {
            let flow_integral_bits = this.fields.flow_integral.items[i].pack();
            bits = bits.concat(flow_integral_bits);
        }

        let quality_bits = this.fields.quality.pack();
        bits = bits.concat(quality_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['integration_interval'] = Number(this.fields['integration_interval'].value);
        obj['rate_gyro_integral'] = this.fields['rate_gyro_integral'].toObj(true);
        obj['flow_integral'] = this.fields['flow_integral'].toObj(true);
        obj['quality'] = Number(this.fields['quality'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hex_equipment_flow_Measurement.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hex_equipment_flow_Measurement.DTID;
    }

    get name() {
        return com_hex_equipment_flow_Measurement.FULL_NAME;
    }

    get fieldNames() {
        return [
            'integration_interval',
            'rate_gyro_integral',
            'flow_integral',
            'quality',
        ];
    }

    static sampleMessage() {
        const msg = new com_hex_equipment_flow_Measurement();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 7678787339500690456n;
    }

    getDataTypeSignature() {
        return 7678787339500690456n;
    }

};
module.exports.com_hex_equipment_flow_Measurement = com_hex_equipment_flow_Measurement;

// JavaScript binding for com.tmotor.esc.ParamGet
// Auto Generated Code, DO NOT MODIFY
const com_tmotor_esc_ParamGet = class {
    static DTID = 1332;
    static FULL_NAME = 'com.tmotor.esc.ParamGet';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 590;
    static MIN_BIT_LEN = 328;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['esc_index'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['esc_uuid'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['esc_id_req'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_ov_threshold'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_oc_threshold'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_ot_threshold'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_acc_threshold'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_dacc_threshold'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_rotate_dir'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 16);
        this.fields['esc_timing'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['esc_startup_times'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_startup_duration'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['esc_product_date'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['esc_error_count'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['esc_signal_priority'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['esc_led_mode'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_can_rate'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['esc_fdb_rate'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_save_option'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['rsvd'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 32 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let esc_index_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_index'].value = esc_index_field.value
        msg.bitOffset += 8;
        let esc_uuid_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_uuid'].value = esc_uuid_field.value
        msg.bitOffset += 32;
        let esc_id_req_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_id_req'].value = esc_id_req_field.value
        msg.bitOffset += 16;
        let esc_ov_threshold_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_ov_threshold'].value = esc_ov_threshold_field.value
        msg.bitOffset += 16;
        let esc_oc_threshold_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_oc_threshold'].value = esc_oc_threshold_field.value
        msg.bitOffset += 16;
        let esc_ot_threshold_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_ot_threshold'].value = esc_ot_threshold_field.value
        msg.bitOffset += 16;
        let esc_acc_threshold_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_acc_threshold'].value = esc_acc_threshold_field.value
        msg.bitOffset += 16;
        let esc_dacc_threshold_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_dacc_threshold'].value = esc_dacc_threshold_field.value
        msg.bitOffset += 16;
        let esc_rotate_dir_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_rotate_dir'].value = esc_rotate_dir_field.value
        msg.bitOffset += 16;
        let esc_timing_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_timing'].value = esc_timing_field.value
        msg.bitOffset += 8;
        let esc_startup_times_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_startup_times'].value = esc_startup_times_field.value
        msg.bitOffset += 16;
        let esc_startup_duration_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_startup_duration'].value = esc_startup_duration_field.value
        msg.bitOffset += 32;
        let esc_product_date_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_product_date'].value = esc_product_date_field.value
        msg.bitOffset += 32;
        let esc_error_count_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_error_count'].value = esc_error_count_field.value
        msg.bitOffset += 32;
        let esc_signal_priority_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_signal_priority'].value = esc_signal_priority_field.value
        msg.bitOffset += 8;
        let esc_led_mode_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_led_mode'].value = esc_led_mode_field.value
        msg.bitOffset += 16;
        let esc_can_rate_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_can_rate'].value = esc_can_rate_field.value
        msg.bitOffset += 8;
        let esc_fdb_rate_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_fdb_rate'].value = esc_fdb_rate_field.value
        msg.bitOffset += 16;
        let esc_save_option_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_save_option'].value = esc_save_option_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field rsvd
        let rsvd_length = 0;
        if (tao) {
            rsvd_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                rsvd_length = bitsToArrayLength(data.getBits(msg.bitOffset, 6));
                msg.bitOffset += 6;
            } else {
                throw new RangeError('Array length exceeds maximum size: 32');
            }
        }
        if (rsvd_length > 32) {
            throw new RangeError('rsvd_length length exceeds maximum size: 32');
        }
        for (let i = 0; i < rsvd_length; i++) {
            msg.fields['rsvd'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let esc_index_bits = this.fields.esc_index.pack();
        bits = bits.concat(esc_index_bits);
        let esc_uuid_bits = this.fields.esc_uuid.pack();
        bits = bits.concat(esc_uuid_bits);
        let esc_id_req_bits = this.fields.esc_id_req.pack();
        bits = bits.concat(esc_id_req_bits);
        let esc_ov_threshold_bits = this.fields.esc_ov_threshold.pack();
        bits = bits.concat(esc_ov_threshold_bits);
        let esc_oc_threshold_bits = this.fields.esc_oc_threshold.pack();
        bits = bits.concat(esc_oc_threshold_bits);
        let esc_ot_threshold_bits = this.fields.esc_ot_threshold.pack();
        bits = bits.concat(esc_ot_threshold_bits);
        let esc_acc_threshold_bits = this.fields.esc_acc_threshold.pack();
        bits = bits.concat(esc_acc_threshold_bits);
        let esc_dacc_threshold_bits = this.fields.esc_dacc_threshold.pack();
        bits = bits.concat(esc_dacc_threshold_bits);
        let esc_rotate_dir_bits = this.fields.esc_rotate_dir.pack();
        bits = bits.concat(esc_rotate_dir_bits);
        let esc_timing_bits = this.fields.esc_timing.pack();
        bits = bits.concat(esc_timing_bits);
        let esc_startup_times_bits = this.fields.esc_startup_times.pack();
        bits = bits.concat(esc_startup_times_bits);
        let esc_startup_duration_bits = this.fields.esc_startup_duration.pack();
        bits = bits.concat(esc_startup_duration_bits);
        let esc_product_date_bits = this.fields.esc_product_date.pack();
        bits = bits.concat(esc_product_date_bits);
        let esc_error_count_bits = this.fields.esc_error_count.pack();
        bits = bits.concat(esc_error_count_bits);
        let esc_signal_priority_bits = this.fields.esc_signal_priority.pack();
        bits = bits.concat(esc_signal_priority_bits);
        let esc_led_mode_bits = this.fields.esc_led_mode.pack();
        bits = bits.concat(esc_led_mode_bits);
        let esc_can_rate_bits = this.fields.esc_can_rate.pack();
        bits = bits.concat(esc_can_rate_bits);
        let esc_fdb_rate_bits = this.fields.esc_fdb_rate.pack();
        bits = bits.concat(esc_fdb_rate_bits);
        let esc_save_option_bits = this.fields.esc_save_option.pack();
        bits = bits.concat(esc_save_option_bits);
        // Encode dynamic array field rsvd
        const rsvd_length = this.fields.rsvd.length;
        if (this.fields.rsvd.length > rsvd_length) {
            throw new Error(`Array length of rsvd exceeds maximum length of rsvd_length`);
        }
        if (!tao) {
           let rsvd_length_bits = arrayLengthToBits(this.fields.rsvd.length, 6);
           bits = bits.concat(rsvd_length_bits);
        }
        for (let i = 0; i < rsvd_length; i++) {
            let rsvd_bits = this.fields.rsvd.items[i].pack();
            bits = bits.concat(rsvd_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['esc_index'] = Number(this.fields['esc_index'].value);
        obj['esc_uuid'] = Number(this.fields['esc_uuid'].value);
        obj['esc_id_req'] = Number(this.fields['esc_id_req'].value);
        obj['esc_ov_threshold'] = Number(this.fields['esc_ov_threshold'].value);
        obj['esc_oc_threshold'] = Number(this.fields['esc_oc_threshold'].value);
        obj['esc_ot_threshold'] = Number(this.fields['esc_ot_threshold'].value);
        obj['esc_acc_threshold'] = Number(this.fields['esc_acc_threshold'].value);
        obj['esc_dacc_threshold'] = Number(this.fields['esc_dacc_threshold'].value);
        obj['esc_rotate_dir'] = Number(this.fields['esc_rotate_dir'].value);
        obj['esc_timing'] = Number(this.fields['esc_timing'].value);
        obj['esc_startup_times'] = Number(this.fields['esc_startup_times'].value);
        obj['esc_startup_duration'] = Number(this.fields['esc_startup_duration'].value);
        obj['esc_product_date'] = Number(this.fields['esc_product_date'].value);
        obj['esc_error_count'] = Number(this.fields['esc_error_count'].value);
        obj['esc_signal_priority'] = Number(this.fields['esc_signal_priority'].value);
        obj['esc_led_mode'] = Number(this.fields['esc_led_mode'].value);
        obj['esc_can_rate'] = Number(this.fields['esc_can_rate'].value);
        obj['esc_fdb_rate'] = Number(this.fields['esc_fdb_rate'].value);
        obj['esc_save_option'] = Number(this.fields['esc_save_option'].value);
        obj['rsvd'] = this.fields['rsvd'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = com_tmotor_esc_ParamGet.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_tmotor_esc_ParamGet.DTID;
    }

    get name() {
        return com_tmotor_esc_ParamGet.FULL_NAME;
    }

    get fieldNames() {
        return [
            'esc_index',
            'esc_uuid',
            'esc_id_req',
            'esc_ov_threshold',
            'esc_oc_threshold',
            'esc_ot_threshold',
            'esc_acc_threshold',
            'esc_dacc_threshold',
            'esc_rotate_dir',
            'esc_timing',
            'esc_startup_times',
            'esc_startup_duration',
            'esc_product_date',
            'esc_error_count',
            'esc_signal_priority',
            'esc_led_mode',
            'esc_can_rate',
            'esc_fdb_rate',
            'esc_save_option',
            'rsvd',
        ];
    }

    static sampleMessage() {
        const msg = new com_tmotor_esc_ParamGet();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 5055419915763663618n;
    }

    getDataTypeSignature() {
        return 5055419915763663618n;
    }

};
module.exports.com_tmotor_esc_ParamGet = com_tmotor_esc_ParamGet;

// JavaScript binding for com.tmotor.esc.PUSHSCI
// Auto Generated Code, DO NOT MODIFY
const com_tmotor_esc_PUSHSCI = class {
    static DTID = 1038;
    static FULL_NAME = 'com.tmotor.esc.PUSHSCI';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 2080;
    static MIN_BIT_LEN = 32;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['data_sequence'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['data'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 255 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let data_sequence_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['data_sequence'].value = data_sequence_field.value
        msg.bitOffset += 32;
        // Decode dynamic array field data
        let data_length = 0;
        if (tao) {
            data_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                data_length = bitsToArrayLength(data.getBits(msg.bitOffset, 8));
                msg.bitOffset += 8;
            } else {
                throw new RangeError('Array length exceeds maximum size: 255');
            }
        }
        if (data_length > 255) {
            throw new RangeError('data_length length exceeds maximum size: 255');
        }
        for (let i = 0; i < data_length; i++) {
            msg.fields['data'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let data_sequence_bits = this.fields.data_sequence.pack();
        bits = bits.concat(data_sequence_bits);
        // Encode dynamic array field data
        const data_length = this.fields.data.length;
        if (this.fields.data.length > data_length) {
            throw new Error(`Array length of data exceeds maximum length of data_length`);
        }
        if (!tao) {
           let data_length_bits = arrayLengthToBits(this.fields.data.length, 8);
           bits = bits.concat(data_length_bits);
        }
        for (let i = 0; i < data_length; i++) {
            let data_bits = this.fields.data.items[i].pack();
            bits = bits.concat(data_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['data_sequence'] = Number(this.fields['data_sequence'].value);
        obj['data'] = this.fields['data'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = com_tmotor_esc_PUSHSCI.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_tmotor_esc_PUSHSCI.DTID;
    }

    get name() {
        return com_tmotor_esc_PUSHSCI.FULL_NAME;
    }

    get fieldNames() {
        return [
            'data_sequence',
            'data',
        ];
    }

    static sampleMessage() {
        const msg = new com_tmotor_esc_PUSHSCI();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 14856088103950224104n;
    }

    getDataTypeSignature() {
        return 14856088103950224104n;
    }

};
module.exports.com_tmotor_esc_PUSHSCI = com_tmotor_esc_PUSHSCI;

// JavaScript binding for com.tmotor.esc.FocCtrl
// Auto Generated Code, DO NOT MODIFY
const com_tmotor_esc_FocCtrl = class {
    static DTID = 1035;
    static FULL_NAME = 'com.tmotor.esc.FocCtrl';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 64;
    static MIN_BIT_LEN = 64;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['esc_index'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['esc_mode'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['esc_fdb_rate'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['esc_cmd'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['esc_cmd_val'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 32);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let esc_index_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_index'].value = esc_index_field.value
        msg.bitOffset += 8;
        let esc_mode_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_mode'].value = esc_mode_field.value
        msg.bitOffset += 8;
        let esc_fdb_rate_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_fdb_rate'].value = esc_fdb_rate_field.value
        msg.bitOffset += 8;
        let esc_cmd_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_cmd'].value = esc_cmd_field.value
        msg.bitOffset += 8;
        let esc_cmd_val_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_cmd_val'].value = esc_cmd_val_field.value
        msg.bitOffset += 32;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let esc_index_bits = this.fields.esc_index.pack();
        bits = bits.concat(esc_index_bits);
        let esc_mode_bits = this.fields.esc_mode.pack();
        bits = bits.concat(esc_mode_bits);
        let esc_fdb_rate_bits = this.fields.esc_fdb_rate.pack();
        bits = bits.concat(esc_fdb_rate_bits);
        let esc_cmd_bits = this.fields.esc_cmd.pack();
        bits = bits.concat(esc_cmd_bits);
        let esc_cmd_val_bits = this.fields.esc_cmd_val.pack();
        bits = bits.concat(esc_cmd_val_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['esc_index'] = Number(this.fields['esc_index'].value);
        obj['esc_mode'] = Number(this.fields['esc_mode'].value);
        obj['esc_fdb_rate'] = Number(this.fields['esc_fdb_rate'].value);
        obj['esc_cmd'] = Number(this.fields['esc_cmd'].value);
        obj['esc_cmd_val'] = Number(this.fields['esc_cmd_val'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_tmotor_esc_FocCtrl.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_tmotor_esc_FocCtrl.DTID;
    }

    get name() {
        return com_tmotor_esc_FocCtrl.FULL_NAME;
    }

    get fieldNames() {
        return [
            'esc_index',
            'esc_mode',
            'esc_fdb_rate',
            'esc_cmd',
            'esc_cmd_val',
        ];
    }

    static sampleMessage() {
        const msg = new com_tmotor_esc_FocCtrl();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 6449510226062999563n;
    }

    getDataTypeSignature() {
        return 6449510226062999563n;
    }

};
module.exports.com_tmotor_esc_FocCtrl = com_tmotor_esc_FocCtrl;

// JavaScript binding for com.tmotor.esc.PUSHCAN
// Auto Generated Code, DO NOT MODIFY
const com_tmotor_esc_PUSHCAN = class {
    static DTID = 1039;
    static FULL_NAME = 'com.tmotor.esc.PUSHCAN';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 2080;
    static MIN_BIT_LEN = 32;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['data_sequence'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['data'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 255 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let data_sequence_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['data_sequence'].value = data_sequence_field.value
        msg.bitOffset += 32;
        // Decode dynamic array field data
        let data_length = 0;
        if (tao) {
            data_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                data_length = bitsToArrayLength(data.getBits(msg.bitOffset, 8));
                msg.bitOffset += 8;
            } else {
                throw new RangeError('Array length exceeds maximum size: 255');
            }
        }
        if (data_length > 255) {
            throw new RangeError('data_length length exceeds maximum size: 255');
        }
        for (let i = 0; i < data_length; i++) {
            msg.fields['data'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let data_sequence_bits = this.fields.data_sequence.pack();
        bits = bits.concat(data_sequence_bits);
        // Encode dynamic array field data
        const data_length = this.fields.data.length;
        if (this.fields.data.length > data_length) {
            throw new Error(`Array length of data exceeds maximum length of data_length`);
        }
        if (!tao) {
           let data_length_bits = arrayLengthToBits(this.fields.data.length, 8);
           bits = bits.concat(data_length_bits);
        }
        for (let i = 0; i < data_length; i++) {
            let data_bits = this.fields.data.items[i].pack();
            bits = bits.concat(data_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['data_sequence'] = Number(this.fields['data_sequence'].value);
        obj['data'] = this.fields['data'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = com_tmotor_esc_PUSHCAN.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_tmotor_esc_PUSHCAN.DTID;
    }

    get name() {
        return com_tmotor_esc_PUSHCAN.FULL_NAME;
    }

    get fieldNames() {
        return [
            'data_sequence',
            'data',
        ];
    }

    static sampleMessage() {
        const msg = new com_tmotor_esc_PUSHCAN();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 12308227053680311406n;
    }

    getDataTypeSignature() {
        return 12308227053680311406n;
    }

};
module.exports.com_tmotor_esc_PUSHCAN = com_tmotor_esc_PUSHCAN;

// JavaScript binding for com.tmotor.esc.ParamCfg
// Auto Generated Code, DO NOT MODIFY
const com_tmotor_esc_ParamCfg = class {
    static DTID = 1033;
    static FULL_NAME = 'com.tmotor.esc.ParamCfg';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 216;
    static MIN_BIT_LEN = 216;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['esc_index'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['esc_uuid'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['esc_id_set'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_ov_threshold'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_oc_threshold'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_ot_threshold'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_acc_threshold'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_dacc_threshold'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_rotate_dir'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 16);
        this.fields['esc_timing'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['esc_signal_priority'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['esc_led_mode'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_can_rate'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['esc_fdb_rate'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['esc_save_option'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let esc_index_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_index'].value = esc_index_field.value
        msg.bitOffset += 8;
        let esc_uuid_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_uuid'].value = esc_uuid_field.value
        msg.bitOffset += 32;
        let esc_id_set_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_id_set'].value = esc_id_set_field.value
        msg.bitOffset += 16;
        let esc_ov_threshold_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_ov_threshold'].value = esc_ov_threshold_field.value
        msg.bitOffset += 16;
        let esc_oc_threshold_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_oc_threshold'].value = esc_oc_threshold_field.value
        msg.bitOffset += 16;
        let esc_ot_threshold_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_ot_threshold'].value = esc_ot_threshold_field.value
        msg.bitOffset += 16;
        let esc_acc_threshold_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_acc_threshold'].value = esc_acc_threshold_field.value
        msg.bitOffset += 16;
        let esc_dacc_threshold_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_dacc_threshold'].value = esc_dacc_threshold_field.value
        msg.bitOffset += 16;
        let esc_rotate_dir_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_rotate_dir'].value = esc_rotate_dir_field.value
        msg.bitOffset += 16;
        let esc_timing_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_timing'].value = esc_timing_field.value
        msg.bitOffset += 8;
        let esc_signal_priority_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_signal_priority'].value = esc_signal_priority_field.value
        msg.bitOffset += 8;
        let esc_led_mode_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_led_mode'].value = esc_led_mode_field.value
        msg.bitOffset += 16;
        let esc_can_rate_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_can_rate'].value = esc_can_rate_field.value
        msg.bitOffset += 8;
        let esc_fdb_rate_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_fdb_rate'].value = esc_fdb_rate_field.value
        msg.bitOffset += 16;
        let esc_save_option_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_save_option'].value = esc_save_option_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let esc_index_bits = this.fields.esc_index.pack();
        bits = bits.concat(esc_index_bits);
        let esc_uuid_bits = this.fields.esc_uuid.pack();
        bits = bits.concat(esc_uuid_bits);
        let esc_id_set_bits = this.fields.esc_id_set.pack();
        bits = bits.concat(esc_id_set_bits);
        let esc_ov_threshold_bits = this.fields.esc_ov_threshold.pack();
        bits = bits.concat(esc_ov_threshold_bits);
        let esc_oc_threshold_bits = this.fields.esc_oc_threshold.pack();
        bits = bits.concat(esc_oc_threshold_bits);
        let esc_ot_threshold_bits = this.fields.esc_ot_threshold.pack();
        bits = bits.concat(esc_ot_threshold_bits);
        let esc_acc_threshold_bits = this.fields.esc_acc_threshold.pack();
        bits = bits.concat(esc_acc_threshold_bits);
        let esc_dacc_threshold_bits = this.fields.esc_dacc_threshold.pack();
        bits = bits.concat(esc_dacc_threshold_bits);
        let esc_rotate_dir_bits = this.fields.esc_rotate_dir.pack();
        bits = bits.concat(esc_rotate_dir_bits);
        let esc_timing_bits = this.fields.esc_timing.pack();
        bits = bits.concat(esc_timing_bits);
        let esc_signal_priority_bits = this.fields.esc_signal_priority.pack();
        bits = bits.concat(esc_signal_priority_bits);
        let esc_led_mode_bits = this.fields.esc_led_mode.pack();
        bits = bits.concat(esc_led_mode_bits);
        let esc_can_rate_bits = this.fields.esc_can_rate.pack();
        bits = bits.concat(esc_can_rate_bits);
        let esc_fdb_rate_bits = this.fields.esc_fdb_rate.pack();
        bits = bits.concat(esc_fdb_rate_bits);
        let esc_save_option_bits = this.fields.esc_save_option.pack();
        bits = bits.concat(esc_save_option_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['esc_index'] = Number(this.fields['esc_index'].value);
        obj['esc_uuid'] = Number(this.fields['esc_uuid'].value);
        obj['esc_id_set'] = Number(this.fields['esc_id_set'].value);
        obj['esc_ov_threshold'] = Number(this.fields['esc_ov_threshold'].value);
        obj['esc_oc_threshold'] = Number(this.fields['esc_oc_threshold'].value);
        obj['esc_ot_threshold'] = Number(this.fields['esc_ot_threshold'].value);
        obj['esc_acc_threshold'] = Number(this.fields['esc_acc_threshold'].value);
        obj['esc_dacc_threshold'] = Number(this.fields['esc_dacc_threshold'].value);
        obj['esc_rotate_dir'] = Number(this.fields['esc_rotate_dir'].value);
        obj['esc_timing'] = Number(this.fields['esc_timing'].value);
        obj['esc_signal_priority'] = Number(this.fields['esc_signal_priority'].value);
        obj['esc_led_mode'] = Number(this.fields['esc_led_mode'].value);
        obj['esc_can_rate'] = Number(this.fields['esc_can_rate'].value);
        obj['esc_fdb_rate'] = Number(this.fields['esc_fdb_rate'].value);
        obj['esc_save_option'] = Number(this.fields['esc_save_option'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_tmotor_esc_ParamCfg.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_tmotor_esc_ParamCfg.DTID;
    }

    get name() {
        return com_tmotor_esc_ParamCfg.FULL_NAME;
    }

    get fieldNames() {
        return [
            'esc_index',
            'esc_uuid',
            'esc_id_set',
            'esc_ov_threshold',
            'esc_oc_threshold',
            'esc_ot_threshold',
            'esc_acc_threshold',
            'esc_dacc_threshold',
            'esc_rotate_dir',
            'esc_timing',
            'esc_signal_priority',
            'esc_led_mode',
            'esc_can_rate',
            'esc_fdb_rate',
            'esc_save_option',
        ];
    }

    static sampleMessage() {
        const msg = new com_tmotor_esc_ParamCfg();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 10704878241490988526n;
    }

    getDataTypeSignature() {
        return 10704878241490988526n;
    }

};
module.exports.com_tmotor_esc_ParamCfg = com_tmotor_esc_ParamCfg;

// JavaScript binding for com.himark.servo.ServoInfo
// Auto Generated Code, DO NOT MODIFY
const com_himark_servo_ServoInfo = class {
    static DTID = 2019;
    static FULL_NAME = 'com.himark.servo.ServoInfo';
    static CONSTANTS = {'error_status': {'NO_ERROR': 0, 'DATA_ERROR': 1}};
    static MAX_BIT_LEN = 96;
    static MIN_BIT_LEN = 96;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['servo_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 5);
        this.fields['pwm_input'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 12);
        this.fields['pos_cmd'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 16);
        this.fields['pos_sensor'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 16);
        this.fields['voltage'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 12);
        this.fields['current'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 10);
        this.fields['pcb_temp'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 10);
        this.fields['motor_temp'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 10);
        this.fields['error_status'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 5);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let servo_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 5), 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['servo_id'].value = servo_id_field.value
        msg.bitOffset += 5;
        let pwm_input_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 12), 12, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pwm_input'].value = pwm_input_field.value
        msg.bitOffset += 12;
        let pos_cmd_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pos_cmd'].value = pos_cmd_field.value
        msg.bitOffset += 16;
        let pos_sensor_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pos_sensor'].value = pos_sensor_field.value
        msg.bitOffset += 16;
        let voltage_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 12), 12, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['voltage'].value = voltage_field.value
        msg.bitOffset += 12;
        let current_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 10), 10, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['current'].value = current_field.value
        msg.bitOffset += 10;
        let pcb_temp_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 10), 10, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pcb_temp'].value = pcb_temp_field.value
        msg.bitOffset += 10;
        let motor_temp_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 10), 10, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['motor_temp'].value = motor_temp_field.value
        msg.bitOffset += 10;
        let error_status_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 5), 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['error_status'].value = error_status_field.value
        msg.bitOffset += 5;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let servo_id_bits = this.fields.servo_id.pack();
        bits = bits.concat(servo_id_bits);
        let pwm_input_bits = this.fields.pwm_input.pack();
        bits = bits.concat(pwm_input_bits);
        let pos_cmd_bits = this.fields.pos_cmd.pack();
        bits = bits.concat(pos_cmd_bits);
        let pos_sensor_bits = this.fields.pos_sensor.pack();
        bits = bits.concat(pos_sensor_bits);
        let voltage_bits = this.fields.voltage.pack();
        bits = bits.concat(voltage_bits);
        let current_bits = this.fields.current.pack();
        bits = bits.concat(current_bits);
        let pcb_temp_bits = this.fields.pcb_temp.pack();
        bits = bits.concat(pcb_temp_bits);
        let motor_temp_bits = this.fields.motor_temp.pack();
        bits = bits.concat(motor_temp_bits);
        let error_status_bits = this.fields.error_status.pack();
        bits = bits.concat(error_status_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['servo_id'] = Number(this.fields['servo_id'].value);
        obj['pwm_input'] = Number(this.fields['pwm_input'].value);
        obj['pos_cmd'] = Number(this.fields['pos_cmd'].value);
        obj['pos_sensor'] = Number(this.fields['pos_sensor'].value);
        obj['voltage'] = Number(this.fields['voltage'].value);
        obj['current'] = Number(this.fields['current'].value);
        obj['pcb_temp'] = Number(this.fields['pcb_temp'].value);
        obj['motor_temp'] = Number(this.fields['motor_temp'].value);
        obj['error_status'] = Number(this.fields['error_status'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_himark_servo_ServoInfo.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_himark_servo_ServoInfo.DTID;
    }

    get name() {
        return com_himark_servo_ServoInfo.FULL_NAME;
    }

    get fieldNames() {
        return [
            'servo_id',
            'pwm_input',
            'pos_cmd',
            'pos_sensor',
            'voltage',
            'current',
            'pcb_temp',
            'motor_temp',
            'error_status',
        ];
    }

    static sampleMessage() {
        const msg = new com_himark_servo_ServoInfo();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 14595967997430610775n;
    }

    getDataTypeSignature() {
        return 14595967997430610775n;
    }

};
module.exports.com_himark_servo_ServoInfo = com_himark_servo_ServoInfo;

// JavaScript binding for com.himark.servo.ServoCmd
// Auto Generated Code, DO NOT MODIFY
const com_himark_servo_ServoCmd = class {
    static DTID = 2018;
    static FULL_NAME = 'com.himark.servo.ServoCmd';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 175;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['cmd'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 10), ArrayType.MODE_DYNAMIC, 17 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field cmd
        let cmd_length = 0;
        if (tao) {
            cmd_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 10);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                cmd_length = bitsToArrayLength(data.getBits(msg.bitOffset, 5));
                msg.bitOffset += 5;
            } else {
                throw new RangeError('Array length exceeds maximum size: 17');
            }
        }
        if (cmd_length > 17) {
            throw new RangeError('cmd_length length exceeds maximum size: 17');
        }
        for (let i = 0; i < cmd_length; i++) {
            msg.fields['cmd'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 10), 10, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 10;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field cmd
        const cmd_length = this.fields.cmd.length;
        if (this.fields.cmd.length > cmd_length) {
            throw new Error(`Array length of cmd exceeds maximum length of cmd_length`);
        }
        if (!tao) {
           let cmd_length_bits = arrayLengthToBits(this.fields.cmd.length, 5);
           bits = bits.concat(cmd_length_bits);
        }
        for (let i = 0; i < cmd_length; i++) {
            let cmd_bits = this.fields.cmd.items[i].pack();
            bits = bits.concat(cmd_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['cmd'] = this.fields['cmd'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = com_himark_servo_ServoCmd.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_himark_servo_ServoCmd.DTID;
    }

    get name() {
        return com_himark_servo_ServoCmd.FULL_NAME;
    }

    get fieldNames() {
        return [
            'cmd',
        ];
    }

    static sampleMessage() {
        const msg = new com_himark_servo_ServoCmd();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 6704140781571969428n;
    }

    getDataTypeSignature() {
        return 6704140781571969428n;
    }

};
module.exports.com_himark_servo_ServoCmd = com_himark_servo_ServoCmd;

// JavaScript binding for com.hobbywing.esc.GetMaintenanceInformation
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_GetMaintenanceInformation_Request = class {
    static DTID = 241;
    static FULL_NAME = 'com.hobbywing.esc.GetMaintenanceInformation';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let option_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['option'].value = option_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let option_bits = this.fields.option.pack();
        bits = bits.concat(option_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['option'] = Number(this.fields['option'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_GetMaintenanceInformation_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_GetMaintenanceInformation_Request.DTID;
    }

    get name() {
        return com_hobbywing_esc_GetMaintenanceInformation_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'option',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_GetMaintenanceInformation_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 13266968223391520637n;
    }

    getDataTypeSignature() {
        return 13266968223391520637n;
    }

};
module.exports.com_hobbywing_esc_GetMaintenanceInformation_Request = com_hobbywing_esc_GetMaintenanceInformation_Request;

// JavaScript binding for com.hobbywing.esc.GetMaintenanceInformation
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_GetMaintenanceInformation_Response = class {
    static DTID = 241;
    static FULL_NAME = 'com.hobbywing.esc.GetMaintenanceInformation';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['total_rotation_time_min'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 32);
        this.fields['time_since_maintainence_min'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 24);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let total_rotation_time_min_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 32), 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['total_rotation_time_min'].value = total_rotation_time_min_field.value
        msg.bitOffset += 32;
        let time_since_maintainence_min_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 24), 24, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['time_since_maintainence_min'].value = time_since_maintainence_min_field.value
        msg.bitOffset += 24;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let total_rotation_time_min_bits = this.fields.total_rotation_time_min.pack();
        bits = bits.concat(total_rotation_time_min_bits);
        let time_since_maintainence_min_bits = this.fields.time_since_maintainence_min.pack();
        bits = bits.concat(time_since_maintainence_min_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['total_rotation_time_min'] = Number(this.fields['total_rotation_time_min'].value);
        obj['time_since_maintainence_min'] = Number(this.fields['time_since_maintainence_min'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_GetMaintenanceInformation_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_GetMaintenanceInformation_Response.DTID;
    }

    get name() {
        return com_hobbywing_esc_GetMaintenanceInformation_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'total_rotation_time_min',
            'time_since_maintainence_min',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_GetMaintenanceInformation_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 13266968223391520637n;
    }

    getDataTypeSignature() {
        return 13266968223391520637n;
    }

};
module.exports.com_hobbywing_esc_GetMaintenanceInformation_Response = com_hobbywing_esc_GetMaintenanceInformation_Response;

// JavaScript binding for com.hobbywing.esc.StatusMsg3
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_StatusMsg3 = class {
    static DTID = 20052;
    static FULL_NAME = 'com.hobbywing.esc.StatusMsg3';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 24;
    static MIN_BIT_LEN = 24;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['MOS_T'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['CAP_T'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['Motor_T'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let MOS_T_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['MOS_T'].value = MOS_T_field.value
        msg.bitOffset += 8;
        let CAP_T_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['CAP_T'].value = CAP_T_field.value
        msg.bitOffset += 8;
        let Motor_T_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['Motor_T'].value = Motor_T_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let MOS_T_bits = this.fields.MOS_T.pack();
        bits = bits.concat(MOS_T_bits);
        let CAP_T_bits = this.fields.CAP_T.pack();
        bits = bits.concat(CAP_T_bits);
        let Motor_T_bits = this.fields.Motor_T.pack();
        bits = bits.concat(Motor_T_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['MOS_T'] = Number(this.fields['MOS_T'].value);
        obj['CAP_T'] = Number(this.fields['CAP_T'].value);
        obj['Motor_T'] = Number(this.fields['Motor_T'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_StatusMsg3.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_StatusMsg3.DTID;
    }

    get name() {
        return com_hobbywing_esc_StatusMsg3.FULL_NAME;
    }

    get fieldNames() {
        return [
            'MOS_T',
            'CAP_T',
            'Motor_T',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_StatusMsg3();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 2635059682396663017n;
    }

    getDataTypeSignature() {
        return 2635059682396663017n;
    }

};
module.exports.com_hobbywing_esc_StatusMsg3 = com_hobbywing_esc_StatusMsg3;

// JavaScript binding for com.hobbywing.esc.GetMajorConfig
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_GetMajorConfig_Request = class {
    static DTID = 242;
    static FULL_NAME = 'com.hobbywing.esc.GetMajorConfig';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let option_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['option'].value = option_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let option_bits = this.fields.option.pack();
        bits = bits.concat(option_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['option'] = Number(this.fields['option'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_GetMajorConfig_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_GetMajorConfig_Request.DTID;
    }

    get name() {
        return com_hobbywing_esc_GetMajorConfig_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'option',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_GetMajorConfig_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 1515029499997260797n;
    }

    getDataTypeSignature() {
        return 1515029499997260797n;
    }

};
module.exports.com_hobbywing_esc_GetMajorConfig_Request = com_hobbywing_esc_GetMajorConfig_Request;

// JavaScript binding for com.hobbywing.esc.GetMajorConfig
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_GetMajorConfig_Response = class {
    static DTID = 242;
    static FULL_NAME = 'com.hobbywing.esc.GetMajorConfig';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['direction'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['throttle_source'] = new PrimitiveType(null, PrimitiveType.KIND_BOOLEAN, 1);
        this.fields['throttle_channel'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 6);
        this.fields['led_status'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 5);
        this.fields['led_color'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 3);
        this.fields['MSG2_rate'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 4);
        this.fields['MSG1_rate'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 4);
        this.fields['positioning_angle'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['reserved'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_STATIC, 2 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let direction_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['direction'].value = direction_field.value
        msg.bitOffset += 1;
        let throttle_source_field = PrimitiveType.unpack(PrimitiveType.KIND_BOOLEAN, data.getBits(msg.bitOffset, 1), 1);
        msg.fields['throttle_source'].value = throttle_source_field.value
        msg.bitOffset += 1;
        let throttle_channel_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 6), 6, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['throttle_channel'].value = throttle_channel_field.value
        msg.bitOffset += 6;
        let led_status_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 5), 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['led_status'].value = led_status_field.value
        msg.bitOffset += 5;
        let led_color_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 3), 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['led_color'].value = led_color_field.value
        msg.bitOffset += 3;
        let MSG2_rate_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 4), 4, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['MSG2_rate'].value = MSG2_rate_field.value
        msg.bitOffset += 4;
        let MSG1_rate_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 4), 4, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['MSG1_rate'].value = MSG1_rate_field.value
        msg.bitOffset += 4;
        let positioning_angle_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['positioning_angle'].value = positioning_angle_field.value
        msg.bitOffset += 16;
        // Decode static array field reserved
        const reserved_length = 2;
        for (let i = 0; i < reserved_length; i++) {
            msg.fields['reserved'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let direction_bits = this.fields.direction.pack();
        bits = bits.concat(direction_bits);
        let throttle_source_bits = this.fields.throttle_source.pack();
        bits = bits.concat(throttle_source_bits);
        let throttle_channel_bits = this.fields.throttle_channel.pack();
        bits = bits.concat(throttle_channel_bits);
        let led_status_bits = this.fields.led_status.pack();
        bits = bits.concat(led_status_bits);
        let led_color_bits = this.fields.led_color.pack();
        bits = bits.concat(led_color_bits);
        let MSG2_rate_bits = this.fields.MSG2_rate.pack();
        bits = bits.concat(MSG2_rate_bits);
        let MSG1_rate_bits = this.fields.MSG1_rate.pack();
        bits = bits.concat(MSG1_rate_bits);
        let positioning_angle_bits = this.fields.positioning_angle.pack();
        bits = bits.concat(positioning_angle_bits);
        // Encode static array field reserved
        const reserved_length = 2;
        for (let i = 0; i < reserved_length; i++) {
            let reserved_bits = this.fields.reserved.items[i].pack();
            bits = bits.concat(reserved_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['direction'] = Number(this.fields['direction'].value);
        obj['throttle_source'] = Number(this.fields['throttle_source'].value);
        obj['throttle_channel'] = Number(this.fields['throttle_channel'].value);
        obj['led_status'] = Number(this.fields['led_status'].value);
        obj['led_color'] = Number(this.fields['led_color'].value);
        obj['MSG2_rate'] = Number(this.fields['MSG2_rate'].value);
        obj['MSG1_rate'] = Number(this.fields['MSG1_rate'].value);
        obj['positioning_angle'] = Number(this.fields['positioning_angle'].value);
        obj['reserved'] = this.fields['reserved'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_GetMajorConfig_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_GetMajorConfig_Response.DTID;
    }

    get name() {
        return com_hobbywing_esc_GetMajorConfig_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'direction',
            'throttle_source',
            'throttle_channel',
            'led_status',
            'led_color',
            'MSG2_rate',
            'MSG1_rate',
            'positioning_angle',
            'reserved',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_GetMajorConfig_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 1515029499997260797n;
    }

    getDataTypeSignature() {
        return 1515029499997260797n;
    }

};
module.exports.com_hobbywing_esc_GetMajorConfig_Response = com_hobbywing_esc_GetMajorConfig_Response;

// JavaScript binding for com.hobbywing.esc.StatusMsg1
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_StatusMsg1 = class {
    static DTID = 20050;
    static FULL_NAME = 'com.hobbywing.esc.StatusMsg1';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 48;
    static MIN_BIT_LEN = 48;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['rpm'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['pwm'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['status'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let rpm_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rpm'].value = rpm_field.value
        msg.bitOffset += 16;
        let pwm_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pwm'].value = pwm_field.value
        msg.bitOffset += 16;
        let status_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'].value = status_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let rpm_bits = this.fields.rpm.pack();
        bits = bits.concat(rpm_bits);
        let pwm_bits = this.fields.pwm.pack();
        bits = bits.concat(pwm_bits);
        let status_bits = this.fields.status.pack();
        bits = bits.concat(status_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['rpm'] = Number(this.fields['rpm'].value);
        obj['pwm'] = Number(this.fields['pwm'].value);
        obj['status'] = Number(this.fields['status'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_StatusMsg1.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_StatusMsg1.DTID;
    }

    get name() {
        return com_hobbywing_esc_StatusMsg1.FULL_NAME;
    }

    get fieldNames() {
        return [
            'rpm',
            'pwm',
            'status',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_StatusMsg1();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 582006563404605198n;
    }

    getDataTypeSignature() {
        return 582006563404605198n;
    }

};
module.exports.com_hobbywing_esc_StatusMsg1 = com_hobbywing_esc_StatusMsg1;

// JavaScript binding for com.hobbywing.esc.GetEscID
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_GetEscID = class {
    static DTID = 20013;
    static FULL_NAME = 'com.hobbywing.esc.GetEscID';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 26;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['payload'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 3 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field payload
        let payload_length = 0;
        if (tao) {
            payload_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 8);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                payload_length = bitsToArrayLength(data.getBits(msg.bitOffset, 2));
                msg.bitOffset += 2;
            } else {
                throw new RangeError('Array length exceeds maximum size: 3');
            }
        }
        if (payload_length > 3) {
            throw new RangeError('payload_length length exceeds maximum size: 3');
        }
        for (let i = 0; i < payload_length; i++) {
            msg.fields['payload'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 8;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field payload
        const payload_length = this.fields.payload.length;
        if (this.fields.payload.length > payload_length) {
            throw new Error(`Array length of payload exceeds maximum length of payload_length`);
        }
        if (!tao) {
           let payload_length_bits = arrayLengthToBits(this.fields.payload.length, 2);
           bits = bits.concat(payload_length_bits);
        }
        for (let i = 0; i < payload_length; i++) {
            let payload_bits = this.fields.payload.items[i].pack();
            bits = bits.concat(payload_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['payload'] = this.fields['payload'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_GetEscID.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_GetEscID.DTID;
    }

    get name() {
        return com_hobbywing_esc_GetEscID.FULL_NAME;
    }

    get fieldNames() {
        return [
            'payload',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_GetEscID();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 20013n;
    }

    getDataTypeSignature() {
        return 20013n;
    }

};
module.exports.com_hobbywing_esc_GetEscID = com_hobbywing_esc_GetEscID;

// JavaScript binding for com.hobbywing.esc.RawCommand
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_RawCommand = class {
    static DTID = 20100;
    static FULL_NAME = 'com.hobbywing.esc.RawCommand';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 116;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['command'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 14), ArrayType.MODE_DYNAMIC, 8 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        // Decode dynamic array field command
        let command_length = 0;
        if (tao) {
            command_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 14);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                command_length = bitsToArrayLength(data.getBits(msg.bitOffset, 4));
                msg.bitOffset += 4;
            } else {
                throw new RangeError('Array length exceeds maximum size: 8');
            }
        }
        if (command_length > 8) {
            throw new RangeError('command_length length exceeds maximum size: 8');
        }
        for (let i = 0; i < command_length; i++) {
            msg.fields['command'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 14), 14, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 14;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        // Encode dynamic array field command
        const command_length = this.fields.command.length;
        if (this.fields.command.length > command_length) {
            throw new Error(`Array length of command exceeds maximum length of command_length`);
        }
        if (!tao) {
           let command_length_bits = arrayLengthToBits(this.fields.command.length, 4);
           bits = bits.concat(command_length_bits);
        }
        for (let i = 0; i < command_length; i++) {
            let command_bits = this.fields.command.items[i].pack();
            bits = bits.concat(command_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['command'] = this.fields['command'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_RawCommand.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_RawCommand.DTID;
    }

    get name() {
        return com_hobbywing_esc_RawCommand.FULL_NAME;
    }

    get fieldNames() {
        return [
            'command',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_RawCommand();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 13686587459509829805n;
    }

    getDataTypeSignature() {
        return 13686587459509829805n;
    }

};
module.exports.com_hobbywing_esc_RawCommand = com_hobbywing_esc_RawCommand;

// JavaScript binding for com.hobbywing.esc.SetAngle
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SetAngle_Request = class {
    static DTID = 217;
    static FULL_NAME = 'com.hobbywing.esc.SetAngle';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 24;
    static MIN_BIT_LEN = 24;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['angle'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let option_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['option'].value = option_field.value
        msg.bitOffset += 8;
        let angle_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['angle'].value = angle_field.value
        msg.bitOffset += 16;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let option_bits = this.fields.option.pack();
        bits = bits.concat(option_bits);
        let angle_bits = this.fields.angle.pack();
        bits = bits.concat(angle_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['option'] = Number(this.fields['option'].value);
        obj['angle'] = Number(this.fields['angle'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SetAngle_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SetAngle_Request.DTID;
    }

    get name() {
        return com_hobbywing_esc_SetAngle_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'option',
            'angle',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SetAngle_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 9356704346101943818n;
    }

    getDataTypeSignature() {
        return 9356704346101943818n;
    }

};
module.exports.com_hobbywing_esc_SetAngle_Request = com_hobbywing_esc_SetAngle_Request;

// JavaScript binding for com.hobbywing.esc.SetAngle
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SetAngle_Response = class {
    static DTID = 217;
    static FULL_NAME = 'com.hobbywing.esc.SetAngle';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 24;
    static MIN_BIT_LEN = 24;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['angle'] = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16), ArrayType.MODE_DYNAMIC, 2 );
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let option_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['option'].value = option_field.value
        msg.bitOffset += 8;
        // Decode dynamic array field angle
        let angle_length = 0;
        if (tao) {
            angle_length = Math.floor((data.byteLength * 8 - msg.bitOffset) / 16);
        } else {
            if (Math.floor(msg.bitOffset / 8) < buf.length) {
                angle_length = bitsToArrayLength(data.getBits(msg.bitOffset, 2));
                msg.bitOffset += 2;
            } else {
                throw new RangeError('Array length exceeds maximum size: 2');
            }
        }
        if (angle_length > 2) {
            throw new RangeError('angle_length length exceeds maximum size: 2');
        }
        for (let i = 0; i < angle_length; i++) {
            msg.fields['angle'].items.push(PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED));
            msg.bitOffset += 16;
        }

        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let option_bits = this.fields.option.pack();
        bits = bits.concat(option_bits);
        // Encode dynamic array field angle
        const angle_length = this.fields.angle.length;
        if (this.fields.angle.length > angle_length) {
            throw new Error(`Array length of angle exceeds maximum length of angle_length`);
        }
        if (!tao) {
           let angle_length_bits = arrayLengthToBits(this.fields.angle.length, 2);
           bits = bits.concat(angle_length_bits);
        }
        for (let i = 0; i < angle_length; i++) {
            let angle_bits = this.fields.angle.items[i].pack();
            bits = bits.concat(angle_bits);
        }

        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['option'] = Number(this.fields['option'].value);
        obj['angle'] = this.fields['angle'].toObj(true);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SetAngle_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SetAngle_Response.DTID;
    }

    get name() {
        return com_hobbywing_esc_SetAngle_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'option',
            'angle',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SetAngle_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 9356704346101943818n;
    }

    getDataTypeSignature() {
        return 9356704346101943818n;
    }

};
module.exports.com_hobbywing_esc_SetAngle_Response = com_hobbywing_esc_SetAngle_Response;

// JavaScript binding for com.hobbywing.esc.SetDirection
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SetDirection_Request = class {
    static DTID = 213;
    static FULL_NAME = 'com.hobbywing.esc.SetDirection';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['direction'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let direction_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['direction'].value = direction_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let direction_bits = this.fields.direction.pack();
        bits = bits.concat(direction_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['direction'] = Number(this.fields['direction'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SetDirection_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SetDirection_Request.DTID;
    }

    get name() {
        return com_hobbywing_esc_SetDirection_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'direction',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SetDirection_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 11347154688750565992n;
    }

    getDataTypeSignature() {
        return 11347154688750565992n;
    }

};
module.exports.com_hobbywing_esc_SetDirection_Request = com_hobbywing_esc_SetDirection_Request;

// JavaScript binding for com.hobbywing.esc.SetDirection
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SetDirection_Response = class {
    static DTID = 213;
    static FULL_NAME = 'com.hobbywing.esc.SetDirection';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['direction'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let direction_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['direction'].value = direction_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let direction_bits = this.fields.direction.pack();
        bits = bits.concat(direction_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['direction'] = Number(this.fields['direction'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SetDirection_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SetDirection_Response.DTID;
    }

    get name() {
        return com_hobbywing_esc_SetDirection_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'direction',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SetDirection_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 11347154688750565992n;
    }

    getDataTypeSignature() {
        return 11347154688750565992n;
    }

};
module.exports.com_hobbywing_esc_SetDirection_Response = com_hobbywing_esc_SetDirection_Response;

// JavaScript binding for com.hobbywing.esc.SelfTest
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SelfTest_Request = class {
    static DTID = 216;
    static FULL_NAME = 'com.hobbywing.esc.SelfTest';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 0;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SelfTest_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SelfTest_Request.DTID;
    }

    get name() {
        return com_hobbywing_esc_SelfTest_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SelfTest_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 14163062053863069151n;
    }

    getDataTypeSignature() {
        return 14163062053863069151n;
    }

};
module.exports.com_hobbywing_esc_SelfTest_Request = com_hobbywing_esc_SelfTest_Request;

// JavaScript binding for com.hobbywing.esc.SelfTest
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SelfTest_Response = class {
    static DTID = 216;
    static FULL_NAME = 'com.hobbywing.esc.SelfTest';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 0;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['status'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let status_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'].value = status_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let status_bits = this.fields.status.pack();
        bits = bits.concat(status_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['status'] = Number(this.fields['status'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SelfTest_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SelfTest_Response.DTID;
    }

    get name() {
        return com_hobbywing_esc_SelfTest_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'status',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SelfTest_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 14163062053863069151n;
    }

    getDataTypeSignature() {
        return 14163062053863069151n;
    }

};
module.exports.com_hobbywing_esc_SelfTest_Response = com_hobbywing_esc_SelfTest_Response;

// JavaScript binding for com.hobbywing.esc.SetLED
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SetLED_Request = class {
    static DTID = 212;
    static FULL_NAME = 'com.hobbywing.esc.SetLED';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 24;
    static MIN_BIT_LEN = 24;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['color'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['blink'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let option_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['option'].value = option_field.value
        msg.bitOffset += 8;
        let color_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['color'].value = color_field.value
        msg.bitOffset += 8;
        let blink_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['blink'].value = blink_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let option_bits = this.fields.option.pack();
        bits = bits.concat(option_bits);
        let color_bits = this.fields.color.pack();
        bits = bits.concat(color_bits);
        let blink_bits = this.fields.blink.pack();
        bits = bits.concat(blink_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['option'] = Number(this.fields['option'].value);
        obj['color'] = Number(this.fields['color'].value);
        obj['blink'] = Number(this.fields['blink'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SetLED_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SetLED_Request.DTID;
    }

    get name() {
        return com_hobbywing_esc_SetLED_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'option',
            'color',
            'blink',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SetLED_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 13011951868568747749n;
    }

    getDataTypeSignature() {
        return 13011951868568747749n;
    }

};
module.exports.com_hobbywing_esc_SetLED_Request = com_hobbywing_esc_SetLED_Request;

// JavaScript binding for com.hobbywing.esc.SetLED
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SetLED_Response = class {
    static DTID = 212;
    static FULL_NAME = 'com.hobbywing.esc.SetLED';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 24;
    static MIN_BIT_LEN = 24;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['color'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['blink'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let option_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['option'].value = option_field.value
        msg.bitOffset += 8;
        let color_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['color'].value = color_field.value
        msg.bitOffset += 8;
        let blink_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['blink'].value = blink_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let option_bits = this.fields.option.pack();
        bits = bits.concat(option_bits);
        let color_bits = this.fields.color.pack();
        bits = bits.concat(color_bits);
        let blink_bits = this.fields.blink.pack();
        bits = bits.concat(blink_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['option'] = Number(this.fields['option'].value);
        obj['color'] = Number(this.fields['color'].value);
        obj['blink'] = Number(this.fields['blink'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SetLED_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SetLED_Response.DTID;
    }

    get name() {
        return com_hobbywing_esc_SetLED_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'option',
            'color',
            'blink',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SetLED_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 13011951868568747749n;
    }

    getDataTypeSignature() {
        return 13011951868568747749n;
    }

};
module.exports.com_hobbywing_esc_SetLED_Response = com_hobbywing_esc_SetLED_Response;

// JavaScript binding for com.hobbywing.esc.StatusMsg2
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_StatusMsg2 = class {
    static DTID = 20051;
    static FULL_NAME = 'com.hobbywing.esc.StatusMsg2';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 40;
    static MIN_BIT_LEN = 40;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['input_voltage'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 16);
        this.fields['current'] = new PrimitiveType(null, PrimitiveType.KIND_SIGNED_INT, 16);
        this.fields['temperature'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let input_voltage_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['input_voltage'].value = input_voltage_field.value
        msg.bitOffset += 16;
        let current_field = PrimitiveType.unpack(PrimitiveType.KIND_SIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['current'].value = current_field.value
        msg.bitOffset += 16;
        let temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['temperature'].value = temperature_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let input_voltage_bits = this.fields.input_voltage.pack();
        bits = bits.concat(input_voltage_bits);
        let current_bits = this.fields.current.pack();
        bits = bits.concat(current_bits);
        let temperature_bits = this.fields.temperature.pack();
        bits = bits.concat(temperature_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['input_voltage'] = Number(this.fields['input_voltage'].value);
        obj['current'] = Number(this.fields['current'].value);
        obj['temperature'] = Number(this.fields['temperature'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_StatusMsg2.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_StatusMsg2.DTID;
    }

    get name() {
        return com_hobbywing_esc_StatusMsg2.FULL_NAME;
    }

    get fieldNames() {
        return [
            'input_voltage',
            'current',
            'temperature',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_StatusMsg2();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 1618439342223069847n;
    }

    getDataTypeSignature() {
        return 1618439342223069847n;
    }

};
module.exports.com_hobbywing_esc_StatusMsg2 = com_hobbywing_esc_StatusMsg2;

// JavaScript binding for com.hobbywing.esc.SetBaud
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SetBaud_Request = class {
    static DTID = 211;
    static FULL_NAME = 'com.hobbywing.esc.SetBaud';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['baud'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let baud_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['baud'].value = baud_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let baud_bits = this.fields.baud.pack();
        bits = bits.concat(baud_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['baud'] = Number(this.fields['baud'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SetBaud_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SetBaud_Request.DTID;
    }

    get name() {
        return com_hobbywing_esc_SetBaud_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'baud',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SetBaud_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 12513680733705724981n;
    }

    getDataTypeSignature() {
        return 12513680733705724981n;
    }

};
module.exports.com_hobbywing_esc_SetBaud_Request = com_hobbywing_esc_SetBaud_Request;

// JavaScript binding for com.hobbywing.esc.SetBaud
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SetBaud_Response = class {
    static DTID = 211;
    static FULL_NAME = 'com.hobbywing.esc.SetBaud';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SetBaud_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SetBaud_Response.DTID;
    }

    get name() {
        return com_hobbywing_esc_SetBaud_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SetBaud_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 12513680733705724981n;
    }

    getDataTypeSignature() {
        return 12513680733705724981n;
    }

};
module.exports.com_hobbywing_esc_SetBaud_Response = com_hobbywing_esc_SetBaud_Response;

// JavaScript binding for com.hobbywing.esc.SetThrottleSource
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SetThrottleSource_Request = class {
    static DTID = 215;
    static FULL_NAME = 'com.hobbywing.esc.SetThrottleSource';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['source'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let source_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['source'].value = source_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let source_bits = this.fields.source.pack();
        bits = bits.concat(source_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['source'] = Number(this.fields['source'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SetThrottleSource_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SetThrottleSource_Request.DTID;
    }

    get name() {
        return com_hobbywing_esc_SetThrottleSource_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'source',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SetThrottleSource_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 874982191948751514n;
    }

    getDataTypeSignature() {
        return 874982191948751514n;
    }

};
module.exports.com_hobbywing_esc_SetThrottleSource_Request = com_hobbywing_esc_SetThrottleSource_Request;

// JavaScript binding for com.hobbywing.esc.SetThrottleSource
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SetThrottleSource_Response = class {
    static DTID = 215;
    static FULL_NAME = 'com.hobbywing.esc.SetThrottleSource';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['source'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let source_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['source'].value = source_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let source_bits = this.fields.source.pack();
        bits = bits.concat(source_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['source'] = Number(this.fields['source'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SetThrottleSource_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SetThrottleSource_Response.DTID;
    }

    get name() {
        return com_hobbywing_esc_SetThrottleSource_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'source',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SetThrottleSource_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 874982191948751514n;
    }

    getDataTypeSignature() {
        return 874982191948751514n;
    }

};
module.exports.com_hobbywing_esc_SetThrottleSource_Response = com_hobbywing_esc_SetThrottleSource_Response;

// JavaScript binding for com.hobbywing.esc.SetID
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SetID_Request = class {
    static DTID = 210;
    static FULL_NAME = 'com.hobbywing.esc.SetID';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 16;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['node_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['throttle_channel'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let node_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['node_id'].value = node_id_field.value
        msg.bitOffset += 8;
        let throttle_channel_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['throttle_channel'].value = throttle_channel_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let node_id_bits = this.fields.node_id.pack();
        bits = bits.concat(node_id_bits);
        let throttle_channel_bits = this.fields.throttle_channel.pack();
        bits = bits.concat(throttle_channel_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['node_id'] = Number(this.fields['node_id'].value);
        obj['throttle_channel'] = Number(this.fields['throttle_channel'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SetID_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SetID_Request.DTID;
    }

    get name() {
        return com_hobbywing_esc_SetID_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'node_id',
            'throttle_channel',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SetID_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 14061306068831745783n;
    }

    getDataTypeSignature() {
        return 14061306068831745783n;
    }

};
module.exports.com_hobbywing_esc_SetID_Request = com_hobbywing_esc_SetID_Request;

// JavaScript binding for com.hobbywing.esc.SetID
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SetID_Response = class {
    static DTID = 210;
    static FULL_NAME = 'com.hobbywing.esc.SetID';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 16;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['node_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['throttle_channel'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let node_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['node_id'].value = node_id_field.value
        msg.bitOffset += 8;
        let throttle_channel_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['throttle_channel'].value = throttle_channel_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let node_id_bits = this.fields.node_id.pack();
        bits = bits.concat(node_id_bits);
        let throttle_channel_bits = this.fields.throttle_channel.pack();
        bits = bits.concat(throttle_channel_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['node_id'] = Number(this.fields['node_id'].value);
        obj['throttle_channel'] = Number(this.fields['throttle_channel'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SetID_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SetID_Response.DTID;
    }

    get name() {
        return com_hobbywing_esc_SetID_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'node_id',
            'throttle_channel',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SetID_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 14061306068831745783n;
    }

    getDataTypeSignature() {
        return 14061306068831745783n;
    }

};
module.exports.com_hobbywing_esc_SetID_Response = com_hobbywing_esc_SetID_Response;

// JavaScript binding for com.hobbywing.esc.SetReportingFrequency
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SetReportingFrequency_Request = class {
    static DTID = 214;
    static FULL_NAME = 'com.hobbywing.esc.SetReportingFrequency';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 32;
    static MIN_BIT_LEN = 32;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['MSG_ID'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['rate'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let option_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['option'].value = option_field.value
        msg.bitOffset += 8;
        let MSG_ID_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['MSG_ID'].value = MSG_ID_field.value
        msg.bitOffset += 16;
        let rate_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rate'].value = rate_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let option_bits = this.fields.option.pack();
        bits = bits.concat(option_bits);
        let MSG_ID_bits = this.fields.MSG_ID.pack();
        bits = bits.concat(MSG_ID_bits);
        let rate_bits = this.fields.rate.pack();
        bits = bits.concat(rate_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['option'] = Number(this.fields['option'].value);
        obj['MSG_ID'] = Number(this.fields['MSG_ID'].value);
        obj['rate'] = Number(this.fields['rate'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SetReportingFrequency_Request.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SetReportingFrequency_Request.DTID;
    }

    get name() {
        return com_hobbywing_esc_SetReportingFrequency_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'option',
            'MSG_ID',
            'rate',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SetReportingFrequency_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 2292402871680384491n;
    }

    getDataTypeSignature() {
        return 2292402871680384491n;
    }

};
module.exports.com_hobbywing_esc_SetReportingFrequency_Request = com_hobbywing_esc_SetReportingFrequency_Request;

// JavaScript binding for com.hobbywing.esc.SetReportingFrequency
// Auto Generated Code, DO NOT MODIFY
const com_hobbywing_esc_SetReportingFrequency_Response = class {
    static DTID = 214;
    static FULL_NAME = 'com.hobbywing.esc.SetReportingFrequency';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 32;
    static MIN_BIT_LEN = 32;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['MSG_ID'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 16);
        this.fields['rate'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let option_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['option'].value = option_field.value
        msg.bitOffset += 8;
        let MSG_ID_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 16), 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['MSG_ID'].value = MSG_ID_field.value
        msg.bitOffset += 16;
        let rate_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rate'].value = rate_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let option_bits = this.fields.option.pack();
        bits = bits.concat(option_bits);
        let MSG_ID_bits = this.fields.MSG_ID.pack();
        bits = bits.concat(MSG_ID_bits);
        let rate_bits = this.fields.rate.pack();
        bits = bits.concat(rate_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['option'] = Number(this.fields['option'].value);
        obj['MSG_ID'] = Number(this.fields['MSG_ID'].value);
        obj['rate'] = Number(this.fields['rate'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_hobbywing_esc_SetReportingFrequency_Response.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_hobbywing_esc_SetReportingFrequency_Response.DTID;
    }

    get name() {
        return com_hobbywing_esc_SetReportingFrequency_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'option',
            'MSG_ID',
            'rate',
        ];
    }

    static sampleMessage() {
        const msg = new com_hobbywing_esc_SetReportingFrequency_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 2292402871680384491n;
    }

    getDataTypeSignature() {
        return 2292402871680384491n;
    }

};
module.exports.com_hobbywing_esc_SetReportingFrequency_Response = com_hobbywing_esc_SetReportingFrequency_Response;

// JavaScript binding for com.volz.servo.ActuatorStatus
// Auto Generated Code, DO NOT MODIFY
const com_volz_servo_ActuatorStatus = class {
    static DTID = 20020;
    static FULL_NAME = 'com.volz.servo.ActuatorStatus';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 56;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['actuator_id'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['actual_position'] = new PrimitiveType(null, PrimitiveType.KIND_FLOAT, 16);
        this.fields['current'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['voltage'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['motor_pwm'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
        this.fields['motor_temperature'] = new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = new Buffer.from(buf)
        const msg = new this();
        msg.bitOffset = bitOffset;
        let actuator_id_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['actuator_id'].value = actuator_id_field.value
        msg.bitOffset += 8;
        let actual_position_field = PrimitiveType.unpack(PrimitiveType.KIND_FLOAT, data.getBits(msg.bitOffset, 16), 16);
        msg.fields['actual_position'].value = actual_position_field.value
        msg.bitOffset += 16;
        let current_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['current'].value = current_field.value
        msg.bitOffset += 8;
        let voltage_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['voltage'].value = voltage_field.value
        msg.bitOffset += 8;
        let motor_pwm_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['motor_pwm'].value = motor_pwm_field.value
        msg.bitOffset += 8;
        let motor_temperature_field = PrimitiveType.unpack(PrimitiveType.KIND_UNSIGNED_INT, data.getBits(msg.bitOffset, 8), 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['motor_temperature'].value = motor_temperature_field.value
        msg.bitOffset += 8;
        return msg;
    }

    pack(tao=true) {
        let bits = [];
        let actuator_id_bits = this.fields.actuator_id.pack();
        bits = bits.concat(actuator_id_bits);
        let actual_position_bits = this.fields.actual_position.pack();
        bits = bits.concat(actual_position_bits);
        let current_bits = this.fields.current.pack();
        bits = bits.concat(current_bits);
        let voltage_bits = this.fields.voltage.pack();
        bits = bits.concat(voltage_bits);
        let motor_pwm_bits = this.fields.motor_pwm.pack();
        bits = bits.concat(motor_pwm_bits);
        let motor_temperature_bits = this.fields.motor_temperature.pack();
        bits = bits.concat(motor_temperature_bits);
        if (bits.length <= this.constructor.MAX_BIT_LEN && bits.length >= this.constructor.MIN_BIT_LEN ) {
            if (this.constructor.MAX_BIT_LEN === this.constructor.MIN_BIT_LEN && this.constructor.MAX_BIT_LEN !== bits.length) {
                throw new Error(`Encoded message length is not equal to the fixed length of ${this.constructor.MAX_BIT_LEN}`);
            }
        } else if (this.constructor.MAX_BIT_LEN > 0 && bits.length <= this.constructor.MAX_BIT_LEN) {
            throw new Error(`Encoded message length is less than minimum length of ${this.constructor.MIN_BIT_LEN}`);
        }
        return bits;
    }

    toObj() {
        const obj = {};
        obj['actuator_id'] = Number(this.fields['actuator_id'].value);
        obj['actual_position'] = Number(this.fields['actual_position'].value);
        obj['current'] = Number(this.fields['current'].value);
        obj['voltage'] = Number(this.fields['voltage'].value);
        obj['motor_pwm'] = Number(this.fields['motor_pwm'].value);
        obj['motor_temperature'] = Number(this.fields['motor_temperature'].value);
        obj.getConstant = function(fieldName) {
            const constants = com_volz_servo_ActuatorStatus.CONSTANTS;
            const value = this[fieldName];
            if (constants[fieldName]) {
                for (const [key, val] of Object.entries(constants[fieldName])) {
                    if (val === value) return key;
                }
            }
            return '';
        }
        return obj;
    }

    get unionField() {
        if (this.unionFieldIndex === null) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return com_volz_servo_ActuatorStatus.DTID;
    }

    get name() {
        return com_volz_servo_ActuatorStatus.FULL_NAME;
    }

    get fieldNames() {
        return [
            'actuator_id',
            'actual_position',
            'current',
            'voltage',
            'motor_pwm',
            'motor_temperature',
        ];
    }

    static sampleMessage() {
        const msg = new com_volz_servo_ActuatorStatus();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    static getDataTypeSignature() {
        return 3008137729260520035n;
    }

    getDataTypeSignature() {
        return 3008137729260520035n;
    }

};
module.exports.com_volz_servo_ActuatorStatus = com_volz_servo_ActuatorStatus;

const messages = {};
messages[1032] = dronecan_sensors_hygrometer_Hygrometer;
messages[1043] = dronecan_sensors_magnetometer_MagneticFieldStrengthHiRes;
messages[1045] = dronecan_sensors_rpm_RPM;
messages[1140] = dronecan_sensors_rc_RCInput;
messages[16371] = dronecan_protocol_FlexDebug;
messages[343] = dronecan_protocol_CanStats;
messages[342] = dronecan_protocol_Stats;
messages[20033] = dronecan_remoteid_System;
messages[20034] = dronecan_remoteid_OperatorID;
messages[20031] = dronecan_remoteid_Location;
messages[20032] = dronecan_remoteid_SelfID;
messages[20030] = dronecan_remoteid_BasicID;
messages[20035] = dronecan_remoteid_ArmStatus;
messages[20001] = ardupilot_indication_Button;
messages[20000] = ardupilot_indication_SafetyState;
messages[20007] = ardupilot_indication_NotifyState;
messages[20005] = ardupilot_gnss_MovingBaselineData;
messages[20002] = ardupilot_gnss_Heading;
messages[20006] = ardupilot_gnss_RelPosHeading;
messages[20003] = ardupilot_gnss_Status;
messages[20010] = ardupilot_equipment_power_BatteryContinuous;
messages[20012] = ardupilot_equipment_power_BatteryCells;
messages[20004] = ardupilot_equipment_power_BatteryInfoAux;
messages[20011] = ardupilot_equipment_power_BatteryPeriodic;
messages[21910] = ardupilot_equipment_proximity_sensor_Proximity;
messages[20790] = ardupilot_equipment_trafficmonitor_TrafficReport;
messages[2000] = uavcan_navigation_GlobalNavigationSolution;
messages[341] = uavcan_protocol_NodeStatus;
messages[5] = uavcan_protocol_Panic;
messages[4] = uavcan_protocol_GlobalTimeSync;
messages[1] = uavcan_protocol_dynamic_node_id_Allocation;
messages[390] = uavcan_protocol_dynamic_node_id_server_Discovery;
messages[380] = uavcan_protocol_enumeration_Indication;
messages[16370] = uavcan_protocol_debug_KeyValue;
messages[16383] = uavcan_protocol_debug_LogMessage;
messages[2011] = uavcan_tunnel_SerialConfig;
messages[2010] = uavcan_tunnel_Broadcast;
messages[3001] = uavcan_tunnel_Targetted;
messages[1091] = uavcan_equipment_power_CircuitStatus;
messages[1090] = uavcan_equipment_power_PrimaryPowerSupplyStatus;
messages[1092] = uavcan_equipment_power_BatteryInfo;
messages[1002] = uavcan_equipment_ahrs_MagneticFieldStrength2;
messages[1003] = uavcan_equipment_ahrs_RawIMU;
messages[1000] = uavcan_equipment_ahrs_Solution;
messages[1001] = uavcan_equipment_ahrs_MagneticFieldStrength;
messages[1030] = uavcan_equipment_esc_RawCommand;
messages[1031] = uavcan_equipment_esc_RPMCommand;
messages[1036] = uavcan_equipment_esc_StatusExtended;
messages[1034] = uavcan_equipment_esc_Status;
messages[1050] = uavcan_equipment_range_sensor_Measurement;
messages[1071] = uavcan_equipment_hardpoint_Status;
messages[1070] = uavcan_equipment_hardpoint_Command;
messages[1040] = uavcan_equipment_camera_gimbal_AngularCommand;
messages[1041] = uavcan_equipment_camera_gimbal_GEOPOICommand;
messages[1044] = uavcan_equipment_camera_gimbal_Status;
messages[1129] = uavcan_equipment_ice_FuelTankStatus;
messages[1120] = uavcan_equipment_ice_reciprocating_Status;
messages[1080] = uavcan_equipment_indication_BeepCommand;
messages[1081] = uavcan_equipment_indication_LightsCommand;
messages[1100] = uavcan_equipment_safety_ArmingStatus;
messages[1062] = uavcan_equipment_gnss_RTCMStream;
messages[1063] = uavcan_equipment_gnss_Fix2;
messages[1060] = uavcan_equipment_gnss_Fix;
messages[1061] = uavcan_equipment_gnss_Auxiliary;
messages[1010] = uavcan_equipment_actuator_ArrayCommand;
messages[1011] = uavcan_equipment_actuator_Status;
messages[1110] = uavcan_equipment_device_Temperature;
messages[1027] = uavcan_equipment_air_data_RawAirData;
messages[1029] = uavcan_equipment_air_data_StaticTemperature;
messages[1028] = uavcan_equipment_air_data_StaticPressure;
messages[1020] = uavcan_equipment_air_data_TrueAirspeed;
messages[1026] = uavcan_equipment_air_data_Sideslip;
messages[1025] = uavcan_equipment_air_data_AngleOfAttack;
messages[1021] = uavcan_equipment_air_data_IndicatedAirspeed;
messages[20407] = com_xacti_CopterAttStatus;
messages[20554] = com_xacti_GimbalControlData;
messages[20305] = com_xacti_GnssStatus;
messages[20402] = com_xacti_GimbalAttitudeStatus;
messages[20306] = com_xacti_GnssStatusReq;
messages[20200] = com_hex_equipment_flow_Measurement;
messages[1332] = com_tmotor_esc_ParamGet;
messages[1038] = com_tmotor_esc_PUSHSCI;
messages[1035] = com_tmotor_esc_FocCtrl;
messages[1039] = com_tmotor_esc_PUSHCAN;
messages[1033] = com_tmotor_esc_ParamCfg;
messages[2019] = com_himark_servo_ServoInfo;
messages[2018] = com_himark_servo_ServoCmd;
messages[20052] = com_hobbywing_esc_StatusMsg3;
messages[20050] = com_hobbywing_esc_StatusMsg1;
messages[20013] = com_hobbywing_esc_GetEscID;
messages[20100] = com_hobbywing_esc_RawCommand;
messages[20051] = com_hobbywing_esc_StatusMsg2;
messages[20020] = com_volz_servo_ActuatorStatus;
module.exports.messages = messages;
const services = {};
services[64] = {'request': dronecan_remoteid_SecureCommand_Request, 'response': dronecan_remoteid_SecureCommand_Response};
services[1] = {'request': uavcan_protocol_GetNodeInfo_Request, 'response': uavcan_protocol_GetNodeInfo_Response};
services[6] = {'request': uavcan_protocol_AccessCommandShell_Request, 'response': uavcan_protocol_AccessCommandShell_Response};
services[2] = {'request': uavcan_protocol_GetDataTypeInfo_Request, 'response': uavcan_protocol_GetDataTypeInfo_Response};
services[5] = {'request': uavcan_protocol_RestartNode_Request, 'response': uavcan_protocol_RestartNode_Response};
services[4] = {'request': uavcan_protocol_GetTransportStats_Request, 'response': uavcan_protocol_GetTransportStats_Response};
services[49] = {'request': uavcan_protocol_file_Write_Request, 'response': uavcan_protocol_file_Write_Response};
services[46] = {'request': uavcan_protocol_file_GetDirectoryEntryInfo_Request, 'response': uavcan_protocol_file_GetDirectoryEntryInfo_Response};
services[45] = {'request': uavcan_protocol_file_GetInfo_Request, 'response': uavcan_protocol_file_GetInfo_Response};
services[47] = {'request': uavcan_protocol_file_Delete_Request, 'response': uavcan_protocol_file_Delete_Response};
services[40] = {'request': uavcan_protocol_file_BeginFirmwareUpdate_Request, 'response': uavcan_protocol_file_BeginFirmwareUpdate_Response};
services[48] = {'request': uavcan_protocol_file_Read_Request, 'response': uavcan_protocol_file_Read_Response};
services[31] = {'request': uavcan_protocol_dynamic_node_id_server_RequestVote_Request, 'response': uavcan_protocol_dynamic_node_id_server_RequestVote_Response};
services[30] = {'request': uavcan_protocol_dynamic_node_id_server_AppendEntries_Request, 'response': uavcan_protocol_dynamic_node_id_server_AppendEntries_Response};
services[15] = {'request': uavcan_protocol_enumeration_Begin_Request, 'response': uavcan_protocol_enumeration_Begin_Response};
services[11] = {'request': uavcan_protocol_param_GetSet_Request, 'response': uavcan_protocol_param_GetSet_Response};
services[10] = {'request': uavcan_protocol_param_ExecuteOpcode_Request, 'response': uavcan_protocol_param_ExecuteOpcode_Response};
services[63] = {'request': uavcan_tunnel_Call_Request, 'response': uavcan_tunnel_Call_Response};
services[241] = {'request': com_hobbywing_esc_GetMaintenanceInformation_Request, 'response': com_hobbywing_esc_GetMaintenanceInformation_Response};
services[242] = {'request': com_hobbywing_esc_GetMajorConfig_Request, 'response': com_hobbywing_esc_GetMajorConfig_Response};
services[217] = {'request': com_hobbywing_esc_SetAngle_Request, 'response': com_hobbywing_esc_SetAngle_Response};
services[213] = {'request': com_hobbywing_esc_SetDirection_Request, 'response': com_hobbywing_esc_SetDirection_Response};
services[216] = {'request': com_hobbywing_esc_SelfTest_Request, 'response': com_hobbywing_esc_SelfTest_Response};
services[212] = {'request': com_hobbywing_esc_SetLED_Request, 'response': com_hobbywing_esc_SetLED_Response};
services[211] = {'request': com_hobbywing_esc_SetBaud_Request, 'response': com_hobbywing_esc_SetBaud_Response};
services[215] = {'request': com_hobbywing_esc_SetThrottleSource_Request, 'response': com_hobbywing_esc_SetThrottleSource_Response};
services[210] = {'request': com_hobbywing_esc_SetID_Request, 'response': com_hobbywing_esc_SetID_Response};
services[214] = {'request': com_hobbywing_esc_SetReportingFrequency_Request, 'response': com_hobbywing_esc_SetReportingFrequency_Response};
module.exports.services = services;
