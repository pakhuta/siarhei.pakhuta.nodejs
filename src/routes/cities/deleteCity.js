import Mongoose from '../../services/mongoDB/mongoose';

export default async function deleteCity(req, res) {
    try {
        await Mongoose.delete('cities', [{ name: 'id', value: req.params.id }]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('City hasn\'t been deleted');
    }
}
