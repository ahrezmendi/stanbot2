// All the favorite gifs, in one easy place (not really, hard coded)
const Discord = require('discord.js');

const reactions = new Discord.Collection()
    .set('letsgo', 'https://gfycat.com/achinguniquebird')
    .set('pacha', '✋👌')
    .set('approve', 'https://tenor.com/view/seal-approval-gif-5057575')
    .set('sealion', 'https://tenor.com/view/bait-thatsbait-gif-5055384');

module.exports = {
    name: 'gif',
    description: "YOOOOOOOOOOOO!",
    args: true,
    cooldown: 30,
    execute(message, args) {
        if (!args.length) return message.channel.send(`I can't react to nothing, ${message.author}!`);

        for (let arg of args) {
            message.channel.send(reactions.get(arg));
        }
    },
};