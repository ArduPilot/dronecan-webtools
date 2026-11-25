const fs = require('node:fs');
const { createRequire } = require('node:module');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { runInNewContext } = require('node:vm');
const { webcrypto } = require('node:crypto');
const babel = require('@babel/core');

function loadModule(filename, overrides = {}, globals = {}) {
    const fullPath = path.resolve(__dirname, '..', filename);
    const requireRelative = createRequire(fullPath);
    const module = { exports: {} };
    const compiled = babel.transformSync(fs.readFileSync(fullPath, 'utf8'), {
        babelrc: false,
        configFile: false,
        presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-react'],
        plugins: [({ types }) => ({
            visitor: {
                MemberExpression(expression) {
                    const { object, property, computed } = expression.node;
                    if (!computed && types.isMetaProperty(object) && object.meta.name === 'import'
                        && object.property.name === 'meta' && types.isIdentifier(property, { name: 'url' })) {
                        expression.replaceWith(types.stringLiteral(pathToFileURL(fullPath).href));
                    }
                }
            }
        })]
    }).code;
    runInNewContext(compiled, {
        module,
        exports: module.exports,
        require: (name) => overrides[name] ?? requireRelative(name),
        crypto: webcrypto,
        clearTimeout,
        setTimeout,
        ...globals
    }, { filename: fullPath });
    return module.exports;
}

module.exports = { loadModule };
