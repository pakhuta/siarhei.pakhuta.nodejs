import jwt from 'jsonwebtoken';
import Storage from '../../services/storage';
import Output from '../../utils/output';

export default function postAuth(req, res) {
    const users = Storage.get('users');
    const requestedUser = req.body.user;

    if (!requestedUser || !(requestedUser instanceof Object)) {
        res.status(400).send('Bad Request');
        Output.write('Received an authentication request with wrong user data');
        return;
    }

    const userData = users.find(userItem => userItem.name === requestedUser.login);

    if (userData) {
        if (userData.password === requestedUser.password) {
            res.status(200).send({
                code: 200,
                message: 'OK',
                data: {
                    user: {
                        email: userData.email,
                        username: userData.name
                    }
                },
                token: jwt.sign({ username: userData.name }, process.env.SECRET_KEY)
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
    } else {
        res.status(404).send({
            code: 404,
            message: 'Not Found',
            data: {}
        });
        Output.write(`Requested not existed user: "${requestedUser.login}"`);
    }
}
