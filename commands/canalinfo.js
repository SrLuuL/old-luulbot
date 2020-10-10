module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch")
const ms = require("pretty-ms")



let sender = args[0] ? args[0] : username

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

const mods = res2.mods.length
const vips = res2.vips.length
  
  
const verifyBio = (bio) => {
  return bio ? bio.length > 70 ? `${bio.slice(0,70)}...` : bio : '(sem bio)'
}

const verifyColor = (chatColor ) => {
  return chatColor || '(sem cor)'
}
  
const verifyBan = (banned) => {
  return banned ? `a conta ${displayName} está banida` : `a conta ${displayName} não está banida`
}

const verifyRoles = (affiliate, partner, staff) => {
  const roles = [!!affiliate && 'afiliado', !!partner && 'parceria', !!staff && 'staff']
  
  return roles.find(i => i) ? roles.filter(Boolean).join(',') : 'nenhum cargo';
}

const robot = (bot) => {
  return bot ? `${displayName} é um bot verificado MrDestructoid` : `${displayName} não é um bot verificado`
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



  
  switch (args[0]) {
    case "--age":
      return client.say(channel, `${username}, Sua conta foi criada em ${getDate()}`)
      
}
  
  
  switch (args[1]) {
    case "--lang":
      client.say(channel, `${username}, A linguagem deste canal é: ${userLang}`);
      break;
    case "--ban":
     client.say(channel, `${username}, ${verifyBan(banned)}`);
      break;
    case "--cargos":
     client.say(channel, `${username}, A conta ${displayName} ${verifyRoles(affiliate, partner, staff)}`);
      break;
    case "--bot":
      client.say(channel, `${username}, ${robot(bot)}`);
      break;
    case "--age":
      client.say(channel, `${username}, A conta ${displayName} foi criada em ${getDate()}`)
      break;
    case "--mv":
      client.say(channel, `${username}, A conta ${displayName} possui ${mods} mods e ${vips} vips em seu canal`)
      break;
    case undefined:
      client.say(channel, `${username}, Canal: ${displayName} | ID: ${id} | Bio: ${verifyBio(bio)} | Cor: ${verifyColor(chatColor)}`)
      break;
    default:
      client.say(channel, `${username}, opção inválida tente --lang / --ban / --cargos / --bot / --age / --mv`)
      break;
}





}

module.exports.config = {
  name: "canalinfo",
  aliases: ["cli"],
  description: "Mostra informações sobre um canal de um usuário",
  usage: "canalinfo"
}
