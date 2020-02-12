module.exports = {
    name: 'kick',
    aliases: ['hammer', 'boot'],
    description: 'Kick a user.',
    guildOnly: true,
	execute(message, args) {
		if (!message.mentions.users.size) {
            return message.reply('you need to tag a user in order to kick them!');
        }

        const kickList = message.mentions.users.map(user => {
			return `You wanted to kick: ${user.username}`;
		});
	
		// send the entire array of strings as a message
		// by default, discord.js will `.join()` the array with `\n`
		message.channel.send(kickList);
	},
};