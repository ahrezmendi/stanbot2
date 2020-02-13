module.exports = {
	name: 'server',
	description: 'Retrieve server info (example)',
	execute(message, args) {
		message.channel.send(`This server's name is: ${message.guild.name}`);
	},
};