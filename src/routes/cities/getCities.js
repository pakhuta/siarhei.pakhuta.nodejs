import Mongoose from '../../services/mongoDB/mongoose';

export default async function getCities(req, res) {
    res.send(await Mongoose.get('cities'));
}
