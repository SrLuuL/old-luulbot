module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch")

let sender = (!args[0]) ? username : args[0]

let res = await fetch(`https://api.ivr.fi/twitch/resolve/${sender}`);
let data = await res.json();

  if (data.status === 404) {
    return client.say(channel, `${username}, não encontrei esse usuário :/`)
  }
  
let user = data.displayName
let userid = data.id
let bio = data.bio
bio = (!bio) ? "(sem bio)" : bio
let color = data.chatColor
let banned = data.banned
banned = (banned === true) ? `${user} está banido` : `${user} não está banido`
let partner = data.partner
partner = (partner === true) ? "parceria/" : ""
let aff = data.affiliate
aff = (aff === true) ? "afiliado/" : ""
let staff = data.roles.isStaff
staff = (staff === true) ? "staff" : ""
let roles = aff + partner + staff
roles = (roles === "" + "" + "") ? `nenhum cargo` : roles
let bot = data.bot
bot = (bot === true) ? `${user} é um bot` : `${user} não é um bot`
  
  switch(roles) {
    case "afiliado/":
      roles = "afiliado"
      break;
    case "parceria/":
      roles = "parceiro"
      break;
  }

  
  switch (args[1]) {
    case "--ban":
     return client.say(channel, `${username}, ${banned}`);
    case "--cargos":
     return client.say(channel, `${username}, ${user} possui ${roles}.`);
    case "--bot":
     return client.say(channel, `${username}, ${bot});
  }

client.say(channel, `${username}, Canal: ${user} | ID: ${userid} | Bio: ${bio} | Cor: ${color}`)

}

module.exports.config = {
  name: "canalinfo",
  aliases: ["cli"],
  description: "Mostra informações sobre um canal de um usuário",
  usage: "canalinfo"
}
