import fs from 'fs';
import util from 'util';
import ConvertedDataItem from './convertedDataItem';

export default class ImporterUtils {
    static readFile(path) {
        const readFile = util.promisify(fs.readFile);
        return readFile(path, { encoding: 'utf8' });
    }

    static readFileSync(path) {
        return fs.readFileSync(path, { encoding: 'utf8' });
    }

    static convertCSVToJSON(rawData) {
        const valueDelimiter = ',';
        let dataArray = rawData.split(/\r\n|\n|\r/);
        let propertiesName = dataArray[0].split(valueDelimiter);
        const convertedDataArray = dataArray.slice(1).map(data => new ConvertedDataItem(propertiesName, data.split(valueDelimiter)));

        return JSON.stringify(convertedDataArray);
    }
}
