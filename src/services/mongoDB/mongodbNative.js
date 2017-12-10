import path from 'path';
import { MongoClient } from 'mongodb';
import File from '../../utils/file';
import config from '../../config';
import * as Utils from '../../utils';

let instance;

export default class MongodbNative {
    constructor() {
        if (instance) {
            return instance;
        }

        instance = this;
    }

    close() {
        this.db.close();
    }

    fill() {
        return new Promise((resolve, reject) => {
            let cities = File.readJSON(path.join(__dirname, '../..', config.dataPath, 'cities.json'));

            MongodbNative.connect()
                .then(db => {
                    this.db = db;
                    this.db.collection('cities')
                        .insertMany(cities, resolve);
                })
                .catch(reject);
        });
    }

    getRandomCity() {
        return new Promise((resolve, reject) => {
            this.db.collection('cities')
                .find({})
                .project({ _id: 0 })
                .toArray((err, cities) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    let randomIndex = Utils.MathUtils.getRandomInteger(0, cities.length - 1);
                    resolve(cities[randomIndex]);
                });
        });
    }

    static connect() {
        return new Promise((resolve, reject) => {
            const url = 'mongodb://localhost:27017/nodejs_mp_nativeDriver';
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    reject(err);
                    return;
                }

                console.log('Connected to mongodb via native driver!');
                resolve(db);
            });
        });
    }
}
