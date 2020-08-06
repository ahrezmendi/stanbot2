const util = require('../util');

//TODO - As is these are global vars for the entire bot. That means any server can change these settings for ALL SERVERS THE BOT IS ON.
// Refactor this to save settings on a per-server basis, and then have commands read the settings for the server the request came from.
const settingsWhitelist = ['voicecategory', 'prefix'];

// To add a new setting, just add a property to the exports and add it to the whitelist above.
// You can then read it from anywhere else by requiring settings.
module.exports = {
    name: 'settings',
    description: 'Allows you to configure various settings for Stanbot (e.g. voice category). ADMIN ONLY.',
    values: {
        "default" : {
            "voicecategory" : 'on-demand voice',
            "prefix" : '?',
        }
    },
    voicecategory: 'on-demand voice',
    execute(message, args) {
        if (!util.performAdminCheck(message)) return;
        if (!args.length) return message.author.send(`You didn't specify a settings command, ${message.author}!`);

        var command = args[0];
        let serverID = message.guild.id;

        switch (command) {
            case ('display'):
                // If this server does not have registered settings, then use the defaults
                if(!this.values.hasOwnProperty(serverID)) {
                    serverID = "default";
                }
                let serverSettings = this.values[serverID];
                message.author.send(`Here are my current settings:\n`);
                for (let setting of Object.keys(serverSettings)) {
                    message.author.send(`${setting}: ${serverSettings[setting]}\n`);
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

                // Update the setting for the server the request came from
                // If this server doesn't have custom settings, add a new entry for it. Otherwise update the value.
                if(!this.values.hasOwnProperty(serverID)) {
                    this.values[serverID] = JSON.parse(JSON.stringify(this.values.default));
                }
                this.values[serverID][setting] = value;

                // TODO - Write settings out to a file.
                util.writeJsonToFile(this.values, `settings.json`);

                break;
            default:
                return message.author.send(`Not sure how I got here, contact @Ahrezmendi`);
        }
        util.performSuccessReact(message);
    },
};