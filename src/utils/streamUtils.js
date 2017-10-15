import https from 'https';

export default class StreamUtils {
    static getAction(processArgs) {
        let isActionNameNotSpecified = processArgs.action === undefined;
        return (isActionNameNotSpecified || StreamUtils.isHelpFirstArg(processArgs)) ? ('help') : (processArgs.action);
    }

    static isHelpFirstArg(processArgs) {
        let firstProcessArg = process.argv[2];
        let isHelpArgDefined = processArgs.hasOwnProperty('help');
        return isHelpArgDefined && (firstProcessArg.startsWith('--help') || firstProcessArg.startsWith('-h'));
    }

    static checkRequiredParams(processArgs, handlerParams) {
        let missedParams = [];
        handlerParams.requiredArgs.forEach(requiredArg => {
            let paramName;

            if (requiredArg instanceof Object) {
                [paramName] = Object.keys(requiredArg);
                processArgs[paramName] = processArgs[paramName] || requiredArg[paramName];
            } else {
                paramName = requiredArg;
            }

            if (!processArgs.hasOwnProperty(paramName)) {
                missedParams.push(paramName);
            }
        });
        return missedParams;
    }

    static getHandlerArguments(processArgs, handlerParams) {
        return handlerParams.requiredArgs.map(requiredArg => {
            let paramName = (requiredArg instanceof Object) ? (Object.keys(requiredArg)[0]) : (requiredArg);
            return processArgs[paramName];
        });
    }

    static getExternalReadStream(url) {
        return new Promise((resolve, reject) => {
            https.get(url, res => {
                const { statusCode } = res;

                if (statusCode !== 200) {
                    reject(new Error(`Request Failed. Status Code: ${statusCode}`));
                }

                resolve(res);
            }).on('error', reject);
        });
    }
}
