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
        var charName = args[0].toLowerCase();
        var command = args[1].toLowerCase();

        switch (command) {
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

                    // Support both using the actual move name, or the cmnCmd (common name)
                    var move;
                    if (moves.has(userProvidedMoveName)) {
                        move = moves.get(userProvidedMoveName);
                    } else {
                        // TODO(michaelstone):This is slow, is it worth maintaining another collection indexed on cmnCmd?
                        for (let [key, value] of moves) {
                            if (value.cmnCmd.toLowerCase() == userProvidedMoveName.toLowerCase()) {
                                move = moves.get(key);
                                break;
                            }
                        }
                    }

                    console.log(move);

                    for (let [key, value] of Object.entries(move)) {
                        // Skip anything not in the whitelist
                        if (propsKeyArr.includes(key)) {
                            console.log(key);
                            // Add the property
                            embed.addField(`${props.get(key)}`, `${value ? value : 'N/A'}`);
                        }
                    }

                    // Let it rip
                    message.channel.send(embed);
                } else {
                    // TODO(michaelstone)
                    // It's too much to list each move, it frequently goes over the Discord 2k character limit.
                    // To solve this, consolidate down to just the move (e.g. Shoryuken instead of Shoryuken with 3 different buttons after).
                    // Lucky for me, the buttons are always noted as follows:
                    // LP, MP, HP, LK, MK, HK, EX
                    // so I can just strip these combinations from the end of each move name.

                    // Edge case: Seth has 108 moves if you include the Tanden Arts. Those are all the same move though
                    // so just list it once and skip the rest.
                    var msg = `${util.capitalize(charName)}'s Normal Moves:`;
                    for (let [key, value] of moves) {
                        if (!key.includes('Install Art')) {
                            msg += `\n${key}`;
                        } else if (key.includes('Install Art') && !msg.includes('Install Art')) {
                            msg += `\n${key.replace(/ *\([^)]*\) */g, "")} ${value.plnCmd.replace(/ *\([^)]*\) */g, "")}`;
                        } else {
                            continue;
                        }
                    }

                    message.channel.send(msg);
                }

                break;
            case 'trigger1':
                // Retrieve VT1 move data
                var vt1moves = sheetsUtil.sfvCharacterData.get(charName).get('trigger1');

                // Create an embed and populate with the data
                var embed = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle(`${util.capitalize(charName)} VT1 Changed Moves`);

                for (let [name, row] of vt1moves) {
                    embed.addField(`${name}`, `${row.plnCmd}`);
                }

                // Let it rip
                message.channel.send(embed);
                break;
            case 'trigger2':
                // Retrieve VT1 move data
                var vt2moves = sheetsUtil.sfvCharacterData.get(charName).get('trigger2');

                // Create an embed and populate with the data
                var embed = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle(`${util.capitalize(charName)} VT2 Changed Moves`);

                for (let [name, row] of vt2moves) {
                    embed.addField(`${name}`, `${row.plnCmd}`);
                }

                // Let it rip
                message.channel.send(embed);
                break;
            default:
                util.performFailReact(message);
        }
    },
};