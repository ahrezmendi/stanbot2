module.exports = {
	name: 'ping',
    description: 'Ping (example simple command)!',
    cooldown: 5,
	execute(message, args) {
		message.channel.send('Pong.');
	},
};