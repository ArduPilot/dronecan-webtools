/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/


const jspack = require("jspack").jspack;

function packBigInt64LE(value) {
    const low = Number(value & 0xFFFFFFFFn);
    const high = Number((value >> 32n) & 0xFFFFFFFFn);
    return jspack.Pack("<II", [low, high]);
}

function crc16FromBytes(buffer, initial = 0xFFFF) {
    let crc = Number(initial);
    for (let byte of buffer) {
        crc ^= byte << 8;  // Move byte to MSB of 16-bit CRC
        for (let i = 0; i < 8; i++) {
            if (crc & 0x8000) {  // Check MSB
                crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
            } else {
                crc = (crc << 1) & 0xFFFF;
            }
        }
    }
    return crc & 0xFFFF;
}

module.exports = {
    crc16FromBytes, packBigInt64LE
};