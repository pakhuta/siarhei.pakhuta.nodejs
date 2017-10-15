import fs from 'fs';
import util from 'util';
import ConvertedDataItem from './convertedDataItem';

export default class ImporterUtils {
    static get valueDelimiter() {
        return ',';
    }

    static readFile(path) {
        const readFile = util.promisify(fs.readFile);
        return readFile(path, { encoding: 'utf8' });
    }

    static readFileSync(path) {
        return fs.readFileSync(path, { encoding: 'utf8' });
    }

    static convertCSVToJSON(rawData) {
        let dataArray = rawData.split(/\r\n|\n|\r/);
        let propertiesName = ImporterUtils.getCSVColumnsName(dataArray[0]);

        const convertedDataArray = dataArray.slice(1)
            .map(data => ImporterUtils.convertCSVRowToObject(data, propertiesName));


        return JSON.stringify(convertedDataArray);
    }

    static convertCSVRowToJSON(rowData, propertiesName) {
        return JSON.stringify(ImporterUtils.convertCSVRowToObject(rowData, propertiesName));
    }

    static getCSVColumnsName(columnsNameRow) {
        return columnsNameRow && columnsNameRow.split(ImporterUtils.valueDelimiter);
    }

    static convertCSVRowToObject(rowData, propertiesName) {
        return new ConvertedDataItem(propertiesName, rowData.split(ImporterUtils.valueDelimiter));
    }
}
