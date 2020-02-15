module.exports = {
    name: 'pacha',
    description: 'Perfection.',
    execute(message, args) {
        message.react('✋')
            .then(() => message.react('👌'));
    },
};