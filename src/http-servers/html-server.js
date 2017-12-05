import http from 'http';
import util from 'util';
import path from 'path';
import url from 'url';
import split2 from 'split2';
import through2 from 'through2';
import config from '../config';
import Output from '../utils/output';
import File from '../utils/file';
import ResponseUtils from '../utils/responseUtils';

const server = http.createServer(requestHandler);

server.listen(config.server.port, () => {
    Output.write(util.format('Web server has started at port: %s', config.server.port));
});

function requestHandler(req, res) {
    let reqUrl = url.parse(req.url, true);

    if (reqUrl.pathname !== '/') {
        ResponseUtils.sendErrorResponse({ res, msg: 'Wrong request' });
    }

    let { message = 'Hello World' } = reqUrl.query || {};
    let placeholderRegexp = new RegExp(config.placeholderPattern);

    res.setHeader('Content-Type', 'text/html');

    File.getReadStream(path.join(__dirname, '..', config.dataPath, 'index.html'))
        .on('error', err => {
            ResponseUtils.sendErrorResponse({ res, msg: 'File "index.html" has not been found.', err });
        })
        .pipe(split2())
        .pipe(through2((chunk, enc, callback) => {
            try {
                callback(null, chunk.toString().replace(placeholderRegexp, message));
            } catch (err) {
                callback(err);
            }
        }))
        .on('error', err => {
            ResponseUtils.sendErrorResponse({ res, msg: 'File "index.html" has not been found.', err });
        })
        .pipe(res);
}
