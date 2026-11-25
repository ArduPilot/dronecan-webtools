// DroneCAN Generated JavaScript bindings via dronecan_dsdljs

Object.defineProperty(module.exports, "bindingInfo", { value: {
  "generator": {
    "name": "dronecan_dsdljs",
    "version": "1.0.0",
    "commit": "0b69d00494a55bb2dc11e0fbc360f82d19d88b7c",
    "dirty": false,
    "sha256": "fd7f7097d9c0ae0e55d64c01b8a3ff34a0cdae3fc28bbc369a427037c46ddb33"
  },
  "dsdl": {
    "ardupilot": {
      "commit": "04e0e818b06c180eb1720fcdf16484d0f12895ee",
      "dirty": false,
      "sha256": "e44e87fe67ca40e7dfbdb742bd234765ad948990a4cda6de6b53f017b6c5ad1c"
    },
    "com": {
      "commit": "f618adf88990829abd152b48a7bbdfd58881a5a6",
      "dirty": false,
      "sha256": "9bdc02ce116398fe49542a8ccef539111b7a1a38ce4b9eb531ccd51e645a98e2"
    },
    "cuav": {
      "commit": "409a69ddc7e885a6ba3b19776ce0c93288e0883a",
      "dirty": false,
      "sha256": "6fc8fb80ce6ad3a86a99f116e46c82a4d690a67ca88885973c9578497a440239"
    },
    "dronecan": {
      "commit": "ab28baa03118fcdb2980d8b55a3afd6760b54f46",
      "dirty": false,
      "sha256": "7ab419b6e23b2d0a78c3892a9e21e5f1c37bfe26dcb5dff068ff4b91cc4da2cb"
    },
    "mppt": {
      "commit": "c09dac9dd35133edc8ba08f59b71c64d0e6328bd",
      "dirty": false,
      "sha256": "c3ab0e620490c288496658dc4f2aac1d42709908f46141aab05f22f4e7646a88"
    },
    "uavcan": {
      "commit": "b4653c7abc3c47cb31b16efa24ea755232774756",
      "dirty": false,
      "sha256": "698fe89a1d38caca85773baad937e36c7c8d2d36ea35d332097f5e3b6f374195"
    }
  },
  "usesDefaultDsdl": false
} });

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

function skipBits(data, msg, count) {
    if (msg.bitOffset + count > data.length * 8) throw new RangeError('Truncated DSDL field');
    msg.bitOffset += count;
}

function readPrimitive(data, msg, kind, width, mode) {
    const bits = data.getBits(msg.bitOffset, width);
    msg.bitOffset += width;
    return PrimitiveType.unpack(kind, bits, width, mode);
}

function readCompound(data, msg, Message, kind, tao) {
    const child = Message.unpack(data, tao, msg.bitOffset);
    msg.bitOffset = child.bitOffset;
    return new CompoundType(child, kind);
}

function appendTag(bits, tag, width) {
    for (let i = width - 1; i >= 0; i--) bits.push(Math.floor(tag / 2 ** i) % 2);
}

function readTag(data, msg, width) {
    let tag = 0;
    for (const bit of data.getBits(msg.bitOffset, width)) tag = tag * 2 + bit;
    msg.bitOffset += width;
    return tag;
}

function packArray(bits, items, maxSize, countWidth, minElementBits, tao) {
    if (items.length > maxSize || (countWidth === 0 && items.length !== maxSize)) {
        throw new RangeError('Array length outside DSDL bounds');
    }
    const implicitLength = countWidth > 0 && tao && minElementBits >= 8;
    if (countWidth > 0 && !implicitLength) {
        const length = new PrimitiveType(items.length, PrimitiveType.KIND_UNSIGNED_INT, countWidth);
        bits.push(...length.pack());
    }
    for (let i = 0; i < items.length; i++) {
        const elementTao = tao && !implicitLength && i === items.length - 1;
        for (const bit of items[i].pack(elementTao)) bits.push(bit);
    }
}

function readArray(data, msg, maxSize, countWidth, minElementBits, tao, readElement) {
    const items = [];
    if (countWidth > 0 && tao && minElementBits >= 8) {
        // Omitted-length elements carry their own lengths. Up to seven final pad bits remain.
        while (data.length * 8 - msg.bitOffset >= 8) {
            if (items.length >= maxSize) throw new RangeError('Array exceeds DSDL maximum length');
            items.push(readElement(false));
        }
    } else {
        const count = countWidth === 0 ? maxSize : readPrimitive(data, msg,
            PrimitiveType.KIND_UNSIGNED_INT, countWidth, PrimitiveType.CAST_MODE_SATURATED).value;
        if (count > maxSize) throw new RangeError('Array exceeds DSDL maximum length');
        for (let i = 0; i < count; i++) items.push(readElement(tao && i === count - 1));
    }
    return items;
}
// JavaScript binding for uavcan.CoarseOrientation
// Auto Generated Code, DO NOT MODIFY
const uavcan_CoarseOrientation = class {
    static DTID = null;
    static FULL_NAME = 'uavcan.CoarseOrientation';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 16;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['fixed_axis_roll_pitch_yaw'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['orientation_defined'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['fixed_axis_roll_pitch_yaw'].items = readArray(data, msg, 3, 0, 5, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['orientation_defined'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['fixed_axis_roll_pitch_yaw'].items, 3, 0, 5, false);
        bits.push(...this.fields['orientation_defined'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['fixed_axis_roll_pitch_yaw'] = this.fields['fixed_axis_roll_pitch_yaw'].toObj(true);
        obj['orientation_defined'] = this.fields['orientation_defined'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 2818023060696505938n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.CoarseOrientation\nsaturated int5[3] fixed_axis_roll_pitch_yaw\nsaturated bool orientation_defined"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['usec'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 56, PrimitiveType.CAST_MODE_TRUNCATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['usec'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 56, PrimitiveType.CAST_MODE_TRUNCATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['usec'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['usec'] = this.fields['usec'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 413499232717667853n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.Timestamp\ntruncated uint56 usec"; }

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
        this.fields['timestamp'] = new CompoundType(new uavcan_Timestamp(), CompoundType.KIND_MESSAGE);
        this.fields['longitude'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 64, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['latitude'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 64, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['height_ellipsoid'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['height_msl'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['height_agl'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['height_baro'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['qnh_hpa'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['orientation_xyzw'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 4);
        this.fields['pose_covariance'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 36);
        this.fields['linear_velocity_body'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['angular_velocity_body'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['linear_acceleration_body'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['velocity_covariance'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 36);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['timestamp'] = readCompound(data, msg, uavcan_Timestamp, CompoundType.KIND_MESSAGE, false);
        msg.fields['longitude'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 64, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['latitude'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 64, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_ellipsoid'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_msl'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_agl'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_baro'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['qnh_hpa'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['orientation_xyzw'].items = readArray(data, msg, 4, 0, 32, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['pose_covariance'].items = readArray(data, msg, 36, 6, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['linear_velocity_body'].items = readArray(data, msg, 3, 0, 32, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['angular_velocity_body'].items = readArray(data, msg, 3, 0, 32, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['linear_acceleration_body'].items = readArray(data, msg, 3, 0, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['velocity_covariance'].items = readArray(data, msg, 36, 6, 16, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['timestamp'].pack(false)) bits.push(bit);
        bits.push(...this.fields['longitude'].pack());
        bits.push(...this.fields['latitude'].pack());
        bits.push(...this.fields['height_ellipsoid'].pack());
        bits.push(...this.fields['height_msl'].pack());
        bits.push(...this.fields['height_agl'].pack());
        bits.push(...this.fields['height_baro'].pack());
        bits.push(...this.fields['qnh_hpa'].pack());
        packArray(bits, this.fields['orientation_xyzw'].items, 4, 0, 32, false);
        packArray(bits, this.fields['pose_covariance'].items, 36, 6, 16, false);
        packArray(bits, this.fields['linear_velocity_body'].items, 3, 0, 32, false);
        packArray(bits, this.fields['angular_velocity_body'].items, 3, 0, 32, false);
        packArray(bits, this.fields['linear_acceleration_body'].items, 3, 0, 16, false);
        packArray(bits, this.fields['velocity_covariance'].items, 36, 6, 16, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['longitude'] = this.fields['longitude'].toObj();
        obj['latitude'] = this.fields['latitude'].toObj();
        obj['height_ellipsoid'] = this.fields['height_ellipsoid'].toObj();
        obj['height_msl'] = this.fields['height_msl'].toObj();
        obj['height_agl'] = this.fields['height_agl'].toObj();
        obj['height_baro'] = this.fields['height_baro'].toObj();
        obj['qnh_hpa'] = this.fields['qnh_hpa'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 4064417545896857596n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.navigation.GlobalNavigationSolution\nuavcan.Timestamp timestamp\nsaturated float64 longitude\nsaturated float64 latitude\nsaturated float32 height_ellipsoid\nsaturated float32 height_msl\nsaturated float32 height_agl\nsaturated float32 height_baro\nsaturated float16 qnh_hpa\nsaturated float32[4] orientation_xyzw\nsaturated float16[<=36] pose_covariance\nsaturated float32[3] linear_velocity_body\nsaturated float32[3] angular_velocity_body\nsaturated float16[3] linear_acceleration_body\nsaturated float16[<=36] velocity_covariance"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 12109555533872359045n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.GetNodeInfo\n---\nuavcan.protocol.NodeStatus status\nuavcan.protocol.SoftwareVersion software_version\nuavcan.protocol.HardwareVersion hardware_version\nsaturated uint8[<=80] name"; }

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
    static MAX_BIT_LEN = 3015;
    static MIN_BIT_LEN = 320;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['status'] = new CompoundType(new uavcan_protocol_NodeStatus(), CompoundType.KIND_MESSAGE);
        this.fields['software_version'] = new CompoundType(new uavcan_protocol_SoftwareVersion(), CompoundType.KIND_MESSAGE);
        this.fields['hardware_version'] = new CompoundType(new uavcan_protocol_HardwareVersion(), CompoundType.KIND_MESSAGE);
        this.fields['name'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 80);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['status'] = readCompound(data, msg, uavcan_protocol_NodeStatus, CompoundType.KIND_MESSAGE, false);
        msg.fields['software_version'] = readCompound(data, msg, uavcan_protocol_SoftwareVersion, CompoundType.KIND_MESSAGE, false);
        msg.fields['hardware_version'] = readCompound(data, msg, uavcan_protocol_HardwareVersion, CompoundType.KIND_MESSAGE, false);
        msg.fields['name'].items = readArray(data, msg, 80, 7, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['status'].pack(false)) bits.push(bit);
        for (const bit of this.fields['software_version'].pack(false)) bits.push(bit);
        for (const bit of this.fields['hardware_version'].pack(false)) bits.push(bit);
        packArray(bits, this.fields['name'].items, 80, 7, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 12109555533872359045n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.GetNodeInfo\n---\nuavcan.protocol.NodeStatus status\nuavcan.protocol.SoftwareVersion software_version\nuavcan.protocol.HardwareVersion hardware_version\nsaturated uint8[<=80] name"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['input'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 128);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['input'].items = readArray(data, msg, 128, 8, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['flags'].pack());
        packArray(bits, this.fields['input'].items, 128, 8, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['flags'] = this.fields['flags'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 6424221424030393454n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.AccessCommandShell\nsaturated uint8 flags\nsaturated uint8[<=128] input\n---\nsaturated int32 last_exit_status\nsaturated uint8 flags\nsaturated uint8[<=256] output"; }

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
    static MAX_BIT_LEN = 2097;
    static MIN_BIT_LEN = 40;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['last_exit_status'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['output'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 256);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['last_exit_status'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['output'].items = readArray(data, msg, 256, 9, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['last_exit_status'].pack());
        bits.push(...this.fields['flags'].pack());
        packArray(bits, this.fields['output'].items, 256, 9, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['last_exit_status'] = this.fields['last_exit_status'].toObj();
        obj['flags'] = this.fields['flags'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 6424221424030393454n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.AccessCommandShell\nsaturated uint8 flags\nsaturated uint8[<=128] input\n---\nsaturated int32 last_exit_status\nsaturated uint8 flags\nsaturated uint8[<=256] output"; }

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
        this.fields['uptime_sec'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['health'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 2, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['mode'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['sub_mode'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['vendor_specific_status_code'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['uptime_sec'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['health'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 2, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['mode'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sub_mode'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['vendor_specific_status_code'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['uptime_sec'].pack());
        bits.push(...this.fields['health'].pack());
        bits.push(...this.fields['mode'].pack());
        bits.push(...this.fields['sub_mode'].pack());
        bits.push(...this.fields['vendor_specific_status_code'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['uptime_sec'] = this.fields['uptime_sec'].toObj();
        obj['health'] = this.fields['health'].toObj();
        obj['mode'] = this.fields['mode'].toObj();
        obj['sub_mode'] = this.fields['sub_mode'].toObj();
        obj['vendor_specific_status_code'] = this.fields['vendor_specific_status_code'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1083230956194088689n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.NodeStatus\nsaturated uint32 uptime_sec\nsaturated uint2 health\nsaturated uint3 mode\nsaturated uint3 sub_mode\nsaturated uint16 vendor_specific_status_code"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['value'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['value'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['value'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['value'] = this.fields['value'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 10673715001607215408n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.DataTypeKind\nsaturated uint8 value"; }

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
        this.fields['reason_text'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 7);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['reason_text'].items = readArray(data, msg, 7, 3, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['reason_text'].items, 7, 3, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 10050262024670265815n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.Panic\nsaturated uint8[<=7] reason_text"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['major'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['minor'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['optional_field_flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['vcs_commit'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['image_crc'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 64, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['major'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['minor'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['optional_field_flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['vcs_commit'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['image_crc'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 64, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['major'].pack());
        bits.push(...this.fields['minor'].pack());
        bits.push(...this.fields['optional_field_flags'].pack());
        bits.push(...this.fields['vcs_commit'].pack());
        bits.push(...this.fields['image_crc'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['major'] = this.fields['major'].toObj();
        obj['minor'] = this.fields['minor'].toObj();
        obj['optional_field_flags'] = this.fields['optional_field_flags'].toObj();
        obj['vcs_commit'] = this.fields['vcs_commit'].toObj();
        obj['image_crc'] = this.fields['image_crc'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 15944709945113968289n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.SoftwareVersion\nsaturated uint8 major\nsaturated uint8 minor\nsaturated uint8 optional_field_flags\nsaturated uint32 vcs_commit\nsaturated uint64 image_crc"; }

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
        this.fields['previous_transmission_timestamp_usec'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 56, PrimitiveType.CAST_MODE_TRUNCATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['previous_transmission_timestamp_usec'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 56, PrimitiveType.CAST_MODE_TRUNCATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['previous_transmission_timestamp_usec'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['previous_transmission_timestamp_usec'] = this.fields['previous_transmission_timestamp_usec'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 2316839322303840987n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.GlobalTimeSync\ntruncated uint56 previous_transmission_timestamp_usec"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['kind'] = new CompoundType(new uavcan_protocol_DataTypeKind(), CompoundType.KIND_MESSAGE);
        this.fields['name'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 80);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['kind'] = readCompound(data, msg, uavcan_protocol_DataTypeKind, CompoundType.KIND_MESSAGE, false);
        msg.fields['name'].items = readArray(data, msg, 80, 7, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['id'].pack());
        for (const bit of this.fields['kind'].pack(false)) bits.push(bit);
        packArray(bits, this.fields['name'].items, 80, 7, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['id'] = this.fields['id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 9856477197111207164n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.GetDataTypeInfo\nsaturated uint16 id\nuavcan.protocol.DataTypeKind kind\nsaturated uint8[<=80] name\n---\nsaturated uint64 signature\nsaturated uint16 id\nuavcan.protocol.DataTypeKind kind\nsaturated uint8 flags\nsaturated uint8[<=80] name"; }

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
    static MAX_BIT_LEN = 743;
    static MIN_BIT_LEN = 96;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['signature'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 64, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['kind'] = new CompoundType(new uavcan_protocol_DataTypeKind(), CompoundType.KIND_MESSAGE);
        this.fields['flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['name'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 80);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['signature'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 64, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['kind'] = readCompound(data, msg, uavcan_protocol_DataTypeKind, CompoundType.KIND_MESSAGE, false);
        msg.fields['flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['name'].items = readArray(data, msg, 80, 7, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['signature'].pack());
        bits.push(...this.fields['id'].pack());
        for (const bit of this.fields['kind'].pack(false)) bits.push(bit);
        bits.push(...this.fields['flags'].pack());
        packArray(bits, this.fields['name'].items, 80, 7, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['signature'] = this.fields['signature'].toObj();
        obj['id'] = this.fields['id'].toObj();
        obj['kind'] = this.fields['kind'].toObj();
        obj['flags'] = this.fields['flags'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 9856477197111207164n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.GetDataTypeInfo\nsaturated uint16 id\nuavcan.protocol.DataTypeKind kind\nsaturated uint8[<=80] name\n---\nsaturated uint64 signature\nsaturated uint16 id\nuavcan.protocol.DataTypeKind kind\nsaturated uint8 flags\nsaturated uint8[<=80] name"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['major'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['minor'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['unique_id'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 16);
        this.fields['certificate_of_authenticity'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 255);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['major'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['minor'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['unique_id'].items = readArray(data, msg, 16, 0, 8, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['certificate_of_authenticity'].items = readArray(data, msg, 255, 8, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['major'].pack());
        bits.push(...this.fields['minor'].pack());
        packArray(bits, this.fields['unique_id'].items, 16, 0, 8, false);
        packArray(bits, this.fields['certificate_of_authenticity'].items, 255, 8, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['major'] = this.fields['major'].toObj();
        obj['minor'] = this.fields['minor'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 780746478857789636n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.HardwareVersion\nsaturated uint8 major\nsaturated uint8 minor\nsaturated uint8[16] unique_id\nsaturated uint8[<=255] certificate_of_authenticity"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['frames_tx'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['frames_rx'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['errors'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['frames_tx'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['frames_rx'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['errors'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['frames_tx'].pack());
        bits.push(...this.fields['frames_rx'].pack());
        bits.push(...this.fields['errors'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['frames_tx'] = this.fields['frames_tx'].toObj();
        obj['frames_rx'] = this.fields['frames_rx'].toObj();
        obj['errors'] = this.fields['errors'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1418922988753691472n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.CANIfaceStats\nsaturated uint48 frames_tx\nsaturated uint48 frames_rx\nsaturated uint48 errors"; }

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
    static CONSTANTS = {'magic_number': {'MAGIC_NUMBER': 742196058910}};
    static MAX_BIT_LEN = 40;
    static MIN_BIT_LEN = 40;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['magic_number'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 40, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['magic_number'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 40, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['magic_number'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['magic_number'] = this.fields['magic_number'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 6241431877198026736n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.RestartNode\nsaturated uint40 magic_number\n---\nsaturated bool ok"; }

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
    static MAX_BIT_LEN = 1;
    static MIN_BIT_LEN = 1;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['ok'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['ok'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['ok'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['ok'] = this.fields['ok'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 6241431877198026736n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.RestartNode\nsaturated uint40 magic_number\n---\nsaturated bool ok"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 3587106470255878579n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.GetTransportStats\n---\nsaturated uint48 transfers_tx\nsaturated uint48 transfers_rx\nsaturated uint48 transfer_errors\nuavcan.protocol.CANIfaceStats[<=3] can_iface_stats"; }

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
    static MAX_BIT_LEN = 578;
    static MIN_BIT_LEN = 144;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['transfers_tx'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['transfers_rx'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['transfer_errors'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['can_iface_stats'] = new ArrayType(new CompoundType(new uavcan_protocol_CANIfaceStats(), CompoundType.KIND_MESSAGE), ArrayType.MODE_DYNAMIC, 3);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['transfers_tx'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['transfers_rx'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['transfer_errors'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['can_iface_stats'].items = readArray(data, msg, 3, 2, 144, tao, elementTao => readCompound(data, msg, uavcan_protocol_CANIfaceStats, CompoundType.KIND_MESSAGE, elementTao));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['transfers_tx'].pack());
        bits.push(...this.fields['transfers_rx'].pack());
        bits.push(...this.fields['transfer_errors'].pack());
        packArray(bits, this.fields['can_iface_stats'].items, 3, 2, 144, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['transfers_tx'] = this.fields['transfers_tx'].toObj();
        obj['transfers_rx'] = this.fields['transfers_rx'].toObj();
        obj['transfer_errors'] = this.fields['transfer_errors'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 3587106470255878579n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.GetTransportStats\n---\nsaturated uint48 transfers_tx\nsaturated uint48 transfers_rx\nsaturated uint48 transfer_errors\nuavcan.protocol.CANIfaceStats[<=3] can_iface_stats"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['flags'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['flags'] = this.fields['flags'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 7576276335658567397n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.file.EntryType\nsaturated uint8 flags"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['offset'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 40, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['path'] = new CompoundType(new uavcan_protocol_file_Path(), CompoundType.KIND_MESSAGE);
        this.fields['data'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 192);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['offset'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 40, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['path'] = readCompound(data, msg, uavcan_protocol_file_Path, CompoundType.KIND_MESSAGE, false);
        msg.fields['data'].items = readArray(data, msg, 192, 8, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['offset'].pack());
        for (const bit of this.fields['path'].pack(false)) bits.push(bit);
        packArray(bits, this.fields['data'].items, 192, 8, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['offset'] = this.fields['offset'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 15863418458432585077n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.file.Write\nsaturated uint40 offset\nuavcan.protocol.file.Path path\nsaturated uint8[<=192] data\n---\nuavcan.protocol.file.Error error"; }

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
    static MAX_BIT_LEN = 16;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['error'] = new CompoundType(new uavcan_protocol_file_Error(), CompoundType.KIND_MESSAGE);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['error'] = readCompound(data, msg, uavcan_protocol_file_Error, CompoundType.KIND_MESSAGE, tao);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['error'].pack(tao)) bits.push(bit);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 15863418458432585077n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.file.Write\nsaturated uint40 offset\nuavcan.protocol.file.Path path\nsaturated uint8[<=192] data\n---\nuavcan.protocol.file.Error error"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['path'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 200);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['path'].items = readArray(data, msg, 200, 8, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['path'].items, 200, 8, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1346290761431925730n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.file.Path\nsaturated uint8[<=200] path"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['entry_index'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['directory_path'] = new CompoundType(new uavcan_protocol_file_Path(), CompoundType.KIND_MESSAGE);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['entry_index'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['directory_path'] = readCompound(data, msg, uavcan_protocol_file_Path, CompoundType.KIND_MESSAGE, tao);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['entry_index'].pack());
        for (const bit of this.fields['directory_path'].pack(tao)) bits.push(bit);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['entry_index'] = this.fields['entry_index'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14965769766661834372n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.file.GetDirectoryEntryInfo\nsaturated uint32 entry_index\nuavcan.protocol.file.Path directory_path\n---\nuavcan.protocol.file.Error error\nuavcan.protocol.file.EntryType entry_type\nuavcan.protocol.file.Path entry_full_path"; }

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
    static MAX_BIT_LEN = 1632;
    static MIN_BIT_LEN = 24;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['error'] = new CompoundType(new uavcan_protocol_file_Error(), CompoundType.KIND_MESSAGE);
        this.fields['entry_type'] = new CompoundType(new uavcan_protocol_file_EntryType(), CompoundType.KIND_MESSAGE);
        this.fields['entry_full_path'] = new CompoundType(new uavcan_protocol_file_Path(), CompoundType.KIND_MESSAGE);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['error'] = readCompound(data, msg, uavcan_protocol_file_Error, CompoundType.KIND_MESSAGE, false);
        msg.fields['entry_type'] = readCompound(data, msg, uavcan_protocol_file_EntryType, CompoundType.KIND_MESSAGE, false);
        msg.fields['entry_full_path'] = readCompound(data, msg, uavcan_protocol_file_Path, CompoundType.KIND_MESSAGE, tao);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['error'].pack(false)) bits.push(bit);
        for (const bit of this.fields['entry_type'].pack(false)) bits.push(bit);
        for (const bit of this.fields['entry_full_path'].pack(tao)) bits.push(bit);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14965769766661834372n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.file.GetDirectoryEntryInfo\nsaturated uint32 entry_index\nuavcan.protocol.file.Path directory_path\n---\nuavcan.protocol.file.Error error\nuavcan.protocol.file.EntryType entry_type\nuavcan.protocol.file.Path entry_full_path"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['path'] = new CompoundType(new uavcan_protocol_file_Path(), CompoundType.KIND_MESSAGE);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['path'] = readCompound(data, msg, uavcan_protocol_file_Path, CompoundType.KIND_MESSAGE, tao);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['path'].pack(tao)) bits.push(bit);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14968774879728218526n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.file.GetInfo\nuavcan.protocol.file.Path path\n---\nsaturated uint40 size\nuavcan.protocol.file.Error error\nuavcan.protocol.file.EntryType entry_type"; }

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
    static MAX_BIT_LEN = 64;
    static MIN_BIT_LEN = 64;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['size'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 40, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['error'] = new CompoundType(new uavcan_protocol_file_Error(), CompoundType.KIND_MESSAGE);
        this.fields['entry_type'] = new CompoundType(new uavcan_protocol_file_EntryType(), CompoundType.KIND_MESSAGE);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['size'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 40, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['error'] = readCompound(data, msg, uavcan_protocol_file_Error, CompoundType.KIND_MESSAGE, false);
        msg.fields['entry_type'] = readCompound(data, msg, uavcan_protocol_file_EntryType, CompoundType.KIND_MESSAGE, tao);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['size'].pack());
        for (const bit of this.fields['error'].pack(false)) bits.push(bit);
        for (const bit of this.fields['entry_type'].pack(tao)) bits.push(bit);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['size'] = this.fields['size'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14968774879728218526n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.file.GetInfo\nuavcan.protocol.file.Path path\n---\nsaturated uint40 size\nuavcan.protocol.file.Error error\nuavcan.protocol.file.EntryType entry_type"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['path'] = new CompoundType(new uavcan_protocol_file_Path(), CompoundType.KIND_MESSAGE);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['path'] = readCompound(data, msg, uavcan_protocol_file_Path, CompoundType.KIND_MESSAGE, tao);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['path'].pack(tao)) bits.push(bit);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 3970010265244241678n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.file.Delete\nuavcan.protocol.file.Path path\n---\nuavcan.protocol.file.Error error"; }

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
    static MAX_BIT_LEN = 16;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['error'] = new CompoundType(new uavcan_protocol_file_Error(), CompoundType.KIND_MESSAGE);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['error'] = readCompound(data, msg, uavcan_protocol_file_Error, CompoundType.KIND_MESSAGE, tao);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['error'].pack(tao)) bits.push(bit);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 3970010265244241678n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.file.Delete\nuavcan.protocol.file.Path path\n---\nuavcan.protocol.file.Error error"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['value'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['value'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['value'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['value'] = this.fields['value'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 12119311941215694357n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.file.Error\nsaturated int16 value"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['source_node_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['image_file_remote_path'] = new CompoundType(new uavcan_protocol_file_Path(), CompoundType.KIND_MESSAGE);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['source_node_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['image_file_remote_path'] = readCompound(data, msg, uavcan_protocol_file_Path, CompoundType.KIND_MESSAGE, tao);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['source_node_id'].pack());
        for (const bit of this.fields['image_file_remote_path'].pack(tao)) bits.push(bit);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['source_node_id'] = this.fields['source_node_id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 3938600915834185083n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.file.BeginFirmwareUpdate\nsaturated uint8 source_node_id\nuavcan.protocol.file.Path image_file_remote_path\n---\nsaturated uint8 error\nsaturated uint8[<=127] optional_error_message"; }

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
    static CONSTANTS = {'error': {'OK': 0, 'INVALID_MODE': 1, 'IN_PROGRESS': 2, 'UNKNOWN': 255}};
    static MAX_BIT_LEN = 1031;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['error'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['optional_error_message'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 127);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['error'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['optional_error_message'].items = readArray(data, msg, 127, 7, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['error'].pack());
        packArray(bits, this.fields['optional_error_message'].items, 127, 7, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['error'] = this.fields['error'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 3938600915834185083n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.file.BeginFirmwareUpdate\nsaturated uint8 source_node_id\nuavcan.protocol.file.Path image_file_remote_path\n---\nsaturated uint8 error\nsaturated uint8[<=127] optional_error_message"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['offset'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 40, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['path'] = new CompoundType(new uavcan_protocol_file_Path(), CompoundType.KIND_MESSAGE);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['offset'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 40, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['path'] = readCompound(data, msg, uavcan_protocol_file_Path, CompoundType.KIND_MESSAGE, tao);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['offset'].pack());
        for (const bit of this.fields['path'].pack(tao)) bits.push(bit);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['offset'] = this.fields['offset'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1741375446184660133n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.file.Read\nsaturated uint40 offset\nuavcan.protocol.file.Path path\n---\nuavcan.protocol.file.Error error\nsaturated uint8[<=256] data"; }

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
    static MAX_BIT_LEN = 2073;
    static MIN_BIT_LEN = 16;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['error'] = new CompoundType(new uavcan_protocol_file_Error(), CompoundType.KIND_MESSAGE);
        this.fields['data'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 256);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['error'] = readCompound(data, msg, uavcan_protocol_file_Error, CompoundType.KIND_MESSAGE, false);
        msg.fields['data'].items = readArray(data, msg, 256, 9, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['error'].pack(false)) bits.push(bit);
        packArray(bits, this.fields['data'].items, 256, 9, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1741375446184660133n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.file.Read\nsaturated uint40 offset\nuavcan.protocol.file.Path path\n---\nuavcan.protocol.file.Error error\nsaturated uint8[<=256] data"; }

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
        this.fields['node_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['first_part_of_unique_id'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['unique_id'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['node_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['first_part_of_unique_id'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['unique_id'].items = readArray(data, msg, 16, 5, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['node_id'].pack());
        bits.push(...this.fields['first_part_of_unique_id'].pack());
        packArray(bits, this.fields['unique_id'].items, 16, 5, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['node_id'] = this.fields['node_id'].toObj();
        obj['first_part_of_unique_id'] = this.fields['first_part_of_unique_id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 804597484195224896n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.dynamic_node_id.Allocation\nsaturated uint7 node_id\nsaturated bool first_part_of_unique_id\nsaturated uint8[<=16] unique_id"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['term'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['last_log_term'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['last_log_index'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['term'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['last_log_term'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['last_log_index'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['term'].pack());
        bits.push(...this.fields['last_log_term'].pack());
        bits.push(...this.fields['last_log_index'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['term'] = this.fields['term'].toObj();
        obj['last_log_term'] = this.fields['last_log_term'].toObj();
        obj['last_log_index'] = this.fields['last_log_index'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14834302724654588758n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.dynamic_node_id.server.RequestVote\nsaturated uint32 term\nsaturated uint32 last_log_term\nsaturated uint8 last_log_index\n---\nsaturated uint32 term\nsaturated bool vote_granted"; }

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
    static MAX_BIT_LEN = 33;
    static MIN_BIT_LEN = 33;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['term'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['vote_granted'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['term'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['vote_granted'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['term'].pack());
        bits.push(...this.fields['vote_granted'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['term'] = this.fields['term'].toObj();
        obj['vote_granted'] = this.fields['vote_granted'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14834302724654588758n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.dynamic_node_id.server.RequestVote\nsaturated uint32 term\nsaturated uint32 last_log_term\nsaturated uint8 last_log_index\n---\nsaturated uint32 term\nsaturated bool vote_granted"; }

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
        this.fields['configured_cluster_size'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['known_nodes'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 5);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['configured_cluster_size'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['known_nodes'].items = readArray(data, msg, 5, 3, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['configured_cluster_size'].pack());
        packArray(bits, this.fields['known_nodes'].items, 5, 3, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['configured_cluster_size'] = this.fields['configured_cluster_size'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 9375055116856893217n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.dynamic_node_id.server.Discovery\nsaturated uint8 configured_cluster_size\nsaturated uint8[<=5] known_nodes"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['term'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['prev_log_term'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['prev_log_index'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['leader_commit'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['entries'] = new ArrayType(new CompoundType(new uavcan_protocol_dynamic_node_id_server_Entry(), CompoundType.KIND_MESSAGE), ArrayType.MODE_DYNAMIC, 1);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['term'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['prev_log_term'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['prev_log_index'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['leader_commit'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['entries'].items = readArray(data, msg, 1, 1, 168, tao, elementTao => readCompound(data, msg, uavcan_protocol_dynamic_node_id_server_Entry, CompoundType.KIND_MESSAGE, elementTao));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['term'].pack());
        bits.push(...this.fields['prev_log_term'].pack());
        bits.push(...this.fields['prev_log_index'].pack());
        bits.push(...this.fields['leader_commit'].pack());
        packArray(bits, this.fields['entries'].items, 1, 1, 168, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['term'] = this.fields['term'].toObj();
        obj['prev_log_term'] = this.fields['prev_log_term'].toObj();
        obj['prev_log_index'] = this.fields['prev_log_index'].toObj();
        obj['leader_commit'] = this.fields['leader_commit'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1165175699356406994n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.dynamic_node_id.server.AppendEntries\nsaturated uint32 term\nsaturated uint32 prev_log_term\nsaturated uint8 prev_log_index\nsaturated uint8 leader_commit\nuavcan.protocol.dynamic_node_id.server.Entry[<=1] entries\n---\nsaturated uint32 term\nsaturated bool success"; }

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
    static MAX_BIT_LEN = 33;
    static MIN_BIT_LEN = 33;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['term'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['success'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['term'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['success'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['term'].pack());
        bits.push(...this.fields['success'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['term'] = this.fields['term'].toObj();
        obj['success'] = this.fields['success'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1165175699356406994n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.dynamic_node_id.server.AppendEntries\nsaturated uint32 term\nsaturated uint32 prev_log_term\nsaturated uint8 prev_log_index\nsaturated uint8 leader_commit\nuavcan.protocol.dynamic_node_id.server.Entry[<=1] entries\n---\nsaturated uint32 term\nsaturated bool success"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['term'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['unique_id'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 16);
        this.fields['node_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['term'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['unique_id'].items = readArray(data, msg, 16, 0, 8, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        skipBits(data, msg, 1);
        msg.fields['node_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['term'].pack());
        packArray(bits, this.fields['unique_id'].items, 16, 0, 8, false);
        bits.push(...Array(1).fill(0));
        bits.push(...this.fields['node_id'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['term'] = this.fields['term'].toObj();
        obj['unique_id'] = this.fields['unique_id'].toObj(true);
        obj['node_id'] = this.fields['node_id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 9199296706745365954n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.dynamic_node_id.server.Entry\nsaturated uint32 term\nsaturated uint8[16] unique_id\nvoid1\nsaturated uint7 node_id"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['timeout_sec'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['parameter_name'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 92);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['timeout_sec'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['parameter_name'].items = readArray(data, msg, 92, 7, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['timeout_sec'].pack());
        packArray(bits, this.fields['parameter_name'].items, 92, 7, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['timeout_sec'] = this.fields['timeout_sec'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1831522919229142488n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.enumeration.Begin\nsaturated uint16 timeout_sec\nsaturated uint8[<=92] parameter_name\n---\nsaturated uint8 error"; }

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
    static CONSTANTS = {'error': {'ERROR_OK': 0, 'ERROR_INVALID_MODE': 1, 'ERROR_INVALID_PARAMETER': 2, 'ERROR_UNSUPPORTED': 3, 'ERROR_UNKNOWN': 255}};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['error'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['error'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['error'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['error'] = this.fields['error'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1831522919229142488n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.enumeration.Begin\nsaturated uint16 timeout_sec\nsaturated uint8[<=92] parameter_name\n---\nsaturated uint8 error"; }

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
        this.fields['value'] = new CompoundType(new uavcan_protocol_param_NumericValue(), CompoundType.KIND_MESSAGE);
        this.fields['parameter_name'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 92);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        skipBits(data, msg, 6);
        msg.fields['value'] = readCompound(data, msg, uavcan_protocol_param_NumericValue, CompoundType.KIND_MESSAGE, false);
        msg.fields['parameter_name'].items = readArray(data, msg, 92, 7, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...Array(6).fill(0));
        for (const bit of this.fields['value'].pack(false)) bits.push(bit);
        packArray(bits, this.fields['parameter_name'].items, 92, 7, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 17637826261134681659n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.enumeration.Indication\nvoid6\nuavcan.protocol.param.NumericValue value\nsaturated uint8[<=92] parameter_name"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['index'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 13, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['value'] = new CompoundType(new uavcan_protocol_param_Value(), CompoundType.KIND_MESSAGE);
        this.fields['name'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 92);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['index'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 13, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['value'] = readCompound(data, msg, uavcan_protocol_param_Value, CompoundType.KIND_MESSAGE, false);
        msg.fields['name'].items = readArray(data, msg, 92, 7, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['index'].pack());
        for (const bit of this.fields['value'].pack(false)) bits.push(bit);
        packArray(bits, this.fields['name'].items, 92, 7, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['index'] = this.fields['index'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 13245439803563057645n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.param.GetSet\nsaturated uint13 index\nuavcan.protocol.param.Value value\nsaturated uint8[<=92] name\n---\nvoid5\nuavcan.protocol.param.Value value\nvoid5\nuavcan.protocol.param.Value default_value\nvoid6\nuavcan.protocol.param.NumericValue max_value\nvoid6\nuavcan.protocol.param.NumericValue min_value\nsaturated uint8[<=92] name"; }

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
    static MAX_BIT_LEN = 2967;
    static MIN_BIT_LEN = 32;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['value'] = new CompoundType(new uavcan_protocol_param_Value(), CompoundType.KIND_MESSAGE);
        this.fields['default_value'] = new CompoundType(new uavcan_protocol_param_Value(), CompoundType.KIND_MESSAGE);
        this.fields['max_value'] = new CompoundType(new uavcan_protocol_param_NumericValue(), CompoundType.KIND_MESSAGE);
        this.fields['min_value'] = new CompoundType(new uavcan_protocol_param_NumericValue(), CompoundType.KIND_MESSAGE);
        this.fields['name'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 92);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        skipBits(data, msg, 5);
        msg.fields['value'] = readCompound(data, msg, uavcan_protocol_param_Value, CompoundType.KIND_MESSAGE, false);
        skipBits(data, msg, 5);
        msg.fields['default_value'] = readCompound(data, msg, uavcan_protocol_param_Value, CompoundType.KIND_MESSAGE, false);
        skipBits(data, msg, 6);
        msg.fields['max_value'] = readCompound(data, msg, uavcan_protocol_param_NumericValue, CompoundType.KIND_MESSAGE, false);
        skipBits(data, msg, 6);
        msg.fields['min_value'] = readCompound(data, msg, uavcan_protocol_param_NumericValue, CompoundType.KIND_MESSAGE, false);
        msg.fields['name'].items = readArray(data, msg, 92, 7, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...Array(5).fill(0));
        for (const bit of this.fields['value'].pack(false)) bits.push(bit);
        bits.push(...Array(5).fill(0));
        for (const bit of this.fields['default_value'].pack(false)) bits.push(bit);
        bits.push(...Array(6).fill(0));
        for (const bit of this.fields['max_value'].pack(false)) bits.push(bit);
        bits.push(...Array(6).fill(0));
        for (const bit of this.fields['min_value'].pack(false)) bits.push(bit);
        packArray(bits, this.fields['name'].items, 92, 7, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 13245439803563057645n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.param.GetSet\nsaturated uint13 index\nuavcan.protocol.param.Value value\nsaturated uint8[<=92] name\n---\nvoid5\nuavcan.protocol.param.Value value\nvoid5\nuavcan.protocol.param.Value default_value\nvoid6\nuavcan.protocol.param.NumericValue max_value\nvoid6\nuavcan.protocol.param.NumericValue min_value\nsaturated uint8[<=92] name"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 7803909736435507679n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.param.Empty"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = true;
        this.fields = {};
        this.unionFieldIndex = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 3);
        this.unionFields = ["empty", "integer_value", "real_value", "boolean_value", "string_value"];
        this.fields['empty'] = new CompoundType(new uavcan_protocol_param_Empty(), CompoundType.KIND_MESSAGE);
        this.fields['integer_value'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 64, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['real_value'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['boolean_value'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['string_value'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 128);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        const tag = readTag(data, msg, 3);
        msg.unionFieldIndex.value = tag;
        switch (tag) {
            case 0:
                msg.fields['empty'] = readCompound(data, msg, uavcan_protocol_param_Empty, CompoundType.KIND_MESSAGE, tao);
                break;
            case 1:
                msg.fields['integer_value'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 64, PrimitiveType.CAST_MODE_SATURATED);
                break;
            case 2:
                msg.fields['real_value'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
                break;
            case 3:
                msg.fields['boolean_value'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
                break;
            case 4:
                msg.fields['string_value'].items = readArray(data, msg, 128, 8, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
                break;
            default: throw new RangeError('Invalid union tag');
        }
        const name = msg.unionFields[tag];
        msg.fields = { [name]: msg.fields[name] };
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        const tag = this.unionFieldIndex.value;
        appendTag(bits, tag, 3);
        switch (tag) {
            case 0:
                for (const bit of this.fields['empty'].pack(tao)) bits.push(bit);
                break;
            case 1:
                bits.push(...this.fields['integer_value'].pack());
                break;
            case 2:
                bits.push(...this.fields['real_value'].pack());
                break;
            case 3:
                bits.push(...this.fields['boolean_value'].pack());
                break;
            case 4:
                packArray(bits, this.fields['string_value'].items, 128, 8, 8, tao);
                break;
            default: throw new RangeError('Invalid union tag');
        }
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        const name = this.unionFields[this.unionFieldIndex.value];
        obj[name] = this.fields[name].toObj(name !== 'name' && name !== 'text');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14112433247592579233n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.param.Value\n@union\nuavcan.protocol.param.Empty empty\nsaturated int64 integer_value\nsaturated float32 real_value\nsaturated uint8 boolean_value\nsaturated uint8[<=128] string_value"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = true;
        this.fields = {};
        this.unionFieldIndex = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 2);
        this.unionFields = ["empty", "integer_value", "real_value"];
        this.fields['empty'] = new CompoundType(new uavcan_protocol_param_Empty(), CompoundType.KIND_MESSAGE);
        this.fields['integer_value'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 64, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['real_value'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        const tag = readTag(data, msg, 2);
        msg.unionFieldIndex.value = tag;
        switch (tag) {
            case 0:
                msg.fields['empty'] = readCompound(data, msg, uavcan_protocol_param_Empty, CompoundType.KIND_MESSAGE, tao);
                break;
            case 1:
                msg.fields['integer_value'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 64, PrimitiveType.CAST_MODE_SATURATED);
                break;
            case 2:
                msg.fields['real_value'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
                break;
            default: throw new RangeError('Invalid union tag');
        }
        const name = msg.unionFields[tag];
        msg.fields = { [name]: msg.fields[name] };
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        const tag = this.unionFieldIndex.value;
        appendTag(bits, tag, 2);
        switch (tag) {
            case 0:
                for (const bit of this.fields['empty'].pack(tao)) bits.push(bit);
                break;
            case 1:
                bits.push(...this.fields['integer_value'].pack());
                break;
            case 2:
                bits.push(...this.fields['real_value'].pack());
                break;
            default: throw new RangeError('Invalid union tag');
        }
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        const name = this.unionFields[this.unionFieldIndex.value];
        obj[name] = this.fields[name].toObj(name !== 'name' && name !== 'text');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1306869236855828508n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.param.NumericValue\n@union\nuavcan.protocol.param.Empty empty\nsaturated int64 integer_value\nsaturated float32 real_value"; }

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
    static CONSTANTS = {'opcode': {'SAVE': 0, 'ERASE': 1}};
    static MAX_BIT_LEN = 56;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['opcode'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['argument'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['opcode'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['argument'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['opcode'].pack());
        bits.push(...this.fields['argument'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['opcode'] = this.fields['opcode'].toObj();
        obj['argument'] = this.fields['argument'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 4256775510155711181n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.param.ExecuteOpcode\nsaturated uint8 opcode\nsaturated int48 argument\n---\nsaturated int48 argument\nsaturated bool ok"; }

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
    static MAX_BIT_LEN = 49;
    static MIN_BIT_LEN = 49;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['argument'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['ok'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['argument'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 48, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['ok'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['argument'].pack());
        bits.push(...this.fields['ok'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['argument'] = this.fields['argument'].toObj();
        obj['ok'] = this.fields['ok'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 4256775510155711181n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.param.ExecuteOpcode\nsaturated uint8 opcode\nsaturated int48 argument\n---\nsaturated int48 argument\nsaturated bool ok"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['value'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['value'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['value'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['value'] = this.fields['value'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 8150373215073936198n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.debug.LogLevel\nsaturated uint3 value"; }

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
        this.fields['value'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['key'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 58);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['value'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['key'].items = readArray(data, msg, 58, 6, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['value'].pack());
        packArray(bits, this.fields['key'].items, 58, 6, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['value'] = this.fields['value'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 16154171993225792224n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.debug.KeyValue\nsaturated float32 value\nsaturated uint8[<=58] key"; }

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
        this.fields['level'] = new CompoundType(new uavcan_protocol_debug_LogLevel(), CompoundType.KIND_MESSAGE);
        this.fields['source'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 31);
        this.fields['text'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 90);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['level'] = readCompound(data, msg, uavcan_protocol_debug_LogLevel, CompoundType.KIND_MESSAGE, false);
        msg.fields['source'].items = readArray(data, msg, 31, 5, 8, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['text'].items = readArray(data, msg, 90, 7, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['level'].pack(false)) bits.push(bit);
        packArray(bits, this.fields['source'].items, 31, 5, 8, false);
        packArray(bits, this.fields['text'].items, 90, 7, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 16827184855661372090n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.protocol.debug.LogMessage\nuavcan.protocol.debug.LogLevel level\nsaturated uint8[<=31] source\nsaturated uint8[<=90] text"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['protocol'] = new CompoundType(new uavcan_tunnel_Protocol(), CompoundType.KIND_MESSAGE);
        this.fields['channel_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['buffer'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 60);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['protocol'] = readCompound(data, msg, uavcan_tunnel_Protocol, CompoundType.KIND_MESSAGE, false);
        msg.fields['channel_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['buffer'].items = readArray(data, msg, 60, 6, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['protocol'].pack(false)) bits.push(bit);
        bits.push(...this.fields['channel_id'].pack());
        packArray(bits, this.fields['buffer'].items, 60, 6, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['protocol'] = this.fields['protocol'].toObj();
        obj['channel_id'] = this.fields['channel_id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 10919649790537264277n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.tunnel.Call\nuavcan.tunnel.Protocol protocol\nsaturated uint8 channel_id\nsaturated uint8[<=60] buffer\n---\nsaturated uint8[<=60] buffer"; }

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
    static MAX_BIT_LEN = 486;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['buffer'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 60);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['buffer'].items = readArray(data, msg, 60, 6, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['buffer'].items, 60, 6, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 10919649790537264277n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.tunnel.Call\nuavcan.tunnel.Protocol protocol\nsaturated uint8 channel_id\nsaturated uint8[<=60] buffer\n---\nsaturated uint8[<=60] buffer"; }

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
        this.fields['channel_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['baud'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['options'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 24, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['channel_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['baud'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['options'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 24, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['channel_id'].pack());
        bits.push(...this.fields['baud'].pack());
        bits.push(...this.fields['options'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['channel_id'] = this.fields['channel_id'].toObj();
        obj['baud'] = this.fields['baud'].toObj();
        obj['options'] = this.fields['options'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 4771470135862919853n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.tunnel.SerialConfig\nsaturated uint8 channel_id\nsaturated uint32 baud\nsaturated uint24 options"; }

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
        this.fields['protocol'] = new CompoundType(new uavcan_tunnel_Protocol(), CompoundType.KIND_MESSAGE);
        this.fields['channel_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['buffer'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 60);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['protocol'] = readCompound(data, msg, uavcan_tunnel_Protocol, CompoundType.KIND_MESSAGE, false);
        msg.fields['channel_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['buffer'].items = readArray(data, msg, 60, 6, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['protocol'].pack(false)) bits.push(bit);
        bits.push(...this.fields['channel_id'].pack());
        packArray(bits, this.fields['buffer'].items, 60, 6, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['protocol'] = this.fields['protocol'].toObj();
        obj['channel_id'] = this.fields['channel_id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 4134594249935497919n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.tunnel.Broadcast\nuavcan.tunnel.Protocol protocol\nsaturated uint8 channel_id\nsaturated uint8[<=60] buffer"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['protocol'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['protocol'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['protocol'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['protocol'] = this.fields['protocol'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 11774459175928729161n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.tunnel.Protocol\nsaturated uint8 protocol"; }

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
        this.fields['protocol'] = new CompoundType(new uavcan_tunnel_Protocol(), CompoundType.KIND_MESSAGE);
        this.fields['target_node'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['serial_id'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['options'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 4, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['baudrate'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 24, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['buffer'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 120);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['protocol'] = readCompound(data, msg, uavcan_tunnel_Protocol, CompoundType.KIND_MESSAGE, false);
        msg.fields['target_node'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['serial_id'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['options'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 4, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['baudrate'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 24, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['buffer'].items = readArray(data, msg, 120, 7, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['protocol'].pack(false)) bits.push(bit);
        bits.push(...this.fields['target_node'].pack());
        bits.push(...this.fields['serial_id'].pack());
        bits.push(...this.fields['options'].pack());
        bits.push(...this.fields['baudrate'].pack());
        packArray(bits, this.fields['buffer'].items, 120, 7, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['protocol'] = this.fields['protocol'].toObj();
        obj['target_node'] = this.fields['target_node'].toObj();
        obj['serial_id'] = this.fields['serial_id'].toObj();
        obj['options'] = this.fields['options'].toObj();
        obj['baudrate'] = this.fields['baudrate'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 2525327448155218793n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.tunnel.Targetted\nuavcan.tunnel.Protocol protocol\nsaturated uint7 target_node\nsaturated int5 serial_id\nsaturated uint4 options\nsaturated uint24 baudrate\nsaturated uint8[<=120] buffer"; }

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
        this.fields['circuit_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['voltage'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['current'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['error_flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['circuit_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['current'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['error_flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['circuit_id'].pack());
        bits.push(...this.fields['voltage'].pack());
        bits.push(...this.fields['current'].pack());
        bits.push(...this.fields['error_flags'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['circuit_id'] = this.fields['circuit_id'].toObj();
        obj['voltage'] = this.fields['voltage'].toObj();
        obj['current'] = this.fields['current'].toObj();
        obj['error_flags'] = this.fields['error_flags'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 9445125102705156373n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.power.CircuitStatus\nsaturated uint16 circuit_id\nsaturated float16 voltage\nsaturated float16 current\nsaturated uint8 error_flags"; }

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
        this.fields['hours_to_empty_at_10sec_avg_power'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['hours_to_empty_at_10sec_avg_power_variance'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['external_power_available'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['remaining_energy_pct'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['remaining_energy_pct_stdev'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['hours_to_empty_at_10sec_avg_power'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['hours_to_empty_at_10sec_avg_power_variance'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['external_power_available'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['remaining_energy_pct'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['remaining_energy_pct_stdev'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['hours_to_empty_at_10sec_avg_power'].pack());
        bits.push(...this.fields['hours_to_empty_at_10sec_avg_power_variance'].pack());
        bits.push(...this.fields['external_power_available'].pack());
        bits.push(...this.fields['remaining_energy_pct'].pack());
        bits.push(...this.fields['remaining_energy_pct_stdev'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['hours_to_empty_at_10sec_avg_power'] = this.fields['hours_to_empty_at_10sec_avg_power'].toObj();
        obj['hours_to_empty_at_10sec_avg_power_variance'] = this.fields['hours_to_empty_at_10sec_avg_power_variance'].toObj();
        obj['external_power_available'] = this.fields['external_power_available'].toObj();
        obj['remaining_energy_pct'] = this.fields['remaining_energy_pct'].toObj();
        obj['remaining_energy_pct_stdev'] = this.fields['remaining_energy_pct_stdev'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 13519894543422813312n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.power.PrimaryPowerSupplyStatus\nsaturated float16 hours_to_empty_at_10sec_avg_power\nsaturated float16 hours_to_empty_at_10sec_avg_power_variance\nsaturated bool external_power_available\nsaturated uint7 remaining_energy_pct\nsaturated uint7 remaining_energy_pct_stdev"; }

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
        this.fields['temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['voltage'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['current'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['average_power_10sec'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['remaining_capacity_wh'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['full_charge_capacity_wh'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['hours_to_full_charge'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['status_flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 11, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['state_of_health_pct'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['state_of_charge_pct'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['state_of_charge_pct_stdev'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['battery_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['model_instance_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['model_name'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 31);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['current'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['average_power_10sec'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['remaining_capacity_wh'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['full_charge_capacity_wh'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['hours_to_full_charge'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status_flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 11, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['state_of_health_pct'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['state_of_charge_pct'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['state_of_charge_pct_stdev'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['battery_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['model_instance_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['model_name'].items = readArray(data, msg, 31, 5, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['temperature'].pack());
        bits.push(...this.fields['voltage'].pack());
        bits.push(...this.fields['current'].pack());
        bits.push(...this.fields['average_power_10sec'].pack());
        bits.push(...this.fields['remaining_capacity_wh'].pack());
        bits.push(...this.fields['full_charge_capacity_wh'].pack());
        bits.push(...this.fields['hours_to_full_charge'].pack());
        bits.push(...this.fields['status_flags'].pack());
        bits.push(...this.fields['state_of_health_pct'].pack());
        bits.push(...this.fields['state_of_charge_pct'].pack());
        bits.push(...this.fields['state_of_charge_pct_stdev'].pack());
        bits.push(...this.fields['battery_id'].pack());
        bits.push(...this.fields['model_instance_id'].pack());
        packArray(bits, this.fields['model_name'].items, 31, 5, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['temperature'] = this.fields['temperature'].toObj();
        obj['voltage'] = this.fields['voltage'].toObj();
        obj['current'] = this.fields['current'].toObj();
        obj['average_power_10sec'] = this.fields['average_power_10sec'].toObj();
        obj['remaining_capacity_wh'] = this.fields['remaining_capacity_wh'].toObj();
        obj['full_charge_capacity_wh'] = this.fields['full_charge_capacity_wh'].toObj();
        obj['hours_to_full_charge'] = this.fields['hours_to_full_charge'].toObj();
        obj['status_flags'] = this.fields['status_flags'].toObj();
        obj['state_of_health_pct'] = this.fields['state_of_health_pct'].toObj();
        obj['state_of_charge_pct'] = this.fields['state_of_charge_pct'].toObj();
        obj['state_of_charge_pct_stdev'] = this.fields['state_of_charge_pct_stdev'].toObj();
        obj['battery_id'] = this.fields['battery_id'].toObj();
        obj['model_instance_id'] = this.fields['model_instance_id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 2638025626274044262n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.power.BatteryInfo\nsaturated float16 temperature\nsaturated float16 voltage\nsaturated float16 current\nsaturated float16 average_power_10sec\nsaturated float16 remaining_capacity_wh\nsaturated float16 full_charge_capacity_wh\nsaturated float16 hours_to_full_charge\nsaturated uint11 status_flags\nsaturated uint7 state_of_health_pct\nsaturated uint7 state_of_charge_pct\nsaturated uint7 state_of_charge_pct_stdev\nsaturated uint8 battery_id\nsaturated uint32 model_instance_id\nsaturated uint8[<=31] model_name"; }

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
        this.fields['sensor_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['magnetic_field_ga'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['magnetic_field_covariance'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 9);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['sensor_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['magnetic_field_ga'].items = readArray(data, msg, 3, 0, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['magnetic_field_covariance'].items = readArray(data, msg, 9, 4, 16, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['sensor_id'].pack());
        packArray(bits, this.fields['magnetic_field_ga'].items, 3, 0, 16, false);
        packArray(bits, this.fields['magnetic_field_covariance'].items, 9, 4, 16, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['sensor_id'] = this.fields['sensor_id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 13162909297701562750n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.ahrs.MagneticFieldStrength2\nsaturated uint8 sensor_id\nsaturated float16[3] magnetic_field_ga\nsaturated float16[<=9] magnetic_field_covariance"; }

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
        this.fields['timestamp'] = new CompoundType(new uavcan_Timestamp(), CompoundType.KIND_MESSAGE);
        this.fields['integration_interval'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rate_gyro_latest'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['rate_gyro_integral'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['accelerometer_latest'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['accelerometer_integral'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['covariance'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 36);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['timestamp'] = readCompound(data, msg, uavcan_Timestamp, CompoundType.KIND_MESSAGE, false);
        msg.fields['integration_interval'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rate_gyro_latest'].items = readArray(data, msg, 3, 0, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['rate_gyro_integral'].items = readArray(data, msg, 3, 0, 32, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['accelerometer_latest'].items = readArray(data, msg, 3, 0, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['accelerometer_integral'].items = readArray(data, msg, 3, 0, 32, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['covariance'].items = readArray(data, msg, 36, 6, 16, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['timestamp'].pack(false)) bits.push(bit);
        bits.push(...this.fields['integration_interval'].pack());
        packArray(bits, this.fields['rate_gyro_latest'].items, 3, 0, 16, false);
        packArray(bits, this.fields['rate_gyro_integral'].items, 3, 0, 32, false);
        packArray(bits, this.fields['accelerometer_latest'].items, 3, 0, 16, false);
        packArray(bits, this.fields['accelerometer_integral'].items, 3, 0, 32, false);
        packArray(bits, this.fields['covariance'].items, 36, 6, 16, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['integration_interval'] = this.fields['integration_interval'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 13121026040351855568n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.ahrs.RawIMU\nuavcan.Timestamp timestamp\nsaturated float32 integration_interval\nsaturated float16[3] rate_gyro_latest\nsaturated float32[3] rate_gyro_integral\nsaturated float16[3] accelerometer_latest\nsaturated float32[3] accelerometer_integral\nsaturated float16[<=36] covariance"; }

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
        this.fields['timestamp'] = new CompoundType(new uavcan_Timestamp(), CompoundType.KIND_MESSAGE);
        this.fields['orientation_xyzw'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 4);
        this.fields['orientation_covariance'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 9);
        this.fields['angular_velocity'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['angular_velocity_covariance'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 9);
        this.fields['linear_acceleration'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['linear_acceleration_covariance'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 9);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['timestamp'] = readCompound(data, msg, uavcan_Timestamp, CompoundType.KIND_MESSAGE, false);
        msg.fields['orientation_xyzw'].items = readArray(data, msg, 4, 0, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        skipBits(data, msg, 4);
        msg.fields['orientation_covariance'].items = readArray(data, msg, 9, 4, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['angular_velocity'].items = readArray(data, msg, 3, 0, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        skipBits(data, msg, 4);
        msg.fields['angular_velocity_covariance'].items = readArray(data, msg, 9, 4, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['linear_acceleration'].items = readArray(data, msg, 3, 0, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['linear_acceleration_covariance'].items = readArray(data, msg, 9, 4, 16, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['timestamp'].pack(false)) bits.push(bit);
        packArray(bits, this.fields['orientation_xyzw'].items, 4, 0, 16, false);
        bits.push(...Array(4).fill(0));
        packArray(bits, this.fields['orientation_covariance'].items, 9, 4, 16, false);
        packArray(bits, this.fields['angular_velocity'].items, 3, 0, 16, false);
        bits.push(...Array(4).fill(0));
        packArray(bits, this.fields['angular_velocity_covariance'].items, 9, 4, 16, false);
        packArray(bits, this.fields['linear_acceleration'].items, 3, 0, 16, false);
        packArray(bits, this.fields['linear_acceleration_covariance'].items, 9, 4, 16, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 15295196622450885084n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.ahrs.Solution\nuavcan.Timestamp timestamp\nsaturated float16[4] orientation_xyzw\nvoid4\nsaturated float16[<=9] orientation_covariance\nsaturated float16[3] angular_velocity\nvoid4\nsaturated float16[<=9] angular_velocity_covariance\nsaturated float16[3] linear_acceleration\nsaturated float16[<=9] linear_acceleration_covariance"; }

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
        this.fields['magnetic_field_ga'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['magnetic_field_covariance'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 9);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['magnetic_field_ga'].items = readArray(data, msg, 3, 0, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['magnetic_field_covariance'].items = readArray(data, msg, 9, 4, 16, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['magnetic_field_ga'].items, 3, 0, 16, false);
        packArray(bits, this.fields['magnetic_field_covariance'].items, 9, 4, 16, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 16332256397172130546n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.ahrs.MagneticFieldStrength\nsaturated float16[3] magnetic_field_ga\nsaturated float16[<=9] magnetic_field_covariance"; }

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
        this.fields['cmd'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 14, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 20);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['cmd'].items = readArray(data, msg, 20, 5, 14, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 14, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['cmd'].items, 20, 5, 14, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 2413749663806821661n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.esc.RawCommand\nsaturated int14[<=20] cmd"; }

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
        this.fields['rpm'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 18, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 20);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['rpm'].items = readArray(data, msg, 20, 5, 18, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 18, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['rpm'].items, 20, 5, 18, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14848261740205434635n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.esc.RPMCommand\nsaturated int18[<=20] rpm"; }

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
        this.fields['input_pct'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['output_pct'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['motor_temperature_degC'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 9, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['motor_angle'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 9, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['status_flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 19, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_index'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['input_pct'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['output_pct'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['motor_temperature_degC'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 9, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['motor_angle'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 9, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status_flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 19, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_index'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['input_pct'].pack());
        bits.push(...this.fields['output_pct'].pack());
        bits.push(...this.fields['motor_temperature_degC'].pack());
        bits.push(...this.fields['motor_angle'].pack());
        bits.push(...this.fields['status_flags'].pack());
        bits.push(...this.fields['esc_index'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['input_pct'] = this.fields['input_pct'].toObj();
        obj['output_pct'] = this.fields['output_pct'].toObj();
        obj['motor_temperature_degC'] = this.fields['motor_temperature_degC'].toObj();
        obj['motor_angle'] = this.fields['motor_angle'].toObj();
        obj['status_flags'] = this.fields['status_flags'].toObj();
        obj['esc_index'] = this.fields['esc_index'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 206075126374338268n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.esc.StatusExtended\nsaturated uint7 input_pct\nsaturated uint7 output_pct\nsaturated int9 motor_temperature_degC\nsaturated uint9 motor_angle\nsaturated uint19 status_flags\nsaturated uint5 esc_index"; }

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
        this.fields['error_count'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['voltage'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['current'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rpm'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 18, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['power_rating_pct'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_index'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['error_count'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['current'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rpm'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 18, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['power_rating_pct'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_index'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['error_count'].pack());
        bits.push(...this.fields['voltage'].pack());
        bits.push(...this.fields['current'].pack());
        bits.push(...this.fields['temperature'].pack());
        bits.push(...this.fields['rpm'].pack());
        bits.push(...this.fields['power_rating_pct'].pack());
        bits.push(...this.fields['esc_index'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['error_count'] = this.fields['error_count'].toObj();
        obj['voltage'] = this.fields['voltage'].toObj();
        obj['current'] = this.fields['current'].toObj();
        obj['temperature'] = this.fields['temperature'].toObj();
        obj['rpm'] = this.fields['rpm'].toObj();
        obj['power_rating_pct'] = this.fields['power_rating_pct'].toObj();
        obj['esc_index'] = this.fields['esc_index'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 12227036243858010708n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.esc.Status\nsaturated uint32 error_count\nsaturated float16 voltage\nsaturated float16 current\nsaturated float16 temperature\nsaturated int18 rpm\nsaturated uint7 power_rating_pct\nsaturated uint5 esc_index"; }

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
        this.fields['timestamp'] = new CompoundType(new uavcan_Timestamp(), CompoundType.KIND_MESSAGE);
        this.fields['sensor_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['beam_orientation_in_body_frame'] = new CompoundType(new uavcan_CoarseOrientation(), CompoundType.KIND_MESSAGE);
        this.fields['field_of_view'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['sensor_type'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['reading_type'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['range'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['timestamp'] = readCompound(data, msg, uavcan_Timestamp, CompoundType.KIND_MESSAGE, false);
        msg.fields['sensor_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['beam_orientation_in_body_frame'] = readCompound(data, msg, uavcan_CoarseOrientation, CompoundType.KIND_MESSAGE, false);
        msg.fields['field_of_view'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sensor_type'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['reading_type'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['range'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['timestamp'].pack(false)) bits.push(bit);
        bits.push(...this.fields['sensor_id'].pack());
        for (const bit of this.fields['beam_orientation_in_body_frame'].pack(false)) bits.push(bit);
        bits.push(...this.fields['field_of_view'].pack());
        bits.push(...this.fields['sensor_type'].pack());
        bits.push(...this.fields['reading_type'].pack());
        bits.push(...this.fields['range'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['sensor_id'] = this.fields['sensor_id'].toObj();
        obj['beam_orientation_in_body_frame'] = this.fields['beam_orientation_in_body_frame'].toObj();
        obj['field_of_view'] = this.fields['field_of_view'].toObj();
        obj['sensor_type'] = this.fields['sensor_type'].toObj();
        obj['reading_type'] = this.fields['reading_type'].toObj();
        obj['range'] = this.fields['range'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 2861650500670899712n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.range_sensor.Measurement\nuavcan.Timestamp timestamp\nsaturated uint8 sensor_id\nuavcan.CoarseOrientation beam_orientation_in_body_frame\nsaturated float16 field_of_view\nsaturated uint5 sensor_type\nsaturated uint3 reading_type\nsaturated float16 range"; }

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
        this.fields['hardpoint_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['payload_weight'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['payload_weight_variance'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['status'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['hardpoint_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['payload_weight'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['payload_weight_variance'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['hardpoint_id'].pack());
        bits.push(...this.fields['payload_weight'].pack());
        bits.push(...this.fields['payload_weight_variance'].pack());
        bits.push(...this.fields['status'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['hardpoint_id'] = this.fields['hardpoint_id'].toObj();
        obj['payload_weight'] = this.fields['payload_weight'].toObj();
        obj['payload_weight_variance'] = this.fields['payload_weight_variance'].toObj();
        obj['status'] = this.fields['status'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 7082563099858124162n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.hardpoint.Status\nsaturated uint8 hardpoint_id\nsaturated float16 payload_weight\nsaturated float16 payload_weight_variance\nsaturated uint16 status"; }

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
        this.fields['hardpoint_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['command'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['hardpoint_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['command'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['hardpoint_id'].pack());
        bits.push(...this.fields['command'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['hardpoint_id'] = this.fields['hardpoint_id'].toObj();
        obj['command'] = this.fields['command'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 11646368175549592661n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.hardpoint.Command\nsaturated uint8 hardpoint_id\nsaturated uint16 command"; }

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
        this.fields['gimbal_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['mode'] = new CompoundType(new uavcan_equipment_camera_gimbal_Mode(), CompoundType.KIND_MESSAGE);
        this.fields['quaternion_xyzw'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 4);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['gimbal_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['mode'] = readCompound(data, msg, uavcan_equipment_camera_gimbal_Mode, CompoundType.KIND_MESSAGE, false);
        msg.fields['quaternion_xyzw'].items = readArray(data, msg, 4, 0, 16, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['gimbal_id'].pack());
        for (const bit of this.fields['mode'].pack(false)) bits.push(bit);
        packArray(bits, this.fields['quaternion_xyzw'].items, 4, 0, 16, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['gimbal_id'] = this.fields['gimbal_id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 3155946750461293917n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.camera_gimbal.AngularCommand\nsaturated uint8 gimbal_id\nuavcan.equipment.camera_gimbal.Mode mode\nsaturated float16[4] quaternion_xyzw"; }

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
        this.fields['gimbal_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['mode'] = new CompoundType(new uavcan_equipment_camera_gimbal_Mode(), CompoundType.KIND_MESSAGE);
        this.fields['longitude_deg_1e7'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['latitude_deg_1e7'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['height_cm'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 22, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['height_reference'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 2, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['gimbal_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['mode'] = readCompound(data, msg, uavcan_equipment_camera_gimbal_Mode, CompoundType.KIND_MESSAGE, false);
        msg.fields['longitude_deg_1e7'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['latitude_deg_1e7'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_cm'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 22, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_reference'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 2, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['gimbal_id'].pack());
        for (const bit of this.fields['mode'].pack(false)) bits.push(bit);
        bits.push(...this.fields['longitude_deg_1e7'].pack());
        bits.push(...this.fields['latitude_deg_1e7'].pack());
        bits.push(...this.fields['height_cm'].pack());
        bits.push(...this.fields['height_reference'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['gimbal_id'] = this.fields['gimbal_id'].toObj();
        obj['mode'] = this.fields['mode'].toObj();
        obj['longitude_deg_1e7'] = this.fields['longitude_deg_1e7'].toObj();
        obj['latitude_deg_1e7'] = this.fields['latitude_deg_1e7'].toObj();
        obj['height_cm'] = this.fields['height_cm'].toObj();
        obj['height_reference'] = this.fields['height_reference'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 8864826429421896463n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.camera_gimbal.GEOPOICommand\nsaturated uint8 gimbal_id\nuavcan.equipment.camera_gimbal.Mode mode\nsaturated int32 longitude_deg_1e7\nsaturated int32 latitude_deg_1e7\nsaturated int22 height_cm\nsaturated uint2 height_reference"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['command_mode'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['command_mode'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['command_mode'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['command_mode'] = this.fields['command_mode'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 10450822255048616388n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.camera_gimbal.Mode\nsaturated uint8 command_mode"; }

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
        this.fields['gimbal_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['mode'] = new CompoundType(new uavcan_equipment_camera_gimbal_Mode(), CompoundType.KIND_MESSAGE);
        this.fields['camera_orientation_in_body_frame_xyzw'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 4);
        this.fields['camera_orientation_in_body_frame_covariance'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 9);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['gimbal_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['mode'] = readCompound(data, msg, uavcan_equipment_camera_gimbal_Mode, CompoundType.KIND_MESSAGE, false);
        msg.fields['camera_orientation_in_body_frame_xyzw'].items = readArray(data, msg, 4, 0, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['camera_orientation_in_body_frame_covariance'].items = readArray(data, msg, 9, 4, 16, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['gimbal_id'].pack());
        for (const bit of this.fields['mode'].pack(false)) bits.push(bit);
        packArray(bits, this.fields['camera_orientation_in_body_frame_xyzw'].items, 4, 0, 16, false);
        packArray(bits, this.fields['camera_orientation_in_body_frame_covariance'].items, 9, 4, 16, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['gimbal_id'] = this.fields['gimbal_id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 5177007673870021954n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.camera_gimbal.Status\nsaturated uint8 gimbal_id\nuavcan.equipment.camera_gimbal.Mode mode\nsaturated float16[4] camera_orientation_in_body_frame_xyzw\nsaturated float16[<=9] camera_orientation_in_body_frame_covariance"; }

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
        this.fields['available_fuel_volume_percent'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['available_fuel_volume_cm3'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['fuel_consumption_rate_cm3pm'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['fuel_temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['fuel_tank_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        skipBits(data, msg, 9);
        msg.fields['available_fuel_volume_percent'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['available_fuel_volume_cm3'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['fuel_consumption_rate_cm3pm'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['fuel_temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['fuel_tank_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...Array(9).fill(0));
        bits.push(...this.fields['available_fuel_volume_percent'].pack());
        bits.push(...this.fields['available_fuel_volume_cm3'].pack());
        bits.push(...this.fields['fuel_consumption_rate_cm3pm'].pack());
        bits.push(...this.fields['fuel_temperature'].pack());
        bits.push(...this.fields['fuel_tank_id'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['available_fuel_volume_percent'] = this.fields['available_fuel_volume_percent'].toObj();
        obj['available_fuel_volume_cm3'] = this.fields['available_fuel_volume_cm3'].toObj();
        obj['fuel_consumption_rate_cm3pm'] = this.fields['fuel_consumption_rate_cm3pm'].toObj();
        obj['fuel_temperature'] = this.fields['fuel_temperature'].toObj();
        obj['fuel_tank_id'] = this.fields['fuel_tank_id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 2912503190478408644n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.ice.FuelTankStatus\nvoid9\nsaturated uint7 available_fuel_volume_percent\nsaturated float32 available_fuel_volume_cm3\nsaturated float32 fuel_consumption_rate_cm3pm\nsaturated float16 fuel_temperature\nsaturated uint8 fuel_tank_id"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['ignition_timing_deg'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['injection_time_ms'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['cylinder_head_temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['exhaust_gas_temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['lambda_coefficient'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['ignition_timing_deg'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['injection_time_ms'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['cylinder_head_temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['exhaust_gas_temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['lambda_coefficient'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['ignition_timing_deg'].pack());
        bits.push(...this.fields['injection_time_ms'].pack());
        bits.push(...this.fields['cylinder_head_temperature'].pack());
        bits.push(...this.fields['exhaust_gas_temperature'].pack());
        bits.push(...this.fields['lambda_coefficient'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['ignition_timing_deg'] = this.fields['ignition_timing_deg'].toObj();
        obj['injection_time_ms'] = this.fields['injection_time_ms'].toObj();
        obj['cylinder_head_temperature'] = this.fields['cylinder_head_temperature'].toObj();
        obj['exhaust_gas_temperature'] = this.fields['exhaust_gas_temperature'].toObj();
        obj['lambda_coefficient'] = this.fields['lambda_coefficient'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 15459388824648790891n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.ice.reciprocating.CylinderStatus\nsaturated float16 ignition_timing_deg\nsaturated float16 injection_time_ms\nsaturated float16 cylinder_head_temperature\nsaturated float16 exhaust_gas_temperature\nsaturated float16 lambda_coefficient"; }

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
        this.fields['state'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 2, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 30, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['engine_load_percent'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['engine_speed_rpm'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 17, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['spark_dwell_time_ms'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['atmospheric_pressure_kpa'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['intake_manifold_pressure_kpa'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['intake_manifold_temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['coolant_temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['oil_pressure'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['oil_temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['fuel_pressure'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['fuel_consumption_rate_cm3pm'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['estimated_consumed_fuel_volume_cm3'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['throttle_position_percent'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['ecu_index'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 6, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['spark_plug_usage'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['cylinder_status'] = new ArrayType(new CompoundType(new uavcan_equipment_ice_reciprocating_CylinderStatus(), CompoundType.KIND_MESSAGE), ArrayType.MODE_DYNAMIC, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['state'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 2, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 30, PrimitiveType.CAST_MODE_SATURATED);
        skipBits(data, msg, 16);
        msg.fields['engine_load_percent'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['engine_speed_rpm'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 17, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['spark_dwell_time_ms'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['atmospheric_pressure_kpa'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['intake_manifold_pressure_kpa'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['intake_manifold_temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['coolant_temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['oil_pressure'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['oil_temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['fuel_pressure'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['fuel_consumption_rate_cm3pm'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['estimated_consumed_fuel_volume_cm3'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['throttle_position_percent'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['ecu_index'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 6, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['spark_plug_usage'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['cylinder_status'].items = readArray(data, msg, 16, 5, 80, tao, elementTao => readCompound(data, msg, uavcan_equipment_ice_reciprocating_CylinderStatus, CompoundType.KIND_MESSAGE, elementTao));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['state'].pack());
        bits.push(...this.fields['flags'].pack());
        bits.push(...Array(16).fill(0));
        bits.push(...this.fields['engine_load_percent'].pack());
        bits.push(...this.fields['engine_speed_rpm'].pack());
        bits.push(...this.fields['spark_dwell_time_ms'].pack());
        bits.push(...this.fields['atmospheric_pressure_kpa'].pack());
        bits.push(...this.fields['intake_manifold_pressure_kpa'].pack());
        bits.push(...this.fields['intake_manifold_temperature'].pack());
        bits.push(...this.fields['coolant_temperature'].pack());
        bits.push(...this.fields['oil_pressure'].pack());
        bits.push(...this.fields['oil_temperature'].pack());
        bits.push(...this.fields['fuel_pressure'].pack());
        bits.push(...this.fields['fuel_consumption_rate_cm3pm'].pack());
        bits.push(...this.fields['estimated_consumed_fuel_volume_cm3'].pack());
        bits.push(...this.fields['throttle_position_percent'].pack());
        bits.push(...this.fields['ecu_index'].pack());
        bits.push(...this.fields['spark_plug_usage'].pack());
        packArray(bits, this.fields['cylinder_status'].items, 16, 5, 80, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['state'] = this.fields['state'].toObj();
        obj['flags'] = this.fields['flags'].toObj();
        obj['engine_load_percent'] = this.fields['engine_load_percent'].toObj();
        obj['engine_speed_rpm'] = this.fields['engine_speed_rpm'].toObj();
        obj['spark_dwell_time_ms'] = this.fields['spark_dwell_time_ms'].toObj();
        obj['atmospheric_pressure_kpa'] = this.fields['atmospheric_pressure_kpa'].toObj();
        obj['intake_manifold_pressure_kpa'] = this.fields['intake_manifold_pressure_kpa'].toObj();
        obj['intake_manifold_temperature'] = this.fields['intake_manifold_temperature'].toObj();
        obj['coolant_temperature'] = this.fields['coolant_temperature'].toObj();
        obj['oil_pressure'] = this.fields['oil_pressure'].toObj();
        obj['oil_temperature'] = this.fields['oil_temperature'].toObj();
        obj['fuel_pressure'] = this.fields['fuel_pressure'].toObj();
        obj['fuel_consumption_rate_cm3pm'] = this.fields['fuel_consumption_rate_cm3pm'].toObj();
        obj['estimated_consumed_fuel_volume_cm3'] = this.fields['estimated_consumed_fuel_volume_cm3'].toObj();
        obj['throttle_position_percent'] = this.fields['throttle_position_percent'].toObj();
        obj['ecu_index'] = this.fields['ecu_index'].toObj();
        obj['spark_plug_usage'] = this.fields['spark_plug_usage'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 6081478868053630770n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.ice.reciprocating.Status\nsaturated uint2 state\nsaturated uint30 flags\nvoid16\nsaturated uint7 engine_load_percent\nsaturated uint17 engine_speed_rpm\nsaturated float16 spark_dwell_time_ms\nsaturated float16 atmospheric_pressure_kpa\nsaturated float16 intake_manifold_pressure_kpa\nsaturated float16 intake_manifold_temperature\nsaturated float16 coolant_temperature\nsaturated float16 oil_pressure\nsaturated float16 oil_temperature\nsaturated float16 fuel_pressure\nsaturated float32 fuel_consumption_rate_cm3pm\nsaturated float32 estimated_consumed_fuel_volume_cm3\nsaturated uint7 throttle_position_percent\nsaturated uint6 ecu_index\nsaturated uint3 spark_plug_usage\nuavcan.equipment.ice.reciprocating.CylinderStatus[<=16] cylinder_status"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['light_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['color'] = new CompoundType(new uavcan_equipment_indication_RGB565(), CompoundType.KIND_MESSAGE);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['light_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['color'] = readCompound(data, msg, uavcan_equipment_indication_RGB565, CompoundType.KIND_MESSAGE, tao);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['light_id'].pack());
        for (const bit of this.fields['color'].pack(tao)) bits.push(bit);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['light_id'] = this.fields['light_id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 10690715702310893134n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.indication.SingleLightCommand\nsaturated uint8 light_id\nuavcan.equipment.indication.RGB565 color"; }

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
        this.fields['frequency'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['duration'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['frequency'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['duration'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['frequency'].pack());
        bits.push(...this.fields['duration'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['frequency'] = this.fields['frequency'].toObj();
        obj['duration'] = this.fields['duration'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 13735602825179782482n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.indication.BeepCommand\nsaturated float16 frequency\nsaturated float16 duration"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['red'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['green'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 6, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['blue'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['red'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['green'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 6, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['blue'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['red'].pack());
        bits.push(...this.fields['green'].pack());
        bits.push(...this.fields['blue'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['red'] = this.fields['red'].toObj();
        obj['green'] = this.fields['green'].toObj();
        obj['blue'] = this.fields['blue'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 6388302144240479284n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.indication.RGB565\nsaturated uint5 red\nsaturated uint6 green\nsaturated uint5 blue"; }

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
        this.fields['commands'] = new ArrayType(new CompoundType(new uavcan_equipment_indication_SingleLightCommand(), CompoundType.KIND_MESSAGE), ArrayType.MODE_DYNAMIC, 20);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['commands'].items = readArray(data, msg, 20, 5, 24, tao, elementTao => readCompound(data, msg, uavcan_equipment_indication_SingleLightCommand, CompoundType.KIND_MESSAGE, elementTao));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['commands'].items, 20, 5, 24, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 13337637737717638189n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.indication.LightsCommand\nuavcan.equipment.indication.SingleLightCommand[<=20] commands"; }

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
        this.fields['status'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['status'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['status'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['status'] = this.fields['status'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 9728042880390037507n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.safety.ArmingStatus\nsaturated uint8 status"; }

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
        this.fields['protocol_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['data'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 128);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['protocol_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['data'].items = readArray(data, msg, 128, 8, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['protocol_id'].pack());
        packArray(bits, this.fields['data'].items, 128, 8, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['protocol_id'] = this.fields['protocol_id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 2257995625244595457n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.gnss.RTCMStream\nsaturated uint8 protocol_id\nsaturated uint8[<=128] data"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['velocity_xyz'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['position_xyz_mm'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 36, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['covariance'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 36);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['velocity_xyz'].items = readArray(data, msg, 3, 0, 32, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['position_xyz_mm'].items = readArray(data, msg, 3, 0, 36, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 36, PrimitiveType.CAST_MODE_SATURATED));
        skipBits(data, msg, 6);
        msg.fields['covariance'].items = readArray(data, msg, 36, 6, 16, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['velocity_xyz'].items, 3, 0, 32, false);
        packArray(bits, this.fields['position_xyz_mm'].items, 3, 0, 36, false);
        bits.push(...Array(6).fill(0));
        packArray(bits, this.fields['covariance'].items, 36, 6, 16, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 2640756771087688264n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.gnss.ECEFPositionVelocity\nsaturated float32[3] velocity_xyz\nsaturated int36[3] position_xyz_mm\nvoid6\nsaturated float16[<=36] covariance"; }

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
        this.fields['timestamp'] = new CompoundType(new uavcan_Timestamp(), CompoundType.KIND_MESSAGE);
        this.fields['gnss_timestamp'] = new CompoundType(new uavcan_Timestamp(), CompoundType.KIND_MESSAGE);
        this.fields['gnss_time_standard'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['num_leap_seconds'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['longitude_deg_1e8'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 37, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['latitude_deg_1e8'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 37, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['height_ellipsoid_mm'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 27, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['height_msl_mm'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 27, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['ned_velocity'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['sats_used'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 6, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['status'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 2, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['mode'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 4, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['sub_mode'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 6, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['covariance'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 36);
        this.fields['pdop'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['ecef_position_velocity'] = new ArrayType(new CompoundType(new uavcan_equipment_gnss_ECEFPositionVelocity(), CompoundType.KIND_MESSAGE), ArrayType.MODE_DYNAMIC, 1);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['timestamp'] = readCompound(data, msg, uavcan_Timestamp, CompoundType.KIND_MESSAGE, false);
        msg.fields['gnss_timestamp'] = readCompound(data, msg, uavcan_Timestamp, CompoundType.KIND_MESSAGE, false);
        msg.fields['gnss_time_standard'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        skipBits(data, msg, 13);
        msg.fields['num_leap_seconds'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['longitude_deg_1e8'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 37, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['latitude_deg_1e8'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 37, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_ellipsoid_mm'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 27, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_msl_mm'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 27, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['ned_velocity'].items = readArray(data, msg, 3, 0, 32, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['sats_used'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 6, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 2, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['mode'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 4, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sub_mode'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 6, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['covariance'].items = readArray(data, msg, 36, 6, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['pdop'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['ecef_position_velocity'].items = readArray(data, msg, 1, 1, 210, tao, elementTao => readCompound(data, msg, uavcan_equipment_gnss_ECEFPositionVelocity, CompoundType.KIND_MESSAGE, elementTao));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['timestamp'].pack(false)) bits.push(bit);
        for (const bit of this.fields['gnss_timestamp'].pack(false)) bits.push(bit);
        bits.push(...this.fields['gnss_time_standard'].pack());
        bits.push(...Array(13).fill(0));
        bits.push(...this.fields['num_leap_seconds'].pack());
        bits.push(...this.fields['longitude_deg_1e8'].pack());
        bits.push(...this.fields['latitude_deg_1e8'].pack());
        bits.push(...this.fields['height_ellipsoid_mm'].pack());
        bits.push(...this.fields['height_msl_mm'].pack());
        packArray(bits, this.fields['ned_velocity'].items, 3, 0, 32, false);
        bits.push(...this.fields['sats_used'].pack());
        bits.push(...this.fields['status'].pack());
        bits.push(...this.fields['mode'].pack());
        bits.push(...this.fields['sub_mode'].pack());
        packArray(bits, this.fields['covariance'].items, 36, 6, 16, false);
        bits.push(...this.fields['pdop'].pack());
        packArray(bits, this.fields['ecef_position_velocity'].items, 1, 1, 210, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['gnss_timestamp'] = this.fields['gnss_timestamp'].toObj();
        obj['gnss_time_standard'] = this.fields['gnss_time_standard'].toObj();
        obj['num_leap_seconds'] = this.fields['num_leap_seconds'].toObj();
        obj['longitude_deg_1e8'] = this.fields['longitude_deg_1e8'].toObj();
        obj['latitude_deg_1e8'] = this.fields['latitude_deg_1e8'].toObj();
        obj['height_ellipsoid_mm'] = this.fields['height_ellipsoid_mm'].toObj();
        obj['height_msl_mm'] = this.fields['height_msl_mm'].toObj();
        obj['ned_velocity'] = this.fields['ned_velocity'].toObj(true);
        obj['sats_used'] = this.fields['sats_used'].toObj();
        obj['status'] = this.fields['status'].toObj();
        obj['mode'] = this.fields['mode'].toObj();
        obj['sub_mode'] = this.fields['sub_mode'].toObj();
        obj['covariance'] = this.fields['covariance'].toObj(true);
        obj['pdop'] = this.fields['pdop'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1442546298338884265n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.gnss.Fix2\nuavcan.Timestamp timestamp\nuavcan.Timestamp gnss_timestamp\nsaturated uint3 gnss_time_standard\nvoid13\nsaturated uint8 num_leap_seconds\nsaturated int37 longitude_deg_1e8\nsaturated int37 latitude_deg_1e8\nsaturated int27 height_ellipsoid_mm\nsaturated int27 height_msl_mm\nsaturated float32[3] ned_velocity\nsaturated uint6 sats_used\nsaturated uint2 status\nsaturated uint4 mode\nsaturated uint6 sub_mode\nsaturated float16[<=36] covariance\nsaturated float16 pdop\nuavcan.equipment.gnss.ECEFPositionVelocity[<=1] ecef_position_velocity"; }

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
        this.fields['timestamp'] = new CompoundType(new uavcan_Timestamp(), CompoundType.KIND_MESSAGE);
        this.fields['gnss_timestamp'] = new CompoundType(new uavcan_Timestamp(), CompoundType.KIND_MESSAGE);
        this.fields['gnss_time_standard'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['num_leap_seconds'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['longitude_deg_1e8'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 37, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['latitude_deg_1e8'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 37, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['height_ellipsoid_mm'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 27, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['height_msl_mm'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 27, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['ned_velocity'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['sats_used'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 6, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['status'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 2, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['pdop'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['position_covariance'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 9);
        this.fields['velocity_covariance'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 9);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['timestamp'] = readCompound(data, msg, uavcan_Timestamp, CompoundType.KIND_MESSAGE, false);
        msg.fields['gnss_timestamp'] = readCompound(data, msg, uavcan_Timestamp, CompoundType.KIND_MESSAGE, false);
        msg.fields['gnss_time_standard'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        skipBits(data, msg, 5);
        msg.fields['num_leap_seconds'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['longitude_deg_1e8'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 37, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['latitude_deg_1e8'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 37, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_ellipsoid_mm'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 27, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_msl_mm'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 27, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['ned_velocity'].items = readArray(data, msg, 3, 0, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['sats_used'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 6, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 2, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pdop'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        skipBits(data, msg, 4);
        msg.fields['position_covariance'].items = readArray(data, msg, 9, 4, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['velocity_covariance'].items = readArray(data, msg, 9, 4, 16, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['timestamp'].pack(false)) bits.push(bit);
        for (const bit of this.fields['gnss_timestamp'].pack(false)) bits.push(bit);
        bits.push(...this.fields['gnss_time_standard'].pack());
        bits.push(...Array(5).fill(0));
        bits.push(...this.fields['num_leap_seconds'].pack());
        bits.push(...this.fields['longitude_deg_1e8'].pack());
        bits.push(...this.fields['latitude_deg_1e8'].pack());
        bits.push(...this.fields['height_ellipsoid_mm'].pack());
        bits.push(...this.fields['height_msl_mm'].pack());
        packArray(bits, this.fields['ned_velocity'].items, 3, 0, 16, false);
        bits.push(...this.fields['sats_used'].pack());
        bits.push(...this.fields['status'].pack());
        bits.push(...this.fields['pdop'].pack());
        bits.push(...Array(4).fill(0));
        packArray(bits, this.fields['position_covariance'].items, 9, 4, 16, false);
        packArray(bits, this.fields['velocity_covariance'].items, 9, 4, 16, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['gnss_timestamp'] = this.fields['gnss_timestamp'].toObj();
        obj['gnss_time_standard'] = this.fields['gnss_time_standard'].toObj();
        obj['num_leap_seconds'] = this.fields['num_leap_seconds'].toObj();
        obj['longitude_deg_1e8'] = this.fields['longitude_deg_1e8'].toObj();
        obj['latitude_deg_1e8'] = this.fields['latitude_deg_1e8'].toObj();
        obj['height_ellipsoid_mm'] = this.fields['height_ellipsoid_mm'].toObj();
        obj['height_msl_mm'] = this.fields['height_msl_mm'].toObj();
        obj['ned_velocity'] = this.fields['ned_velocity'].toObj(true);
        obj['sats_used'] = this.fields['sats_used'].toObj();
        obj['status'] = this.fields['status'].toObj();
        obj['pdop'] = this.fields['pdop'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 17081607641574234946n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.gnss.Fix\nuavcan.Timestamp timestamp\nuavcan.Timestamp gnss_timestamp\nsaturated uint3 gnss_time_standard\nvoid5\nsaturated uint8 num_leap_seconds\nsaturated int37 longitude_deg_1e8\nsaturated int37 latitude_deg_1e8\nsaturated int27 height_ellipsoid_mm\nsaturated int27 height_msl_mm\nsaturated float16[3] ned_velocity\nsaturated uint6 sats_used\nsaturated uint2 status\nsaturated float16 pdop\nvoid4\nsaturated float16[<=9] position_covariance\nsaturated float16[<=9] velocity_covariance"; }

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
        this.fields['gdop'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['pdop'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['hdop'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['vdop'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['tdop'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['ndop'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['edop'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['sats_visible'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['sats_used'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 6, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['gdop'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pdop'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['hdop'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['vdop'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tdop'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['ndop'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['edop'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sats_visible'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sats_used'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 6, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['gdop'].pack());
        bits.push(...this.fields['pdop'].pack());
        bits.push(...this.fields['hdop'].pack());
        bits.push(...this.fields['vdop'].pack());
        bits.push(...this.fields['tdop'].pack());
        bits.push(...this.fields['ndop'].pack());
        bits.push(...this.fields['edop'].pack());
        bits.push(...this.fields['sats_visible'].pack());
        bits.push(...this.fields['sats_used'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['gdop'] = this.fields['gdop'].toObj();
        obj['pdop'] = this.fields['pdop'].toObj();
        obj['hdop'] = this.fields['hdop'].toObj();
        obj['vdop'] = this.fields['vdop'].toObj();
        obj['tdop'] = this.fields['tdop'].toObj();
        obj['ndop'] = this.fields['ndop'].toObj();
        obj['edop'] = this.fields['edop'].toObj();
        obj['sats_visible'] = this.fields['sats_visible'].toObj();
        obj['sats_used'] = this.fields['sats_used'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 11234437923272900562n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.gnss.Auxiliary\nsaturated float16 gdop\nsaturated float16 pdop\nsaturated float16 hdop\nsaturated float16 vdop\nsaturated float16 tdop\nsaturated float16 ndop\nsaturated float16 edop\nsaturated uint7 sats_visible\nsaturated uint6 sats_used"; }

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
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['actuator_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['command_type'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['command_value'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['actuator_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['command_type'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['command_value'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['actuator_id'].pack());
        bits.push(...this.fields['command_type'].pack());
        bits.push(...this.fields['command_value'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['actuator_id'] = this.fields['actuator_id'].toObj();
        obj['command_type'] = this.fields['command_type'].toObj();
        obj['command_value'] = this.fields['command_value'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 10203585081262301548n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.actuator.Command\nsaturated uint8 actuator_id\nsaturated uint8 command_type\nsaturated float16 command_value"; }

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
        this.fields['commands'] = new ArrayType(new CompoundType(new uavcan_equipment_actuator_Command(), CompoundType.KIND_MESSAGE), ArrayType.MODE_DYNAMIC, 15);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['commands'].items = readArray(data, msg, 15, 4, 32, tao, elementTao => readCompound(data, msg, uavcan_equipment_actuator_Command, CompoundType.KIND_MESSAGE, elementTao));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['commands'].items, 15, 4, 32, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 2804605963164684704n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.actuator.ArrayCommand\nuavcan.equipment.actuator.Command[<=15] commands"; }

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
        this.fields['actuator_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['position'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['force'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['speed'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['power_rating_pct'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['actuator_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['position'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['force'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['speed'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        skipBits(data, msg, 1);
        msg.fields['power_rating_pct'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['actuator_id'].pack());
        bits.push(...this.fields['position'].pack());
        bits.push(...this.fields['force'].pack());
        bits.push(...this.fields['speed'].pack());
        bits.push(...Array(1).fill(0));
        bits.push(...this.fields['power_rating_pct'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['actuator_id'] = this.fields['actuator_id'].toObj();
        obj['position'] = this.fields['position'].toObj();
        obj['force'] = this.fields['force'].toObj();
        obj['speed'] = this.fields['speed'].toObj();
        obj['power_rating_pct'] = this.fields['power_rating_pct'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 6817247266386078212n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.actuator.Status\nsaturated uint8 actuator_id\nsaturated float16 position\nsaturated float16 force\nsaturated float16 speed\nvoid1\nsaturated uint7 power_rating_pct"; }

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
        this.fields['device_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['error_flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['device_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['error_flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['device_id'].pack());
        bits.push(...this.fields['temperature'].pack());
        bits.push(...this.fields['error_flags'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['device_id'] = this.fields['device_id'].toObj();
        obj['temperature'] = this.fields['temperature'].toObj();
        obj['error_flags'] = this.fields['error_flags'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 8081177542326830278n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.device.Temperature\nsaturated uint16 device_id\nsaturated float16 temperature\nsaturated uint8 error_flags"; }

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
        this.fields['flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['static_pressure'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['differential_pressure'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['static_pressure_sensor_temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['differential_pressure_sensor_temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['static_air_temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['pitot_temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['covariance'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 16);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['static_pressure'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['differential_pressure'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['static_pressure_sensor_temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['differential_pressure_sensor_temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['static_air_temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pitot_temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['covariance'].items = readArray(data, msg, 16, 5, 16, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['flags'].pack());
        bits.push(...this.fields['static_pressure'].pack());
        bits.push(...this.fields['differential_pressure'].pack());
        bits.push(...this.fields['static_pressure_sensor_temperature'].pack());
        bits.push(...this.fields['differential_pressure_sensor_temperature'].pack());
        bits.push(...this.fields['static_air_temperature'].pack());
        bits.push(...this.fields['pitot_temperature'].pack());
        packArray(bits, this.fields['covariance'].items, 16, 5, 16, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['flags'] = this.fields['flags'].toObj();
        obj['static_pressure'] = this.fields['static_pressure'].toObj();
        obj['differential_pressure'] = this.fields['differential_pressure'].toObj();
        obj['static_pressure_sensor_temperature'] = this.fields['static_pressure_sensor_temperature'].toObj();
        obj['differential_pressure_sensor_temperature'] = this.fields['differential_pressure_sensor_temperature'].toObj();
        obj['static_air_temperature'] = this.fields['static_air_temperature'].toObj();
        obj['pitot_temperature'] = this.fields['pitot_temperature'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14374913366665917914n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.air_data.RawAirData\nsaturated uint8 flags\nsaturated float32 static_pressure\nsaturated float32 differential_pressure\nsaturated float16 static_pressure_sensor_temperature\nsaturated float16 differential_pressure_sensor_temperature\nsaturated float16 static_air_temperature\nsaturated float16 pitot_temperature\nsaturated float16[<=16] covariance"; }

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
        this.fields['static_temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['static_temperature_variance'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['static_temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['static_temperature_variance'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['static_temperature'].pack());
        bits.push(...this.fields['static_temperature_variance'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['static_temperature'] = this.fields['static_temperature'].toObj();
        obj['static_temperature_variance'] = this.fields['static_temperature_variance'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 5271228499856286321n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.air_data.StaticTemperature\nsaturated float16 static_temperature\nsaturated float16 static_temperature_variance"; }

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
        this.fields['static_pressure'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['static_pressure_variance'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['static_pressure'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['static_pressure_variance'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['static_pressure'].pack());
        bits.push(...this.fields['static_pressure_variance'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['static_pressure'] = this.fields['static_pressure'].toObj();
        obj['static_pressure_variance'] = this.fields['static_pressure_variance'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14828036026072418458n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.air_data.StaticPressure\nsaturated float32 static_pressure\nsaturated float16 static_pressure_variance"; }

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
        this.fields['true_airspeed'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['true_airspeed_variance'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['true_airspeed'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['true_airspeed_variance'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['true_airspeed'].pack());
        bits.push(...this.fields['true_airspeed_variance'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['true_airspeed'] = this.fields['true_airspeed'].toObj();
        obj['true_airspeed_variance'] = this.fields['true_airspeed_variance'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 3490124649806802858n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.air_data.TrueAirspeed\nsaturated float16 true_airspeed\nsaturated float16 true_airspeed_variance"; }

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
        this.fields['sideslip_angle'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['sideslip_angle_variance'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['sideslip_angle'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sideslip_angle_variance'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['sideslip_angle'].pack());
        bits.push(...this.fields['sideslip_angle_variance'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['sideslip_angle'] = this.fields['sideslip_angle'].toObj();
        obj['sideslip_angle_variance'] = this.fields['sideslip_angle_variance'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 8883602464661842519n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.air_data.Sideslip\nsaturated float16 sideslip_angle\nsaturated float16 sideslip_angle_variance"; }

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
        this.fields['sensor_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['aoa'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['aoa_variance'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['sensor_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['aoa'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['aoa_variance'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['sensor_id'].pack());
        bits.push(...this.fields['aoa'].pack());
        bits.push(...this.fields['aoa_variance'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['sensor_id'] = this.fields['sensor_id'].toObj();
        obj['aoa'] = this.fields['aoa'].toObj();
        obj['aoa_variance'] = this.fields['aoa_variance'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 15371133246536075086n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.air_data.AngleOfAttack\nsaturated uint8 sensor_id\nsaturated float16 aoa\nsaturated float16 aoa_variance"; }

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
        this.fields['indicated_airspeed'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['indicated_airspeed_variance'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['indicated_airspeed'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['indicated_airspeed_variance'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['indicated_airspeed'].pack());
        bits.push(...this.fields['indicated_airspeed_variance'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['indicated_airspeed'] = this.fields['indicated_airspeed'].toObj();
        obj['indicated_airspeed_variance'] = this.fields['indicated_airspeed_variance'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 727492792652698719n; }
    getDsdlSignatureSourceDefinition() { return "uavcan.equipment.air_data.IndicatedAirspeed\nsaturated float16 indicated_airspeed\nsaturated float16 indicated_airspeed_variance"; }

    static getDataTypeSignature() {
        return 727492792652698719n;
    }

    getDataTypeSignature() {
        return 727492792652698719n;
    }

};
module.exports.uavcan_equipment_air_data_IndicatedAirspeed = uavcan_equipment_air_data_IndicatedAirspeed;

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
        this.fields['temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['humidity'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['humidity'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['temperature'].pack());
        bits.push(...this.fields['humidity'].pack());
        bits.push(...this.fields['id'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['temperature'] = this.fields['temperature'].toObj();
        obj['humidity'] = this.fields['humidity'].toObj();
        obj['id'] = this.fields['id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14894257777885144040n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.sensors.hygrometer.Hygrometer\nsaturated float16 temperature\nsaturated float16 humidity\nsaturated uint8 id"; }

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
        this.fields['sensor_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['magnetic_field_ga'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['sensor_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['magnetic_field_ga'].items = readArray(data, msg, 3, 0, 32, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['sensor_id'].pack());
        packArray(bits, this.fields['magnetic_field_ga'].items, 3, 0, 32, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['sensor_id'] = this.fields['sensor_id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 3482386300689983599n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.sensors.magnetometer.MagneticFieldStrengthHiRes\nsaturated uint8 sensor_id\nsaturated float32[3] magnetic_field_ga"; }

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
        this.fields['sensor_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rpm'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['sensor_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rpm'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['sensor_id'].pack());
        bits.push(...this.fields['flags'].pack());
        bits.push(...this.fields['rpm'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['sensor_id'] = this.fields['sensor_id'].toObj();
        obj['flags'] = this.fields['flags'].toObj();
        obj['rpm'] = this.fields['rpm'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1443130729267787495n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.sensors.rpm.RPM\nsaturated uint8 sensor_id\nsaturated uint16 flags\nsaturated float32 rpm"; }

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
    static CONSTANTS = {'status': {'QUALITY_VALID': 1, 'FAILSAFE': 2, 'QUALITY_TYPE': 28}, 'quality': {'TYPE_RSSI': 0, 'TYPE_LQ_ACTIVE_ANTENNA': 4, 'TYPE_RSSI_DBM': 8, 'TYPE_SNR': 12, 'TYPE_TX_POWER': 16}};
    static MAX_BIT_LEN = 418;
    static MIN_BIT_LEN = 28;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['status'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['quality'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 4, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rcin'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 12, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 32);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['status'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['quality'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 4, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rcin'].items = readArray(data, msg, 32, 6, 12, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 12, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['status'].pack());
        bits.push(...this.fields['quality'].pack());
        bits.push(...this.fields['id'].pack());
        packArray(bits, this.fields['rcin'].items, 32, 6, 12, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['status'] = this.fields['status'].toObj();
        obj['quality'] = this.fields['quality'].toObj();
        obj['id'] = this.fields['id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 8580859109587989711n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.sensors.rc.RCInput\nsaturated uint16 status\nsaturated uint8 quality\nsaturated uint4 id\nsaturated uint12[<=32] rcin"; }

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
        this.fields['id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['u8'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 255);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['u8'].items = readArray(data, msg, 255, 8, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['id'].pack());
        packArray(bits, this.fields['u8'].items, 255, 8, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['id'] = this.fields['id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 17052320900244016953n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.protocol.FlexDebug\nsaturated uint16 id\nsaturated uint8[<=255] u8"; }

    static getDataTypeSignature() {
        return 17052320900244016953n;
    }

    getDataTypeSignature() {
        return 17052320900244016953n;
    }

};
module.exports.dronecan_protocol_FlexDebug = dronecan_protocol_FlexDebug;

// JavaScript binding for dronecan.protocol.GlobalTime
// Auto Generated Code, DO NOT MODIFY
const dronecan_protocol_GlobalTime = class {
    static DTID = 344;
    static FULL_NAME = 'dronecan.protocol.GlobalTime';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 56;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['timestamp'] = new CompoundType(new uavcan_Timestamp(), CompoundType.KIND_MESSAGE);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['timestamp'] = readCompound(data, msg, uavcan_Timestamp, CompoundType.KIND_MESSAGE, tao);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['timestamp'].pack(tao)) bits.push(bit);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = dronecan_protocol_GlobalTime.CONSTANTS;
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
        if (!this.unionFieldIndex) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return dronecan_protocol_GlobalTime.DTID;
    }

    get name() {
        return dronecan_protocol_GlobalTime.FULL_NAME;
    }

    get fieldNames() {
        return [
            'timestamp',
        ];
    }

    static sampleMessage() {
        const msg = new dronecan_protocol_GlobalTime();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    getDsdlSignature() { return 13761999526797146364n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.protocol.GlobalTime\nuavcan.Timestamp timestamp"; }

    static getDataTypeSignature() {
        return 11912433625633197875n;
    }

    getDataTypeSignature() {
        return 11912433625633197875n;
    }

};
module.exports.dronecan_protocol_GlobalTime = dronecan_protocol_GlobalTime;

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
        this.fields['interface'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['tx_requests'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['tx_rejected'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['tx_overflow'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['tx_success'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['tx_timedout'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['tx_abort'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rx_received'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rx_overflow'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rx_errors'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['busoff_errors'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['interface'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tx_requests'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tx_rejected'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tx_overflow'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tx_success'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tx_timedout'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tx_abort'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_received'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_overflow'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_errors'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['busoff_errors'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['interface'].pack());
        bits.push(...this.fields['tx_requests'].pack());
        bits.push(...this.fields['tx_rejected'].pack());
        bits.push(...this.fields['tx_overflow'].pack());
        bits.push(...this.fields['tx_success'].pack());
        bits.push(...this.fields['tx_timedout'].pack());
        bits.push(...this.fields['tx_abort'].pack());
        bits.push(...this.fields['rx_received'].pack());
        bits.push(...this.fields['rx_overflow'].pack());
        bits.push(...this.fields['rx_errors'].pack());
        bits.push(...this.fields['busoff_errors'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['interface'] = this.fields['interface'].toObj();
        obj['tx_requests'] = this.fields['tx_requests'].toObj();
        obj['tx_rejected'] = this.fields['tx_rejected'].toObj();
        obj['tx_overflow'] = this.fields['tx_overflow'].toObj();
        obj['tx_success'] = this.fields['tx_success'].toObj();
        obj['tx_timedout'] = this.fields['tx_timedout'].toObj();
        obj['tx_abort'] = this.fields['tx_abort'].toObj();
        obj['rx_received'] = this.fields['rx_received'].toObj();
        obj['rx_overflow'] = this.fields['rx_overflow'].toObj();
        obj['rx_errors'] = this.fields['rx_errors'].toObj();
        obj['busoff_errors'] = this.fields['busoff_errors'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14846130114108013685n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.protocol.CanStats\nsaturated uint8 interface\nsaturated uint32 tx_requests\nsaturated uint16 tx_rejected\nsaturated uint16 tx_overflow\nsaturated uint16 tx_success\nsaturated uint16 tx_timedout\nsaturated uint16 tx_abort\nsaturated uint32 rx_received\nsaturated uint16 rx_overflow\nsaturated uint16 rx_errors\nsaturated uint16 busoff_errors"; }

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
        this.fields['tx_frames'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['tx_errors'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rx_frames'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rx_error_oom'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rx_error_internal'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rx_error_missed_start'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rx_error_wrong_toggle'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rx_error_short_frame'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rx_error_bad_crc'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rx_ignored_wrong_address'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rx_ignored_not_wanted'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rx_ignored_unexpected_tid'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['tx_frames'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tx_errors'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_frames'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_error_oom'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_error_internal'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_error_missed_start'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_error_wrong_toggle'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_error_short_frame'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_error_bad_crc'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_ignored_wrong_address'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_ignored_not_wanted'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rx_ignored_unexpected_tid'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['tx_frames'].pack());
        bits.push(...this.fields['tx_errors'].pack());
        bits.push(...this.fields['rx_frames'].pack());
        bits.push(...this.fields['rx_error_oom'].pack());
        bits.push(...this.fields['rx_error_internal'].pack());
        bits.push(...this.fields['rx_error_missed_start'].pack());
        bits.push(...this.fields['rx_error_wrong_toggle'].pack());
        bits.push(...this.fields['rx_error_short_frame'].pack());
        bits.push(...this.fields['rx_error_bad_crc'].pack());
        bits.push(...this.fields['rx_ignored_wrong_address'].pack());
        bits.push(...this.fields['rx_ignored_not_wanted'].pack());
        bits.push(...this.fields['rx_ignored_unexpected_tid'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['tx_frames'] = this.fields['tx_frames'].toObj();
        obj['tx_errors'] = this.fields['tx_errors'].toObj();
        obj['rx_frames'] = this.fields['rx_frames'].toObj();
        obj['rx_error_oom'] = this.fields['rx_error_oom'].toObj();
        obj['rx_error_internal'] = this.fields['rx_error_internal'].toObj();
        obj['rx_error_missed_start'] = this.fields['rx_error_missed_start'].toObj();
        obj['rx_error_wrong_toggle'] = this.fields['rx_error_wrong_toggle'].toObj();
        obj['rx_error_short_frame'] = this.fields['rx_error_short_frame'].toObj();
        obj['rx_error_bad_crc'] = this.fields['rx_error_bad_crc'].toObj();
        obj['rx_ignored_wrong_address'] = this.fields['rx_ignored_wrong_address'].toObj();
        obj['rx_ignored_not_wanted'] = this.fields['rx_ignored_not_wanted'].toObj();
        obj['rx_ignored_unexpected_tid'] = this.fields['rx_ignored_unexpected_tid'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 8519372027382397137n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.protocol.Stats\nsaturated uint32 tx_frames\nsaturated uint16 tx_errors\nsaturated uint32 rx_frames\nsaturated uint16 rx_error_oom\nsaturated uint16 rx_error_internal\nsaturated uint16 rx_error_missed_start\nsaturated uint16 rx_error_wrong_toggle\nsaturated uint16 rx_error_short_frame\nsaturated uint16 rx_error_bad_crc\nsaturated uint16 rx_ignored_wrong_address\nsaturated uint16 rx_ignored_not_wanted\nsaturated uint16 rx_ignored_unexpected_tid"; }

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
        this.fields['id_or_mac'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 20);
        this.fields['operator_location_type'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['classification_type'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['operator_latitude'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['operator_longitude'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['area_count'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['area_radius'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['area_ceiling'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['area_floor'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['category_eu'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['class_eu'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['operator_altitude_geo'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['timestamp'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['id_or_mac'].items = readArray(data, msg, 20, 5, 8, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['operator_location_type'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['classification_type'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['operator_latitude'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['operator_longitude'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['area_count'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['area_radius'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['area_ceiling'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['area_floor'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['category_eu'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['class_eu'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['operator_altitude_geo'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['timestamp'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['id_or_mac'].items, 20, 5, 8, false);
        bits.push(...this.fields['operator_location_type'].pack());
        bits.push(...this.fields['classification_type'].pack());
        bits.push(...this.fields['operator_latitude'].pack());
        bits.push(...this.fields['operator_longitude'].pack());
        bits.push(...this.fields['area_count'].pack());
        bits.push(...this.fields['area_radius'].pack());
        bits.push(...this.fields['area_ceiling'].pack());
        bits.push(...this.fields['area_floor'].pack());
        bits.push(...this.fields['category_eu'].pack());
        bits.push(...this.fields['class_eu'].pack());
        bits.push(...this.fields['operator_altitude_geo'].pack());
        bits.push(...this.fields['timestamp'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['id_or_mac'] = this.fields['id_or_mac'].toObj(true);
        obj['operator_location_type'] = this.fields['operator_location_type'].toObj();
        obj['classification_type'] = this.fields['classification_type'].toObj();
        obj['operator_latitude'] = this.fields['operator_latitude'].toObj();
        obj['operator_longitude'] = this.fields['operator_longitude'].toObj();
        obj['area_count'] = this.fields['area_count'].toObj();
        obj['area_radius'] = this.fields['area_radius'].toObj();
        obj['area_ceiling'] = this.fields['area_ceiling'].toObj();
        obj['area_floor'] = this.fields['area_floor'].toObj();
        obj['category_eu'] = this.fields['category_eu'].toObj();
        obj['class_eu'] = this.fields['class_eu'].toObj();
        obj['operator_altitude_geo'] = this.fields['operator_altitude_geo'].toObj();
        obj['timestamp'] = this.fields['timestamp'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 11153290872097023031n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.remoteid.System\nsaturated uint8[<=20] id_or_mac\nsaturated uint8 operator_location_type\nsaturated uint8 classification_type\nsaturated int32 operator_latitude\nsaturated int32 operator_longitude\nsaturated uint16 area_count\nsaturated uint16 area_radius\nsaturated float32 area_ceiling\nsaturated float32 area_floor\nsaturated uint8 category_eu\nsaturated uint8 class_eu\nsaturated float32 operator_altitude_geo\nsaturated uint32 timestamp"; }

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
        this.fields['id_or_mac'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 20);
        this.fields['operator_id_type'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['operator_id'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 20);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['id_or_mac'].items = readArray(data, msg, 20, 5, 8, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['operator_id_type'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['operator_id'].items = readArray(data, msg, 20, 5, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['id_or_mac'].items, 20, 5, 8, false);
        bits.push(...this.fields['operator_id_type'].pack());
        packArray(bits, this.fields['operator_id'].items, 20, 5, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['id_or_mac'] = this.fields['id_or_mac'].toObj(true);
        obj['operator_id_type'] = this.fields['operator_id_type'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 6349653021344594229n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.remoteid.OperatorID\nsaturated uint8[<=20] id_or_mac\nsaturated uint8 operator_id_type\nsaturated uint8[<=20] operator_id"; }

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
        this.fields['id_or_mac'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 20);
        this.fields['status'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['direction'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['speed_horizontal'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['speed_vertical'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['latitude'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['longitude'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['altitude_barometric'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['altitude_geodetic'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['height_reference'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['height'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['horizontal_accuracy'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['vertical_accuracy'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['barometer_accuracy'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['speed_accuracy'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['timestamp'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['timestamp_accuracy'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['id_or_mac'].items = readArray(data, msg, 20, 5, 8, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['status'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['direction'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['speed_horizontal'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['speed_vertical'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['latitude'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['longitude'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['altitude_barometric'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['altitude_geodetic'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height_reference'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['height'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['horizontal_accuracy'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['vertical_accuracy'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['barometer_accuracy'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['speed_accuracy'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['timestamp'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['timestamp_accuracy'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['id_or_mac'].items, 20, 5, 8, false);
        bits.push(...this.fields['status'].pack());
        bits.push(...this.fields['direction'].pack());
        bits.push(...this.fields['speed_horizontal'].pack());
        bits.push(...this.fields['speed_vertical'].pack());
        bits.push(...this.fields['latitude'].pack());
        bits.push(...this.fields['longitude'].pack());
        bits.push(...this.fields['altitude_barometric'].pack());
        bits.push(...this.fields['altitude_geodetic'].pack());
        bits.push(...this.fields['height_reference'].pack());
        bits.push(...this.fields['height'].pack());
        bits.push(...this.fields['horizontal_accuracy'].pack());
        bits.push(...this.fields['vertical_accuracy'].pack());
        bits.push(...this.fields['barometer_accuracy'].pack());
        bits.push(...this.fields['speed_accuracy'].pack());
        bits.push(...this.fields['timestamp'].pack());
        bits.push(...this.fields['timestamp_accuracy'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['id_or_mac'] = this.fields['id_or_mac'].toObj(true);
        obj['status'] = this.fields['status'].toObj();
        obj['direction'] = this.fields['direction'].toObj();
        obj['speed_horizontal'] = this.fields['speed_horizontal'].toObj();
        obj['speed_vertical'] = this.fields['speed_vertical'].toObj();
        obj['latitude'] = this.fields['latitude'].toObj();
        obj['longitude'] = this.fields['longitude'].toObj();
        obj['altitude_barometric'] = this.fields['altitude_barometric'].toObj();
        obj['altitude_geodetic'] = this.fields['altitude_geodetic'].toObj();
        obj['height_reference'] = this.fields['height_reference'].toObj();
        obj['height'] = this.fields['height'].toObj();
        obj['horizontal_accuracy'] = this.fields['horizontal_accuracy'].toObj();
        obj['vertical_accuracy'] = this.fields['vertical_accuracy'].toObj();
        obj['barometer_accuracy'] = this.fields['barometer_accuracy'].toObj();
        obj['speed_accuracy'] = this.fields['speed_accuracy'].toObj();
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['timestamp_accuracy'] = this.fields['timestamp_accuracy'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 16907536396236967082n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.remoteid.Location\nsaturated uint8[<=20] id_or_mac\nsaturated uint8 status\nsaturated uint16 direction\nsaturated uint16 speed_horizontal\nsaturated int16 speed_vertical\nsaturated int32 latitude\nsaturated int32 longitude\nsaturated float32 altitude_barometric\nsaturated float32 altitude_geodetic\nsaturated uint8 height_reference\nsaturated float32 height\nsaturated uint8 horizontal_accuracy\nsaturated uint8 vertical_accuracy\nsaturated uint8 barometer_accuracy\nsaturated uint8 speed_accuracy\nsaturated float32 timestamp\nsaturated uint8 timestamp_accuracy"; }

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
        this.fields['id_or_mac'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 20);
        this.fields['description_type'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['description'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 23);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['id_or_mac'].items = readArray(data, msg, 20, 5, 8, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['description_type'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['description'].items = readArray(data, msg, 23, 5, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['id_or_mac'].items, 20, 5, 8, false);
        bits.push(...this.fields['description_type'].pack());
        packArray(bits, this.fields['description'].items, 23, 5, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['id_or_mac'] = this.fields['id_or_mac'].toObj(true);
        obj['description_type'] = this.fields['description_type'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 6466748898118902149n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.remoteid.SelfID\nsaturated uint8[<=20] id_or_mac\nsaturated uint8 description_type\nsaturated uint8[<=23] description"; }

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
        this.fields['id_or_mac'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 20);
        this.fields['id_type'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['ua_type'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['uas_id'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 20);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['id_or_mac'].items = readArray(data, msg, 20, 5, 8, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['id_type'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['ua_type'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['uas_id'].items = readArray(data, msg, 20, 5, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['id_or_mac'].items, 20, 5, 8, false);
        bits.push(...this.fields['id_type'].pack());
        bits.push(...this.fields['ua_type'].pack());
        packArray(bits, this.fields['uas_id'].items, 20, 5, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['id_or_mac'] = this.fields['id_or_mac'].toObj(true);
        obj['id_type'] = this.fields['id_type'].toObj();
        obj['ua_type'] = this.fields['ua_type'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 6565230429154034995n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.remoteid.BasicID\nsaturated uint8[<=20] id_or_mac\nsaturated uint8 id_type\nsaturated uint8 ua_type\nsaturated uint8[<=20] uas_id"; }

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
        this.fields['status'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['error'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 50);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['status'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['error'].items = readArray(data, msg, 50, 6, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['status'].pack());
        packArray(bits, this.fields['error'].items, 50, 6, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['status'] = this.fields['status'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 18365524029972888541n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.remoteid.ArmStatus\nsaturated uint8 status\nsaturated uint8[<=50] error"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['sequence'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['operation'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['sig_length'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['data'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 220);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['sequence'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['operation'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['sig_length'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['data'].items = readArray(data, msg, 220, 8, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['sequence'].pack());
        bits.push(...this.fields['operation'].pack());
        bits.push(...this.fields['sig_length'].pack());
        packArray(bits, this.fields['data'].items, 220, 8, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['sequence'] = this.fields['sequence'].toObj();
        obj['operation'] = this.fields['operation'].toObj();
        obj['sig_length'] = this.fields['sig_length'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1326951972074064855n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.remoteid.SecureCommand\nsaturated uint32 sequence\nsaturated uint32 operation\nsaturated uint8 sig_length\nsaturated uint8[<=220] data\n---\nsaturated uint32 sequence\nsaturated uint32 operation\nsaturated uint8 result\nsaturated uint8[<=220] data"; }

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
    static CONSTANTS = {'result': {'ACCEPTED': 0, 'TEMPORARILY_REJECTED': 1, 'DENIED': 2, 'UNSUPPORTED': 3, 'FAILED': 4}};
    static MAX_BIT_LEN = 1840;
    static MIN_BIT_LEN = 72;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['sequence'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['operation'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['result'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['data'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 220);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['sequence'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['operation'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['result'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['data'].items = readArray(data, msg, 220, 8, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['sequence'].pack());
        bits.push(...this.fields['operation'].pack());
        bits.push(...this.fields['result'].pack());
        packArray(bits, this.fields['data'].items, 220, 8, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['sequence'] = this.fields['sequence'].toObj();
        obj['operation'] = this.fields['operation'].toObj();
        obj['result'] = this.fields['result'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1326951972074064855n; }
    getDsdlSignatureSourceDefinition() { return "dronecan.remoteid.SecureCommand\nsaturated uint32 sequence\nsaturated uint32 operation\nsaturated uint8 sig_length\nsaturated uint8[<=220] data\n---\nsaturated uint32 sequence\nsaturated uint32 operation\nsaturated uint8 result\nsaturated uint8[<=220] data"; }

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
        this.fields['button'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['press_time'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['button'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['press_time'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['button'].pack());
        bits.push(...this.fields['press_time'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['button'] = this.fields['button'].toObj();
        obj['press_time'] = this.fields['press_time'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 451948134196004462n; }
    getDsdlSignatureSourceDefinition() { return "ardupilot.indication.Button\nsaturated uint8 button\nsaturated uint8 press_time"; }

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
        this.fields['status'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['status'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['status'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['status'] = this.fields['status'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 16817971642966845089n; }
    getDsdlSignatureSourceDefinition() { return "ardupilot.indication.SafetyState\nsaturated uint8 status"; }

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
        this.fields['aux_data_type'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['aux_data'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 255);
        this.fields['vehicle_state'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 64, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['aux_data_type'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['aux_data'].items = readArray(data, msg, 255, 8, 8, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['vehicle_state'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 64, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['aux_data_type'].pack());
        packArray(bits, this.fields['aux_data'].items, 255, 8, 8, false);
        bits.push(...this.fields['vehicle_state'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['aux_data_type'] = this.fields['aux_data_type'].toObj();
        obj['aux_data'] = this.fields['aux_data'].toObj(true);
        obj['vehicle_state'] = this.fields['vehicle_state'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 7142474383910632940n; }
    getDsdlSignatureSourceDefinition() { return "ardupilot.indication.NotifyState\nsaturated uint8 aux_data_type\nsaturated uint8[<=255] aux_data\nsaturated uint64 vehicle_state"; }

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
        this.fields['data'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 300);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['data'].items = readArray(data, msg, 300, 9, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['data'].items, 300, 9, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 716955749157311290n; }
    getDsdlSignatureSourceDefinition() { return "ardupilot.gnss.MovingBaselineData\nsaturated uint8[<=300] data"; }

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
        this.fields['heading_valid'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['heading_accuracy_valid'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['heading_rad'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['heading_accuracy_rad'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['heading_valid'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['heading_accuracy_valid'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['heading_rad'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['heading_accuracy_rad'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['heading_valid'].pack());
        bits.push(...this.fields['heading_accuracy_valid'].pack());
        bits.push(...this.fields['heading_rad'].pack());
        bits.push(...this.fields['heading_accuracy_rad'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['heading_valid'] = this.fields['heading_valid'].toObj();
        obj['heading_accuracy_valid'] = this.fields['heading_accuracy_valid'].toObj();
        obj['heading_rad'] = this.fields['heading_rad'].toObj();
        obj['heading_accuracy_rad'] = this.fields['heading_accuracy_rad'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 3556909369527186450n; }
    getDsdlSignatureSourceDefinition() { return "ardupilot.gnss.Heading\nsaturated bool heading_valid\nsaturated bool heading_accuracy_valid\nsaturated float16 heading_rad\nsaturated float16 heading_accuracy_rad"; }

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
        this.fields['timestamp'] = new CompoundType(new uavcan_Timestamp(), CompoundType.KIND_MESSAGE);
        this.fields['reported_heading_acc_available'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['reported_heading_deg'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['reported_heading_acc_deg'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['relative_distance_m'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['relative_down_pos_m'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['timestamp'] = readCompound(data, msg, uavcan_Timestamp, CompoundType.KIND_MESSAGE, false);
        msg.fields['reported_heading_acc_available'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['reported_heading_deg'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['reported_heading_acc_deg'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['relative_distance_m'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['relative_down_pos_m'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['timestamp'].pack(false)) bits.push(bit);
        bits.push(...this.fields['reported_heading_acc_available'].pack());
        bits.push(...this.fields['reported_heading_deg'].pack());
        bits.push(...this.fields['reported_heading_acc_deg'].pack());
        bits.push(...this.fields['relative_distance_m'].pack());
        bits.push(...this.fields['relative_down_pos_m'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['reported_heading_acc_available'] = this.fields['reported_heading_acc_available'].toObj();
        obj['reported_heading_deg'] = this.fields['reported_heading_deg'].toObj();
        obj['reported_heading_acc_deg'] = this.fields['reported_heading_acc_deg'].toObj();
        obj['relative_distance_m'] = this.fields['relative_distance_m'].toObj();
        obj['relative_down_pos_m'] = this.fields['relative_down_pos_m'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 12895872748970622160n; }
    getDsdlSignatureSourceDefinition() { return "ardupilot.gnss.RelPosHeading\nuavcan.Timestamp timestamp\nsaturated bool reported_heading_acc_available\nsaturated float32 reported_heading_deg\nsaturated float32 reported_heading_acc_deg\nsaturated float16 relative_distance_m\nsaturated float16 relative_down_pos_m"; }

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
        this.fields['error_codes'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['healthy'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['status'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 23, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['error_codes'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['healthy'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 23, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['error_codes'].pack());
        bits.push(...this.fields['healthy'].pack());
        bits.push(...this.fields['status'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['error_codes'] = this.fields['error_codes'].toObj();
        obj['healthy'] = this.fields['healthy'].toObj();
        obj['status'] = this.fields['status'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 13419799639327014761n; }
    getDsdlSignatureSourceDefinition() { return "ardupilot.gnss.Status\nsaturated uint32 error_codes\nsaturated bool healthy\nsaturated uint23 status"; }

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
        this.fields['temperature_cells'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['temperature_pcb'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['temperature_other'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['current'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['voltage'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['state_of_charge'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['slot_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['capacity_consumed'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['status_flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['temperature_cells'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['temperature_pcb'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['temperature_other'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['current'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['state_of_charge'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['slot_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['capacity_consumed'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status_flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['temperature_cells'].pack());
        bits.push(...this.fields['temperature_pcb'].pack());
        bits.push(...this.fields['temperature_other'].pack());
        bits.push(...this.fields['current'].pack());
        bits.push(...this.fields['voltage'].pack());
        bits.push(...this.fields['state_of_charge'].pack());
        bits.push(...this.fields['slot_id'].pack());
        bits.push(...this.fields['capacity_consumed'].pack());
        bits.push(...this.fields['status_flags'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['temperature_cells'] = this.fields['temperature_cells'].toObj();
        obj['temperature_pcb'] = this.fields['temperature_pcb'].toObj();
        obj['temperature_other'] = this.fields['temperature_other'].toObj();
        obj['current'] = this.fields['current'].toObj();
        obj['voltage'] = this.fields['voltage'].toObj();
        obj['state_of_charge'] = this.fields['state_of_charge'].toObj();
        obj['slot_id'] = this.fields['slot_id'].toObj();
        obj['capacity_consumed'] = this.fields['capacity_consumed'].toObj();
        obj['status_flags'] = this.fields['status_flags'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 8460950965637735598n; }
    getDsdlSignatureSourceDefinition() { return "ardupilot.equipment.power.BatteryContinuous\nsaturated float16 temperature_cells\nsaturated float16 temperature_pcb\nsaturated float16 temperature_other\nsaturated float32 current\nsaturated float32 voltage\nsaturated float16 state_of_charge\nsaturated uint8 slot_id\nsaturated float32 capacity_consumed\nsaturated uint32 status_flags"; }

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
        this.fields['voltages'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 24);
        this.fields['index'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['voltages'].items = readArray(data, msg, 24, 5, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['index'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['voltages'].items, 24, 5, 16, false);
        bits.push(...this.fields['index'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['voltages'] = this.fields['voltages'].toObj(true);
        obj['index'] = this.fields['index'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 6668453072664596132n; }
    getDsdlSignatureSourceDefinition() { return "ardupilot.equipment.power.BatteryCells\nsaturated float16[<=24] voltages\nsaturated uint16 index"; }

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
        this.fields['timestamp'] = new CompoundType(new uavcan_Timestamp(), CompoundType.KIND_MESSAGE);
        this.fields['voltage_cell'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 255);
        this.fields['cycle_count'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['over_discharge_count'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['max_current'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['nominal_voltage'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['is_powering_off'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['battery_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['timestamp'] = readCompound(data, msg, uavcan_Timestamp, CompoundType.KIND_MESSAGE, false);
        msg.fields['voltage_cell'].items = readArray(data, msg, 255, 8, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['cycle_count'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['over_discharge_count'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['max_current'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['nominal_voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['is_powering_off'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['battery_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['timestamp'].pack(false)) bits.push(bit);
        packArray(bits, this.fields['voltage_cell'].items, 255, 8, 16, false);
        bits.push(...this.fields['cycle_count'].pack());
        bits.push(...this.fields['over_discharge_count'].pack());
        bits.push(...this.fields['max_current'].pack());
        bits.push(...this.fields['nominal_voltage'].pack());
        bits.push(...this.fields['is_powering_off'].pack());
        bits.push(...this.fields['battery_id'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['voltage_cell'] = this.fields['voltage_cell'].toObj(true);
        obj['cycle_count'] = this.fields['cycle_count'].toObj();
        obj['over_discharge_count'] = this.fields['over_discharge_count'].toObj();
        obj['max_current'] = this.fields['max_current'].toObj();
        obj['nominal_voltage'] = this.fields['nominal_voltage'].toObj();
        obj['is_powering_off'] = this.fields['is_powering_off'].toObj();
        obj['battery_id'] = this.fields['battery_id'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14810188916584809014n; }
    getDsdlSignatureSourceDefinition() { return "ardupilot.equipment.power.BatteryInfoAux\nuavcan.Timestamp timestamp\nsaturated float16[<=255] voltage_cell\nsaturated uint16 cycle_count\nsaturated uint16 over_discharge_count\nsaturated float16 max_current\nsaturated float16 nominal_voltage\nsaturated bool is_powering_off\nsaturated uint8 battery_id"; }

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
        this.fields['name'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 50);
        this.fields['serial_number'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 32);
        this.fields['manufacture_date'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 9);
        this.fields['design_capacity'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['cells_in_series'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['nominal_voltage'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['discharge_minimum_voltage'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['charging_minimum_voltage'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['charging_maximum_voltage'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['charging_maximum_current'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['discharge_maximum_current'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['discharge_maximum_burst_current'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['full_charge_capacity'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['cycle_count'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['state_of_health'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['name'].items = readArray(data, msg, 50, 6, 8, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['serial_number'].items = readArray(data, msg, 32, 6, 8, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['manufacture_date'].items = readArray(data, msg, 9, 4, 8, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['design_capacity'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['cells_in_series'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['nominal_voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['discharge_minimum_voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['charging_minimum_voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['charging_maximum_voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['charging_maximum_current'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['discharge_maximum_current'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['discharge_maximum_burst_current'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['full_charge_capacity'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['cycle_count'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['state_of_health'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['name'].items, 50, 6, 8, false);
        packArray(bits, this.fields['serial_number'].items, 32, 6, 8, false);
        packArray(bits, this.fields['manufacture_date'].items, 9, 4, 8, false);
        bits.push(...this.fields['design_capacity'].pack());
        bits.push(...this.fields['cells_in_series'].pack());
        bits.push(...this.fields['nominal_voltage'].pack());
        bits.push(...this.fields['discharge_minimum_voltage'].pack());
        bits.push(...this.fields['charging_minimum_voltage'].pack());
        bits.push(...this.fields['charging_maximum_voltage'].pack());
        bits.push(...this.fields['charging_maximum_current'].pack());
        bits.push(...this.fields['discharge_maximum_current'].pack());
        bits.push(...this.fields['discharge_maximum_burst_current'].pack());
        bits.push(...this.fields['full_charge_capacity'].pack());
        bits.push(...this.fields['cycle_count'].pack());
        bits.push(...this.fields['state_of_health'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['name'] = this.fields['name'].toObj(false);
        obj['serial_number'] = this.fields['serial_number'].toObj(true);
        obj['manufacture_date'] = this.fields['manufacture_date'].toObj(true);
        obj['design_capacity'] = this.fields['design_capacity'].toObj();
        obj['cells_in_series'] = this.fields['cells_in_series'].toObj();
        obj['nominal_voltage'] = this.fields['nominal_voltage'].toObj();
        obj['discharge_minimum_voltage'] = this.fields['discharge_minimum_voltage'].toObj();
        obj['charging_minimum_voltage'] = this.fields['charging_minimum_voltage'].toObj();
        obj['charging_maximum_voltage'] = this.fields['charging_maximum_voltage'].toObj();
        obj['charging_maximum_current'] = this.fields['charging_maximum_current'].toObj();
        obj['discharge_maximum_current'] = this.fields['discharge_maximum_current'].toObj();
        obj['discharge_maximum_burst_current'] = this.fields['discharge_maximum_burst_current'].toObj();
        obj['full_charge_capacity'] = this.fields['full_charge_capacity'].toObj();
        obj['cycle_count'] = this.fields['cycle_count'].toObj();
        obj['state_of_health'] = this.fields['state_of_health'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1081185607536040146n; }
    getDsdlSignatureSourceDefinition() { return "ardupilot.equipment.power.BatteryPeriodic\nsaturated uint8[<=50] name\nsaturated uint8[<=32] serial_number\nsaturated uint8[<=9] manufacture_date\nsaturated float32 design_capacity\nsaturated uint8 cells_in_series\nsaturated float16 nominal_voltage\nsaturated float16 discharge_minimum_voltage\nsaturated float16 charging_minimum_voltage\nsaturated float16 charging_maximum_voltage\nsaturated float32 charging_maximum_current\nsaturated float32 discharge_maximum_current\nsaturated float32 discharge_maximum_burst_current\nsaturated float32 full_charge_capacity\nsaturated uint16 cycle_count\nsaturated uint8 state_of_health"; }

    static getDataTypeSignature() {
        return 1081185607536040146n;
    }

    getDataTypeSignature() {
        return 1081185607536040146n;
    }

};
module.exports.ardupilot_equipment_power_BatteryPeriodic = ardupilot_equipment_power_BatteryPeriodic;

// JavaScript binding for ardupilot.equipment.power.BatteryTag
// Auto Generated Code, DO NOT MODIFY
const ardupilot_equipment_power_BatteryTag = class {
    static DTID = 20500;
    static FULL_NAME = 'ardupilot.equipment.power.BatteryTag';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 192;
    static MIN_BIT_LEN = 192;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['serial_number'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['num_cycles'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['armed_hours'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['battery_capacity_mAh'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['first_use_mins'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['last_arm_time_mins'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['serial_number'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['num_cycles'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['armed_hours'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['battery_capacity_mAh'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['first_use_mins'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['last_arm_time_mins'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['serial_number'].pack());
        bits.push(...this.fields['num_cycles'].pack());
        bits.push(...this.fields['armed_hours'].pack());
        bits.push(...this.fields['battery_capacity_mAh'].pack());
        bits.push(...this.fields['first_use_mins'].pack());
        bits.push(...this.fields['last_arm_time_mins'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['serial_number'] = this.fields['serial_number'].toObj();
        obj['num_cycles'] = this.fields['num_cycles'].toObj();
        obj['armed_hours'] = this.fields['armed_hours'].toObj();
        obj['battery_capacity_mAh'] = this.fields['battery_capacity_mAh'].toObj();
        obj['first_use_mins'] = this.fields['first_use_mins'].toObj();
        obj['last_arm_time_mins'] = this.fields['last_arm_time_mins'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = ardupilot_equipment_power_BatteryTag.CONSTANTS;
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
        if (!this.unionFieldIndex) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return ardupilot_equipment_power_BatteryTag.DTID;
    }

    get name() {
        return ardupilot_equipment_power_BatteryTag.FULL_NAME;
    }

    get fieldNames() {
        return [
            'serial_number',
            'num_cycles',
            'armed_hours',
            'battery_capacity_mAh',
            'first_use_mins',
            'last_arm_time_mins',
        ];
    }

    static sampleMessage() {
        const msg = new ardupilot_equipment_power_BatteryTag();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    getDsdlSignature() { return 5357765414642217953n; }
    getDsdlSignatureSourceDefinition() { return "ardupilot.equipment.power.BatteryTag\nsaturated uint32 serial_number\nsaturated uint32 num_cycles\nsaturated float32 armed_hours\nsaturated uint32 battery_capacity_mAh\nsaturated uint32 first_use_mins\nsaturated uint32 last_arm_time_mins"; }

    static getDataTypeSignature() {
        return 5357765414642217953n;
    }

    getDataTypeSignature() {
        return 5357765414642217953n;
    }

};
module.exports.ardupilot_equipment_power_BatteryTag = ardupilot_equipment_power_BatteryTag;

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
        this.fields['sensor_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['reading_type'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['yaw'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['pitch'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['distance'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['sensor_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['reading_type'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['yaw'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pitch'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['distance'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['sensor_id'].pack());
        bits.push(...this.fields['reading_type'].pack());
        bits.push(...this.fields['flags'].pack());
        bits.push(...this.fields['yaw'].pack());
        bits.push(...this.fields['pitch'].pack());
        bits.push(...this.fields['distance'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['sensor_id'] = this.fields['sensor_id'].toObj();
        obj['reading_type'] = this.fields['reading_type'].toObj();
        obj['flags'] = this.fields['flags'].toObj();
        obj['yaw'] = this.fields['yaw'].toObj();
        obj['pitch'] = this.fields['pitch'].toObj();
        obj['distance'] = this.fields['distance'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 11087081105263829710n; }
    getDsdlSignatureSourceDefinition() { return "ardupilot.equipment.proximity_sensor.Proximity\nsaturated uint8 sensor_id\nsaturated uint3 reading_type\nsaturated uint5 flags\nsaturated float16 yaw\nsaturated float16 pitch\nsaturated float16 distance"; }

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
        this.fields['timestamp'] = new CompoundType(new uavcan_Timestamp(), CompoundType.KIND_MESSAGE);
        this.fields['icao_address'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['tslc'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['latitude_deg_1e7'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['longitude_deg_1e7'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['alt_m'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['heading'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['velocity'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 3);
        this.fields['squawk'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['callsign'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 9);
        this.fields['source'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['traffic_type'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['alt_type'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['lat_lon_valid'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['heading_valid'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['velocity_valid'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['callsign_valid'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['ident_valid'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['simulated_report'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['vertical_velocity_valid'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['baro_valid'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['timestamp'] = readCompound(data, msg, uavcan_Timestamp, CompoundType.KIND_MESSAGE, false);
        msg.fields['icao_address'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['tslc'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['latitude_deg_1e7'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['longitude_deg_1e7'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['alt_m'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['heading'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['velocity'].items = readArray(data, msg, 3, 0, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['squawk'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['callsign'].items = readArray(data, msg, 9, 0, 8, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['source'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['traffic_type'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['alt_type'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['lat_lon_valid'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['heading_valid'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['velocity_valid'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['callsign_valid'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['ident_valid'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['simulated_report'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['vertical_velocity_valid'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['baro_valid'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        for (const bit of this.fields['timestamp'].pack(false)) bits.push(bit);
        bits.push(...this.fields['icao_address'].pack());
        bits.push(...this.fields['tslc'].pack());
        bits.push(...this.fields['latitude_deg_1e7'].pack());
        bits.push(...this.fields['longitude_deg_1e7'].pack());
        bits.push(...this.fields['alt_m'].pack());
        bits.push(...this.fields['heading'].pack());
        packArray(bits, this.fields['velocity'].items, 3, 0, 16, false);
        bits.push(...this.fields['squawk'].pack());
        packArray(bits, this.fields['callsign'].items, 9, 0, 8, false);
        bits.push(...this.fields['source'].pack());
        bits.push(...this.fields['traffic_type'].pack());
        bits.push(...this.fields['alt_type'].pack());
        bits.push(...this.fields['lat_lon_valid'].pack());
        bits.push(...this.fields['heading_valid'].pack());
        bits.push(...this.fields['velocity_valid'].pack());
        bits.push(...this.fields['callsign_valid'].pack());
        bits.push(...this.fields['ident_valid'].pack());
        bits.push(...this.fields['simulated_report'].pack());
        bits.push(...this.fields['vertical_velocity_valid'].pack());
        bits.push(...this.fields['baro_valid'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['timestamp'] = this.fields['timestamp'].toObj();
        obj['icao_address'] = this.fields['icao_address'].toObj();
        obj['tslc'] = this.fields['tslc'].toObj();
        obj['latitude_deg_1e7'] = this.fields['latitude_deg_1e7'].toObj();
        obj['longitude_deg_1e7'] = this.fields['longitude_deg_1e7'].toObj();
        obj['alt_m'] = this.fields['alt_m'].toObj();
        obj['heading'] = this.fields['heading'].toObj();
        obj['velocity'] = this.fields['velocity'].toObj(true);
        obj['squawk'] = this.fields['squawk'].toObj();
        obj['callsign'] = this.fields['callsign'].toObj(true);
        obj['source'] = this.fields['source'].toObj();
        obj['traffic_type'] = this.fields['traffic_type'].toObj();
        obj['alt_type'] = this.fields['alt_type'].toObj();
        obj['lat_lon_valid'] = this.fields['lat_lon_valid'].toObj();
        obj['heading_valid'] = this.fields['heading_valid'].toObj();
        obj['velocity_valid'] = this.fields['velocity_valid'].toObj();
        obj['callsign_valid'] = this.fields['callsign_valid'].toObj();
        obj['ident_valid'] = this.fields['ident_valid'].toObj();
        obj['simulated_report'] = this.fields['simulated_report'].toObj();
        obj['vertical_velocity_valid'] = this.fields['vertical_velocity_valid'].toObj();
        obj['baro_valid'] = this.fields['baro_valid'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14470426553482971465n; }
    getDsdlSignatureSourceDefinition() { return "ardupilot.equipment.trafficmonitor.TrafficReport\nuavcan.Timestamp timestamp\nsaturated uint32 icao_address\nsaturated uint16 tslc\nsaturated int32 latitude_deg_1e7\nsaturated int32 longitude_deg_1e7\nsaturated float32 alt_m\nsaturated float16 heading\nsaturated float16[3] velocity\nsaturated uint16 squawk\nsaturated uint8[9] callsign\nsaturated uint3 source\nsaturated uint5 traffic_type\nsaturated uint7 alt_type\nsaturated bool lat_lon_valid\nsaturated bool heading_valid\nsaturated bool velocity_valid\nsaturated bool callsign_valid\nsaturated bool ident_valid\nsaturated bool simulated_report\nsaturated bool vertical_velocity_valid\nsaturated bool baro_valid"; }

    static getDataTypeSignature() {
        return 7558269111091429880n;
    }

    getDataTypeSignature() {
        return 7558269111091429880n;
    }

};
module.exports.ardupilot_equipment_trafficmonitor_TrafficReport = ardupilot_equipment_trafficmonitor_TrafficReport;

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
        this.fields['quaternion_wxyz_e4'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 4);
        this.fields['reserved'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 2);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['quaternion_wxyz_e4'].items = readArray(data, msg, 4, 0, 16, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['reserved'].items = readArray(data, msg, 2, 2, 16, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['quaternion_wxyz_e4'].items, 4, 0, 16, false);
        packArray(bits, this.fields['reserved'].items, 2, 2, 16, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 7790999694321607601n; }
    getDsdlSignatureSourceDefinition() { return "com.xacti.CopterAttStatus\nsaturated int16[4] quaternion_wxyz_e4\nsaturated float16[<=2] reserved"; }

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
        this.fields['pitch_cmd_type'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['yaw_cmd_type'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['pitch_cmd_value'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['yaw_cmd_value'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['pitch_cmd_type'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['yaw_cmd_type'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pitch_cmd_value'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['yaw_cmd_value'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['pitch_cmd_type'].pack());
        bits.push(...this.fields['yaw_cmd_type'].pack());
        bits.push(...this.fields['pitch_cmd_value'].pack());
        bits.push(...this.fields['yaw_cmd_value'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['pitch_cmd_type'] = this.fields['pitch_cmd_type'].toObj();
        obj['yaw_cmd_type'] = this.fields['yaw_cmd_type'].toObj();
        obj['pitch_cmd_value'] = this.fields['pitch_cmd_value'].toObj();
        obj['yaw_cmd_value'] = this.fields['yaw_cmd_value'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 4252963364928538046n; }
    getDsdlSignatureSourceDefinition() { return "com.xacti.GimbalControlData\nsaturated uint8 pitch_cmd_type\nsaturated uint8 yaw_cmd_type\nsaturated uint16 pitch_cmd_value\nsaturated uint16 yaw_cmd_value"; }

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
        this.fields['gps_status'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['order'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['remain_buffer'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['utc_year'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['utc_month'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['utc_day'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['utc_hour'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['utc_minute'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['utc_seconds'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['latitude'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 64, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['longitude'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 64, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['altitude'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['gps_status'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['order'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['remain_buffer'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['utc_year'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['utc_month'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['utc_day'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['utc_hour'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['utc_minute'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['utc_seconds'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['latitude'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 64, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['longitude'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 64, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['altitude'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['gps_status'].pack());
        bits.push(...this.fields['order'].pack());
        bits.push(...this.fields['remain_buffer'].pack());
        bits.push(...this.fields['utc_year'].pack());
        bits.push(...this.fields['utc_month'].pack());
        bits.push(...this.fields['utc_day'].pack());
        bits.push(...this.fields['utc_hour'].pack());
        bits.push(...this.fields['utc_minute'].pack());
        bits.push(...this.fields['utc_seconds'].pack());
        bits.push(...this.fields['latitude'].pack());
        bits.push(...this.fields['longitude'].pack());
        bits.push(...this.fields['altitude'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['gps_status'] = this.fields['gps_status'].toObj();
        obj['order'] = this.fields['order'].toObj();
        obj['remain_buffer'] = this.fields['remain_buffer'].toObj();
        obj['utc_year'] = this.fields['utc_year'].toObj();
        obj['utc_month'] = this.fields['utc_month'].toObj();
        obj['utc_day'] = this.fields['utc_day'].toObj();
        obj['utc_hour'] = this.fields['utc_hour'].toObj();
        obj['utc_minute'] = this.fields['utc_minute'].toObj();
        obj['utc_seconds'] = this.fields['utc_seconds'].toObj();
        obj['latitude'] = this.fields['latitude'].toObj();
        obj['longitude'] = this.fields['longitude'].toObj();
        obj['altitude'] = this.fields['altitude'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 3752532431003831267n; }
    getDsdlSignatureSourceDefinition() { return "com.xacti.GnssStatus\nsaturated uint8 gps_status\nsaturated uint8 order\nsaturated uint8 remain_buffer\nsaturated uint16 utc_year\nsaturated uint8 utc_month\nsaturated uint8 utc_day\nsaturated uint8 utc_hour\nsaturated uint8 utc_minute\nsaturated float32 utc_seconds\nsaturated float64 latitude\nsaturated float64 longitude\nsaturated float32 altitude"; }

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
        this.fields['gimbal_roll'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['gimbal_pitch'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['gimbal_yaw'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['magneticencoder_roll'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['magneticencoder_pitch'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['magneticencoder_yaw'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['gimbal_roll'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['gimbal_pitch'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['gimbal_yaw'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['magneticencoder_roll'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['magneticencoder_pitch'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['magneticencoder_yaw'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['gimbal_roll'].pack());
        bits.push(...this.fields['gimbal_pitch'].pack());
        bits.push(...this.fields['gimbal_yaw'].pack());
        bits.push(...this.fields['magneticencoder_roll'].pack());
        bits.push(...this.fields['magneticencoder_pitch'].pack());
        bits.push(...this.fields['magneticencoder_yaw'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['gimbal_roll'] = this.fields['gimbal_roll'].toObj();
        obj['gimbal_pitch'] = this.fields['gimbal_pitch'].toObj();
        obj['gimbal_yaw'] = this.fields['gimbal_yaw'].toObj();
        obj['magneticencoder_roll'] = this.fields['magneticencoder_roll'].toObj();
        obj['magneticencoder_pitch'] = this.fields['magneticencoder_pitch'].toObj();
        obj['magneticencoder_yaw'] = this.fields['magneticencoder_yaw'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 16952265243978049170n; }
    getDsdlSignatureSourceDefinition() { return "com.xacti.GimbalAttitudeStatus\nsaturated int16 gimbal_roll\nsaturated int16 gimbal_pitch\nsaturated int16 gimbal_yaw\nsaturated int16 magneticencoder_roll\nsaturated int16 magneticencoder_pitch\nsaturated int16 magneticencoder_yaw"; }

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
        this.fields['requirement'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['requirement'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['requirement'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['requirement'] = this.fields['requirement'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 6986567698236847177n; }
    getDsdlSignatureSourceDefinition() { return "com.xacti.GnssStatusReq\nsaturated uint8 requirement"; }

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
        this.fields['integration_interval'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rate_gyro_integral'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 2);
        this.fields['flow_integral'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 2);
        this.fields['quality'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['integration_interval'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rate_gyro_integral'].items = readArray(data, msg, 2, 0, 32, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['flow_integral'].items = readArray(data, msg, 2, 0, 32, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['quality'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['integration_interval'].pack());
        packArray(bits, this.fields['rate_gyro_integral'].items, 2, 0, 32, false);
        packArray(bits, this.fields['flow_integral'].items, 2, 0, 32, false);
        bits.push(...this.fields['quality'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['integration_interval'] = this.fields['integration_interval'].toObj();
        obj['rate_gyro_integral'] = this.fields['rate_gyro_integral'].toObj(true);
        obj['flow_integral'] = this.fields['flow_integral'].toObj(true);
        obj['quality'] = this.fields['quality'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 7678787339500690456n; }
    getDsdlSignatureSourceDefinition() { return "com.hex.equipment.flow.Measurement\nsaturated float32 integration_interval\nsaturated float32[2] rate_gyro_integral\nsaturated float32[2] flow_integral\nsaturated uint8 quality"; }

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
        this.fields['esc_index'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_uuid'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_id_req'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_ov_threshold'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_oc_threshold'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_ot_threshold'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_acc_threshold'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_dacc_threshold'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_rotate_dir'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_timing'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_startup_times'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_startup_duration'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_product_date'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_error_count'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_signal_priority'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_led_mode'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_can_rate'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_fdb_rate'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_save_option'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rsvd'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 32);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['esc_index'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_uuid'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_id_req'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_ov_threshold'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_oc_threshold'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_ot_threshold'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_acc_threshold'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_dacc_threshold'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_rotate_dir'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_timing'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_startup_times'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_startup_duration'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_product_date'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_error_count'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_signal_priority'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_led_mode'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_can_rate'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_fdb_rate'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_save_option'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rsvd'].items = readArray(data, msg, 32, 6, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['esc_index'].pack());
        bits.push(...this.fields['esc_uuid'].pack());
        bits.push(...this.fields['esc_id_req'].pack());
        bits.push(...this.fields['esc_ov_threshold'].pack());
        bits.push(...this.fields['esc_oc_threshold'].pack());
        bits.push(...this.fields['esc_ot_threshold'].pack());
        bits.push(...this.fields['esc_acc_threshold'].pack());
        bits.push(...this.fields['esc_dacc_threshold'].pack());
        bits.push(...this.fields['esc_rotate_dir'].pack());
        bits.push(...this.fields['esc_timing'].pack());
        bits.push(...this.fields['esc_startup_times'].pack());
        bits.push(...this.fields['esc_startup_duration'].pack());
        bits.push(...this.fields['esc_product_date'].pack());
        bits.push(...this.fields['esc_error_count'].pack());
        bits.push(...this.fields['esc_signal_priority'].pack());
        bits.push(...this.fields['esc_led_mode'].pack());
        bits.push(...this.fields['esc_can_rate'].pack());
        bits.push(...this.fields['esc_fdb_rate'].pack());
        bits.push(...this.fields['esc_save_option'].pack());
        packArray(bits, this.fields['rsvd'].items, 32, 6, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['esc_index'] = this.fields['esc_index'].toObj();
        obj['esc_uuid'] = this.fields['esc_uuid'].toObj();
        obj['esc_id_req'] = this.fields['esc_id_req'].toObj();
        obj['esc_ov_threshold'] = this.fields['esc_ov_threshold'].toObj();
        obj['esc_oc_threshold'] = this.fields['esc_oc_threshold'].toObj();
        obj['esc_ot_threshold'] = this.fields['esc_ot_threshold'].toObj();
        obj['esc_acc_threshold'] = this.fields['esc_acc_threshold'].toObj();
        obj['esc_dacc_threshold'] = this.fields['esc_dacc_threshold'].toObj();
        obj['esc_rotate_dir'] = this.fields['esc_rotate_dir'].toObj();
        obj['esc_timing'] = this.fields['esc_timing'].toObj();
        obj['esc_startup_times'] = this.fields['esc_startup_times'].toObj();
        obj['esc_startup_duration'] = this.fields['esc_startup_duration'].toObj();
        obj['esc_product_date'] = this.fields['esc_product_date'].toObj();
        obj['esc_error_count'] = this.fields['esc_error_count'].toObj();
        obj['esc_signal_priority'] = this.fields['esc_signal_priority'].toObj();
        obj['esc_led_mode'] = this.fields['esc_led_mode'].toObj();
        obj['esc_can_rate'] = this.fields['esc_can_rate'].toObj();
        obj['esc_fdb_rate'] = this.fields['esc_fdb_rate'].toObj();
        obj['esc_save_option'] = this.fields['esc_save_option'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 5055419915763663618n; }
    getDsdlSignatureSourceDefinition() { return "com.tmotor.esc.ParamGet\nsaturated uint8 esc_index\nsaturated uint32 esc_uuid\nsaturated uint16 esc_id_req\nsaturated uint16 esc_ov_threshold\nsaturated uint16 esc_oc_threshold\nsaturated uint16 esc_ot_threshold\nsaturated uint16 esc_acc_threshold\nsaturated uint16 esc_dacc_threshold\nsaturated int16 esc_rotate_dir\nsaturated uint8 esc_timing\nsaturated uint16 esc_startup_times\nsaturated uint32 esc_startup_duration\nsaturated uint32 esc_product_date\nsaturated uint32 esc_error_count\nsaturated uint8 esc_signal_priority\nsaturated uint16 esc_led_mode\nsaturated uint8 esc_can_rate\nsaturated uint16 esc_fdb_rate\nsaturated uint8 esc_save_option\nsaturated uint8[<=32] rsvd"; }

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
        this.fields['data_sequence'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['data'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 255);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['data_sequence'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['data'].items = readArray(data, msg, 255, 8, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['data_sequence'].pack());
        packArray(bits, this.fields['data'].items, 255, 8, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['data_sequence'] = this.fields['data_sequence'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14856088103950224104n; }
    getDsdlSignatureSourceDefinition() { return "com.tmotor.esc.PUSHSCI\nsaturated uint32 data_sequence\nsaturated uint8[<=255] data"; }

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
        this.fields['esc_index'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_mode'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_fdb_rate'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_cmd'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_cmd_val'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['esc_index'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_mode'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_fdb_rate'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_cmd'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_cmd_val'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['esc_index'].pack());
        bits.push(...this.fields['esc_mode'].pack());
        bits.push(...this.fields['esc_fdb_rate'].pack());
        bits.push(...this.fields['esc_cmd'].pack());
        bits.push(...this.fields['esc_cmd_val'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['esc_index'] = this.fields['esc_index'].toObj();
        obj['esc_mode'] = this.fields['esc_mode'].toObj();
        obj['esc_fdb_rate'] = this.fields['esc_fdb_rate'].toObj();
        obj['esc_cmd'] = this.fields['esc_cmd'].toObj();
        obj['esc_cmd_val'] = this.fields['esc_cmd_val'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 6449510226062999563n; }
    getDsdlSignatureSourceDefinition() { return "com.tmotor.esc.FocCtrl\nsaturated uint8 esc_index\nsaturated uint8 esc_mode\nsaturated uint8 esc_fdb_rate\nsaturated uint8 esc_cmd\nsaturated int32 esc_cmd_val"; }

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
        this.fields['data_sequence'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['data'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 255);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['data_sequence'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['data'].items = readArray(data, msg, 255, 8, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['data_sequence'].pack());
        packArray(bits, this.fields['data'].items, 255, 8, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['data_sequence'] = this.fields['data_sequence'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 12308227053680311406n; }
    getDsdlSignatureSourceDefinition() { return "com.tmotor.esc.PUSHCAN\nsaturated uint32 data_sequence\nsaturated uint8[<=255] data"; }

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
        this.fields['esc_index'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_uuid'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_id_set'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_ov_threshold'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_oc_threshold'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_ot_threshold'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_acc_threshold'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_dacc_threshold'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_rotate_dir'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_timing'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_signal_priority'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_led_mode'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_can_rate'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_fdb_rate'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['esc_save_option'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['esc_index'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_uuid'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_id_set'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_ov_threshold'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_oc_threshold'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_ot_threshold'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_acc_threshold'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_dacc_threshold'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_rotate_dir'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_timing'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_signal_priority'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_led_mode'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_can_rate'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_fdb_rate'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['esc_save_option'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['esc_index'].pack());
        bits.push(...this.fields['esc_uuid'].pack());
        bits.push(...this.fields['esc_id_set'].pack());
        bits.push(...this.fields['esc_ov_threshold'].pack());
        bits.push(...this.fields['esc_oc_threshold'].pack());
        bits.push(...this.fields['esc_ot_threshold'].pack());
        bits.push(...this.fields['esc_acc_threshold'].pack());
        bits.push(...this.fields['esc_dacc_threshold'].pack());
        bits.push(...this.fields['esc_rotate_dir'].pack());
        bits.push(...this.fields['esc_timing'].pack());
        bits.push(...this.fields['esc_signal_priority'].pack());
        bits.push(...this.fields['esc_led_mode'].pack());
        bits.push(...this.fields['esc_can_rate'].pack());
        bits.push(...this.fields['esc_fdb_rate'].pack());
        bits.push(...this.fields['esc_save_option'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['esc_index'] = this.fields['esc_index'].toObj();
        obj['esc_uuid'] = this.fields['esc_uuid'].toObj();
        obj['esc_id_set'] = this.fields['esc_id_set'].toObj();
        obj['esc_ov_threshold'] = this.fields['esc_ov_threshold'].toObj();
        obj['esc_oc_threshold'] = this.fields['esc_oc_threshold'].toObj();
        obj['esc_ot_threshold'] = this.fields['esc_ot_threshold'].toObj();
        obj['esc_acc_threshold'] = this.fields['esc_acc_threshold'].toObj();
        obj['esc_dacc_threshold'] = this.fields['esc_dacc_threshold'].toObj();
        obj['esc_rotate_dir'] = this.fields['esc_rotate_dir'].toObj();
        obj['esc_timing'] = this.fields['esc_timing'].toObj();
        obj['esc_signal_priority'] = this.fields['esc_signal_priority'].toObj();
        obj['esc_led_mode'] = this.fields['esc_led_mode'].toObj();
        obj['esc_can_rate'] = this.fields['esc_can_rate'].toObj();
        obj['esc_fdb_rate'] = this.fields['esc_fdb_rate'].toObj();
        obj['esc_save_option'] = this.fields['esc_save_option'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 10704878241490988526n; }
    getDsdlSignatureSourceDefinition() { return "com.tmotor.esc.ParamCfg\nsaturated uint8 esc_index\nsaturated uint32 esc_uuid\nsaturated uint16 esc_id_set\nsaturated uint16 esc_ov_threshold\nsaturated uint16 esc_oc_threshold\nsaturated uint16 esc_ot_threshold\nsaturated uint16 esc_acc_threshold\nsaturated uint16 esc_dacc_threshold\nsaturated int16 esc_rotate_dir\nsaturated uint8 esc_timing\nsaturated uint8 esc_signal_priority\nsaturated uint16 esc_led_mode\nsaturated uint8 esc_can_rate\nsaturated uint16 esc_fdb_rate\nsaturated uint8 esc_save_option"; }

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
        this.fields['servo_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['pwm_input'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 12, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['pos_cmd'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['pos_sensor'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['voltage'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 12, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['current'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 10, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['pcb_temp'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 10, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['motor_temp'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 10, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['error_status'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['servo_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pwm_input'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 12, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pos_cmd'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pos_sensor'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 12, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['current'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 10, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pcb_temp'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 10, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['motor_temp'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 10, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['error_status'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['servo_id'].pack());
        bits.push(...this.fields['pwm_input'].pack());
        bits.push(...this.fields['pos_cmd'].pack());
        bits.push(...this.fields['pos_sensor'].pack());
        bits.push(...this.fields['voltage'].pack());
        bits.push(...this.fields['current'].pack());
        bits.push(...this.fields['pcb_temp'].pack());
        bits.push(...this.fields['motor_temp'].pack());
        bits.push(...this.fields['error_status'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['servo_id'] = this.fields['servo_id'].toObj();
        obj['pwm_input'] = this.fields['pwm_input'].toObj();
        obj['pos_cmd'] = this.fields['pos_cmd'].toObj();
        obj['pos_sensor'] = this.fields['pos_sensor'].toObj();
        obj['voltage'] = this.fields['voltage'].toObj();
        obj['current'] = this.fields['current'].toObj();
        obj['pcb_temp'] = this.fields['pcb_temp'].toObj();
        obj['motor_temp'] = this.fields['motor_temp'].toObj();
        obj['error_status'] = this.fields['error_status'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14595967997430610775n; }
    getDsdlSignatureSourceDefinition() { return "com.himark.servo.ServoInfo\nsaturated uint5 servo_id\nsaturated uint12 pwm_input\nsaturated int16 pos_cmd\nsaturated int16 pos_sensor\nsaturated uint12 voltage\nsaturated uint10 current\nsaturated uint10 pcb_temp\nsaturated uint10 motor_temp\nsaturated uint5 error_status"; }

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
        this.fields['cmd'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 10, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 17);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['cmd'].items = readArray(data, msg, 17, 5, 10, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 10, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['cmd'].items, 17, 5, 10, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 6704140781571969428n; }
    getDsdlSignatureSourceDefinition() { return "com.himark.servo.ServoCmd\nsaturated uint10[<=17] cmd"; }

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
    static CONSTANTS = {'option': {'OPTION_CLEAR': 1}};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['option'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['option'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['option'] = this.fields['option'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 13266968223391520637n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.GetMaintenanceInformation\nsaturated uint8 option\n---\nsaturated uint32 total_rotation_time_min\nsaturated uint24 time_since_maintainence_min"; }

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
    static MAX_BIT_LEN = 56;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['total_rotation_time_min'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['time_since_maintainence_min'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 24, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['total_rotation_time_min'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['time_since_maintainence_min'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 24, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['total_rotation_time_min'].pack());
        bits.push(...this.fields['time_since_maintainence_min'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['total_rotation_time_min'] = this.fields['total_rotation_time_min'].toObj();
        obj['time_since_maintainence_min'] = this.fields['time_since_maintainence_min'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 13266968223391520637n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.GetMaintenanceInformation\nsaturated uint8 option\n---\nsaturated uint32 total_rotation_time_min\nsaturated uint24 time_since_maintainence_min"; }

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
        this.fields['MOS_T'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['CAP_T'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['Motor_T'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['MOS_T'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['CAP_T'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['Motor_T'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['MOS_T'].pack());
        bits.push(...this.fields['CAP_T'].pack());
        bits.push(...this.fields['Motor_T'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['MOS_T'] = this.fields['MOS_T'].toObj();
        obj['CAP_T'] = this.fields['CAP_T'].toObj();
        obj['Motor_T'] = this.fields['Motor_T'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 2635059682396663017n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.StatusMsg3\nsaturated uint8 MOS_T\nsaturated uint8 CAP_T\nsaturated uint8 Motor_T"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['option'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['option'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['option'] = this.fields['option'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1515029499997260797n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.GetMajorConfig\nsaturated uint8 option\n---\nsaturated bool direction\nsaturated bool throttle_source\nsaturated uint6 throttle_channel\nsaturated uint5 led_status\nsaturated uint3 led_color\nsaturated uint4 MSG2_rate\nsaturated uint4 MSG1_rate\nsaturated uint16 positioning_angle\nsaturated uint8[2] reserved"; }

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
    static MAX_BIT_LEN = 56;
    static MIN_BIT_LEN = 56;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['direction'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['throttle_source'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['throttle_channel'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 6, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['led_status'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['led_color'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['MSG2_rate'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 4, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['MSG1_rate'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 4, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['positioning_angle'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['reserved'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_STATIC, 2);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['direction'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['throttle_source'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['throttle_channel'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 6, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['led_status'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 5, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['led_color'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 3, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['MSG2_rate'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 4, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['MSG1_rate'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 4, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['positioning_angle'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['reserved'].items = readArray(data, msg, 2, 0, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['direction'].pack());
        bits.push(...this.fields['throttle_source'].pack());
        bits.push(...this.fields['throttle_channel'].pack());
        bits.push(...this.fields['led_status'].pack());
        bits.push(...this.fields['led_color'].pack());
        bits.push(...this.fields['MSG2_rate'].pack());
        bits.push(...this.fields['MSG1_rate'].pack());
        bits.push(...this.fields['positioning_angle'].pack());
        packArray(bits, this.fields['reserved'].items, 2, 0, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['direction'] = this.fields['direction'].toObj();
        obj['throttle_source'] = this.fields['throttle_source'].toObj();
        obj['throttle_channel'] = this.fields['throttle_channel'].toObj();
        obj['led_status'] = this.fields['led_status'].toObj();
        obj['led_color'] = this.fields['led_color'].toObj();
        obj['MSG2_rate'] = this.fields['MSG2_rate'].toObj();
        obj['MSG1_rate'] = this.fields['MSG1_rate'].toObj();
        obj['positioning_angle'] = this.fields['positioning_angle'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1515029499997260797n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.GetMajorConfig\nsaturated uint8 option\n---\nsaturated bool direction\nsaturated bool throttle_source\nsaturated uint6 throttle_channel\nsaturated uint5 led_status\nsaturated uint3 led_color\nsaturated uint4 MSG2_rate\nsaturated uint4 MSG1_rate\nsaturated uint16 positioning_angle\nsaturated uint8[2] reserved"; }

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
        this.fields['rpm'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['pwm'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['status'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['rpm'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['pwm'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['rpm'].pack());
        bits.push(...this.fields['pwm'].pack());
        bits.push(...this.fields['status'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['rpm'] = this.fields['rpm'].toObj();
        obj['pwm'] = this.fields['pwm'].toObj();
        obj['status'] = this.fields['status'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 582006563404605198n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.StatusMsg1\nsaturated uint16 rpm\nsaturated uint16 pwm\nsaturated uint16 status"; }

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
        this.fields['payload'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 3);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['payload'].items = readArray(data, msg, 3, 2, 8, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['payload'].items, 3, 2, 8, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 20013n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.GetEscID\nsaturated uint8[<=3] payload"; }

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
        this.fields['command'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 14, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 8);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['command'].items = readArray(data, msg, 8, 4, 14, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 14, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        packArray(bits, this.fields['command'].items, 8, 4, 14, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 13686587459509829805n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.RawCommand\nsaturated int14[<=8] command"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['angle'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['option'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['angle'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['option'].pack());
        bits.push(...this.fields['angle'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['option'] = this.fields['option'].toObj();
        obj['angle'] = this.fields['angle'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 9356704346101943818n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SetAngle\nsaturated uint8 option\nsaturated uint16 angle\n---\nsaturated uint8 option\nsaturated uint16[<=2] angle"; }

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
    static MAX_BIT_LEN = 42;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['angle'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 2);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['option'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['angle'].items = readArray(data, msg, 2, 2, 16, tao, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED));
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['option'].pack());
        packArray(bits, this.fields['angle'].items, 2, 2, 16, tao);
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['option'] = this.fields['option'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 9356704346101943818n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SetAngle\nsaturated uint8 option\nsaturated uint16 angle\n---\nsaturated uint8 option\nsaturated uint16[<=2] angle"; }

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
    static CONSTANTS = {'direction': {'DIRECTION_CLOCKWISE': 0, 'DIRECTION_COUNTER_CLOCKWISE': 1, 'DIRECTION_QUERY': 255}};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['direction'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['direction'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['direction'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['direction'] = this.fields['direction'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 11347154688750565992n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SetDirection\nsaturated uint8 direction\n---\nsaturated uint8 direction"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['direction'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['direction'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['direction'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['direction'] = this.fields['direction'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 11347154688750565992n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SetDirection\nsaturated uint8 direction\n---\nsaturated uint8 direction"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14163062053863069151n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SelfTest\n---\nsaturated uint8 status"; }

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
    static CONSTANTS = {'status': {'STATUS_PASS': 0, 'STATUS_FAIL': 1}};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['status'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['status'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['status'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['status'] = this.fields['status'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14163062053863069151n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SelfTest\n---\nsaturated uint8 status"; }

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
    static CONSTANTS = {'option': {'SAVE': 1}, 'color': {'R': 4, 'G': 2, 'B': 1}, 'blink': {'OFF': 0, '1HZ': 1, '2HZ': 2, '5HZ': 5}};
    static MAX_BIT_LEN = 24;
    static MIN_BIT_LEN = 24;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['color'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['blink'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['option'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['color'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['blink'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['option'].pack());
        bits.push(...this.fields['color'].pack());
        bits.push(...this.fields['blink'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['option'] = this.fields['option'].toObj();
        obj['color'] = this.fields['color'].toObj();
        obj['blink'] = this.fields['blink'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 13011951868568747749n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SetLED\nsaturated uint8 option\nsaturated uint8 color\nsaturated uint8 blink\n---\nsaturated uint8 option\nsaturated uint8 color\nsaturated uint8 blink"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['color'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['blink'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['option'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['color'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['blink'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['option'].pack());
        bits.push(...this.fields['color'].pack());
        bits.push(...this.fields['blink'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['option'] = this.fields['option'].toObj();
        obj['color'] = this.fields['color'].toObj();
        obj['blink'] = this.fields['blink'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 13011951868568747749n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SetLED\nsaturated uint8 option\nsaturated uint8 color\nsaturated uint8 blink\n---\nsaturated uint8 option\nsaturated uint8 color\nsaturated uint8 blink"; }

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
        this.fields['input_voltage'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['current'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['temperature'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['input_voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['current'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['input_voltage'].pack());
        bits.push(...this.fields['current'].pack());
        bits.push(...this.fields['temperature'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['input_voltage'] = this.fields['input_voltage'].toObj();
        obj['current'] = this.fields['current'].toObj();
        obj['temperature'] = this.fields['temperature'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 1618439342223069847n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.StatusMsg2\nsaturated int16 input_voltage\nsaturated int16 current\nsaturated uint8 temperature"; }

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
    static CONSTANTS = {'baud': {'BAUD_1MBPS': 0, 'BAUD_500KBPS': 1, 'BAUD_250KBPS': 2, 'BAUD_200KBPS': 3, 'BAUD_100KBPS': 4, 'BAUD_50KBPS': 5}};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['baud'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['baud'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['baud'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['baud'] = this.fields['baud'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 12513680733705724981n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SetBaud\nsaturated uint8 baud\n---"; }

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
    static MAX_BIT_LEN = 0;
    static MIN_BIT_LEN = 0;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 12513680733705724981n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SetBaud\nsaturated uint8 baud\n---"; }

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
    static CONSTANTS = {'source': {'SOURCE_CAN_DIGITAL': 0, 'SOURCE_PWM': 1}};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['source'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['source'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['source'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['source'] = this.fields['source'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 874982191948751514n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SetThrottleSource\nsaturated uint8 source\n---\nsaturated uint8 source"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['source'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['source'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['source'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['source'] = this.fields['source'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 874982191948751514n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SetThrottleSource\nsaturated uint8 source\n---\nsaturated uint8 source"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['node_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['throttle_channel'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['node_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['throttle_channel'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['node_id'].pack());
        bits.push(...this.fields['throttle_channel'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['node_id'] = this.fields['node_id'].toObj();
        obj['throttle_channel'] = this.fields['throttle_channel'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14061306068831745783n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SetID\nsaturated uint8 node_id\nsaturated uint8 throttle_channel\n---\nsaturated uint8 node_id\nsaturated uint8 throttle_channel"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['node_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['throttle_channel'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['node_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['throttle_channel'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['node_id'].pack());
        bits.push(...this.fields['throttle_channel'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['node_id'] = this.fields['node_id'].toObj();
        obj['throttle_channel'] = this.fields['throttle_channel'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 14061306068831745783n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SetID\nsaturated uint8 node_id\nsaturated uint8 throttle_channel\n---\nsaturated uint8 node_id\nsaturated uint8 throttle_channel"; }

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
    static CONSTANTS = {'option': {'READ': 0, 'WRITE': 1}, 'rate': {'500HZ': 1, '250HZ': 2, '200HZ': 3, '100HZ': 4, '50HZ': 5, '20HZ': 6, '10HZ': 7, '1HZ': 8, '0HZ': 9}};
    static MAX_BIT_LEN = 32;
    static MIN_BIT_LEN = 32;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['MSG_ID'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rate'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['option'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['MSG_ID'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rate'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['option'].pack());
        bits.push(...this.fields['MSG_ID'].pack());
        bits.push(...this.fields['rate'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['option'] = this.fields['option'].toObj();
        obj['MSG_ID'] = this.fields['MSG_ID'].toObj();
        obj['rate'] = this.fields['rate'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 2292402871680384491n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SetReportingFrequency\nsaturated uint8 option\nsaturated uint16 MSG_ID\nsaturated uint8 rate\n---\nsaturated uint8 option\nsaturated uint16 MSG_ID\nsaturated uint8 rate"; }

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
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['option'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['MSG_ID'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['rate'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['option'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['MSG_ID'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['rate'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['option'].pack());
        bits.push(...this.fields['MSG_ID'].pack());
        bits.push(...this.fields['rate'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['option'] = this.fields['option'].toObj();
        obj['MSG_ID'] = this.fields['MSG_ID'].toObj();
        obj['rate'] = this.fields['rate'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 2292402871680384491n; }
    getDsdlSignatureSourceDefinition() { return "com.hobbywing.esc.SetReportingFrequency\nsaturated uint8 option\nsaturated uint16 MSG_ID\nsaturated uint8 rate\n---\nsaturated uint8 option\nsaturated uint16 MSG_ID\nsaturated uint8 rate"; }

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
        this.fields['actuator_id'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['actual_position'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['current'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['voltage'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['motor_pwm'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['motor_temperature'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['actuator_id'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['actual_position'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['current'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['motor_pwm'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['motor_temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['actuator_id'].pack());
        bits.push(...this.fields['actual_position'].pack());
        bits.push(...this.fields['current'].pack());
        bits.push(...this.fields['voltage'].pack());
        bits.push(...this.fields['motor_pwm'].pack());
        bits.push(...this.fields['motor_temperature'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['actuator_id'] = this.fields['actuator_id'].toObj();
        obj['actual_position'] = this.fields['actual_position'].toObj();
        obj['current'] = this.fields['current'].toObj();
        obj['voltage'] = this.fields['voltage'].toObj();
        obj['motor_pwm'] = this.fields['motor_pwm'].toObj();
        obj['motor_temperature'] = this.fields['motor_temperature'].toObj();
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
        if (!this.unionFieldIndex) return null;
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

    getDsdlSignature() { return 3008137729260520035n; }
    getDsdlSignatureSourceDefinition() { return "com.volz.servo.ActuatorStatus\nsaturated uint8 actuator_id\nsaturated float16 actual_position\nsaturated uint8 current\nsaturated uint8 voltage\nsaturated uint8 motor_pwm\nsaturated uint8 motor_temperature"; }

    static getDataTypeSignature() {
        return 3008137729260520035n;
    }

    getDataTypeSignature() {
        return 3008137729260520035n;
    }

};
module.exports.com_volz_servo_ActuatorStatus = com_volz_servo_ActuatorStatus;

// JavaScript binding for cuav.equipment.power.CBAT
// Auto Generated Code, DO NOT MODIFY
const cuav_equipment_power_CBAT = class {
    static DTID = 20300;
    static FULL_NAME = 'cuav.equipment.power.CBAT';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 989;
    static MIN_BIT_LEN = 505;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['temperature'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['voltage'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['voltage_cell'] = new ArrayType(new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED), ArrayType.MODE_DYNAMIC, 15);
        this.fields['cell_count'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['current'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['average_current'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['average_power'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['available_energy'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['remaining_capacity'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['full_charge_capacity'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['design_capacity'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['average_time_to_empty'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['average_time_to_full'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['state_of_health'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['state_of_charge'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['max_error'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['serial_number'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['manufacture_date'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['cycle_count'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['over_discharge_count'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['passed_charge'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['nominal_voltage'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['is_powering_off'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['interface_error'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['status_flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 11, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['voltage_cell'].items = readArray(data, msg, 15, 4, 32, false, elementTao => readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED));
        msg.fields['cell_count'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['current'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['average_current'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['average_power'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['available_energy'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['remaining_capacity'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['full_charge_capacity'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['design_capacity'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['average_time_to_empty'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['average_time_to_full'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['state_of_health'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['state_of_charge'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['max_error'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 7, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['serial_number'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['manufacture_date'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['cycle_count'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['over_discharge_count'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['passed_charge'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['nominal_voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 32, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['is_powering_off'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['interface_error'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['status_flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 11, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['temperature'].pack());
        bits.push(...this.fields['voltage'].pack());
        packArray(bits, this.fields['voltage_cell'].items, 15, 4, 32, false);
        bits.push(...this.fields['cell_count'].pack());
        bits.push(...this.fields['current'].pack());
        bits.push(...this.fields['average_current'].pack());
        bits.push(...this.fields['average_power'].pack());
        bits.push(...this.fields['available_energy'].pack());
        bits.push(...this.fields['remaining_capacity'].pack());
        bits.push(...this.fields['full_charge_capacity'].pack());
        bits.push(...this.fields['design_capacity'].pack());
        bits.push(...this.fields['average_time_to_empty'].pack());
        bits.push(...this.fields['average_time_to_full'].pack());
        bits.push(...this.fields['state_of_health'].pack());
        bits.push(...this.fields['state_of_charge'].pack());
        bits.push(...this.fields['max_error'].pack());
        bits.push(...this.fields['serial_number'].pack());
        bits.push(...this.fields['manufacture_date'].pack());
        bits.push(...this.fields['cycle_count'].pack());
        bits.push(...this.fields['over_discharge_count'].pack());
        bits.push(...this.fields['passed_charge'].pack());
        bits.push(...this.fields['nominal_voltage'].pack());
        bits.push(...this.fields['is_powering_off'].pack());
        bits.push(...this.fields['interface_error'].pack());
        bits.push(...this.fields['status_flags'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['temperature'] = this.fields['temperature'].toObj();
        obj['voltage'] = this.fields['voltage'].toObj();
        obj['voltage_cell'] = this.fields['voltage_cell'].toObj(true);
        obj['cell_count'] = this.fields['cell_count'].toObj();
        obj['current'] = this.fields['current'].toObj();
        obj['average_current'] = this.fields['average_current'].toObj();
        obj['average_power'] = this.fields['average_power'].toObj();
        obj['available_energy'] = this.fields['available_energy'].toObj();
        obj['remaining_capacity'] = this.fields['remaining_capacity'].toObj();
        obj['full_charge_capacity'] = this.fields['full_charge_capacity'].toObj();
        obj['design_capacity'] = this.fields['design_capacity'].toObj();
        obj['average_time_to_empty'] = this.fields['average_time_to_empty'].toObj();
        obj['average_time_to_full'] = this.fields['average_time_to_full'].toObj();
        obj['state_of_health'] = this.fields['state_of_health'].toObj();
        obj['state_of_charge'] = this.fields['state_of_charge'].toObj();
        obj['max_error'] = this.fields['max_error'].toObj();
        obj['serial_number'] = this.fields['serial_number'].toObj();
        obj['manufacture_date'] = this.fields['manufacture_date'].toObj();
        obj['cycle_count'] = this.fields['cycle_count'].toObj();
        obj['over_discharge_count'] = this.fields['over_discharge_count'].toObj();
        obj['passed_charge'] = this.fields['passed_charge'].toObj();
        obj['nominal_voltage'] = this.fields['nominal_voltage'].toObj();
        obj['is_powering_off'] = this.fields['is_powering_off'].toObj();
        obj['interface_error'] = this.fields['interface_error'].toObj();
        obj['status_flags'] = this.fields['status_flags'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = cuav_equipment_power_CBAT.CONSTANTS;
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
        if (!this.unionFieldIndex) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return cuav_equipment_power_CBAT.DTID;
    }

    get name() {
        return cuav_equipment_power_CBAT.FULL_NAME;
    }

    get fieldNames() {
        return [
            'temperature',
            'voltage',
            'voltage_cell',
            'cell_count',
            'current',
            'average_current',
            'average_power',
            'available_energy',
            'remaining_capacity',
            'full_charge_capacity',
            'design_capacity',
            'average_time_to_empty',
            'average_time_to_full',
            'state_of_health',
            'state_of_charge',
            'max_error',
            'serial_number',
            'manufacture_date',
            'cycle_count',
            'over_discharge_count',
            'passed_charge',
            'nominal_voltage',
            'is_powering_off',
            'interface_error',
            'status_flags',
        ];
    }

    static sampleMessage() {
        const msg = new cuav_equipment_power_CBAT();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    getDsdlSignature() { return 13031955221207620212n; }
    getDsdlSignatureSourceDefinition() { return "cuav.equipment.power.CBAT\nsaturated float32 temperature\nsaturated float32 voltage\nsaturated float32[<=15] voltage_cell\nsaturated uint8 cell_count\nsaturated float32 current\nsaturated float32 average_current\nsaturated float32 average_power\nsaturated float32 available_energy\nsaturated float32 remaining_capacity\nsaturated float32 full_charge_capacity\nsaturated float32 design_capacity\nsaturated uint16 average_time_to_empty\nsaturated uint16 average_time_to_full\nsaturated uint7 state_of_health\nsaturated uint7 state_of_charge\nsaturated uint7 max_error\nsaturated uint16 serial_number\nsaturated uint16 manufacture_date\nsaturated uint16 cycle_count\nsaturated uint16 over_discharge_count\nsaturated float32 passed_charge\nsaturated float32 nominal_voltage\nsaturated bool is_powering_off\nsaturated uint16 interface_error\nsaturated uint11 status_flags"; }

    static getDataTypeSignature() {
        return 13031955221207620212n;
    }

    getDataTypeSignature() {
        return 13031955221207620212n;
    }

};
module.exports.cuav_equipment_power_CBAT = cuav_equipment_power_CBAT;

// JavaScript binding for mppt.Stream
// Auto Generated Code, DO NOT MODIFY
const mppt_Stream = class {
    static DTID = 20009;
    static FULL_NAME = 'mppt.Stream';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 112;
    static MIN_BIT_LEN = 112;
    constructor() {
        this.kind = CompoundType.KIND_MESSAGE;
        this.union = false;
        this.fields = {};
        this.fields['fault_flags'] = new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['temperature'] = new PrimitiveType(0, PrimitiveType.KIND_SIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['input_voltage'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['input_current'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['input_power'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['output_voltage'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['output_current'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['output_power'] = new PrimitiveType(0, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        msg.fields['fault_flags'] = readPrimitive(data, msg, PrimitiveType.KIND_UNSIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['temperature'] = readPrimitive(data, msg, PrimitiveType.KIND_SIGNED_INT, 8, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['input_voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['input_current'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['input_power'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['output_voltage'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['output_current'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['output_power'] = readPrimitive(data, msg, PrimitiveType.KIND_FLOAT, 16, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...this.fields['fault_flags'].pack());
        bits.push(...this.fields['temperature'].pack());
        bits.push(...this.fields['input_voltage'].pack());
        bits.push(...this.fields['input_current'].pack());
        bits.push(...this.fields['input_power'].pack());
        bits.push(...this.fields['output_voltage'].pack());
        bits.push(...this.fields['output_current'].pack());
        bits.push(...this.fields['output_power'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['fault_flags'] = this.fields['fault_flags'].toObj();
        obj['temperature'] = this.fields['temperature'].toObj();
        obj['input_voltage'] = this.fields['input_voltage'].toObj();
        obj['input_current'] = this.fields['input_current'].toObj();
        obj['input_power'] = this.fields['input_power'].toObj();
        obj['output_voltage'] = this.fields['output_voltage'].toObj();
        obj['output_current'] = this.fields['output_current'].toObj();
        obj['output_power'] = this.fields['output_power'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = mppt_Stream.CONSTANTS;
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
        if (!this.unionFieldIndex) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return mppt_Stream.DTID;
    }

    get name() {
        return mppt_Stream.FULL_NAME;
    }

    get fieldNames() {
        return [
            'fault_flags',
            'temperature',
            'input_voltage',
            'input_current',
            'input_power',
            'output_voltage',
            'output_current',
            'output_power',
        ];
    }

    static sampleMessage() {
        const msg = new mppt_Stream();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    getDsdlSignature() { return 15956419172464550744n; }
    getDsdlSignatureSourceDefinition() { return "mppt.Stream\nsaturated uint8 fault_flags\nsaturated int8 temperature\nsaturated float16 input_voltage\nsaturated float16 input_current\nsaturated float16 input_power\nsaturated float16 output_voltage\nsaturated float16 output_current\nsaturated float16 output_power"; }

    static getDataTypeSignature() {
        return 15956419172464550744n;
    }

    getDataTypeSignature() {
        return 15956419172464550744n;
    }

};
module.exports.mppt_Stream = mppt_Stream;

// JavaScript binding for mppt.OutputEnable
// Auto Generated Code, DO NOT MODIFY
const mppt_OutputEnable_Request = class {
    static DTID = 240;
    static FULL_NAME = 'mppt.OutputEnable';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['enable'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        this.fields['disable'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        skipBits(data, msg, 6);
        msg.fields['enable'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        msg.fields['disable'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...Array(6).fill(0));
        bits.push(...this.fields['enable'].pack());
        bits.push(...this.fields['disable'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['enable'] = this.fields['enable'].toObj();
        obj['disable'] = this.fields['disable'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = mppt_OutputEnable_Request.CONSTANTS;
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
        if (!this.unionFieldIndex) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return mppt_OutputEnable_Request.DTID;
    }

    get name() {
        return mppt_OutputEnable_Request.FULL_NAME;
    }

    get fieldNames() {
        return [
            'enable',
            'disable',
        ];
    }

    static sampleMessage() {
        const msg = new mppt_OutputEnable_Request();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    getDsdlSignature() { return 16871925846104987813n; }
    getDsdlSignatureSourceDefinition() { return "mppt.OutputEnable\nvoid6\nsaturated bool enable\nsaturated bool disable\n---\nvoid7\nsaturated bool enabled"; }

    static getDataTypeSignature() {
        return 16871925846104987813n;
    }

    getDataTypeSignature() {
        return 16871925846104987813n;
    }

};
module.exports.mppt_OutputEnable_Request = mppt_OutputEnable_Request;

// JavaScript binding for mppt.OutputEnable
// Auto Generated Code, DO NOT MODIFY
const mppt_OutputEnable_Response = class {
    static DTID = 240;
    static FULL_NAME = 'mppt.OutputEnable';
    static CONSTANTS = {};
    static MAX_BIT_LEN = 8;
    static MIN_BIT_LEN = 8;
    constructor() {
        this.kind = CompoundType.KIND_SERVICE;
        this.union = false;
        this.fields = {};
        this.fields['enabled'] = new PrimitiveType(0, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
    }

    static unpack(buf, tao=true, bitOffset=0) {
        const data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
        const msg = new this();
        msg.bitOffset = bitOffset;
        skipBits(data, msg, 7);
        msg.fields['enabled'] = readPrimitive(data, msg, PrimitiveType.KIND_BOOLEAN, 1, PrimitiveType.CAST_MODE_SATURATED);
        return msg;
    }
    pack(tao=true) {
        const bits = [];
        bits.push(...Array(7).fill(0));
        bits.push(...this.fields['enabled'].pack());
        if (bits.length < this.constructor.MIN_BIT_LEN || bits.length > this.constructor.MAX_BIT_LEN) {
            throw new RangeError('Encoded message length outside DSDL bounds');
        }
        return bits;
    }
    toObj() {
        const obj = {};
        obj['enabled'] = this.fields['enabled'].toObj();
        obj.getConstant = function(fieldName) {
            const constants = mppt_OutputEnable_Response.CONSTANTS;
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
        if (!this.unionFieldIndex) return null;
        const unionField = this.unionFields[this.unionFieldIndex.value];
        return this.fields[unionField];
    }

    get dataTypeId() {
        return mppt_OutputEnable_Response.DTID;
    }

    get name() {
        return mppt_OutputEnable_Response.FULL_NAME;
    }

    get fieldNames() {
        return [
            'enabled',
        ];
    }

    static sampleMessage() {
        const msg = new mppt_OutputEnable_Response();
        // Initialize fields with sample values
        return msg;
    }

    static calculateBufferSize() {
        return Math.ceil(this.MAX_BIT_LEN / 8);
    }

    getDsdlSignature() { return 16871925846104987813n; }
    getDsdlSignatureSourceDefinition() { return "mppt.OutputEnable\nvoid6\nsaturated bool enable\nsaturated bool disable\n---\nvoid7\nsaturated bool enabled"; }

    static getDataTypeSignature() {
        return 16871925846104987813n;
    }

    getDataTypeSignature() {
        return 16871925846104987813n;
    }

};
module.exports.mppt_OutputEnable_Response = mppt_OutputEnable_Response;

const messages = {};
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
messages[1032] = dronecan_sensors_hygrometer_Hygrometer;
messages[1043] = dronecan_sensors_magnetometer_MagneticFieldStrengthHiRes;
messages[1045] = dronecan_sensors_rpm_RPM;
messages[1140] = dronecan_sensors_rc_RCInput;
messages[16371] = dronecan_protocol_FlexDebug;
messages[344] = dronecan_protocol_GlobalTime;
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
messages[20500] = ardupilot_equipment_power_BatteryTag;
messages[21910] = ardupilot_equipment_proximity_sensor_Proximity;
messages[20790] = ardupilot_equipment_trafficmonitor_TrafficReport;
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
messages[20300] = cuav_equipment_power_CBAT;
messages[20009] = mppt_Stream;
module.exports.messages = messages;
const services = {};
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
services[64] = {'request': dronecan_remoteid_SecureCommand_Request, 'response': dronecan_remoteid_SecureCommand_Response};
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
services[240] = {'request': mppt_OutputEnable_Request, 'response': mppt_OutputEnable_Response};
module.exports.services = services;
