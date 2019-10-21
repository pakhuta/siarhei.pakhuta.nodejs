import Mongoose from '../mongoDB/mongoose';

let tokens = new Set();

export default class AuthUtils {
    static getUserByCredentials(login, password) {
        return Mongoose.get('users', [{ name: 'name', value: login }, { name: 'password', value: password }]);
    }

    static getUserById(userId) {
        return Mongoose.get('users', [{ name: 'id', value: userId }]);
    }

    static addToken(token) {
        tokens.add(token);
    }

    static isTokenValid(token) {
        return tokens.has(token);
    }
}
