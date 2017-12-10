import Mongoose from '../../services/mongoDB/mongoose';

export default async function getProducts(req, res) {
    res.send(await Mongoose.get('products'));
}
