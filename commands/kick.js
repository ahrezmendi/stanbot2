const util = require('../util');

module.exports = {
	name: 'kick',
	aliases: ['hammer', 'boot'],
	description: 'Kick a user. Only usable if you are an admin.',
	guildOnly: true,
	execute(message, args) {
		util.performAdminCheck(message);
		if (!message.mentions.users.size) return message.reply('You need to tag a user in order to kick them.');

		const kickList = message.mentions.users.map(user => {
			return `For now this function does nothing, you should kick people manually. You wanted to kick: ${user.username}`;
		});

		// send the entire array of strings as a message
		// by default, discord.js will `.join()` the array with `\n`
		message.channel.send(kickList);
	},
};