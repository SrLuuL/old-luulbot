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

const modCheck = res.mods.find(i => i.login === user)
  
  
if (args[0] && args[1]) {

if (modCheck) {

let modTime = ms(Date.now() - new Date(modCheck.grantedAt), {secondsDecimalDigits: 0, unitCount: 3});

sender = (sender === username) ? 'seu canal' : user;
user = (user === username) ? 'você' : user;
  
return client.say(channel , `${username}, ${user} é mod em ${sender} há ${modTime} atrás`)

} else {

return client.say(channel, `${username}, ${user} não é mod em ${sender}`)
  
}

  
}  

}

module.exports.config = {
name: 'modcheck',
aliases: ['modchk'],
description: 'Checa se um usuário é mod em um determinado canal',
usage: 'modcheck [user1] [user2]'
}
