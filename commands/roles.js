const util = require('../util');

module.exports = {
    name: 'roles',
    description: 'Manage your roles on the server. You can join a role via !roles join <role name>, or see joinable roles by just !roles',
    usage: `roles [join <role name>]`,
    execute(message, args) {
        // Get the bots role position. It can only assign roles *below* it (Discord requirement)
        let myRole = message.guild.roles.find(role => role.name === "Stanbot 2.0");

        // Get the list of all roles that the bot can assign
        var roleNames = [];
        for (const role of message.guild.roles.values()) {
            // Can't assign managed roles or roles that are higher than the bots role
            // Also don't list @everyone
            if (!role.managed && role.calculatedPosition <= myRole.calculatedPosition && role.name != '@everyone') {
                roleNames.push(role.name.toLowerCase());
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
        var roleToJoin = `${args.slice(1).join(' ').toLowerCase()}`;

        // Make sure it's in our valid role list
        if (!roleNames.includes(roleToJoin)) {
            util.performFailReact(message);
            return util.replyToUserWithMessage(message, `I'm sorry ${message.author}, I'm afraid I can't do that. (Role doesn't exist, or I can't assign it)`);
        }

        // Get the actual Role object and join
        var role = message.guild.roles.find(r => r.name === roleToJoin);

        // Switch on args[0] for each command arg
        switch (args[0]) {
            case 'join':
                message.member.addRole(role).then(success => {
                    util.performSuccessReact(message);
                }).catch(error => {
                    console.log(error);
                    util.performFailReact(message);
                });
                break;
            case 'leave':
                message.member.removeRole(role).then(success => {
                    util.performSuccessReact(message);
                }).catch(error => {
                    console.log(error);
                    util.performFailReact(message);
                });
                break;
            default:
                util.performFailReact(message);
        }
    },
};