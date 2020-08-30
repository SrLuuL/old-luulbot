module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch");
const hastebin = require("hastebin-gen");

const userid = (!args[0]) ? username : args[0];
  
const res = await (await fetch(`https://modlookup.3v.fi/api/user-v3/${userid}`)).json();
const res2 = await (await fetch(`https://modlookup.3v.fi/api/user-totals/${userid}`)).json();  
  
const modsList = res.channels.map(i => i.name)  
 
 try { 
   
const haste = await hastebin(modsList)  

const {user, views, follows, total, partners} = res2;

const sender = (user === username) ? 'você' : user;   

return client.say(channel, `${username}, ${sender} é mod em ${total} canais, ${partners} sendo parceiros | Views totais: ${views} | Follows totais: ${follows} | Canais: ${haste}`)
   

 } catch (err) {
   client.say(channel, `${username}, serviço indisponível :/`)
 }
   
}

module.exports.config = {
name: "modstats",
aliases: ["modinfo","faxineiro"],
description: "Mostra informações de mod de um usuário",
usage: "modstats"
}




