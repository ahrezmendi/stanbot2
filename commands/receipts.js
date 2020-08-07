// Proof that you said something, without having to use search
const Discord = require('discord.js');
const util = require('../util');
const { prefix, sqlitepath } = require('../config.json');
const Keyv = require('keyv');

var receipts = [];
const receiptsStorage = new Keyv(sqlitepath, { namespace: 'receipts' });
// Handle DB connection errors
receiptsStorage.on('error', err => console.log('SQLite Connection Error', err));

module.exports = {
    name: 'receipts',
    description: "You said it, and everyone knows!",
    args: true,
    usage: `supports the following arguments: store | list | retrieve.\n\n
        You can store up to 10 receipts using store, e.g. '${prefix}receipts store <the rest of your message is stored as the receipt>'.\n
        You can list your stored receipts (via DM), e.g. '${prefix}receipts list'. This will list them in order they were stored.\n
        You can get a specific receipt (in the channel), e.g. '${prefix}receipts retrieve 3' will get the 3rd receipt you stored (or tell you if you didn't store one).\n
        You can delete a receipt, e.g. '${prefix}receipts delete 4' will delete the 4th receipt you stores (or tell you if you don't have that many).`,
    async execute(message, args) {
        if (!args.length) return util.replyToUserWithMessage(message, `I need to know if you want to store, list, or retrieve receipts ${message.author}!`);

        var cmd = args[0].toLowerCase();
        let receiptText;
        let receiptIndex;

        // Before doing anything, get this users receipts (if any) from storage
        // This is a ready per command invocation. Find a better way to do this maybe?
        let receiptData = await receiptsStorage.get(message.author.id);
        if (receiptData == undefined) {
            receipts = [];
        } else {
            receipts = JSON.parse(receiptData);
        }

        // Quick helper function
        function checkReceiptValidity() {
            if (receipts.length == 0) return message.author.send(`I don't have any of your receipts. Check with your tax accountant.`);
            if (receipts.length < args[1]) return message.author.send(`You haven't given me that many receipts. Maybe it's still in your pocket?`);
        }

        switch (cmd) {
            case 'store':
                // Get the receipt text
                receiptText = args.slice(1).join(' ');

                // Add the receipt to the users list
                receipts.push(receiptText);

                // Write the receipts collection to disk
                await receiptsStorage.set(message.author.id, JSON.stringify(receipts));

                break;
            case 'list':
                checkReceiptValidity();

                var msgText = `Here are all your receipts ${message.author}\n\n`;
                for (let i = 0; i < receipts.length; i++) {
                    msgText += `Receipt #${i + 1}:\n${receipts[i]}\n\n`;
                }

                message.author.send(msgText);
                break;
            case 'retrieve':
                checkReceiptValidity();
                
                receiptIndex = parseInt(args[1]) - 1;
                receiptText = receipts[receiptIndex];
                message.channel.send(`${message.author} has a verified receipt for the following:\n${receiptText}`);
                break;
            case 'delete':
                checkReceiptValidity();

                receiptIndex = parseInt(args[1]) - 1;
                receipts.splice(receiptIndex, 1);

                // Write the receipts collection to disk
                await receiptsStorage.set(message.author.id, JSON.stringify(receipts));
                break;
            default:
                return util.performFailReact(message);
        }
        util.performSuccessReact(message);
    },
};