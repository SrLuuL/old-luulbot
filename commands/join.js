module.exports.run = async (context) => {

const channelsOptions = require("../credentials/login.js").channelOptions;
const db = require("../clients/database.js").db;
const fetch = require('node-fetch');  

let channelSender = context.args[0];  

if (!channelSender) return { reply: 'nenhum canal citado :/' }
 
const getUID = await db.query('SELECT useruid FROM luulbot_channels ORDER BY useruid ASC')
const channelsDB = await db.query('SELECT * FROM luulbot_channels')
const userID = await (await fetch(`https://luulbot.herokuapp.com/api/twitch/user/${channelSender}`)).json()
let channelUID = getUID.rows.pop().useruid + 1;

if(userID.error) {
 return { reply: `${userID.error} :/` } 
}
 
let channelInfo =  channelsDB.rows.find(i => i.userid === userID.id);
console.log(channelInfo) 
 
if(channelInfo) {
 await db.query(`UPDATE luulbot_channels SET userchannel = '${channelSender}' WHERE userid = '${channelInfo.userid}'`);
 const channelPlace = channelsOptions.findIndex(i => i === channelSender);
 channelsOptions.splice(`${channelInfo.userchannel}`, 1);
 channelsOptions.push(`${channelSender}`)
} else {
await db.query(`INSERT INTO luulbot_channels(userchannel, userid, useruid) VALUES($1,$2,$3)`, [channelSender, userID.id , channelUID]);
context.client.join(channelSender);
channelsOptions.push(`${channelSender}`)
}

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
