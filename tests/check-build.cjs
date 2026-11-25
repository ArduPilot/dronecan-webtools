const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dir = path.resolve(process.argv[2] || 'dist');
for (const name of ['index', 'bus_monitor', 'esc_panel', 'actuator_panel', 'subscriber']) {
    const html = fs.readFileSync(path.join(dir, name + '.html'), 'utf8');
    const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(match => match[1]);
    const entry = (name === 'index' ? 'main' : name) + '.bundle.js';
    assert.equal(scripts.filter(script => script === entry).length, 1, name + ' must include its entry exactly once');
    assert.equal(new Set(scripts).size, scripts.length, name + ' contains duplicate scripts');
    for (const script of scripts) {
        assert.ok(fs.existsSync(path.join(dir, script)), name + ' references a missing script: ' + script);
    }
}
console.log('Verified all five HTML entry points.');
