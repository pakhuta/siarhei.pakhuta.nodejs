import passport from 'passport';
import PassportLocalStrategy from './localStrategy';
import BearerLocalStrategy from './bearerStrategy';
import PassportFacebookStrategy from './facebookStrategy';
import PassportTwitterStrategy from './twitterStrategy';
import PassportGoogleStrategy from './googleStrategy';

export default function init() {
    PassportLocalStrategy.use();
    BearerLocalStrategy.use();
    PassportFacebookStrategy.use();
    PassportTwitterStrategy.use();
    PassportGoogleStrategy.use();

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        if (user) {
            done(null, user);
        } else {
            done(new Error('User not found'), user);
        }
    });
}
