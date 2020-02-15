const util = require('../util');

module.exports = {
	name: 'registervoicecategory',
    description: 'Registers the channel category to use for creating voice channels with createvoice.',
    category: 'On-Demand Voice',
	execute(message, args) {
        util.performAdminCheck(message);
        if (!args.length) return message.channel.send(`You didn't specify a category channel, ${message.author}!`);
        this.category = args.join(' ').toLowerCase();
        util.performSuccessReact(message);
    },
};