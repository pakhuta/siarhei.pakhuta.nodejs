import jwt from 'jsonwebtoken';
import Output from '../utils/output';

export default function authVerification(req, res, next) {
    jwt.verify(req.headers.token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401).send({
                code: 401,
                message: 'Unauthorized',
                data: { message: 'Invalid token' }
            });
            Output.write(`Invalid token. Error: ${err}`);
        } else {
            req.tokenData = decoded;
            next();
        }
    });
}
