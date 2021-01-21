module.exports.run = async (context) => {

const fetch = require('node-fetch');

   
let user = context.args[0] ? context.args[0] : context.user.username;


const res = await (await fetch(`https://luulbot.herokuapp.com/api/twitch/user/${user}`)).json();

if (res.status === 404) {
   return { reply: res.error + ' :/' }
  }

let followCount = res.followers.totalCount;   
let followers = (!followCount) ? 'nenhum seguidor' : (followCount > 1) ? `${followCount} seguidores` : `${followCount} seguidor`;
    
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
