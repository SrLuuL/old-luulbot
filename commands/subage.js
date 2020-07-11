module.exports.run = async (client, message, args, username, channel) => {
  
 const fetch = require("node-fetch")
 let sender = channel.slice(1)
 let user1;
 let user2;
 
 if (!args[0] && !args[1]) {
user1 = username;
user2 = sender;
 }else!args[1]) {
 user1 = username;
 user2 = args[0];
 }
   
 let res = await fetch(`https://api.ivr.fi/twitch/subage/${username}/${sender}`)
 let data = await res.json();
 

 
}



module.exports.config = {
  name: "subage",
  aliases: ["sub"],
  description: "Mostra as informações de inscrito de uma pessoa em um certo canal",
  usage: "subage"
}
