import parseArgs from 'minimist';
import path from 'path';
import through2 from 'through2';
import split2 from 'split2';
import request from 'request';
import config from '../config';
import Output from './output';
import File from './file';
import StreamUtils from './streamUtils';
import * as services from '../services';

const { ImporterUtils } = services;
const supportedFileFormats = ['csv'];
const externalCSS = 'https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css';

export default class Streams {
    static inputOutput(filePath) {
        File.getReadStream(filePath)
            .pipe(Output.getStream());
    }

    static transformFile(filePath, isSaveToFile) {
        let csvColumnsName;
        let isFirstChunk = true;
        let isSupported = supportedFileFormats.some(fileFormat => File.checkExtname(filePath, fileFormat));

        if (!isSupported) {
            Output.write(config.messages.notSupportedFileFormats, supportedFileFormats.join(', '));
            return;
        }

        let readStream = File.getReadStream(filePath);
        let writeStream = isSaveToFile ? File.getWriteStream(File.getPathForSaveJSON(filePath)) : Output.getStream();

        readStream
            .pipe(split2())
            .pipe(through2((chunk, enc, callback) => {
                if (!csvColumnsName) {
                    csvColumnsName = ImporterUtils.getCSVColumnsName(chunk.toString());
                    callback(null, '[');
                } else {
                    try {
                        let jsonChunk = ImporterUtils.convertCSVRowToJSON(chunk.toString(), csvColumnsName);
                        if (!isFirstChunk) {
                            jsonChunk = `,${jsonChunk}`;
                        }
                        isFirstChunk = false;
                        callback(null, jsonChunk);
                    } catch (err) {
                        callback(err);
                    }
                }
            }, function flush(callback) {
                this.push(']');
                callback();
            }))
            .pipe(writeStream);
    }

    static transform() {
        Output.write(config.messages.typeDataToTransform);

        process.stdin
            .pipe(Streams.transformToUpperCase())
            .pipe(through2((chunk, enc, callback) => {
                process.stdin.end();
                Output.write(chunk);
                callback();
            }));
    }

    static async cssBundler(dirPath) {
        const bundleName = 'bundle.css';
        const cssPattern = '**/*.css';
        let bundleFilePath = path.join(dirPath, bundleName);
        let writeStream = File.getWriteStream(bundleFilePath);

        try {
            let cssFilesList = await File.getFilesFromPath(path.join(dirPath, cssPattern));

            let sources = cssFilesList.concat(request.get(externalCSS));
            Streams.combineStreams(sources, writeStream)
                .on('finish', () => {
                    Output.write(config.messages.cssBundleSuccess, bundleFilePath);
                })
                .on('error', () => {
                    Output.write(config.messages.cssBundleFail, bundleFilePath);
                });
        } catch (err) {
            Output.write(config.messages.cssBundleFail, bundleFilePath);
        }
    }

    static printHelpMessage() {
        File.getReadStream(path.join(path.dirname(module.filename), config.helpFile))
            .pipe(Output.getStream());
    }

    static transformToUpperCase() {
        return through2((chunk, enc, callback) => {
            try {
                callback(null, chunk.toString().toUpperCase());
            } catch (err) {
                callback(err);
            }
        });
    }

    static combineStreams(sources, initialWriteStream) {
        let completedStreamsCount = 0;
        return sources
            .map(source => (typeof source === 'string') ? (File.getReadStream(source)) : (source))
            .reduce((writeStream, currentReadStream) => {
                currentReadStream
                    .on('end', () => {
                        completedStreamsCount++;
                        if (completedStreamsCount === sources.length) {
                            writeStream.end();
                        }
                    })
                    .pipe(writeStream, { end: false });
                return writeStream;
            }, initialWriteStream);
    }
}

const handlers = new Map([
    ['io', {
        handler: Streams.inputOutput,
        requiredArgs: ['file']
    }],
    ['transform-file', {
        handler: Streams.transformFile,
        requiredArgs: ['file', 'save']
    }],
    ['transform', {
        handler: Streams.transform,
        requiredArgs: []
    }],
    ['bundle-css', {
        handler: Streams.cssBundler,
        requiredArgs: ['path']
    }],
    ['help', {
        handler: Streams.printHelpMessage,
        requiredArgs: []
    }]
]);

init();

function init() {
    if (!module.parent) {
        run();
    }
}

function run() {
    const processArgs = parseArgs(process.argv, {
        alias: config.argParams.alias,
        default: {
            save: false
        }
    });
    let action;
    let handlerParams;
    let missedParams;
    let handlerArgs;

    process.stdin.setEncoding('utf8');

    if (Object.keys(processArgs).length === 1) {
        Streams.printHelpMessage();
        return;
    }

    action = StreamUtils.getAction(processArgs);
    handlerParams = handlers.get(action);
    if (!handlerParams) {
        Output.write(config.messages.wrongActionType, action);
        return;
    }

    missedParams = StreamUtils.checkRequiredParams(processArgs, handlerParams);
    if (missedParams.length) {
        Output.write(config.messages.requiredArgumentNotSpecified, missedParams.join(', '));
        return;
    }

    handlerArgs = StreamUtils.getHandlerArguments(processArgs, handlerParams);
    handlerParams.handler(...handlerArgs);
}
