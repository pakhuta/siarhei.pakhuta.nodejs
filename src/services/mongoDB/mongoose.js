import path from 'path';
import mongoose from 'mongoose';
import File from '../../utils/file';
import config from '../../config';
import * as Scheme from '../../scheme';
import * as Utils from '../../utils';

const SOURCES = [
    {
        name: 'cities',
        path: path.join(__dirname, '../..', config.dataPath, 'cities.json'),
        schema: Scheme.CitySchema
    },
    {
        name: 'products',
        path: path.join(__dirname, '../..', config.dataPath, 'products.json'),
        schema: Scheme.ProductSchema
    },
    {
        name: 'users',
        path: path.join(__dirname, '../..', config.dataPath, 'users.json'),
        schema: Scheme.UserSchema
    }
];
const EXCLUDED_FIELDS = '-_id -__v';

export default class Mongoose {
    static connect() {
        const url = 'mongodb://localhost:27017/nodejs_mp_mongoose';

        mongoose.connection.openUri(url);
        this.db = mongoose.connection;
        this.db.once('open', () => {
            console.log('Connected to mongodb via Mongoose!');
        });
    }

    static async getRandomCity() {
        let cities = await Mongoose.get('cities');
        let randomIndex = Utils.MathUtils.getRandomInteger(0, cities.length - 1);

        return cities[randomIndex];
    }

    static get(modelName, filters = []) {
        return new Promise((resolve, reject) => {
            mongoose.model(modelName)
                .find(Mongoose.getWhere(filters))
                .select(EXCLUDED_FIELDS)
                .exec((err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(data);
                });
        });
    }

    static async add(modelName, data) {
        let Model = mongoose.model(modelName);
        let doc = new Model(data);

        Mongoose.addLastModifiedDate(doc);
        await doc.save();

        return data;
    }

    static delete(modelName, filters = []) {
        return new Promise((resolve, reject) => {
            mongoose.model(modelName)
                .deleteOne(Mongoose.getWhere(filters))
                .exec((err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(data);
                });
        });
    }

    static update(modelName, id, data) {
        let Model = mongoose.model(modelName);
        Mongoose.addLastModifiedDate(data);

        return Model.update({ id }, data, { upsert: true });
    }

    static fillDB() {
        SOURCES.forEach(source => {
            let data = File.readJSON(source.path);
            let Model = mongoose.model(source.name, source.schema);

            Model.insertMany(data)
                .catch(err => console.log(err.message));
        });
    }

    static getWhere(filters) {
        let where = {};

        filters.forEach(filter => {
            where[filter.name] = filter.value;
        });

        return where;
    }

    static addLastModifiedDate(doc) {
        doc.lastModifiedDate = Date.now();
    }
}
