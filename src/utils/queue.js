import EventEmitter from 'eventemitter3';

export default class Queue {
    constructor(handlerTask, maxParallelTasks) {
        this.emitter = new EventEmitter();
        this.handlerTask = handlerTask;
        this.maxParallelTasks = maxParallelTasks;
        this.queue = [];
        this.tasks = [];
    }

    pushToQueue(task) {
        this.queue.push(task);
        this.handlerQueue();
    }

    removeTask(filePath) {
        this.tasks.splice(this.tasks.findIndex(taskFilePath => taskFilePath === filePath), 1);
        this.queue.splice(this.queue.findIndex(taskFilePath => taskFilePath === filePath), 1);
        this.handlerQueue();
    }

    onQueueEmpty(handler) {
        this.emitter.on('queueEmpty', handler);
    }

    handlerQueue() {
        let currentFilePath = this.queue[this.tasks.length];

        if (!currentFilePath) {
            this.emitter.emit('queueEmpty');
            return;
        }

        if (this.tasks.length >= this.maxParallelTasks) {
            return;
        }

        this.tasks.push(currentFilePath);
        this.handlerTask(this, currentFilePath);
    }
}
