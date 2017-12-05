import passport from 'passport';
import FacebookStrategy from 'passport-facebook';

export default class PassportFacebookStrategy {
    static use() {
        const params = {
            clientID: '2043307415902456',
            clientSecret: 'cbff66922ce05e924f755b24ac70001b',
            callbackURL: `http://localhost:${process.env.PORT}/`
        };

        passport.use(new FacebookStrategy(params, (accessToken, refreshToken, profile, cb) => {
            cb(null, { user: 'myUser' });
        }));
    }
}
