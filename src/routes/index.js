import express from 'express';
import getProducts from './getProducts';
import getProduct from './getProduct';
import getProductReviews from './getProductReviews';
import postProducts from './postProducts';
import getUsers from './getUsers';

const router = express.Router();

router.get('/', (req, res) => {
    res.send({ parsedQuery: req.parsedQuery, parsedCookies: req.parsedCookies });
});

router.get('/api/products', getProducts);
router.get('/api/products/:id', getProduct);
router.get('/api/products/:id/reviews', getProductReviews);
router.post('/api/products', postProducts);
router.get('/api/users', getUsers);

router.all('*', (req, res) => {
    res.status(404).send('404. Page not found');
});

export default router;
