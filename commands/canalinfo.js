module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch")
const ms = require("pretty-ms")



let sender = args[0] ? args[0] : username


const res = await (await fetch(`https://api.ivr.fi/twitch/resolve/${sender}`)).json()



  if (res.status === 404 || res.status === 500) {
    return client.say(channel, `${username}, não encontrei esse usuário :/`)
  }
 
let {displayName, login, id, bio, chatColor} = res;


  

bio =  bio ? bio.length > 70 ? `${bio.slice(0,70)}...` : bio : '(sem bio)';
  
chatColor = chatColor || '(sem cor)';
  

 
client.say(channel, `${username}, Canal: ${displayName} | ID: ${id} | Bio: ${bio} | Cor: ${chatColor}`)



}

module.exports.config = {
  name: "canalinfo",
  aliases: ["cli"],
  description: "Mostra informações sobre um canal de um usuário",
  usage: "canalinfo [user]",
  level: 'Todos',
  cooldown: 5000
}
