const fetch = require('node-fetch');

module.exports = {
	handleVoiceStateUpdate(client) {
		// Handling for voice channel activities
		client.on('voiceStateUpdate', (oldMember, newMember) => {
			let newUserChannel = newMember.voiceChannel
			let oldUserChannel = oldMember.voiceChannel

			if (oldUserChannel === undefined && newUserChannel !== undefined) {
				// User has just joined a voice channel
			} else if (newUserChannel === undefined) {
				// User has just left a voice channel
			}
		});
	},
	performAdminCheck(message) {
		if (!message.member.hasPermission('ADMINISTRATOR')) return message.react('❌');
	},
	performSuccessReact(message) {
		message.react('👌');
	},
	performFailReact(message) {
		message.react('❌');
		message.channel.send(`🤷 ${message.author}, I don't understand that command.`);
	},
	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	},
	capitalize(string) {
		if (typeof string !== 'string') return string;
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
};