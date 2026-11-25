const assert = require('node:assert/strict');
const test = require('node:test');
const { setTimeout: wait } = require('node:timers/promises');
const { createMonitorBuffer } = require('../src/monitor_buffer');

test('publishes a burst once and retains only the newest entries in order', async () => {
    const snapshots = [];
    const buffer = createMonitorBuffer(3, entries => snapshots.push(entries));
    for (let index = 0; index < 1000; index++) {
        buffer.push(index);
    }

    assert.deepEqual(snapshots, []);
    assert.deepEqual(buffer.snapshot(), [997, 998, 999]);
    await wait(150);
    assert.deepEqual(snapshots, [[997, 998, 999]]);
});

test('resize flushes the retained records and clear cancels a pending publish', async () => {
    const snapshots = [];
    const buffer = createMonitorBuffer(3, entries => snapshots.push(entries));
    for (const entry of [1, 2, 3, 4]) {
        buffer.push(entry);
    }
    buffer.resize(2);
    assert.deepEqual(snapshots, [[3, 4]]);

    buffer.push(5);
    buffer.clear();
    assert.deepEqual(buffer.snapshot(), []);
    await wait(150);
    assert.deepEqual(snapshots, [[3, 4]]);

    buffer.push(6);
    buffer.flush();
    assert.deepEqual(snapshots, [[3, 4], [6]]);
});
