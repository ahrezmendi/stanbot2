const util = require('../util');

const settingsWhitelist = ['voicecategory'];

// To add a new setting, just add a property to the exports and add it to the whitelist above.
// You can then read it from anywhere else by requiring settings.
module.exports = {
    name: 'settings',
    description: 'Allows you to configure various settings for Stanbot (e.g. voice category).',
    voicecategory: 'on-demand voice',
    execute(message, args) {
        util.performAdminCheck(message);
        if (!args.length) return message.author.send(`You didn't specify a settings command, ${message.author}!`);

        var command = args[0];

        switch (command) {
            case ('display'):
                message.author.send(`Here are my current settings:\n`);
                for (let property of Object.keys(this)) {
                    if (!settingsWhitelist.includes(property)) continue;
                    if (this.hasOwnProperty(property)) message.author.send(`${property}: ${this[property]}\n`);
                }
                break;
            case ('register'):
                var setting = args[1];
                var value = args.slice(2).join(' ').toLowerCase();

                if (!setting) message.author.send(`You need to specify a setting to change.`);
                if (!value) message.author.send(`You need to give me a value to set.`);

                // Don't want to change anything that isn't allowed to be changed.
                if (!settingsWhitelist.includes(setting)) {
                    message.author.send(`That's not a valid setting parameter. Use 'display' to see what settings can be changed.`);
                    break;
                }

                this[setting] = value;

                break;
            default:
                return message.author.send(`Not sure how I got here, contact @Ahrezmendi`);
        }
        util.performSuccessReact(message);
    },
};