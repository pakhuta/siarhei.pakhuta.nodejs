import Mongoose from '../../services/mongoDB/mongoose';

export default async function getProduct(req, res) {
    let product = await Mongoose.get('products', [{ name: 'id', value: req.params.id }]) || {};
    res.send(product);
}
