import http from 'http';
import util from 'util';
import config from '../config';
import Output from '../utils/output';
import ResponseUtils from '../utils/responseUtils';

const product = {
    id: 1,
    name: 'Supreme T-Shirt',
    brand: 'Supreme',
    price: 99.99,
    options: [
        { color: 'blue' },
        { size: 'XL' }
    ]
};
const server = http.createServer(requestHandler);

server.listen(config.server.port, () => {
    Output.write(util.format('Web server has started at port: %s', config.server.port));
});

function requestHandler(req, res) {
    try {
        let jsonData = JSON.stringify(product);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(jsonData);
    } catch (err) {
        ResponseUtils.sendErrorResponse({ res });
    }
}
