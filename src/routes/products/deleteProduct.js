import Mongoose from '../../services/mongoDB/mongoose';

export default async function deleteProduct(req, res) {
    try {
        await Mongoose.delete('products', [{ name: 'id', value: req.params.id }]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Product hasn\'t been deleted');
    }
}
