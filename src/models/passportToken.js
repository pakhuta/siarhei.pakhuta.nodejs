import jwt from 'jsonwebtoken';

export default class PassportToken {
    constructor(id) {
        this.id = id;
        this.token = jwt.sign({ id }, process.env.SECRET_KEY);
    }
}
