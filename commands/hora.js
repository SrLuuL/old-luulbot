module.exports.run = async (client, message, args, username, channel) => {

if (!args[0]) {
return client.say(channel, `${username}, insira um país :/`)
}

const ct = require("country-timezone")
const unirest = require("unirest")
const { flag } = require("country-emoji")

let num

if (ct.getTimezones(args.join(" "))[1] === undefined) {
num = 0 
} else {
num = 1
}

let country = ct.getTimezones(args.join(" "))[num]



let req = unirest("GET", `http://worldtimeapi.org/api/timezone/${country}`)



req.end(function (res){


  
let datetime = res.body.datetime

if (res.body.datetime === undefined) {
  return client.say(channel, `${username}, local inválido :/ `)
} else {
  let date = datetime.slice(11, 19)
  
client.say(channel, `${username}, são ${date} em ${args.join(" ")} agora.`)
}






    
});
 
}

module.exports.config = {
name: "hora",
aliases: ["time"],
description: "Mostra o horário atual de um país",
usage: "hora [país]"
}
