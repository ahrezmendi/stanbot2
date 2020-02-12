module.exports = {
    name: 'pacha',
    description: 'Perfection.',
    cooldown: 5,
    execute(message, args) {
        message.react('✋')
            .then(() => message.react('👌'));
    },
};