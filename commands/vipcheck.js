module.exports.run = async (client, message, args , username, channel) => {

const fetch = require('node-fetch');
const ms = require('pretty-ms');

let sender;
let user;

if (args[0] && args[1]) {
sender = args[1].toLowerCase();
user = args[0].toLowerCase();  
} else if (args[0] && !args[1]) {
sender = args[0].toLowerCase();
user = username; 
} else {
sender = channe.replace('#', '');
user = username;
}


const res = await (await fetch(`https://api.ivr.fi/twitch/modsvips/${sender}`)).json();

const vipCheck = res.vips.find(i => i.login === user)


sender = (sender === username) ? 'seu canal' : sender;
user = (user === username) ? 'você' : user;  


if (modCheck) {

let vipTime = ms(Date.now() - new Date(modCheck.grantedAt), {secondsDecimalDigits: 0, unitCount: 3});
  
return client.say(channel , `${username}, ${user} é vip em ${sender} há ${modTime} atrás`)

} else {

return client.say(channel, `${username}, ${user} não é vip em ${sender}`)
  
}
  

}

module.exports.config = {
name: 'vipcheck',
aliases: ['vipchk'],
description: 'Checa se um usuário é vip em um determinado canal',
usage: 'vipcheck [user1] [user2]'
}