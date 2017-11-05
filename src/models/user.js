export default class User {
    constructor(params) {
        this.id = params.id || process.hrtime().join('');
        this.name = params.name || '';
    }
}
