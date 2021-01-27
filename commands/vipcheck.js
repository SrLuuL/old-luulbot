module.exports.run = async (context) => {

const fetch = require('node-fetch');
const ms = require('pretty-ms');
const {args, user:username, channel} = context
  
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

const vipCheck = res.vips.find(i => i.login === user) || false;


sender = (sender === username.username) ? 'seu canal' : sender;
user = (user === username.username) ? 'você' : user;  


if (vipCheck) {

let vipTime = ms(Date.now() - new Date(vipCheck.grantedAt), {secondsDecimalDigits: 0, unitCount: 3})
.replace(/y/, 'a');
  
return { reply: `${user} é vip em ${sender} há ${vipTime} atrás` }

} else {

return { reply: `${user} não é vip em ${sender}` }
  
}
  
 } catch(e) {
  return { reply: 'Erro desconhecido' } 
 }

}

module.exports.config = {
name: 'vipcheck',
aliases: ['vipchk'],
description: 'Checa se um usuário é vip em um determinado canal',
usage: 'vipcheck [user1] [user2]',
level: 'Todos',
cooldown: 5000    
}
