// All the favorite reactions, in one easy place (not really, hard coded)
const Discord = require('discord.js');

module.exports = {
    name: 'poll',
    description: `Adds reactions to a message so you can create custom polls.`,
    usage: `<some poll question/text> -- [<emoji for option>]+. You can specify as many options as you like, but leave a space between each one!.`,
    args: true,
    cooldown: 30,
    execute(message, args) {
        var pollDelimiter = '--';

        // Find the delimiter index, and build the poll text.
        var delimiterIndex = args.indexOf(pollDelimiter);
        var pollText = args.slice(0, delimiterIndex);
        var optionArray = args.slice(delimiterIndex);

        // Slice includes the delimiter in the option array, so discard it now
        optionArray.shift();

        // Remove the command message
        message.delete();

        async function sendPollToChannel() {
            // Send the poll text to the channel
            var sentMessage = await message.channel.send(`${pollText.join(' ')} (Poll requested by ${message.author})`);
            // Now all reaction options can be added until the array is exhausted
            while (optionArray) {
                await sentMessage.react(optionArray.shift());
            }
        };

        sendPollToChannel().catch(console.error);
    },
};