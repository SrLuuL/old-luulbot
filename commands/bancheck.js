module.exports.run = async (context) => {

const ms = require("pretty-ms");
const fetch = require("node-fetch");

let [user, user2] = context.args;

if (!user) {
 return { reply: 'insira usuários :/' } 
}

if (!user2) {
user = context.user.username
user2 = context.args[0]
}

const res = await (await fetch(`https://api.ivr.fi/twitch/banlookup/${user}/${user2}`)).json(); 
  
if (res.error) {
 return { reply: 'conta inexistente ou suspensa' } 
}
  
const {status, banned, isPermanent, createdAt, expiresAt} = res;

user = (user.toLowerCase() === context.user.username) ? "você" : user;
user2 = (user2.toLowerCase() === context.user.username) ? "seu canal" : user2;

if (status === 500) {
  return { reply: 'usuários inválidos :/' }
}
  
if (!banned) {
  return { reply: `${user} não está com um ban em ${user2}` }
}
  
const dateBan = ms(Date.now() - new Date(createdAt), {secondsDecimalDigits: 0, unitCount: 3})
.replace(/y/g, "a");
const dateExpire = ms(new Date(expiresAt) - Date.now(), {secondsDecimalDigits: 0, unitCount: 3})
.replace(/y/g, "a");
  

  
if (isPermanent) {
return { reply: `${user} está com um ban permanente em ${user2} há ${dateBan} atrás` }
} else {
return { reply: `${user} está com timeout em ${user2} há ${dateBan} atrás e vai acabar em ${dateExpire}` }
}



}

module.exports.config = {
name: "bancheck",
aliases: ["banchk"],
description: "Verifica se um usuário está banido em algum canal",
usage: "bancheck [user] [user2]",
level: 'Todos',
cooldown: 5000
}

