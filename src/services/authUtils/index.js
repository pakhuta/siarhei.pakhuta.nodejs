import Storage from '../storage';

export default class AuthUtils {
    static getUserByCredentials(login, password) {
        const users = Storage.get('users');
        return users.find(userItem => (userItem.name === login && userItem.password === password));
    }

    static getUserById(userId) {
        const users = Storage.get('users');
        return users.find(userItem => (userItem.id === userId));
    }

    static findToken(token) {
        return Storage.get('token', [{ value: token }])[0];
    }
}
