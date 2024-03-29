module.exports.run = async ({args, user: username, channel}) => {
  
 const ms = require("pretty-ms")
  
 const fetch = require("node-fetch")
 
 try {
 
 let sender = channel.slice(1)
 let user1;
 let user2;
 
 if (!args[0] && !args[1]) {
user1 = username.username;
user2 = sender;
 } else if (!args[1]) {
 user1 = username.username;
 user2 = args[0];
 } else {
   user1 = args[0];
   user2 = args[1];
 }
   
 let res = await fetch(`https://luulbot.herokuapp.com/api/twitch/sub/${user1}/${user2}`)
 let data = await res.json();
 
   if(data.error) {
   return { reply: `${data.error} :/` }
  }
   
  if (data.hidden) return { reply: `usuário escondeu suas informações de inscrito` }

  let {channel: canal, username: user, cumulative: {months: subCumulative, end: endCumulative}, subscription} = data;
  
  
   user = (user.toLowerCase() === username.username) ? "você" : user; 
   canal = (canal.toLowerCase() === username.username) ? "seu canal" : canal;
   
  

  
  let subTotal = `(Acabou há ${ms(Date.now() - new Date(endCumulative), {secondsDecimalDigits: 0, unitCount: 3})} atrás)`
  .replace(/y/g, 'a');
  
 
  
  subTotal = (endCumulative) ? subTotal.replace(/-/g, '') : ''
  
  let subMonths = subCumulative ? subCumulative > 1 ? `${subCumulative} meses` : `${subCumulative} mês` : 'nenhum mês';
  


  
   if (!data.subscribed) {
    return { reply: `${user} não possui uma inscrição  em ${canal}, possuindo ${subMonths} no total ${subTotal}` }
}  
  
  let {type, tier, endsAt} = subscription;
  let dateCumulative = new Date(endCumulative);
  let gifter = '';
  dateStreak = Math.abs(new Date(endsAt) - Date.now());
  dateCumulative = Math.abs(dateCumulative - Date.now());
  dateStreak = ms(dateStreak, {secondsDecimalDigits: 0, unitCount: 3}).replace(/-/g, '').replace(/y/g, 'a');
  dateCumulative = ms(dateCumulative, {secondsDecimalDigits: 0, unitCount: 3}).replace(/-/g, '').replace(/y/g, 'a');
  type = (type == "Paid") ? "Pago" : type
  
  if(subscription) {
    if (subscription.gift.gifter) {
      gifter = `| Gifter: ${subscription.gift.gifter.login}`
    }
   }
   
return {
 reply: `${user} possui  uma inscrição em ${canal} há  ${subMonths} | Sub acaba em: ${dateStreak}  | Próximo aniversário em: ${dateCumulative} | Sub: ${type} ${gifter} | Tier: ${tier}` 
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
