import express from 'express';
import passport from 'passport';
import getProducts from './products/getProducts';
import getProduct from './products/getProduct';
import getProductReviews from './products/getProductReviews';
import postProducts from './products/postProducts';
import getUsers from './users/getUsers';
import postAuth from './auth/postAuth';
import authVerification from '../middlewares/authVerification';

const router = express.Router();

router.get('/', (req, res) => {
    res.send({ parsedQuery: req.parsedQuery, parsedCookies: req.parsedCookies });
});

router.get('/api/products', authVerification, getProducts);
router.get('/api/products/:id', authVerification, getProduct);
router.get('/api/products/:id/reviews', authVerification, getProductReviews);
router.post('/api/products', authVerification, postProducts);
router.get('/api/users', authVerification, getUsers);
router.post('/auth', postAuth);

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

router.all('*', (req, res) => {
    res.status(404).send('404. Page not found');
});

export default router;
