import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';
import jwt from 'jsonwebtoken';
import AuthUtils from '../../../services/authUtils';

export default class BearerLocalStrategy {
    static use() {
        passport.use(new BearerStrategy((token, done) => {
            if (!token) {
                return done(null, false);
            }

            if (AuthUtils.isTokenValid(token)) {
                jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
                    if (err) {
                        return done(err);
                    }

                    let { userId } = decoded;
                    let [user] = await AuthUtils.getUserById(userId);

                    done(null, user);
                });
            } else {
                return done(null, false);
            }
        }));
    }
}
