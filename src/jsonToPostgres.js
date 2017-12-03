import path from 'path';
import fs from 'fs';
import Sequelize from 'sequelize';
import Output from './utils/output';
import config from './config';

const SOURCES = {
    users: path.join(__dirname, config.dataPath, 'users.json'),
    products: path.join(__dirname, config.dataPath, 'products.json')
};

const sequelize = new Sequelize('postgres', 'postgres', '123456', {
    host: 'localhost',
    port: '5432',
    dialect: 'postgres'
});

class ImportData {
    static readJSON(source) {
        let data = [];

        try {
            data = fs.readFileSync(source);
            return JSON.parse(data.toString());
        } catch (err) {
            Output.write(err);
        }

        return data;
    }

    static users() {
        let data = ImportData.readJSON(SOURCES.users);
        let Users = sequelize.import(path.join(__dirname, 'models/user.js'));

        return Promise.all(data.map(userData => Users.create(userData)));
    }

    static products() {
        let data = ImportData.readJSON(SOURCES.products);
        let Products = sequelize.import(path.join(__dirname, 'models/product.js'));

        return Promise.all(data.map(productData => Products.create(productData)));
    }

    static async run() {
        try {
            await sequelize.authenticate();
            await ImportData.users();
            await ImportData.products();
            Output.write('All data have been migrated to PostgreSQL!');
        } catch (err) {
            Output.write(err);
        }

        process.exit();
    }
}

ImportData.run();

