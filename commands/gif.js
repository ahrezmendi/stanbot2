// All the favorite gifs, in one easy place (not really, hard coded)
const Discord = require('discord.js');
const util = require('../util');

const reactions = new Discord.Collection()
    .set('letsgo', 'https://gfycat.com/achinguniquebird')
    .set('pacha', '✋👌')
    .set('approve', 'https://tenor.com/view/seal-approval-gif-5057575')
    .set('sealion', 'https://tenor.com/view/bait-thatsbait-gif-5055384')
    .set('micdrop', 'https://tenor.com/view/obama-micdrop-gif-7413222');

module.exports = {
    name: 'gif',
    description: "YOOOOOOOOOOOO!",
    args: true,
    cooldown: 5,
    usage: `You can specify a reaction, and I'll respond with the appropriate gif. It's like the Favorites section of the gif picker, but not platform specific.
        Here are the reactions I can do:\n${Array.from(reactions.keys()).join(' ')}`,
    execute(message, args) {
        if (!args.length) return util.replyToUserWithMessage(message, `I can't react to nothing, ${message.author}!`);

        for (let arg of args) {
            if (Array.from(reactions.keys()).includes(arg)) {
                message.channel.send(reactions.get(arg));
            } else {
                util.replyToUserWithMessage(message, `I don't have a reaction for ${arg}.`);
            }
        }
    },
};