import express from 'express';
import passport from 'passport';
import getProducts from './products/getProducts';
import getProduct from './products/getProduct';
import getProductReviews from './products/getProductReviews';
import postProducts from './products/postProducts';
import getUsers from './users/getUsers';
import postAuth from './auth/postAuth';

const router = express.Router();

router.get('/', (req, res) => {
    res.send({ parsedQuery: req.parsedQuery, parsedCookies: req.parsedCookies });
});

router.get('/api/products', getProducts);
router.get('/api/products/:id', getProduct);
router.get('/api/products/:id/reviews', getProductReviews);
router.post('/api/products', postProducts);
router.get('/api/users', getUsers);
router.post('/auth', postAuth);

router.post(
    '/auth-passport',
    passport.authenticate('local', { session: false }),
    (req, res) => res.send('Local authentication has been passed')
);
// router.get(
//     '/auth-local',
//     passport.authenticate('bearer', { session: false }),
//     (req, res) => res.send('Resource is reached by local authentication')
// );

router.all('*', (req, res) => {
    res.status(404).send('404. Page not found');
});

export default router;
