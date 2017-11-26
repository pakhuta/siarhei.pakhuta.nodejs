import http from 'http';
import util from 'util';
import config from '../config';
import Output from '../utils/output';

const server = http.createServer(requestHandler);

server.listen(config.server.port, () => {
    Output.write(util.format('Web server has started at port: %s', config.server.port));
});

function requestHandler(req, res) {
    req.pipe(res);
}
