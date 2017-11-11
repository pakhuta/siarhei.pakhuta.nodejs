import Storage from '../storage';

export default class AuthUtils {
    static getUserByCredentials(login, password) {
        const users = Storage.get('users');
        return users.find(userItem => (userItem.name === login && userItem.password === password));
    }

    static getUserByLogin(login) {
        const users = Storage.get('users');
        return users.find(userItem => (userItem.name === login));
    }
}
