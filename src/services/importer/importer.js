import ImporterUtils from './importerUtils';

export default class Importer {
    static async import(path) {
        let data = await ImporterUtils.readFile(path);
        return ImporterUtils.convertCSVToJSON(data);
    }

    static importSync(path) {
        let data = ImporterUtils.readFileSync(path);
        return ImporterUtils.convertCSVToJSON(data);
    }
}
