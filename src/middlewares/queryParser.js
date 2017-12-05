export default function queryParser(req, res, next) {
    try {
        req.parsedQuery = req.query;
        next();
    } catch (err) {
        next(err);
    }
}
