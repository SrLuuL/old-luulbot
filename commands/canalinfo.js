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
partner = (partner === true) ? "parceiro" : null
let aff = data.affiliate
aff = (aff === true) ? "afiliado" : null
let staff = data.roles.isStaff
staff = (staff === true) ? "staff" : null
let roles = [partner, aff, staff]
roles = (roles === null + null + null) ? `${user} não possui cargos` : roles
  

  
  switch (args[1]) {
    case "--b":
     return client.say(channel, `${username}, ${banned}`);
    case "--c":
     return client.say(channel, `${username}, ${user} é um ${roles.join("/")}.`);
  }

client.say(channel, `${username}, Canal: ${user} | ID: ${userid} | Bio: ${bio} | Cor: ${color}`)

}

module.exports.config = {
  name: "canalinfo",
  aliases: ["cli"],
  description: "Mostra informações sobre um canal de um usuário",
  usage: "canalinfo"
}
