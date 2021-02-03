module.exports.run = async (context) => {

const channelsOptions = require("../credentials/login.js").channelOptions;
const db = require("../clients/database.js").db;
const fetch = require('node-fetch');  

let channelSender = context.args[0];  

if (channelSender) return { reply: 'nenhum canal citado :/' }
 
const getId = await db.query('SELECT userid FROM luulbot_channels ORDER BY userid ASC')
const userID = await (await fetch(`https://luulbot.herokuapp.com/api/twitch/user/${channelSender}`)).json()

if(userID.error) {
 return { reply: `${userID.error} :/` } 
}

await db.query(`INSERT INTO luulbot_channels(userchannel, userid, useruid) VALUES($1,$2,$3)`, [context.args[0], getId.rows.pop().userid + 1, userID.id]);
context.client.join(context.args[0]);
channelsOptions.push(`${context.args[0]}`)

return {
 reply: `conectado com sucesso em ${channelSender}` 
}
  
}

module.exports.config = {
name: "join",
aliases: [],
description: "Conecta o bot em um canal",
usage: "join [user]",
level: 'Dono',
cooldown: 500
}
