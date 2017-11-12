import fs from 'fs';
import path from 'path';
import config from '../../config';
import Output from '../../utils/output';
import Product from '../../models/product';
import User from '../../models/user';

const sources = [
    { name: 'products', Model: Product, hasFile: true },
    { name: 'users', Model: User, hasFile: true },
    { name: 'token', Model: null, hasFile: false }
];
let storageInstance;

class StorageInstance {
    constructor() {
        sources.forEach(source => {
            if (source.hasFile) {
                try {
                    let data = fs.readFileSync(path.join(__dirname, '../..', config.dataPath, `${source.name}.json`));
                    this.add(source, JSON.parse(data.toString()));
                } catch (err) {
                    Output.write(err);
                }
            }
        });
    }

    add(source, data) {
        let insertedData = [];
        let isDataArray = Array.isArray(data);

        try {
            if (!this[source.name]) {
                this[source.name] = [];
            }

            if (!isDataArray) {
                data = [data];
            }

            insertedData = data.map(dataItem => (source.Model) ? (new source.Model(dataItem)) : (dataItem));
            this[source.name] = this[source.name].concat(insertedData);
        } catch (err) {
            Output.write(err);
        }

        return (isDataArray) ? (insertedData) : (insertedData[0]);
    }

    static getSourceParams(sourceName) {
        return sources.find(source => source.name === sourceName);
    }
}

export default class Storage {
    static get(sourceName, filters = []) {
        if (!storageInstance) {
            storageInstance = new StorageInstance();
        }

        let data = storageInstance[sourceName];

        filters.forEach(filter => {
            if (filter.name) {
                data = data.filter(dataItem => dataItem[filter.name] === filter.value);
            } else {
                data = data.filter(dataItem => dataItem === filter.value);
            }
        });

        return data;
    }

    static add(sourceName, data) {
        if (!storageInstance) {
            storageInstance = new StorageInstance();
        }

        return storageInstance.add(StorageInstance.getSourceParams(sourceName), data);
    }
}
