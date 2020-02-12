module.exports = {
	name: 'user-info',
	description: 'Retrieve data about a user (example)',
	execute(message, args) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	},
};