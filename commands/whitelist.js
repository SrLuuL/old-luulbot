module.exports.run = async ({args}) => {

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
return { reply: 'bot não possui este comando :/' }
}
  
if (channelPerm.rowCount) {
  return { reply: 'o canal já possui acesso a este comando :/' }
}

const {userchannel, userid, useruid} = channelList.rows[0];

await db.query(`INSERT INTO luulbot_perms(channel, channel_id, command, channel_uid) VALUES($1, $2, $3, $4)`, [userchannel, userid, cmd.config.name, useruid])

return {
 reply: `${userchannel} agora possui ${cmd.config.name}!` 
}

}

module.exports.config = {
name: 'whitelist',
aliases: [],
usage: 'whitelist [user] [cmd]',
description: 'Autoriza canais a usarem certos comandos',
level: 'Dono',
cooldown: 500    
}
