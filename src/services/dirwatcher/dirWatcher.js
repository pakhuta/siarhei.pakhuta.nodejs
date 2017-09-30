import fs from 'fs';
import EventEmitter from 'eventemitter3';
import WatcherParams from './watcherParams';

export default class DirWatcher {
    constructor() {
        this.emitter = new EventEmitter();
        this.changedFiles = new Set();
        this.watchers = new Map();
    }

    watch(path, delay) {
        if (this.watchers.has(path)) {
            let watcherParams = this.watchers.get(path);
            if (watcherParams.delay !== delay) {
                watcherParams.updateWatcherInterval(delay);
            }
        } else {
            this.watchers.set(path, new WatcherParams(this.setPathWatcher(path), delay, this.getHandler(path)));
        }
    }

    setPathWatcher(path) {
        let watcher;
        try {
            watcher = fs.watch(path, (eventType, filename) => {
                this.changedFiles.add(filename);
            });
        } catch (err) {
            console.dir(err);
        }

        return watcher;
    }

    getHandler(path) {
        return () => {
            if (this.changedFiles.size) {
                this.changedFiles.forEach(fileName => {
                    this.emitter.emit('dirwatcher:changed', `${path}/${fileName}`);
                    this.changedFiles.delete(fileName);
                });
            }
        };
    }

    on(...args) {
        this.emitter.on(...args);
    }
}
