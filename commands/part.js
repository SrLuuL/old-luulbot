module.exports.run = async (client, message, args, username, channel) => {
const channels = require("../credentials/login.js").channelOptions;
const db = require("../clients/database.js").db


if (!args[0]) return client.say(channel, `${username}, nenhum canal no input :Z`)
if (!channels.includes(args[0])) return client.say(channel, `${username}, não estou nesse canal :/`)


await db.query(`DELETE FROM luulbot_channels WHERE userchannel='${args[0]}'`)
  
let index = channels.indexOf(args[0])
channels.splice(index, 1)

if (client.channels.includes(`#${args[0]}`)) {
    client.part(args[0]);
}
  

client.say(channel, `${username}, saí do canal ${args[0]} com sucesso!`);


}

module.exports.config = {
name: "part",
aliases: [],
description: "Desconecta o bot em um canal",
usage: "join [user]",
level: 'Dono'  
}
