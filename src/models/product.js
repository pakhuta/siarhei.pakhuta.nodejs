export default class Product {
    constructor(params) {
        this.id = params.id || process.hrtime().join('');
        this.name = params.name || '';
        this.reviews = params.reviews || [];
    }
}
