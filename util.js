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
		if (!message.member.hasPermission('ADMINISTRATOR')) {
			message.react('❌');
			return false;
		}
	},
	performDmCheck(message) {
		if (!message.guild) {
			message.author.send(`I can't perform that action via DM.`);
			return false;
		}
	},
	performSuccessReact(message) {
		message.react('👌');
	},
	performFailReact(message) {
		message.react('❌');
	},
	replyToUserWithMessage(message, replyText) {
		message.author.send(`${replyText}`);
	},
	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	},
	capitalize(string) {
		if (typeof string !== 'string') return string;
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	titleCase(string) {
		string.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
	},
};