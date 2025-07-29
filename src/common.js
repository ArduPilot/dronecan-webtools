function secondsToTime(seconds) {
    seconds = Math.max(0, Math.floor(seconds));
    const date = new Date(seconds * 1000);
    const timeStr = date.toISOString().substr(11, 8);
    return seconds < 3600 ? timeStr.slice(3) : timeStr;
}

export { secondsToTime };