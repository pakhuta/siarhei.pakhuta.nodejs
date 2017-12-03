import path from 'path';
import Sequelize from 'sequelize';

const sequelize = new Sequelize('postgres', 'postgres', '123456', {
    host: 'localhost',
    port: '5432',
    dialect: 'postgres'
});

const sources = {
    products: sequelize.import(path.join(__dirname, '../../models/product.js')),
    users: sequelize.import(path.join(__dirname, '../../models/user.js'))
};

export default class Storage {
    static init() {
        return sequelize.authenticate();
    }

    static get(sourceName, filters = []) {
        let where = {};

        filters.forEach(filter => {
            where[filter.name] = filter.value;
        });

        return sources[sourceName].findAll({
            where,
            raw: true,
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
    }

    static async add(sourceName, data) {
        await sources[sourceName].create(data);
        return data;
    }
}
