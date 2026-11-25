import AM32_Rtttl from '../am32_rtttl.js';

export function getParamType(compound) {
    const value = compound.msg;
    return value.unionFields[value.unionFieldIndex.value].replace(/_value$/, '');
}

export function getParamValue(compound, name) {
    const field = compound.msg.unionField;
    switch (getParamType(compound)) {
        case 'empty':
            return null;
        case 'string':
            return name === 'STARTUP_TUNE'
                ? AM32_Rtttl.from_am32_startup_melody(field.toBytes(), 'Tune')
                : field.toString();
        default:
            return field.value;
    }
}

export function parseNumericParam(input, param) {
    const integer = getParamType(param.fields.value) === 'integer';
    const text = input.trim();
    if (integer && !/^[+-]?\d+$/.test(text)) return { error: 'Enter a whole number' };
    const value = integer ? BigInt(text) : Number(text);
    if (!integer && (!text || !Number.isFinite(value))) return { error: 'Enter a finite number' };

    const fieldRange = param.fields.value.msg.unionField.value_range;
    const min = getParamValue(param.fields.min_value) ?? fieldRange.min;
    const max = getParamValue(param.fields.max_value) ?? fieldRange.max;
    if (value < min || value > max) return { error: `Value must be between ${min} and ${max}` };
    return { value };
}
