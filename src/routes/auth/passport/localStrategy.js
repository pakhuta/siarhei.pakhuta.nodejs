import passport from 'passport';
import LocalStrategy from 'passport-local';
import AuthUtils from '../../../services/authUtils';

export default class PassportLocalStrategy {
    static use() {
        const params = {
            usernameField: 'user[login]',
            passwordField: 'user[password]',
            session: false
        };

        passport.use(new LocalStrategy(params, (username, password, done) => {
            const user = AuthUtils.getUserByCredentials(username, password);

            if (!user) {
                return done(null, false);
            }

            PassportToken

            return done(null, user);
        }));
    }
}
