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
let timezoe = res.body.timezone

if (res.body.datetime === undefined) {
  return client.say(channel, `${username}, local inválido :/ `)
} else {
  let date = datetime.slice(11, 19)
  
  let input = []
  for(let x = 0; x < args.join(" ").length; x++) {
    input.push(args[x].charAt(0).toUpperCase + args[0].slice(1))
  }
  
client.say(channel, `${username}, Local: ${input} | Horário atual: ${date} | Fuso horário: ${input}`)
  
}
 

    
});
 
}

module.exports.config = {
name: "hora",
aliases: ["time"],
description: "Mostra o horário atual de um país",
usage: "hora [país]"
}
