module.exports.run = async (context) => {

const db = require('../clients/database.js').db;
const luulbot = require('../clients/discord.js').luulbot;
const {args} = context
  
const channelList = await db.query(`SELECT * FROM luulbot_channels WHERE userchannel = '${args[0]}'`);
const channelPerm = await db.query(`SELECT * FROM luulbot_perms WHERE channel = '${args[0]}' AND command = '${args[1]}'`)
const cmd = luulbot.commands.get(args[1].toLowerCase()) || luulbot.commands.get(luulbot.aliases.get(args[1].toLowerCase()))

if (!channelList.rowCount) {
return { reply: 'bot não está presente neste canal :/' }
}

if (!cmd) {
return { reply: 'bot não possui esse comando :/' }
}
  
if (!channelPerm.rowCount) {
  return { reply: 'o canal não possui acesso a este comando :/' }
}

const {userchannel, userid} = channelList.rows[0];


await db.query(`DELETE FROM luulbot_perms WHERE channel = '${args[0]}' AND command = '${args[1]}'`)

return {
 reply: `${userchannel} não possui mais ${cmd.config.name}!` 
}

}

module.exports.config = {
name: 'unwhitelist',
aliases: [],
usage: 'unwhitelist [user] [cmd]',
description: 'Remove a autorização dos canais a usarem certos comandos',
level: 'Dono',
cooldown: 500   
}
