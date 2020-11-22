module.exports.run = async (context) => {

const fetch = require("node-fetch")
const ms = require("pretty-ms")



let sender = context.args[0] ? context.args[0] : context.user


const res = await (await fetch(`https://api.ivr.fi/twitch/resolve/${sender}`)).json()



  if (res.status === 404 || res.status === 500) {
    return { reply: 'não encontrei esse usuário :/' }
  }
 
let {displayName, login, id, bio, chatColor} = res;

bio =  bio ? bio.length > 70 ? `${bio.slice(0,70)}...` : bio : '(sem bio)';
  
chatColor = chatColor || '(sem cor)';
  

return {
 reply: `Canal: ${displayName} | ID: ${id} | Bio: ${bio} | Cor: ${chatColor}` 
}
  



}

module.exports.config = {
  name: "canalinfo",
  aliases: ["cli"],
  description: "Mostra informações sobre um canal de um usuário",
  usage: "canalinfo [user]",
  level: 'Todos',
  cooldown: 5000
}
