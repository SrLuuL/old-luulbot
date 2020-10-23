module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch");
const hastebin = require("easy-hastebin");

const userid = (!args[0]) ? username : args[0];
  
const res = await (await fetch(`https://modlookup.3v.fi/api/user-v3/${userid}`)).json();
const res2 = await (await fetch(`https://modlookup.3v.fi/api/user-totals/${userid}`)).json();  
  
const modsList = res.channels.map(i => i.name)  
 
 try { 
   
const haste = await hastebin(modsList)  

const {user, views, follows, total, partners} = res2;

const sender = (user === username) ? 'você' : user; 
   
let channelTotal = total ? total > 1 ? `${total} canais` : `1 canal` : 'nenhum canal';
let partnerTotal = partners ? partners > 1 ? `(${partners}  parceiros)` : '(1 parceiro)' : '';     

return client.say(channel, `${username}, ${sender} é mod em ${channelTotal} ${partnerTotal} | Views totais: ${views} | Follows totais: ${follows} | Canais: ${haste}`)
   

 } catch (err) {
   client.say(channel, `${username}, serviço indisponível :/`)
 }
   
}

module.exports.config = {
name: "modstats",
aliases: ["modinfo","faxineiro"],
description: "Mostra informações de mod de um usuário",
usage: "modstats",
level: 'Todos'  
}




