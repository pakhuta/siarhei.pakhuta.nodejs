import Mongoose from '../../services/mongoDB/mongoose';

export default async function getProductReviews(req, res) {
    let [product] = await Mongoose.get('products', [{ name: 'id', value: req.params.id }]);
    let { reviews = [] } = product || {};
    res.send(reviews);
}
