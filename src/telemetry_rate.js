const TELEMETRY_WINDOW_MS = 1000;
const TELEMETRY_REFRESH_MS = 250;

function sampleTelemetryRate(previous, now) {
    const windowStart = previous?.windowStart ?? now;
    const intervals = previous ? previous.intervals + 1 : 0;
    const elapsed = now - windowStart;
    if (elapsed >= TELEMETRY_WINDOW_MS) {
        return { windowStart: now, lastReceivedAt: now, intervals: 0, hz: intervals * 1000 / elapsed };
    }
    return { windowStart, lastReceivedAt: now, intervals, hz: previous?.hz ?? 0 };
}

function expireTelemetryRates(records, now) {
    const expired = ({ rate }) => rate && (rate.hz > 0 || rate.intervals > 0)
        && now - rate.lastReceivedAt >= TELEMETRY_WINDOW_MS;
    if (!records.some(expired)) return records;
    return records.map(record => expired(record)
        ? { ...record, rate: sampleTelemetryRate(null, record.rate.lastReceivedAt) }
        : record);
}

module.exports = { TELEMETRY_WINDOW_MS, TELEMETRY_REFRESH_MS, sampleTelemetryRate, expireTelemetryRates };
