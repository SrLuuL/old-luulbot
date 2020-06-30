module.exports.run = (client, message, args, username, channel) => {
  
  const unirest = require("unirest")
  

  let req = unirest("GET",`https://api.ivr.fi/twitch/subage/${args[0]}/${args[1]}`)
    
  let req2 = unirest("GET",`https://api.ivr.fi/twitch/subage/${username}/${args[0]}`)
  
  
  
  
  
    req.end(function (res){
      
      let user = res.body.username
      let channelsub = res.body.channel
      let tier = res.body.meta.tier
      let months = res.body.cumulative.months
      let niver = res.body.cumulative.remaining
      let subend = res.body.streak.remaining
      let type = res.body.meta.type
      
  
      
      if (args.join(" ").length === 0 || args[1] === 0) {
     return client.say(channel,`${username}, especifique o usuário e o canal :/`)
      }
      
      
      if (type === "paid") {
        
        type = "pago"
        
      }
      
      
      if (res.body.subscribed === false) {
        return client.say(channel,`${username}, ${user} não é inscrito em ${channelsub} || Meses totais: ${months}`)
      }
      else {
      
      return client.say(channel,`${username}, ${user} é inscrito  em ${channelsub} há ${months} meses || Próximo aniversário em: ${niver} dias  || Sub acaba em: ${subend} dias || Sub: ${type} || Tier: ${tier} `)
      
      }
    })
  
}



module.exports.config = {
  name: "subage",
  aliases: ["sub"],
  description: "Mostra as informações de inscrito de um pessoa em um certo canal",
  usage: "subage"
}
