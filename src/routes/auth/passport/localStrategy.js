import passport from 'passport';
import jwt from 'jsonwebtoken';
import LocalStrategy from 'passport-local';
import AuthUtils from '../../../services/authUtils';
import Storage from '../../../services/storage';

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

            let token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
            Storage.add('token', token);
            user.token = token;

            return done(null, user);
        }));
    }
}
