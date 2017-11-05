import util from 'util';
import express from 'express';
import * as models from './models';
import * as services from './services';
import config from './config';
import cookiesParser from './middlewares/cookiesParser';
import queryParser from './middlewares/queryParser';
import ResponseUtils from './utils/responseUtils';
import routes from './routes';

const app = express();

app.use(cookiesParser);
app.use(queryParser);
app.use(express.json());
app.use((err, req, res, next) => {
    ResponseUtils.sendErrorResponse({ res, err, msg: `Failed request processing: ${req.url}` });
    next(err);
});
app.use('/', routes);

init();

console.log(`Application: "${config.name}" has been started`);

let user1 = new models.User({});
let product1 = new models.Product({});
let dirWatcher = new services.DirWatcher();
let importer = services.Importer;

console.log(user1, product1);

dirWatcher.on('dirwatcher:changed', async path => {
    try {
        console.log(await importer.import(path));
    } catch (err) {
        console.log(err);
    }
});

dirWatcher.on('dirwatcher:changed', path => {
    try {
        console.log(importer.importSync(path));
    } catch (err) {
        console.log(err);
    }
});

dirWatcher.watch(`${__dirname}/${config.dataPath}`, 3000);

// import * as utils from './utils';
// use "streams.js" as module
// utils.Streams.printHelpMessage();

function init() {
    process.on('uncaughtException', err => {
        console.error(util.format('Application got uncaught exception: %O', err));
    });
}

export default app;
