import fs from 'fs';
import path from 'path';
import glob from 'glob';
import Output from './output';
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

    static getFilesFromPath(pattern) {
        return new Promise((resolve, reject) => {
            glob(pattern, (err, fileList) => (err) ? (reject(err)) : (resolve(fileList)));
        });
    }
}

function errorHandler(filePath, err) {
    if (err.code === 'ENOENT') {
        Output.write(config.messages.fileNotFound, filePath);
    } else {
        Output.write(err);
    }
}
