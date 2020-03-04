const util = require('../util');
const sheetsUtil = require('../sheets');
const Discord = require('discord.js');

// List of the move properties we actually give a shit about
const props = new Map([
    ['MOVE', 'Move'],
    ['FIRST ACTIVE', 'First Active Frame'],
    ['ACTIVE', 'Active Frames'],
    ['RECOVERY', 'Recovery Frames'],
    ['ADVANTAGE', 'Advantage'],
    ['GUARD', 'Guard'],
    ['DAMAGE', 'Damage'],
    ['PRORATION init/comb', 'Proration (initial/combo)']
]);

module.exports = {
    name: 'dbfz',
    description: 'Kamehameha! (This command is still in alpha, ping @Ahrezmendi detailed status).',
    args: true,
    usage: `<character name> <move input>\n\n
        E.g. !dbfz goku ssj 5ll\n\n
        If a character name doesn't work, check the spreadsheet for the correct name (they are taken directly from there).\n
        For characters with forms, use the name followed by the form (e.g. goku blue, vegeta base). Names like "Bluegeta" are not supported.\n\n
        NOTE: Assists are not currently supported, only base moves.\n
        2ND NOTE: The frame data indicates which patch it is from, so be sure to check that before quoting frame data.\n\n
        All data courtesy of (and credit to) TURTLEON's Frame Data Spreadsheet here:\n
        https://docs.google.com/spreadsheets/d/1-p29UmRGIPF6n17ddOEtYfLcn_KRlE2VH6tE61P5UM8/edit#gid=1043945512`,
    execute(message, args) {
        // Special admin command - refreshes data from the Google Sheets sheet.
        if (args[0].toLowerCase() == 'refresh') {
            util.performAdminCheck(message);
            // Refreshes the data from the spreadsheet. This is slow, so don't do it often. It will also block the bot.
            async function refreshData() {
                await sheetsUtil.refreshDbfzData();
            }

            refreshData();
            return message.channel.send(`DBFZ character data is now being refreshed, ${message.author}. Please give me a bit to finish this.`);
        }

        // Need a character name from the user
        if (!args[0]) {
            util.performFailReact(message);
            return message.channel.send(`You have to specify a character, ${message.author}`);
        }

        var charName = args[0].toLowerCase();
        var moveName;

        console.log(args);

        // Edge case: Many characters have 2 word names (Android 17, Goku SSJ, Vegeta Blue, etc.)
        // If I assume that all move notations start with either a number or a lowercase J
        // then everything prior to that is the character name. Then the only special cases are
        // the androids, whose names all start with "Android" so it's easy to handle them.
        if (charName == 'android') {
            charName = charName.concat(` ${args[1]}`);
            moveName = args.slice(2).join(' ').toLowerCase();
        } else {
            // Main case. Split on the first arg that contains a number or lowercase J preceded by whitespace
            var joinedArgs = args.join(' ');
            charName = joinedArgs.split(/(\sj|\d)/)[0].trim();
            moveName = joinedArgs.split(/(\sj|\d)/).slice(1).join('').toLowerCase();
        }

        // Special case: Base Vegeta is just "vegeta" in the spreadsheet, but let's be nice and handle "vegeta base" too
        if (charName == 'vegeta base') charName = 'vegeta';

        // Retrieve normal move data
        var moves = sheetsUtil.dbfzCharacterData.get(charName);

        // If no data, inform the user
        if(!moves) return message.channel.send(`I'm afraid I don't have any data for ${charName}`);

        // Create an embed and populate with the data
        var embed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle(`${util.titleCase(charName)} Move Properties (Patch ${sheetsUtil.dbfzCharacterData.get('version').get(charName)})`);

        var propsKeyArr = Array.from(props.keys());

        var move = moves.get(moveName);

        for (let [key, value] of Object.entries(move)) {
            // Skip anything not in the whitelist
            if (propsKeyArr.includes(key)) {
                // Add the property
                embed.addField(`${props.get(key)}`, `${value ? value : 'N/A'}`);
            }
        }

        // Let it rip
        message.channel.send(embed);
    },
};