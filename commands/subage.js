module.exports.run = async (client, message, args, username, channel) => {
  
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

  
  let canal = data.channel
  let subCumulative = data.cumulative.months
  let endCumulative = data.cumulative.remaining
  let user = data.username
  const {subscribed} = data;
  const {type, tier} = data.meta;
  const {remaining} = data.streak.remaining;
  type = type.replace("paid", "pago");
  
  if (subscribed === false) {
    client.say(channel, `${username}, ${user} não é inscrito em ${canal}`)
} else {
  client.say(channel, `${username}, ${user} é inscrito em ${canal} há ${subCumulative} | Sub acaba em: ${remaining} | Próximo aniversário em: ${endCumulative} | Sub: ${type.toLowerCase()} | Tier: ${tier} `) 
}
  
  
}



module.exports.config = {
  name: "subage",
  aliases: ["sub"],
  description: "Mostra as informações de inscrito de uma pessoa em um certo canal",
  usage: "subage"
}
