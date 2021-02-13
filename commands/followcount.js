module.exports.run = async ({args, username}) => {

const fetch = require('node-fetch');

   
let user = args[0] ? args[0] : user.username;


const res = await (await fetch(`https://luulbot.herokuapp.com/api/twitch/user/${user}`)).json();

if (res.status === 404) {
   return { reply: res.error + ' :/' }
  }

let followCount = res.followers.totalCount;   
let followers = (!followCount) ? 'nenhum seguidor' : (followCount > 1) ? `${followCount} seguidores` : `${followCount} seguidor`;
    
user = (user === user.username) ? 'você' : user;
    
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
