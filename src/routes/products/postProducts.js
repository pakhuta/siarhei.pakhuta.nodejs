import Storage from '../../services/storage';

export default function getProducts(req, res) {
    res.send(Storage.add('products', req.body));
}
