export default function output(msgTpl, ...args) {
    let message = getFormattedMessage(msgTpl, ...args);
    process.stdout.write(`\n${message}`);
}

function getFormattedMessage(msgTpl, ...args) {
    let formattedMsg = msgTpl;
    args.forEach((arg, index) => {
        let regExp = new RegExp(`(\\$${index})`, 'g');
        formattedMsg = formattedMsg.replace(regExp, arg);
    });
    return formattedMsg;
}
