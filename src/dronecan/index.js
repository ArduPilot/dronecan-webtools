/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

const Node = require('./node');
const TransferManager = require('./transfer_manager');
const Frame = require('./frame');
const ArrayType = require('./array_type');
const CompoundType = require('./compound_type');
const PrimitiveType = require('./primitive_type');
const DSDL = require('./dsdl');

function parseFrameMessage(messageId, buffer) {
    const MessageClass = DSDL.messages[messageId];
    if (!MessageClass) {
         console.error(`Unknown message id: ${messageId}`);
         return null;
    }
    return MessageClass.unpack(buffer);
}

function toYaml(msg) {
}

module.exports = {
    Node,
    TransferManager,
    Frame,
    ArrayType,
    CompoundType,
    PrimitiveType,
    DSDL,
    parseFrameMessage
};