module.exports.run = async (context) => {

 const {args, user: username, channel} = context
  
 const ms = require("pretty-ms")
  
 const fetch = require("node-fetch")
 
 try {
 
 let sender = channel.slice(1)
 let user1;
 let user2;
 
 if (!args[0] && !args[1]) {
user1 = username;
user2 = sender;
 } else if (!args[1]) {
 user1 = username;
 user2 = args[0];
 } else {
   user1 = args[0];
   user2 = args[1];
 }
   
 let res = await fetch(`https://api.ivr.fi/twitch/subage/${user1}/${user2}`)
 let data = await res.json();
 
 if (data.status === 404 || data.status === 500) {
   return { reply: 'usuário não foi encontrado :/' }
 }


  let {channel: canal, username: user, cumulative: {months: subCumulative, end: endCumulative}, hidden} = data;
  
  
   user = (user.toLowerCase() === username) ? "você" : user; 
   canal = (canal.toLowerCase() === username) ? "seu canal" : canal;
  
   if (hidden) return { reply: `${user} escondeu suas informações de inscrito` }
  

  
  let subTotal = `(Acabou há ${ms(Date.now() - new Date(endCumulative), {secondsDecimalDigits: 0, unitCount: 3})} atrás)`
  .replace(/y/g, 'a');
  
 
  
  subTotal = (endCumulative) ? subTotal : ''
  
  let subMonths = subCumulative ? subCumulative > 1 ? `${subCumulative} meses` : `${subCumulative} mês` : 'nenhum mês';
  


  
   if (!data.subscribed) {
    return { reply: `${user} não é inscrito em ${canal}, possuindo ${subMonths} no total ${subTotal}` }
}  
  
  let {type, tier} = data.meta;
  const {end} = data.streak;
  let dateStreak = new Date(end);
  let dateCumulative = new Date(endCumulative);
  dateStreak = dateStreak - Date.now();
  dateCumulative = dateCumulative - Date.now();
  dateStreak = ms(dateStreak, {secondsDecimalDigits: 0, unitCount: 3});
  dateCumulative = ms(dateCumulative, {secondsDecimalDigits: 0, unitCount: 3});
  type = (type == "paid") ? "Pago" : type.charAt(0).toUpperCase() + type.slice(1)
  

  
return {
 reply: `${user} é inscrito em ${canal} há  ${subMonths} | Sub acaba em: ${dateStreak}  | Próximo aniversário em: ${dateCumulative} | Sub: ${type} | Tier: ${tier}` 
}
  
 } catch(err) {
  return { reply: 'Erro desconhecido' }
 }
  
}



module.exports.config = {
  name: "subage",
  aliases: ["sub", "subcheck"],
  description: "Mostra as informações de inscrito de uma pessoa em um certo canal",
  usage: "subage [user1] [user2]",
  level: 'Todos',
  cooldown: 6000  
}
