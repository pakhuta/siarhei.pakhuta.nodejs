import util from 'util';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';
import * as services from './services';
import config from './config';
import cookiesParser from './middlewares/cookiesParser';
import queryParser from './middlewares/queryParser';
import ResponseUtils from './utils/responseUtils';
import routes from './routes';
import initPassport from './routes/auth/passport';
import Output from './utils/output';
import * as Mongodb from './services/mongoDB';

const app = express();

process.env.SECRET_KEY = process.env.SECRET_KEY || 'secretKey';
process.env.PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(session({
    secret: 'nodejsmp',
    saveUninitialized: true,
    resave: true,
}));

app.use(cookiesParser);
app.use(queryParser);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use('/', routes);
app.use((err, req, res, next) => {
    ResponseUtils.sendErrorResponse({ res, err, msg: `Failed request processing: ${req.url}` });
    next(err);
});

initPassport();
init();

// let user1 = new models.User({});
// let product1 = new models.Product({});
let dirWatcher = new services.DirWatcher();
let importer = services.Importer;

// console.log(user1, product1);

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

async function init() {
    addEventListeners();

    try {
        // await Storage.init();
        let mongodbNative = new Mongodb.MongodbNative();
        Mongodb.Mongoose.connect();

        await mongodbNative.fill();
        Mongodb.Mongoose.fillDB();
        console.log(`Application: "${config.name}" has been started`);
    } catch (err) {
        Output.write(err);
        process.exit(1);
    }
}

function addEventListeners() {
    process.on('SIGINT', () => {
        let mongodbNative = new Mongodb.MongodbNative();
        mongodbNative.close();
        mongoose.connection.close(() => {
            Output.write('Disconnected from databases');
            process.exit(0);
        });
    });

    process.on('uncaughtException', err => {
        console.error(util.format('Application got uncaught exception: %O', err));
    });
}

export default app;
