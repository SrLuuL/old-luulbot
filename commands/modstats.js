module.exports.run = async (context) => {

const fetch = require("node-fetch");
const {args, user: username} = context
const userid = (!args[0]) ? username : args[0];
  
const res = await (await fetch(`https://modlookup.3v.fi/api/user-totals/${userid}`)).json();  
 
 try { 
   
const {user, views, follows, total, partners} = res;

const sender = (user === user) ? 'você' : user; 
   
let channelTotal = total ? total > 1 ? `${total} canais` : `1 canal` : 'nenhum canal';
let partnerTotal = partners ? partners > 1 ? `(${partners}  parceiros)` : '(1 parceiro)' : '';     

return {
 reply: `${sender} é mod em ${channelTotal} ${partnerTotal} | https://modlookup.3v.fi/u/${user}` 
}
   

   
}

module.exports.config = {
name: "modstats",
aliases: ["modinfo","faxineiro"],
description: "Mostra informações de mod de um usuário",
usage: "modstats [user]",
level: 'Todos',
cooldown: 5000  
}




