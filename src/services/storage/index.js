import fs from 'fs';
import path from 'path';
import config from '../../config';
import Output from '../../utils/output';
import Product from '../../models/product';
import User from '../../models/user';

const sources = [
    { name: 'products', Model: Product },
    { name: 'users', Model: User }
];
let storageInstance;

class StorageInstance {
    constructor() {
        sources.forEach(source => {
            try {
                let data = fs.readFileSync(path.join(__dirname, '../..', config.dataPath, `${source.name}.json`));
                this.add(source, JSON.parse(data.toString()));
            } catch (err) {
                Output.write(err);
            }
        });
    }

    add(source, data) {
        let insertedData = [];

        try {
            if (Array.isArray(data) && data.length) {
                insertedData = data.map(dataItem => new source.Model(dataItem));
                this[source.name] = insertedData;
            }
        } catch (err) {
            Output.write(err);
        }

        return insertedData;
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
            if (Array.isArray(data)) {
                data = data.find(dataItem => dataItem[filter.name] === filter.value);
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
