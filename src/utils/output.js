export default class Output {
    static write(msgTpl, ...args) {
        let message = getFormattedMessage(msgTpl, ...args);
        process.stdout.write(`\n${message}`);
    }

    static getStream() {
        return process.stdout;
    }
}

function getFormattedMessage(msgTpl, ...args) {
    let formattedMsg = msgTpl;
    args.forEach((arg, index) => {
        let regExp = new RegExp(`(\\$${index})`, 'g');
        formattedMsg = formattedMsg.replace(regExp, arg);
    });
    return formattedMsg;
}
