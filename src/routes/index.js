import express from 'express';
import passport from 'passport';
import getProducts from './products/getProducts';
import getProduct from './products/getProduct';
import getProductReviews from './products/getProductReviews';
import postProducts from './products/postProducts';
import deleteProduct from './products/deleteProduct';
import getUsers from './users/getUsers';
import deleteUser from './users/deleteUser';
import postAuth from './auth/postAuth';
import authVerification from '../middlewares/authVerification';
import getRandomCityNative from './mongodbNative/getRandomCity';
import getRandomCityMongoose from './mongodbMongoose/getRandomCity';
import getCities from './cities/getCities';
import postCity from './cities/postCity';
import putCity from './cities/putCity';
import deleteCity from './cities/deleteCity';

const router = express.Router();

router.get('/', (req, res) => {
    res.send({ parsedQuery: req.parsedQuery, parsedCookies: req.parsedCookies });
});

router.get('/api/products', authVerification, getProducts);
router.get('/api/products/:id', authVerification, getProduct);
router.get('/api/products/:id/reviews', authVerification, getProductReviews);
router.post('/api/products', authVerification, postProducts);
router.delete('/api/products/:id', authVerification, deleteProduct);
router.get('/api/users', authVerification, getUsers);
router.delete('/api/users/:id', authVerification, deleteUser);
router.post('/auth', postAuth);
router.get('/api/cities', authVerification, getCities);
router.post('/api/cities', authVerification, postCity);
router.put('/api/cities/:id', authVerification, putCity);
router.delete('/api/cities/:id', authVerification, deleteCity);

router.post(
    '/auth-passport',
    passport.authenticate('local', { session: false }),
    (req, res) => res.json({ token: req.user.token })
);
router.get(
    '/auth-local',
    passport.authenticate('bearer', { session: false }),
    (req, res) => res.send('Resource is reached by local authentication')
);

router.get(
    '/auth-facebook',
    passport.authenticate('facebook'),
    (req, res) => res.send('Resource is reached by facebook authentication')
);

router.get('/auth-twitter', passport.authenticate('twitter'));
router.get(
    '/auth-twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/' }),
    (req, res) => res.send(`Resource is reached by twitter authentication. User name: ${req.user.name}`)
);

router.get('/auth-google', passport.authenticate('google', { scope: ['profile'] }));
router.get(
    '/auth-google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => res.send(`Resource is reached by google authentication. User name: ${req.user.name}`)
);

router.get('/cityNative', getRandomCityNative);

router.get('/city', getRandomCityMongoose);

router.all('*', (req, res) => {
    res.status(404).send('404. Page not found');
});

export default router;
