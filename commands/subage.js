module.exports.run = async (client, message, args, username, channel) => {

  try{
  
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
 
 if (data.status === 404) {
   return client.say(channel, `${username}, usuário não foi encontrado :/`)
 }

 if (data.subscribed === false) {
    return client.say(channel, `${username}, ${user} não é inscrito em ${canal}, possuindo ${subCumulative} meses totais`)
}  
  let canal = data.channel
  let subCumulative = data.cumulative.months
  let endCumulative = data.cumulative.end
  let user = data.username
  const {type, tier} = data.meta;
  const {end} = data.streak;
  let dateStreak = new Date(end);
  let dateCumulative = new Date(endCumulative);
  dateStreak = dateStreak - Date.now();
  dateCumulative = dateCumulative - Date.now();
  dateStreak = ms(dateStreak, {secondsDecimalDigits: 0});
  dateCumulative = ms(dateCumulative, {secondsDecimalDigits: 0});
  let typeF = type.charAt(0).toUpperCase() + type.slice(1)
  typeF = (typeF == "Paid") ? "Pago" : typeF
    
    
  
   client.say(channel, `${username}, ${user} é inscrito em ${canal} há ${subCumulative} meses | Sub acaba em: ${dateStreak}  | Próximo aniversário em: ${dateCumulative} | Sub: ${typeF} | Tier: ${tier} `) 

  
  } catch (err) {
    client.say(channel, `${username}, não foi possível verificar o sub :/`)
  }
  
}



module.exports.config = {
  name: "subage",
  aliases: ["sub"],
  description: "Mostra as informações de inscrito de uma pessoa em um certo canal",
  usage: "subage"
}
