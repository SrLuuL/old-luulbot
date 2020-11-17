module.exports.run = async (client, message, args, username, channel) => {

const db = require('../clients/database.js').db;
const luulbot = require('../clients/discord.js').luulbot;

const channelList = await db.query(`SELECT * FROM luulbot_channels WHERE userchannel = '${args[0]}'`);
const channelPerm = await db.query(`SELECT * FROM luulbot_perms WHERE channel = '${args[0]}' AND command = '${args[1]}'`)
const cmd = luulbot.commands.get(args[1].toLowerCase()) || luulbot.commands.get(luulbot.aliases.get(args[1].toLowerCase()))
const {userchannel, userid} = channelList.rows[0]

if (!channelList.rowCount) {
return client.say(channel, `${username}, bot não está presente neste canal :/`)
}

if (!cmd) {
return client.say(channel, `${username}, o bot não possui esse comando :/`)
}
  
if (!channelPerm.rowCount) {
  return client.say(channel, `${username}, o canal já não possui acesso a esse comando :/`)
}

await db.query(`DELETE FROM luulbot_perms WHERE channel = '${args[0]}' AND command = '${args[1]}'`)

client.say(channel, `${username}, ${userchannel} não possui mais ${cmd.config.name}!`)

}

module.exports.config = {
name: 'unwhitelist',
aliases: [],
usage: 'unwhitelist [user] [cmd]',
description: 'Remove a autorização dos canais a usarem certos comandos',
level: 'Dono'
}
