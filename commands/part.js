module.exports.run = async ({args, client}) => {
const channels = require("../credentials/login.js").channelOptions;
const db = require("../clients/database.js").db
let channelsList = client.channels


if (!args[0]) return { reply: 'insira um canal :/' }
if (!channels.includes(args[0])) return { reply: 'não estou nesse canal :/' }


await db.query(`DELETE FROM luulbot_channels WHERE userchannel='${args[0]}'`)
  
let index = channels.indexOf(args[0])
channels.splice(index, 1)

  
  
if (channelsList.includes(`#${args[0]}`)) {
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
