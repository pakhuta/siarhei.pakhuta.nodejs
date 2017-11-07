export default class User {
    constructor(params) {
        this.id = params.id || process.hrtime().join('');
        this.name = params.name;
        this.password = params.password;
        this.email = params.email;
    }
}
