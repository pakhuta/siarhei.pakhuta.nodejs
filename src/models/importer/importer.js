import ImporterUtils from './importerUtils';

export default class Importer {
    static import(path) {
        return ImporterUtils.readFile(path).then(ImporterUtils.convertCSVToJSON);
    }

    static importSync(path) {
        let data = ImporterUtils.readFileSync(path);
        return ImporterUtils.convertCSVToJSON(data);
    }
}