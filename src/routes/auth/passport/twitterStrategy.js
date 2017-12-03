import passport from 'passport';
import TwitterStrategy from 'passport-twitter';
import AuthUtils from '../../../services/authUtils';
import Storage from '../../../services/storage';

export default class PassportTwitterStrategy {
    static use() {
        const params = {
            consumerKey: 'pXEBxAvdkqqOz1VSJdqYF2Cqd',
            consumerSecret: 'cBCY9FeiNxq8vtHhDlU8KDOOYoS4vB2x1EIbMqDhCZz5QqgRsZ',
            callbackURL: `http://localhost:${process.env.PORT}/auth-twitter/callback`
        };

        passport.use(new TwitterStrategy(params, async (token, tokenSecret, profile, cb) => {
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
