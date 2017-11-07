import Storage from '../../services/storage';

export default function getProduct(req, res) {
    let product = Storage.get('products', [{ name: 'id', value: req.params.id }]) || {};
    res.send(product);
}
