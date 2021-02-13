module.exports.run = async ({args, user: username, channel}) => {

const fetch = require('node-fetch');
const ms = require('pretty-ms');

let sender;
let user;


if (args[0] && args[1]) {
sender = args[1].toLowerCase();
user = args[0].toLowerCase();  
} else if (args[0] && !args[1]) {
sender = args[0].toLowerCase();
user = username.username; 
} else {
sender = channel.replace('#', '');
user = username.username;
}

try {
 
const res = await (await fetch(`https://luulbot.herokuapp.com/api/twitch/modsvips/${sender}`)).json();

const modCheck = res.mods.find(i => i.login === user) || false;


sender = (sender === username.username) ? 'seu canal' : sender;
user = (user === username.username) ? 'você' : user;  


if (modCheck) {

let modTime = ms(Date.now() - new Date(modCheck.grantedAt), {secondsDecimalDigits: 0, unitCount: 3})
.replace(/y/, 'a');
  
return { reply: `${user} é mod em ${sender} há ${modTime} atrás` }

} else {

return { reply: `${user} não é mod em ${sender}` }
  
}
  
} catch(e) {
return { reply: 'Erro desconhecido' }
}

}

module.exports.config = {
name: 'modcheck',
aliases: ['modchk'],
description: 'Checa se um usuário é mod em um determinado canal',
usage: 'modcheck [user1] [user2]',
level: 'Todos',
cooldown: 5000  
}
