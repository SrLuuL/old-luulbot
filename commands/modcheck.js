module.exports.run = async (client, message, args , username, channel) => {

const fetch = require('node-fetch');
const ms = require('pretty-ms');

let sender;


if (args[0] && args[1]) {
sender = args[1];
} else if (args[0] && !args[1]) {
sender = args[0];
} else {
sender = channe.replace('#', '');
}


const res = await (await fetch(`https://api.ivr.fi/twitch/modsvips/${sender}`)).json();


if (args[0] && args[1]) {

if (res.mods.find(i => i.login === args[0].toLowerCase())) {

let modTime = ms(Date.now() - new Date(res.mods.find(i => i.login === args[0].toLowerCase()).grantedAt), {secondsDecimalDigits: 0, unitCount: 3});

let senderUser =  (args[0].toLowerCase() === username) ? 'você' : args[0];
let senderChannel =  (args[1].toLowerCase() === username) ? 'seu canal' : args[1];  
  
return client.say(channel , `${username}, ${args[0]} é mod em ${args[1]} há ${modTime} atrás`)

} else {

return client.say(channel, `${username}, ${args[0]} não é mod em ${args[1]}`)
  
}

  
}  

}

module.exports.config = {
name: 'modcheck',
aliases: ['modchk'],
description: 'Checa se um usuário é mod em um determinado canal',
usage: 'modcheck [user1] [user2]'
}
