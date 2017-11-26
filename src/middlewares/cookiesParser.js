export default function cookiesParser(req, res, next) {
    try {
        req.parsedCookies = parseCookies(req.headers.cookie);
        next();
    } catch (err) {
        next(err);
    }
}

function parseCookies(cookiesRaw = '') {
    let parsedCookies = {};

    cookiesRaw.split('; ')
        .map(pair => pair.split('='))
        .forEach(cookie => {
            let [cookieKey, cookieValue] = cookie;
            parsedCookies[cookieKey] = cookieValue;
        });

    return parsedCookies;
}
