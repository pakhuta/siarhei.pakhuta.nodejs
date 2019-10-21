import passport from 'passport';
import jwt from 'jsonwebtoken';
import LocalStrategy from 'passport-local';
import AuthUtils from '../../../services/authUtils';

export default class PassportLocalStrategy {
    static use() {
        const params = {
            usernameField: 'user[login]',
            passwordField: 'user[password]',
            session: false
        };

        passport.use(new LocalStrategy(params, async (username, password, done) => {
            const [user] = await AuthUtils.getUserByCredentials(username, password);

            if (!user) {
                return done(null, false);
            }

            let token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
            AuthUtils.addToken(token);
            user.token = token;

            return done(null, user);
        }));
    }
}
