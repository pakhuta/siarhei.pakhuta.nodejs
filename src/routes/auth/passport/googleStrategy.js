import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import AuthUtils from '../../../services/authUtils';
import Storage from '../../../services/storage';

export default class PassportGoogleStrategy {
    static use() {
        const params = {
            clientID: '927036289556-69j791aj6f1tv6e4v3l08283odr3lgp8.apps.googleusercontent.com',
            clientSecret: 'uP4UVhX2Ksqm_DcCMUHlmDJ6',
            callbackURL: `http://localhost:${process.env.PORT}/auth-google/callback`
        };

        passport.use(new GoogleStrategy.Strategy(params, async (accessToken, refreshToken, profile, cb) => {
            let [user] = await AuthUtils.getUserById(profile.id);
            if (!user) {
                user = await Storage.add('users', {
                    id: profile.id,
                    name: profile.displayName
                });
            }

            cb(null, user);
        }));
    }
}
