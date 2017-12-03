import util from 'util';
import express from 'express';
import passport from 'passport';
import Sequelize from 'sequelize';
import * as models from './models';
import * as services from './services';
import config from './config';
import cookiesParser from './middlewares/cookiesParser';
import queryParser from './middlewares/queryParser';
import ResponseUtils from './utils/responseUtils';
import routes from './routes';
import authVerification from './middlewares/authVerification';
import PassportLocalStrategy from './routes/auth/passport/localStrategy';

const app = express();
const sequelize = new Sequelize('postgres', 'postgres', '123456', {
    host: 'localhost',
    port: '5432',
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false
});

let Users;

sequelize.authenticate()
    .then(() => {
        console.log('DB success');
        Users = sequelize.define('users', {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            name: Sequelize.STRING,
            password: Sequelize.STRING,
            email: Sequelize.STRING
        });

        return Users.sync();
    })
    .then(() => Users.create({
        id: '1',
        name: 'asd',
        password: '1234',
        email: 'asd@ddd.com'
    }))
    .then(() => Users.findOne({ where: { name: 'asd' } }))
    .then((user) => {
        console.log('##############');
        console.dir(user);
    })
    .catch((err) => console.dir(err));

process.env.SECRET_KEY = process.env.SECRET_KEY || 'secretKey';

app.disable('x-powered-by');
app.use(cookiesParser);
app.use(queryParser);
app.use(authVerification);
app.use(passport.initialize());
app.use(express.json());
app.use((err, req, res, next) => {
    ResponseUtils.sendErrorResponse({ res, err, msg: `Failed request processing: ${req.url}` });
    next(err);
});
app.use('/', routes);
PassportLocalStrategy.use();

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
