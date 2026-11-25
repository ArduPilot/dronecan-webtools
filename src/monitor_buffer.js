const REFRESH_INTERVAL_MS = 100;

function createMonitorBuffer(capacity, publish) {
    let entries = new Array(capacity);
    let oldestIndex = 0;
    let size = 0;
    let timer = null;

    const snapshot = () => Array.from({ length: size },
        (_, index) => entries[(oldestIndex + index) % entries.length]);

    const cancelFlush = () => {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }
    };

    const flush = () => {
        cancelFlush();
        publish(snapshot());
    };

    return {
        push(entry) {
            const index = (oldestIndex + size) % entries.length;
            entries[index] = entry;
            if (size < entries.length) {
                size++;
            } else {
                oldestIndex = (oldestIndex + 1) % entries.length;
            }
            if (timer === null) {
                timer = setTimeout(flush, REFRESH_INTERVAL_MS);
            }
        },
        resize(capacity) {
            const retained = snapshot().slice(-capacity);
            entries = new Array(capacity);
            retained.forEach((entry, index) => {
                entries[index] = entry;
            });
            oldestIndex = 0;
            size = retained.length;
            flush();
        },
        clear() {
            cancelFlush();
            entries.fill(undefined);
            oldestIndex = 0;
            size = 0;
        },
        snapshot,
        flush
    };
}

module.exports = { createMonitorBuffer };
