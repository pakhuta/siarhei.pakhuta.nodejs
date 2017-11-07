import Storage from '../services/storage';

export default function getProductReviews(req, res) {
    let { reviews = [] } = Storage.get('products', [{ name: 'id', value: req.params.id }]) || {};
    res.send(reviews);
}
