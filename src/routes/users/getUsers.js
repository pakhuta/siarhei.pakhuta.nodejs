import Mongoose from '../../services/mongoDB/mongoose';

export default async function getUsers(req, res) {
    res.send(await Mongoose.get('users'));
}
