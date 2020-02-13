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
};