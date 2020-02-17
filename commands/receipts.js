// Proof that you said something, without having to use search
const Discord = require('discord.js');
const util = require('../util');

var receipts = new Discord.Collection();

function userHasReceipts(message, args) {
    if (!receipts.has(message.author) || receipts.get(message.author).length == 0) {
        message.author.send(`I don't have any of your receipts. Check with your tax accountant.`);
        return false;
    }
    userReceipts = receipts.get(message.author);
    if (userReceipts.length < args[1]) {
        message.author.send(`You haven't given me that many receipts. Maybe it's still in your pocket?`);
        return false;
    }
    return true;
};

module.exports = {
    name: 'receipts',
    description: "You said it, and everyone knows!",
    args: true,
    usage: `supports the following arguments: store | list | retrieve.\n\n
        You can store up to 10 receipts using store, e.g. '!receipts store <the rest of your message is stored as the receipt>'.\n
        You can list your stored receipts (via DM), e.g. '!receipts list'. This will list them in order they were stored.\n
        You can get a specific receipt (in the channel), e.g. '!receipts retrieve 3' will get the 3rd receipt you stored (or tell you if you didn't store one).\n
        You can delete a receipt, e.g. '!receipts delete 4' will delete the 4th receipt you stores (or tell you if you don't have that many).`,
    execute(message, args) {
        if (!args.length) return message.channel.send(`I need to know if you want to store, list, or retrieve receipts ${message.author}!`);

        var cmd = args[0].toLowerCase();
        let userReceipts;
        let receiptText;
        let receiptIndex;

        switch (cmd) {
            case 'store':
                // Get the existing set of receipts for the author. If they have none, create a new array.
                receiptText = args.slice(1).join(' ');
                if (!receipts.has(message.author)) {
                    userReceipts = [receiptText];
                    receipts.set(message.author, userReceipts);
                } else {
                    userReceipts = receipts.get(message.author);
                    // Make sure they don't already have 10 receipts (just to keep a cap on this)
                    if (userReceipts.length >= 10) return message.author.send(`You've already stored 10 receipts. Clear some out, I'm not a filing cabinet!`);
                    userReceipts.push(receiptText);
                    receipts.set(message.author, userReceipts);
                }
                break;
            case 'list':
                if (!userHasReceipts(message, args)) return;

                userReceipts = receipts.get(message.author);
                var msgText = `Here are all your receipts ${message.author}\n\n`;

                for (let i = 0; i < userReceipts.length; i++) {
                    msgText += `Receipt #${i + 1}:\n${userReceipts[i]}\n\n`;
                }

                message.author.send(msgText);
                break;
            case 'retrieve':
                if (!userHasReceipts(message, args)) return;

                userReceipts = receipts.get(message.author);
                receiptIndex = parseInt(args[1]) - 1;
                receiptText = userReceipts[receiptIndex];
                message.channel.send(`${message.author} has a verified receipt for the following:\n${receiptText}`);
                break;
            case 'delete':
                if (!userHasReceipts(message, args)) return;

                userReceipts = receipts.get(message.author);
                receiptIndex = parseInt(args[1]) - 1;
                userReceipts.splice(receiptIndex, 1);
                receipts.set(message.author, userReceipts);
                break;
            default:
                return util.performFailReact(message);
        }
        util.performSuccessReact(message);
    },
};