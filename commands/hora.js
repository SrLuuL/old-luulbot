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
let timezone = res.body.timezone

if (res.body.datetime === undefined) {
  return client.say(channel, `${username}, local inválido :/ `)
} else {
  let date = datetime.slice(11, 19)
  let year = datetime.slice(0, 4)
  let month = datetime.slice(5, 7)
  let day = datetime.slice(8, 10)
  let formatDate = day + "/" + month + "/" + year
 

  
 function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
  
client.say(channel, `${username}, Local: ${toTitleCase(args.join(" "))} | Horário atual: ${date}(${formatDate}) | Fuso horário: ${timezone} `)
  
}
 

    
});
 
}

module.exports.config = {
name: "hora",
aliases: ["time"],
description: "Mostra o horário atual de um local",
usage: "hora [país]"
}
