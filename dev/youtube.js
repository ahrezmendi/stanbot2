// const search = require('youtube-search');
// const Discord = require('discord.js');
// const { prefix, token, apikey } = require('../config.json');

// const opts = {
//   maxResults: 1,
//   key: apikey
// };

// module.exports = {
//     name: 'youtube',
//     description: "Search for a YouTube video, and get the first result embedded. Works like I'm Feeling Lucky used to on Google.",
//     args: true,
//     cooldown: 30,
//     usage: `All text you provide will be used as the search terms, and I'll embed the #1 resulting video for you.`,
//     execute(message, args) {
//         if (!args.length) return message.channel.send(`I can't search nothing, ${message.author}!`);

//         let searchTerms = args.join(' ');
//         search(searchTerms, opts, function(err, result) {
//             if(err) {
//                 console.log(err);
//                 return message.channel.send(`Sorry, something went wrong on the YouTube end, ${message.author}.`);
//             }
//             console.log(result);
//             message.channel.send(result[0].link);
//         });
//     },
// };