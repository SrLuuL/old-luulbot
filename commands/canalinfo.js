module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch")

let sender = (!args[0]) ? username : args[0]

let res = await fetch(`https://api.ivr.fi/twitch/resolve/${sender}`);
let data = await res.json();

let user = data.displayName
let userid = data.id
let bio = data.bio
bio = (!bio) ? "(sem bio)" : bio
let color = data.chatColor
let banned = data.banned
banned = (banned === true) ? `${user} está banido` : `${user} não está banido`
let partner = data.partner
partner = (partner === true) ? `${user} é um parceiro. ` : ""
let aff = data.affiliate
aff = (aff === true) ? `${user} é um afiliado. ` : ""
let staff = data.roles.isStaff
staff = (staff === true) ? `${user} é um staff. ` : ""
let roles = aff + partner + staff
if (data.affiliate === false) && (data.partner === false) && (data.roles.isStaff === false) {
  roles = `${user} não  possui cargos`
}
  

  
  switch (args[1]) {
    case "--b":
     return client.say(channel, `${username}, ${banned}`);
    case "--c":
     return client.say(channel, `${username}, ${roles}`);
  }

client.say(channel, `${username}, Canal: ${user} | ID: ${userid} | Bio: ${bio} | Cor: ${color}`)

}

module.exports.config = {
  name: "canalinfo",
  aliases: ["cli"],
  description: "Mostra informações sobre um canal de um usuário",
  usage: "canalinfo"
}
