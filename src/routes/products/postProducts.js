import Storage from '../../services/storage';

export default async function getProducts(req, res) {
    res.send(await Storage.add('products', req.body));
}
