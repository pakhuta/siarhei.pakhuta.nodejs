import Output from './output';

const defaultErrorMsg = 'There was an error on the server side';

export default class ResponseUtils {
    static sendErrorResponse({ res, err, msg = defaultErrorMsg }) {
        Output.write(err || msg);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(msg));
    }

    static handleError(res) {
        res.on('error', err => {
            ResponseUtils.sendErrorResponse({ res, err });
        });
    }
}
