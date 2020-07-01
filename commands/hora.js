module.exports.run = (client, message, args, username, channel) => {

if (!args[0]) {
return client.say(channel, `${username}, insira um país :/`)
}

const ct = require("country-timezone")
const unirest = require("unirest")
const { flag } = require("country-emoji")

let country = ct.getTimezones(args[0])

let req = unirest("GET", `http://worldtimeapi.org/api/timezone/${country}`)

req.end(function (res){

  try {
  
let datetime = res.body.datetime
let date = datetime.slice(11, 19)

client.say(channel, `${username}, são ${date} em ${args[0]} agora.`)

  } catch (err) {
    return client.say(channel, `${username}, insira um local inválido :/``)
}
    
});

}

module.exports.config = {
name: "hora",
aliases: ["time"],
description: "Mostra o horário atual de um país",
usage: "hora [país]"
}
