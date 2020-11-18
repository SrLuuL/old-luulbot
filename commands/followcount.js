module.exports.run = async (client, message, args, username, channel) => {

const fetch = require('node-fetch');

   
let user = args[0] ? args[0] : username;


const res = await (await fetch(`https://decapi.me/twitch/followcount/${user}`)).text()

if (!parseInt(res, 0)) {
   return client.say(channel, `${username}, usuário não existe :/`)
  }
  
let followers = (parseInt(res, 0) === 0) ? 'nenhum seguidor' : (parseInt(res, 0) > 1) ? `${res} seguidores` : `${res} seguidor`;
    
user = (user === username) ? 'você' : user;
    
client.say(channel, `${username}, ${user} possui ${followers}`)

}

module.exports.config = {
name: 'followcount',
aliases: ['fc'],
usage:'followcount [user]',
description: 'Mostra quantos seguidores um canal possui',
level: 'Todos',
cooldown: 5000
}
