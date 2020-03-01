var settings = require('./settings.js');
const util = require('../util');

module.exports = {
    name: 'createvoice',
    description: 'Creates a temporary voice channel for use while playing games. All args will be combined to make the channel name.',
    aliases: ['voice'],
    usage: 'createvoice <name of the voice channel, e.g. "Age of Empires">',
    args: true,
    cooldown: 60,
    execute(message, args) {
        var channelName = args.join(' ');

        // Can't be used in DM
        if (!util.performDmCheck(message)) return;

        // Check the category exists/is set correctly
        let category = message.guild.channels.find(c => c.name.toLowerCase() == `${settings.voicecategory}` && c.type == "category");
        if (!category) return message.channel.send(`Category channel does not exist. Was it registered correctly ${message.author}?`);

        // Create the channel
        message.guild.createChannel(channelName, { type: "voice" })
            .then(channel => {
                channel.setParent(category.id);
            }).catch(console.error);

        // If you want to overwrite default permissions, use .then() and call chan.overwritePermissions within it. E.g.
        // .then((chan) => {chan.overwritePermissions(message.guild.roles.find('name', '@everyone'), {'VIEW_CHANNEL': false})});

        message.channel.send(`New voice channel ${channelName} created, ${message.author}!`);
    },
};