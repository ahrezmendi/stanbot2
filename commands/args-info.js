module.exports = {
	name: 'args-info',
	description: 'Returns the args you sent it (example args processing)',
	execute(message, args) {
		if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }
        else {
            return message.channel.send(`Yours args were: ${args}`);
        }
        
        message.channel.send(`First argument: ${args[0]}`);
	},
};