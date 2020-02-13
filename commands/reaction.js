// All the favorite reactions, in one easy place (not really, hard coded)

module.exports = {
	name: 'reaction',
    description: "YOOOOOOOOOOOO!",
    args: true,
    cooldown: 30,
	execute(message, args) {
        if (!args.length) return message.channel.send(`I can't react to nothing, ${message.author}!`);

        // letsgo
        if (args.includes('letsgo')) message.channel.send('https://gfycat.com/achinguniquebird');
        
        // sealion
        if (args.includes('sealion')) message.channel.send('https://tenor.com/view/bait-thatsbait-gif-5055384');

        // pacha
        if (args.includes('pacha')) message.channel.send('✋👌');

        // approve
        if (args.includes('approve')) message.channel.send('https://tenor.com/view/seal-approval-gif-5057575');
	},
};