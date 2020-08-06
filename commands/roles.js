const util = require('../util');

module.exports = {
    name: 'roles',
    description: 'Manage your roles on the server. You can join a role via !roles join <role name>, or see joinable roles by just !roles',
    usage: `roles [join <role name>]`,
    execute(message, args) {
        // Can't be used in DM
        if (!util.performDmCheck(message)) return;

        // Get the bots role position. It can only assign roles *below* it (Discord requirement)
        let myRole = message.guild.roles.cache.find(role => role.name === "Stanbot 2.0");

        // Get the list of all roles that the bot can assign
        var roleNames = [];
        for (const role of message.guild.roles.cache.values()) {
            // Can't assign managed roles or roles that are higher than the bots role
            // Also don't list @everyone
            console.log(role);
            if (!role.managed && role.position <= myRole.position && role.name != '@everyone') {
                roleNames.push(role.name);
            }
        }

        // No args just give the list of available roles
        if (!args.length) {
            // Strip the @ so this doesn't spam people
            roleNames.forEach(function (value) { value.replace('@', '') });
            return util.replyToUserWithMessage(message, `You can join any of the following roles ${message.author}:\n${roleNames}`);
        }

        // If not listing roles, then minimum # of args is 2 (command + role to act on)
        if (!args[1]) {
            // Make sure they gave you a role to join
            util.performFailReact(message);
            return util.replyToUserWithMessage(message, `You have to give me an instruction and tell me what role to use, ${message.author}`);
        }

        // Get the role name. Role names can be many strings, so assume the rest of the args are the role name.
        var roleToJoin = `${args.slice(1).join(' ')}`;

        // Make sure it's in our valid role list
        if (!roleNames.includes(roleToJoin)) {
            util.performFailReact(message);
            return util.replyToUserWithMessage(message, `I'm sorry ${message.author}, I'm afraid I can't do that. (Role doesn't exist, or I can't assign it)`);
        }

        // Get the actual Role object and join
        var role = message.guild.roles.cache.find(r => r.name === roleToJoin);

        // Switch on args[0] for each command arg
        switch (args[0]) {
            case 'join':
                message.member.roles.add(role).then(success => {
                    util.performSuccessReact(message);
                }).catch(error => {
                    console.log(error);
                    util.performFailReact(message);
                    return util.replyToUserWithMessage(message, `I couldn't add you to that role. Did you spell the role name correctly? It is case sensitive.`);
                });
                break;
            case 'leave':
                message.member.roles.remove(role).then(success => {
                    util.performSuccessReact(message);
                }).catch(error => {
                    console.log(error);
                    util.performFailReact(message);
                    return util.replyToUserWithMessage(message, `I couldn't remove you from that role. Did you spell the role name correctly? It is case sensitive.`);
                });
                break;
            default:
                util.performFailReact(message);
        }
    },
};