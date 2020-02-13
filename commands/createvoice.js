module.exports = {
	name: 'createvoice',
    description: 'Creates a temporary voice channel for use while playing games. All args will be combined to make the channel name.',
    aliases: ['voice'],
    usage: 'createvoice <name of the voice channel, e.g. "Age of Empires">',
    args: true,
    cooldown: 60,
	execute(message, args) {
        // Create the channel
        message.guild.createChannel(args.join(' '), { type: "voice" });
        
        // If you want to overwrite default permissions, use .then() and call chan.overwritePermissions within it. E.g.
        // .then((chan) => {chan.overwritePermissions(message.guild.roles.find('name', '@everyone'), {'VIEW_CHANNEL': false})});
    },
};