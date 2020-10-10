module.exports.run = async (client, message, args, username, channel) => {

  
  
  const ms = require("pretty-ms")
  
 const fetch = require("node-fetch")
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
   return client.say(channel, `${username}, usuário não foi encontrado :/`)
 }


  let {channel: canal, username: user, cumulative: {months: subCumulative, end: endCumulative}, hidden} = data;
  

  
  let subTotal = `(Acabou há ${ms(Date.now() - new Date(endCumulative), {secondsDecimalDigits: 0, unitCount: 3})} atrás)`
  .replace(/y/g, 'a');
  
  user = (user.toLowerCase() === username) ? "você" : user; 
  canal = (canal.toLowerCase() === username) ? "seu canal" : canal;
  
  subTotal = (endCumulative) ? subTotal : ''
  
  let subMonths
  
  if (hidden) return client.say(channel, `${username}, usuário escondeu suas informações de inscrito`)
  
   if (!data.subscribed) {
    return client.say(channel, `${username}, ${user} não é inscrito em ${canal}, possuindo ${subCumulative} ${subMonths = (subCumulative > 1) ? 'meses' : 'mês'} totais ${subTotal}`)
}  
  
  const {type, tier} = data.meta;
  const {end} = data.streak;
  let dateStreak = new Date(end);
  let dateCumulative = new Date(endCumulative);
  dateStreak = dateStreak - Date.now();
  dateCumulative = dateCumulative - Date.now();
  dateStreak = ms(dateStreak, {secondsDecimalDigits: 0, unitCount: 3});
  dateCumulative = ms(dateCumulative, {secondsDecimalDigits: 0, unitCount: 3});
  type = (type == "paid") ? "Pago" : type.charAt(0).toUpperCase() + type.slice(1)
  

  
   client.say(channel, `${username}, ${user} é inscrito em ${canal} há ${subCumulative} ${subMonths = (subCumulative > 1) ? 'meses' : 'mês'} | Sub acaba em: ${dateStreak}  | Próximo aniversário em: ${dateCumulative} | Sub: ${typeF} | Tier: ${tier} `) 

  

  
}



module.exports.config = {
  name: "subage",
  aliases: ["sub", "subcheck"],
  description: "Mostra as informações de inscrito de uma pessoa em um certo canal",
  usage: "subage"
}
