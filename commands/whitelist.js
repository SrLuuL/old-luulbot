module.exports.run = async (client, message, args, username, channel) => {

const db = require('../clients/database.js').db;
const luulbot = require('../clients/discord.js').luulbot;

const channelList = await db.query(`SELECT * FROM luulbot_channels WHERE userchannel = '${args[0]}'`);

if (!channelList.rowCount) {
return client.say(channel, `${username}, bot não está presente neste canal :/`)
}

const {userchannel, userid} = channelList.rows[0]

const cmd = luulbot.command.get(args[1].toLowerCase()) || luulbot.command.get(luulbot.aliases.get(args[1].toLowerCase()))

if (!cmd) {
return client.say(channel, `${username}, o bot não possui esse comando :/`)
}

await db.query(`INSERT INTO luulbot_perms(channel, channel_id, command) VALUES(1$,2$,3$), [userchannel, userid, cmd.config.name] `)

client.say(channel, `${username}, ${userchannel} agora possui ${cmd.config.name}!`)

}

module.exports.config = {
name: 'whitelist',
aliases: [],
usage: 'whitelist [user] [cmd]'
description: 'Autoriza canais a usarem certos comandos'
level: 'Dono'
}
