import Storage from '../../services/storage';

export default async function getProductReviews(req, res) {
    let [product] = await Storage.get('products', [{ name: 'id', value: req.params.id }]);
    let { reviews = [] } = product || {};
    res.send(reviews);
}
