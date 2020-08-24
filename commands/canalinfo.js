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


bio = (!bio) ? "(Sem Bio)" : bio;
bio = (bio.length > 70) ? bio.slice(0, 70) + "..." : bio;
chatColor = (chatColor === null) ? "(Sem Cor)" : chatColor;
banned = (banned === true) ? `A conta ${displayName} está banida` : `A conta ${displayName} não está banida`;
partner = (partner === true) ? "parceria" : partner;
affiliate = (affiliate === true) ? "afiliado" : affiliate;
staff = (staff === true) ? "staff" : staff;
let roles = [affiliate, partner, staff];
roles = (!roles.includes(true)) ? `nenhum cargo` : roles.filter(Boolean).join("/");
bot = (bot === true) ? `${displayName} é um bot verificado MrDestructoid` : `${displayName} não é um bot verificado`;
let date = new Date(createdAt);
let dateDay = (date.getDate() > 9) ? date.getDate() : "0" + date.getDate();
let dateMonth = (date.getMonth() > 9) ? date.getMonth() : "0" + (date.getMonth() + 1);
let dateYear = date.getFullYear() ;
let fullDate = `${dateDay}/${dateMonth}/${dateYear}`;
let dateAge = ms(Date.now() - date, {secondsDecimalDigits: 0, unitCount: 2}).replace(/y/g, "a");
const {mods, vips} = res2;
let totalMods = await Object.keys(mods).length;
let totalVips = await Object.keys(vips).length;



  
  switch (args[0]) {
    case "--age":
      return client.say(channel, `${username}, Sua conta foi criada em ${fullDate}(${dateAge} atrás)`)
}
  
  
  switch (args[1]) {
    case "--lang":
      return client.say(channel, `${username}, A linguagem deste canal é: ${userLang}`);
    case "--ban":
     return client.say(channel, `${username}, ${banned}`);
    case "--cargos":
     return client.say(channel, `${username}, A conta ${displayName} possui ${roles}.`);
    case "--bot":
      return client.say(channel, `${username}, ${bot}`);
    case "--age":
      return client.say(channel, `${username}, A conta ${displayName} foi criada em ${fullDate}(${dateAge} atrás)`)
    case "--mv":
      return client.say(channel, `${username}, A conta ${displayName} possui ${totalMods} mods e ${totalVips} vips em seu canal`)
}


client.say(channel, `${username}, Canal: ${displayName} | ID: ${id} | Bio: ${bio} | Cor: ${chatColor}`)


}

module.exports.config = {
  name: "canalinfo",
  aliases: ["cli"],
  description: "Mostra informações sobre um canal de um usuário",
  usage: "canalinfo"
}
