module.exports.run = async ({args, client}) => {
const channels = require("../credentials/login.js").channelOptions;
const db = require("../clients/database.js").db
let channelsList = client.channels

let channelSender = args[0].toLowerCase();
if (!channelSender) return { reply: 'insira um canal :/' }
if (!channels.includes(channelSender)) return { reply: 'não estou nesse canal :/' }


await db.query(`DELETE FROM luulbot_channels WHERE userchannel='${channelSender}'`)
  
let index = channels.indexOf(channelSender)
channels.splice(index, 1)

  
  
if (channelsList.includes(`#${channelSender}`)) {
    client.part(args[0]);
}
  

return {
 reply: `saí do canal ${args[0]} com sucesso!` 
}


}

module.exports.config = {
name: "part",
aliases: [],
description: "Desconecta o bot em um canal",
usage: "join [user]",
level: 'Dono',
cooldown: 500
}
