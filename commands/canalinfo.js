module.exports.run = async ({args, user}) => {

const fetch = require("node-fetch")
const ms = require("pretty-ms")

try {

let sender = args[0] ? args[0] : user.username


const res = await (await fetch(`https://luulbot.herokuapp.com/api/twitch/user/${sender}`)).json()

if(res.status === 404) {
  return { reply: res.error }
}

let {displayName, login, id, description, chatColor, banned} = res;
  
banned = (banned) ? '| 🛑 BANIDO' : '';  
description =  (description) ? description.length > 70 ? `${description.slice(0,70)}...` : description : '(sem bio)';  
chatColor = (chatColor) || '(sem cor)';
  

return {
 reply: `Canal: ${displayName} | ID: ${id} | Bio: ${description} | Cor: ${chatColor} ${banned}` 
}
  
} catch(err) {
  return { reply: 'Erro desconhecido' }
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
