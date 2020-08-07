const util = require('../util');
const { sqlitepath } = require('../config.json');
const Keyv = require('keyv');

const defaultCategory = 'on-demand voice';

const voiceCategories = new Keyv(sqlitepath, { namespace: 'voice' });
// Handle DB connection errors
voiceCategories.on('error', err => console.log('SQLite Connection Error', err));

module.exports = {
    name: 'voice',
    description: 'Creates a temporary voice channel for use while playing games. All args will be combined to make the channel name.',
    aliases: ['voice'],
    usage: 'voice create <name of the voice channel, e.g. "Age of Empires">',
    args: true,
    cooldown: 0,
    async execute(message, args) {
        // Can't be used in DM
        if (!util.performDmCheck(message)) return;

        // Switch on args[0] to decide what to do
        switch (args[0]) {
            case 'register':
                // Only admins can set the category
                if (!util.performAdminCheck(message)) return;

                // Get the category name
                var categoryName = `${args.slice(1).join(' ')}`;

                // Set the specified category in the database
                await voiceCategories.set(message.guild.id, categoryName);
                util.replyToUserWithMessage(message, `Successfully set voice category to ${categoryName}.`);
                break;
            case 'display':
                // Only admins can set the category
                if (!util.performAdminCheck(message)) return;

                // Get the category name
                let voiceCategory = await voiceCategories.get(message.guild.id);
                if (voiceCategory == undefined) voiceCategory = defaultCategory;
                util.replyToUserWithMessage(message, `Current category name ${voiceCategory}.`);
                break;
            case 'create':
                var channelName = `${args.slice(1).join(' ')}`;

                // Look up the per-guild category, otherwise use default
                let guildCategory = await voiceCategories.get(message.guild.id);
                if (guildCategory == undefined) guildCategory = defaultCategory;

                // Check the category exists/is set correctly
                let category = message.guild.channels.cache.find(c => c.name.toLowerCase() == `${guildCategory}` && c.type == "category");
                if (!category) return message.channel.send(`Category channel does not exist. Was it registered correctly ${message.author}?`);

                // Create the channel
                message.guild.channels.create(channelName, { type: "voice" })
                    .then(channel => {
                        channel.setParent(category.id);
                    }).catch(console.error);

                // If you want to overwrite default permissions, use .then() and call chan.overwritePermissions within it. E.g.
                // .then((chan) => {chan.overwritePermissions(message.guild.roles.find('name', '@everyone'), {'VIEW_CHANNEL': false})});

                message.channel.send(`New voice channel ${channelName} created, ${message.author}!`);
                break;
            default:
                util.performFailReact(message);
        }
    },
};