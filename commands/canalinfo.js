module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch")
const ms = require("pretty-ms")

let sender = (!args[0]) ? username : args[0]
switch(args[0]) {
  case "--age":
    sender = username
    break;
  case "--mv":
    sender = username
    break;
}

let res = await fetch(`https://api.ivr.fi/twitch/resolve/${sender}`);  
let data = await res.json();
let res2 = await fetch(`https://api.ivr.fi/twitch/modsvips/${sender}`);
let data2 = await res2.json();

  if (data.status === 404 || data.status === 500) {
    return client.say(channel, `${username}, não encontrei esse usuário :/`)
  }
  
let user = data.displayName
let userid = data.id
let bio = data.bio
bio = (!bio) ? "(Sem Bio)" : bio
bio = (bio.length > 70) ? bio.slice(0, 70) + "..." : bio
let color = data.chatColor
color = (color === null) ? "(Sem Cor)" : color
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
bot = (bot === true) ? `${user} é um bot verificado MrDestructoid` : `${user} não é um bot verificado`
let lang = data.settings.preferredLanguageTag 
let date = new Date(data.createdAt)
let dateDay = (date.getDate() > 9) ? date.getDate() : "0" + date.getDate()
let dateMonth = (date.getMonth() > 9) ? date.getMonth() : "0" + (date.getMonth() + 1)
let dateYear = date.getFullYear() 
let fullDate = `${dateDay}/${dateMonth}/${dateYear}`
let dateAge = ms(Date.now() - date, {secondsDecimalDigits: 0, unitCount: 2}).replace(/y/g, "a")
const {mods, vips} = data2;
let totalMods = await Object.keys(mods).length
let totalVips = await Object.keys(vips).length


  switch(roles) {
    case "afiliado/":
      roles = "afiliado"
      break;
    case "parceria/":
      roles = "parceria"
      break;
  }

  
  switch (args[0]) {
    case "--age":
      return client.say(channel, `${username}, Sua conta foi criada em ${fullDate}(${dateAge} atrás)`)
}
  
  
  switch (args[1]) {
    case "--lang":
      return client.say(channel, `${username}, A linguagem deste canal é: ${lang}`);
    case "--ban":
     return client.say(channel, `${username}, ${banned}`);
    case "--cargos":
     return client.say(channel, `${username}, ${user} possui ${roles}.`);
    case "--bot":
      return client.say(channel, `${username}, ${bot}`);
    case "--age":
      return client.say(channel, `${username}, A conta ${user} foi criada em ${fullDate}(${dateAge} atrás)`)
    case "--mv":
      return client.say(channel, `${username}, ${user} possui ${totalMods} mods e ${totalVips} vips em seu canal`)
}


client.say(channel, `${username}, Canal: ${user} | ID: ${userid} | Bio: ${bio} | Cor: ${color}`)

}

module.exports.config = {
  name: "canalinfo",
  aliases: ["cli"],
  description: "Mostra informações sobre um canal de um usuário",
  usage: "canalinfo"
}
