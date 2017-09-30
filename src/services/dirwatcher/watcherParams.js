export default class WatcherParams {
    constructor(watcher, delay, handler) {
        this.watcher = watcher;
        this.delay = delay;
        this.handler = handler;
        this.setTimer(delay);
    }

    updateWatcherInterval(delay) {
        clearImmediate(this.timer);
        this.setTimer(delay);
    }

    setTimer(delay) {
        this.timer = setInterval(this.handler, delay);
    }
}
