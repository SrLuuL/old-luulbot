module.exports.run = async (context) => {

const fetch = require("node-fetch")
const ms = require("pretty-ms")

try {

let sender = context.args[0] ? context.args[0] : context.user.username


const res = await (await fetch(`https://luulbot.herokuapp.com/api/twitch/user/${sender}`)).json()

if(res.status === 404) {
  return { reply: res.error }
}

let {displayName, login, id, description, chatColor, banned} = res;
  
banned = (banned) ? '(🛑 Banido)' : '';  
description =  (description) ? description.length > 70 ? `${description.slice(0,70)}...` : description : '(sem bio)';  
chatColor = (chatColor) || '(sem cor)';
  

return {
 reply: `Canal: ${displayName} ${banned} | ID: ${id} | Bio: ${description} | Cor: ${chatColor}` 
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
