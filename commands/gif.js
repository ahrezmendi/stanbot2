// All the favorite gifs, in one easy place (not really, hard coded)
const Discord = require('discord.js');

const reactions = new Discord.Collection()
    .set('letsgo', 'https://gfycat.com/achinguniquebird')
    .set('pacha', '✋👌')
    .set('approve', 'https://tenor.com/view/seal-approval-gif-5057575')
    .set('sealion', 'https://tenor.com/view/bait-thatsbait-gif-5055384')
    .set('micdrop', 'https://tenor.com/view/obama-micdrop-gif-7413222')
    .set('amn', `"Sorry losers and haters, but my I.Q. is one of the highest -and you all know it! Please don't feel so stupid or insecure,it's not your fault"\n\n🍆🍆🍆\n\nHow dare you.`)
    .set('eastwardflea', `I'm trash. Uninstalled.\n\nS2 Urien was fine.\nAkatsuki is fine.\nS1 Android 16 was fine.\n\nFuck printers.`)
    .set('bnice', `LET'S FUCKING GO!!!!!!!!\n\n<new gif with text overlayed>\n\nWhat does the crystal ball say?`)
    .set('ahrezmendi', 'https://tenor.com/view/captain-america-chris-evans-thankyou-salute-gif-4762823');

module.exports = {
    name: 'gif',
    description: "YOOOOOOOOOOOO!",
    args: true,
    cooldown: 5,
    execute(message, args) {
        if (!args.length) return message.channel.send(`I can't react to nothing, ${message.author}!`);

        for (let arg of args) {
            message.channel.send(reactions.get(arg));
        }
    },
};