import url from 'url';
import jwt from 'jsonwebtoken';
import Output from '../utils/output';

const verificationPaths = [
    '/api/products',
    '/api/users'
];

export default function authVerification(req, res, next) {
    if (isNeedVerification(url.parse(req.url).pathname)) {
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
    } else {
        next();
    }
}

function isNeedVerification(pathname) {
    return verificationPaths.some(verificationPath => pathname.startsWith(verificationPath));
}
