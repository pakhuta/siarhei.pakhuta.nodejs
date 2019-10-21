import Mongoose from '../../services/mongoDB/mongoose';

export default async function postCity(req, res) {
    try {
        await Mongoose.update('cities', req.params.id, req.body);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(`City hasn't been updated. ${err.message}`);
    }
}
