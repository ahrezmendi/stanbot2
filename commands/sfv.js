const util = require('../util');
const { prefix, token, apikey } = require('../config.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const sheetsUtil = require('../sheets');
const Discord = require('discord.js');

// Some constants, such as the doc itself
const doc = new GoogleSpreadsheet('1nlbWon7SYhhO5TSpNx06qQrw2TRDEZ85HQrNherXioY');
doc.useApiKey(apikey);

// List of the move properties we actually give a shit about
const props = new Map([
    ['moveName', 'Move'],
    ['plnCmd', 'Input'],
    ['startup', 'Startup Frames'],
    ['active', 'Active Frames'],
    ['recovery', 'Recovery Frames'],
    ['onHit', 'Advantage on Hit'],
    ['onBlock', 'Advantage on Block'],
    ['damage', 'Damage'],
    ['stun', 'Stun']
]);

module.exports = {
    name: 'sfv',
    description: 'Rise up.',
    cooldown: 60,
    args: true,
    usage: 'sfv [character command [specific move]]',
    execute(message, args) {
        // If the user asked for stats, return stats data
        var stats = sheetsUtil.sfvCharacterData;

        // Need a character name from the user
        if (!args[0]) {
            util.performFailReact(message);
            return message.channel.send(`You have to specify a character, ${message.author}`);
        }
        var charName = args[0];

        // Switch on args[0] for each command arg
        switch (args[1]) {
            case 'stats':
                // Retrieve that character stats sheet from the data collection
                var stats = sheetsUtil.sfvCharacterData.get(charName).get('stats');

                // Create an embed and populate with the data
                var embed = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle(`${util.capitalize(charName)} Vital Statistics`);

                for (let entry of stats) {
                    embed.addField(`${entry[0]}`, `${entry[1].stat}`);
                }

                // Let it rip
                message.channel.send(embed);
                break;
            case 'normal':
                // Retrieve normal move data
                var moves = sheetsUtil.sfvCharacterData.get(charName).get('normal');

                // Embeds are limited to 25 fields. That's enough for specific move data, but not for all moves.
                // So if the user just requested moves (normal) then build a chat message which lists the moves.
                // If they requested a specific move, that can be an embed.
                var userProvidedMoveName = args.slice(2).join(' ');
                console.log(userProvidedMoveName);
                var isSpecificMove = !args[2] ? false : true;

                if (isSpecificMove) {
                    // Create an embed and populate with the data
                    var embed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle(`${util.capitalize(charName)} Normal Move Properties`);

                    var propsKeyArr = Array.from(props.keys());

                    var move = moves.get(userProvidedMoveName);

                    for (let [key, value] of Object.entries(move)) {
                        // Skip anything not in the whitelist
                        if (propsKeyArr.includes(key)) {
                            console.log(key);
                            // Add the property
                            embed.addField(`${props.get(key)}`, `${value}`);
                        }
                    }

                    // Let it rip
                    message.channel.send(embed);
                } else {
                    var msg = `${util.capitalize(charName)}'s Normal Moves:`;
                    for (let [key, value] of moves) {
                        msg += `\n${key} : ${value.plnCmd}`;
                    }

                    message.channel.send(msg);
                }

                break;
            default:
                util.performFailReact(message);
        }
    },
};