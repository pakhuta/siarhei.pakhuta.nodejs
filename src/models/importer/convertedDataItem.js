export default class ConvertedDataItem {
    constructor(propertiesName, propertiesValue) {
        propertiesName.forEach((propName, index) => {
            this[propName] = propertiesValue[index];
        });
    }
}