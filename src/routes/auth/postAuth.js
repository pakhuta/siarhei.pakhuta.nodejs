import jwt from 'jsonwebtoken';
import AuthUtils from '../../services/authUtils';
import Output from '../../utils/output';

export default async function postAuth(req, res) {
    const requestedUser = req.body.user;

    if (!(requestedUser instanceof Object)) {
        res.status(400).send('Bad Request');
        Output.write('Received an authentication request with wrong user data');
        return;
    }

    const [user] = await AuthUtils.getUserByCredentials(requestedUser.login, requestedUser.password);

    if (user) {
        res.status(200).send({
            code: 200,
            message: 'OK',
            data: {
                user: {
                    email: user.email,
                    username: user.name
                }
            },
            token: jwt.sign({ username: user.name }, process.env.SECRET_KEY)
        });
        Output.write(`User: "${requestedUser.login}" has authenticated`);
    } else {
        res.status(401).send({
            code: 401,
            message: 'Unauthorized',
            data: {}
        });
        Output.write(`Invalid credentials for user: "${requestedUser.login}"`);
    }
}
