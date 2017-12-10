import Mongoose from '../../services/mongoDB/mongoose';

export default async function deleteUser(req, res) {
    try {
        await Mongoose.delete('users', [{ name: 'id', value: req.params.id }]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('User hasn\'t been deleted');
    }
}
