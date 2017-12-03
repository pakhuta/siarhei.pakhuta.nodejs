import Storage from '../storage';

let tokens = new Set();

export default class AuthUtils {
    static getUserByCredentials(login, password) {
        return Storage.get('users', [{ name: 'name', value: login }, { name: 'password', value: password }]);
    }

    static getUserById(userId) {
        return Storage.get('users', [{ name: 'id', value: userId }]);
    }

    static addToken(token) {
        tokens.add(token);
    }

    static isTokenValid(token) {
        return tokens.has(token);
    }
}
