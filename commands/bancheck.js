module.exports.run = async (client, message, args, username, channel) => {

const ms = require("pretty-ms");
const fetch = require("node-fetch");

let [user, user2] = args;

if (!user) return client.say(channel, `${username}, insira usuários :/`)

if (!user2) {
user = username
user2 = args[0]
}

const res = await (await fetch(`https://api.ivr.fi/twitch/banlookup/${user}/${user2}`)).json(); 
  
if (res.error) return client.say(channel, `${username}, conta inexistente ou suspensa`);  
const {status, banned, isPermanent, createdAt, expiresAt} = res;

user = (user.toLowerCase() === username) ? "você" : user;
user2 = (user2.toLowerCase() === username) ? "seu canal" : user2;

if (status === 500) return client.say(channel, `${username}, usuários inválidos :/`)
if (!banned) return client.say(channel, `${username}, ${user} não está com um ban em ${user2}`)

const dateBan = ms(Date.now() - new Date(createdAt), {secondsDecimalDigits: 0, unitCount: 3})
.replace(/y/g, "a");
const dateExpire = ms(new Date(expiresAt) - Date.now(), {secondsDicimalDigits: 0, unitCount: 3})
.replace(/y/g, "a");
  

  
if (isPermanent) {
client.say(channel, `${username}, ${user} está com um ban permanente em ${user2} há ${dateBan} atrás`)
} else {
client.say(channel, `${username}, ${user} está com timeout em ${user2} há ${dateBan} atrás e vai acabar em ${dateExpire}`)
}



}

module.exports.config = {
name: "bancheck",
aliases: ["banchk"],
description: "Verifica se um usuário está banido em algum canal",
usage: "bancheck [user] [user2]",
level: 'Todos'
}

