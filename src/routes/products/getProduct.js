import Storage from '../../services/storage';

export default async function getProduct(req, res) {
    let product = await Storage.get('products', [{ name: 'id', value: req.params.id }]) || {};
    res.send(product);
}
