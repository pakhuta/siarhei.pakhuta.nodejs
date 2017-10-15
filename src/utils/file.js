import fs from 'fs';
import path from 'path';
import output from './output';
import config from '../config';

export default class File {
    static getReadStream(filePath) {
        let stream = fs.createReadStream(filePath);
        stream.on('error', errorHandler.bind(null, filePath));
        return stream;
    }

    static getWriteStream(filePath) {
        let stream = fs.createWriteStream(filePath);
        stream.on('error', errorHandler.bind(null, filePath));
        return stream;
    }

    static getPathForSaveJSON(filePath) {
        let parsedPath = path.parse(filePath);
        return `${parsedPath.dir}/${parsedPath.name}.json`;
    }

    static checkExtname(filePath, ext) {
        let extname = (ext.startsWith('.')) ? (ext) : (`.${ext}`);
        return path.extname(filePath).toLowerCase() === extname.toLowerCase();
    }

    static getFilesFromPath(dirPath, extname, exceptions, emitter, executionParams) {
        executionParams = executionParams || { notProcessedDir: 0, notProcessedFiles: 0 };
        executionParams.notProcessedDir += 1;

        fs.readdir(dirPath, (err, files) => {
            if (err) {
                emitter.emit('readdirError', err);
                return;
            }

            executionParams.notProcessedDir -= 1;
            executionParams.notProcessedFiles += files.length;

            files.forEach(file => {
                let filePath = path.join(dirPath, file);

                fs.stat(filePath, (error, stats) => {
                    if (error) {
                        emitter.emit('readdirError', error);
                        return;
                    }

                    if (stats.isDirectory()) {
                        File.getFilesFromPath(filePath, extname, exceptions, emitter, executionParams);
                    } else if (File.checkExtname(filePath, extname) && !isException(exceptions, file)) {
                        emitter.emit('addFile', filePath);
                    }

                    executionParams.notProcessedFiles -= 1;
                    File.checkingEndOfGetFilesFromPathHandler(executionParams, emitter);
                });
            });

            File.checkingEndOfGetFilesFromPathHandler(executionParams, emitter);
        });
    }

    static checkingEndOfGetFilesFromPathHandler(executionParams, emitter) {
        if (executionParams.notProcessedDir === 0 && executionParams.notProcessedFiles === 0) {
            emitter.emit('addFilesIsEnded');
        }
    }
}

function errorHandler(filePath, err) {
    if (err.code === 'ENOENT') {
        output(config.messages.fileNotFound, filePath);
    } else {
        output(err);
    }
}

function isException(exceptions, file) {
    return !!exceptions.find(exception => exception === file);
}
