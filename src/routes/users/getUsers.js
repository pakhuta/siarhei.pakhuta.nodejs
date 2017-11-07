import Storage from '../services/storage';

export default function getUsers(req, res) {
    res.send(Storage.get('users'));
}
