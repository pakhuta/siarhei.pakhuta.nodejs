export default class StreamUtils {
    static getAction(processArgs) {
        return (StreamUtils.isHelpFirstArg(processArgs) || !processArgs.action) ? ('help') : (processArgs.action);
    }

    static isHelpFirstArg(processArgs) {
        let firstProcessArg = process.argv[2];
        let isHelpArgDefined = processArgs.hasOwnProperty('help');
        return isHelpArgDefined && (firstProcessArg.startsWith('--help') || firstProcessArg.startsWith('-h'));
    }

    static checkRequiredParams(processArgs, handlerParams) {
        return handlerParams.requiredArgs.filter(requiredArg => !processArgs.hasOwnProperty(requiredArg));
    }

    static getHandlerArguments(processArgs, handlerParams) {
        return handlerParams.requiredArgs.map(requiredArg => processArgs[requiredArg]);
    }
}
