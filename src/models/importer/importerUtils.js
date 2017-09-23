import fs from 'fs';
import util from 'util';
import ConvertedDataItem from './convertedDataItem';

export default class ImporterUtils {
    static readFile(path) {
        const readFile = util.promisify(fs.readFile);
        return readFile(path, {encoding: 'utf8'});
    }

    static readFileSync(path) {
        return fs.readFileSync(path, {encoding: 'utf8'});
    }

    static convertCSVToJSON(data) {
        let valueDelimiter = ',';
        let convertedDataArray = [];
        let dataArray = data.split(/\r\n|\n|\r/);
        let propertiesName = dataArray[0].split(valueDelimiter);

        for (let i = 1; i < dataArray.length; i++) {
            convertedDataArray.push(new ConvertedDataItem(propertiesName, dataArray[i].split(valueDelimiter)));
        }

        return JSON.stringify(convertedDataArray);
    }
}