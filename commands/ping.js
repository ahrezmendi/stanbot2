module.exports = {
	name: 'ping',
	description: 'Ping (example simple command)!',
	execute(message, args) {
		message.channel.send('Pong.');
	},
};