module.exports.run = async (context) => {
const channels = require("../credentials/login.js").channelOptions;
const db = require("../clients/database.js").db


if (!context.args[0]) return { reply: 'insira um canal :/' }
if (!channels.includes(context.args[0])) return { reply: 'não estou nesse canal :/' }


await db.query(`DELETE FROM luulbot_channels WHERE userchannel='${context.args[0]}'`)
  
let index = channels.indexOf(context.args[0])
channels.splice(index, 1)

if (context.client.channels.includes(`#${context.args[0]}`)) {
    context.client.part(context.args[0]);
}
  

return {
 reply: `saí do canal ${context.args[0]} com sucesso!` 
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
