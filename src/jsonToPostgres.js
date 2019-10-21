import path from 'path';
import Sequelize from 'sequelize';
import Output from './utils/output';
import config from './config';
import File from './utils/file';

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
    static users() {
        let data = File.readJSON(SOURCES.users);
        let Users = sequelize.import(path.join(__dirname, 'models/user.js'));

        return Promise.all(data.map(userData => Users.create(userData)));
    }

    static products() {
        let data = File.readJSON(SOURCES.products);
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

