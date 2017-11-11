import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';
import AuthUtils from '../../../services/authUtils';

export default class PassportLocalStrategy {
    static use() {
        // const params = {
        //     usernameField: 'user[login]',
        //     passwordField: 'user[password]'
        // };


        passport.use(new BearerStrategy((token, done) => {


            User.findOne({ token: token }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user, { scope: 'all' });
            });
        }));




        passport.use(new LocalStrategy(params, (username, password, done) => {
            const user = AuthUtils.getUserByCredentials(username, password);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        }));
    }
}
