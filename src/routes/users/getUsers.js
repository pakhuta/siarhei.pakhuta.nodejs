import Storage from '../../services/storage';

export default async function getUsers(req, res) {
    res.send(await Storage.get('users'));
}
