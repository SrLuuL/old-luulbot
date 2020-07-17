module.exports.run = async (client, message, args, username, channel) => {

const ms = require("pretty-ms")
const fetch = require("node-fetch")

let user = args[0];
let user2 = args[1];

if (!user) return client.say(channel, `${username}, insira um usuário :/`)

if (!user2) {
user = username
user2 = args[0]
}

let res = await fetch(`https://api.ivr.fi/twitch/banlookup/${user}/${user2}`);
let data = await res.json();  
  
const {status, banned, isPermanent, createdAt, expiresAt} = data

if (status === 500) return client.say(channel, `${username}, usuários inválidos :/`)
if (banned === false) return client.say(channel, `${username}, ${user} não está banido em ${user2}`)
  
let DateBan = new Date(createdAt)
let DateExpire = new Date(expiresAt)
DateBan = Date.now() - DateBan
DateBan = ms(DateBan, {secondsDecimalDigits: 0});
DateExpire = DateExpire - Date.now()
DateExpire = ms(DateExpire, {secondsDecimalDigits: 0});


if (isPermanent === true) {
return client.say(channel, `${username}, ${user} está banido permanentemente em ${user2} há ${DateBan} atrás`)
} else {
return client.say(channel, `${username}, ${user} está com timeout em ${user2} há ${DateBan} atrás e vai acabar em ${DateExpire}`)
}



}

module.exports.config = {
name: "bancheck",
aliases: ["banchk"],
description: "Verifica se um usuário está banido em algum canal",
usage: "bancheck [user] [user2]"
}

