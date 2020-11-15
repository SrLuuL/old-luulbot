module.exports.run = async (client, message, args, username, channel) => {

const fetch = require('node-fetch');

let user = args[0] ? args[0] : username;


const res = await (await fetch(`https://decapi.me/twitch/followcount/${user}`)).text()

if (res === `No user with the name "${user}" found.`) {
    client.say(channel, `${username}, usuário não existe :/`)
  }
  
let followers = (res !== 0) ? (parseInt(res, 0) > 1) ? `${res} seguidores` : `{res} seguidor` : 'nenhum seguidor';

client.say(channel, `${username}, ${user} possui ${followers}`)

}

module.exports.config = {
name: 'followcount',
aliases: ['fc'],
usage:'followcount [user]',
description: 'Mostra quantos seguidores um canal possui',
level: 'Todos'
}
