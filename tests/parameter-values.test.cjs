const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { loadModule } = require('./load-module.cjs');
const DSDL = require('../src/dronecan/dsdl');

const melody = loadModule('src/am32_rtttl.js', {}, { Uint8Array });
const paramValues = loadModule('src/ParamEditors/param_value.js', { '../am32_rtttl.js': melody });

function parameter(name, type, val) {
    const param = new DSDL.uavcan_protocol_param_GetSet_Response();
    param.fields.name.fromString(name);
    const value = param.fields.value.msg;
    value.unionFieldIndex.value = value.unionFields.indexOf(type);
    if (typeof val === 'string') value.unionField.fromString(val);
    else if (val instanceof Uint8Array) value.unionField.fromBytes(val);
    else value.unionField.value = val;
    return param;
}

test('parameter table renders the active field of constructed and decoded values', () => {
    const version = parameter('VERSION64', 'integer_value', 9007199254740993n);
    const label = parameter('LABEL', 'string_value', '接收机');
    const enabled = parameter('ENABLED', 'boolean_value', 1);
    const bytes = new Uint8Array([0, 180, 5, 4, 128, 90]);
    const tune = parameter('STARTUP_TUNE', 'string_value', bytes);
    const wireLabel = Buffer.alloc(Math.ceil(label.pack().length / 8));
    label.pack().forEach((bit, i) => { wireLabel[i >> 3] |= bit << (7 - i % 8); });
    const params = { 0: version, 1: label.constructor.unpack(wireLabel), 2: enabled, 3: tune };
    const NodeParam = loadModule('src/NodeParam.js', {
        './ParamEditors/ParamEditorSelector': () => null,
        './ParamEditors/param_value': paramValues,
    }, { window: { localNode: { nodeParams: { 42: params } } } }).default;
    const html = renderToStaticMarkup(React.createElement(NodeParam, { nodeId: 42, nodes: { 42: {} } }));
    for (const value of ['9007199254740993', '接收机', 'Enabled', melody.default.from_am32_startup_melody(bytes, 'Tune')]) {
        assert.ok(html.includes('>' + value + '<'), 'missing rendered value: ' + value);
    }
});

test('integer edits preserve exact 64-bit digits and enforce advertised limits', () => {
    const param = parameter('LIMIT', 'integer_value', 0);
    const parse = text => paramValues.parseNumericParam(text, param);
    assert.equal(parse('-9223372036854775808').value, -9223372036854775808n);
    assert.equal(parse('9007199254740993').value, 9007199254740993n);
    assert.ok(parse('9223372036854775808').error);
    assert.ok(parse('2.5').error);
    const max = param.fields.max_value.msg;
    max.unionFieldIndex.value = max.unionFields.indexOf('integer_value');
    max.unionField.value = 9007199254740992n;
    assert.ok(parse('9007199254740993').error);
    assert.equal(parse('9007199254740992').value, 9007199254740992n);
});
