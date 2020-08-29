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

const res = await (await fetch(`https://api.ivr.fi/twitch/resolve/${sender}`)).json()
const res2 = await (await fetch(`https://api.ivr.fi/twitch/modsvips/${sender}`)).json()


  if (res.status === 404 || res.status === 500) {
    return client.say(channel, `${username}, não encontrei esse usuário :/`)
  }
 
let {displayName, login, id, bio, chatColor,
partner, affiliate, bot, banned, createdAt} = res;
let staff = res.roles.isStaff;   
const userLang = res.settings.preferredLanguageTag;

const verifyBio = (bio) => {
  if (!bio) return '(Sem Bio)'
  if (bio.length > 70) return `${bio.slice(0,70)}...`;
  
  return bio;
}

const verifyColor = (chatColor) => {
  if (!chatColor) return '(Sem Cor)'
  
  return chatColor;
}
  
const verifyBan = (banned) => {
  if (banned) return `A conta ${displayName} está banida`
  
  return `A conta ${displayName} não está banida`;
}

const verifyRoles = (affiliate, partner, staff) => {
  const aff = (!affiliate) ? false : 'afiliado';
  const part = (!partner) ? false : 'parceria';
  const staf = (!staff) ? false : 'staff';
  
  
  const roles = [aff, part, staf];
  if (!roles.find(i => i)) return `não possui cargos`
  
  return  `possui ${roles.filter(Boolean).join("/")}`;
}

const robot = (bot) => {
  if (bot) return `${displayName} é um bot verificado MrDestructoid`
  
  return `${displayName} não é um bot verificado`
}

const getDate = () => {
let date = new Date(createdAt);
let dateDay = (date.getDate() >= 10) ? date.getDate() : "0" + date.getDate();
let dateMonth = (date.getMonth() >= 10) ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
let dateYear = date.getFullYear();
let fullDate = `${dateDay}/${dateMonth}/${dateYear}`;
let dateAge = ms(Date.now() - date, {secondsDecimalDigits: 0, unitCount: 2})
.replace(/y/g, "a");
  
return `${fullDate}(${dateAge} atrás)`  
}

const getMv = async() => {
const {mods,vips} = res2;  
const totalMods = await Object.keys(mods).length;
const totalVips = await Object.keys(vips).length;
  
return await `${totalMods} mods e ${totalVips} vips`   
}


  
  switch (args[0]) {
    case "--age":
      client.say(channel, `${username}, Sua conta foi criada em ${getDate()}`)
}
  
  
  switch (args[1]) {
    case "--lang":
      return client.say(channel, `${username}, A linguagem deste canal é: ${userLang}`);
    case "--ban":
     return client.say(channel, `${username}, ${verifyBan(banned)}`);
    case "--cargos":
     return client.say(channel, `${username}, A conta ${displayName} ${verifyRoles(affiliate, partner, staff)}`);
    case "--bot":
      return client.say(channel, `${username}, ${robot(bot)}`);
    case "--age":
      return client.say(channel, `${username}, A conta ${displayName} foi criada em ${getDate()}`)
    case "--mv":
      return client.say(channel, `${username}, A conta ${displayName} possui ${getMv()} em seu canal`)
}


client.say(channel, `${username}, Canal: ${displayName} | ID: ${id} | Bio: ${verifyBio(bio)} | Cor: ${verifyColor(chatColor)}`)


}

module.exports.config = {
  name: "canalinfo",
  aliases: ["cli"],
  description: "Mostra informações sobre um canal de um usuário",
  usage: "canalinfo"
}
