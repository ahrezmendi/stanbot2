const fs = require('fs');
const { prefix, token, sqlitepath } = require('./config.json');
const Discord = require('discord.js');
const sheetsUtil = require('./sheets');
const Keyv = require('keyv');

// Set up SQLite DB connections
const voiceCategories = new Keyv(sqlitepath, { namespace: 'voice' });

// Handle DB connection errors
voiceCategories.on('error', err => console.log('SQLite Connection Error', err));

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const activities_list = [
	`${prefix}help to see what I can do! (DM or in any text channel)`,
	`${prefix}help`,
	`${prefix}help for great awesome!`
];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	console.log(`Processing command file: ${file}`);
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	setInterval(() => {
		const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
		client.user.setPresence({ game: { name: activities_list[index] }, status: 'available' })
			.then(console.log)
			.catch(console.error);
	}, 10000000); // Runs this every 10,000 seconds.
	sheetsUtil.loadSpreadsheetData();
	console.log('Ready!');
});

// Main entrypoint for all text commands the bot receives.
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	// Retrieve the correct command based on the name or alias
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// Check if the command is only valid in a server
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	// Check args
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	// Process any active command cooldowns
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	let now = Date.now();
	let timestamps = cooldowns.get(command.name);
	let cooldownAmount = (command.cooldown || 1) * 1000;

	if (timestamps.has(message.author.id)) {
		let expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			let timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	// Execute
	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

// Main entrypoint for handling voice status changes
client.on('voiceStateUpdate', (oldState, newState) => {
	async function deleteVoiceChannel() {
		if (newState.channelID == undefined) {
			// Someone just left a voice channel, so determine what channel it was
			let ch = oldState.channel;

			// See if this channel is in the On-Demand section
			let channelCategory = ch.parent.name;
			let voiceCategory = await voiceCategories.get(oldState.guild.id);
			console.log(voiceCategory);
			if (channelCategory.toLowerCase() == `${voiceCategory}`) {
				// See if the channel is now empty. If it is, clean it up.
				if (ch.members.size <= 0) {
					ch.delete();
				}
			}
		}
	}
	deleteVoiceChannel();
})

client.login(token);
