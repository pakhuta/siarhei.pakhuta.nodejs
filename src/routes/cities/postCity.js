import Mongoose from '../../services/mongoDB/mongoose';

export default async function postCity(req, res) {
    try {
        res.send(await Mongoose.add('cities', req.body));
    } catch (err) {
        res.status(500).send(`City hasn't been added. ${err.message}`);
    }
}
