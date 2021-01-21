module.exports.run = async (context) => {

const fetch = require('node-fetch');

   
let user = context.args[0] ? context.args[0] : context.user.username;


const res = await (await fetch(`https://luulbot.herokuapp.com/api/twitch/user/${user}`)).text()

if (res.status === 404) {
   return { reply: res.error + ' :/' }
  }
  
let followers = (!res.followers.totalCount) ? 'nenhum seguidor' : (res.followers.totalCount > 1) ? `${res} seguidores` : `${res} seguidor`;
    
user = (user === context.user.username) ? 'você' : user;
    
return {
 reply: `${user} possui ${followers}`  
}
   
}

module.exports.config = {
name: 'followcount',
aliases: ['fc'],
usage:'followcount [user]',
description: 'Mostra quantos seguidores um canal possui',
level: 'Todos',
cooldown: 5000
}
