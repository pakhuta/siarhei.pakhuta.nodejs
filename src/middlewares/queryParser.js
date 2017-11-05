import url from 'url';

export default function queryParser(req, res, next) {
    try {
        req.parsedQuery = url.parse(req.url, true).query;
        next();
    } catch (err) {
        next(err);
    }
}
