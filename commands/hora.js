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

let datetime = res.body.datetime
let dateFormat = new Date(datetime);
let emoji = flag(args[0])
let hours = dateFormat.getHours()
let minutes = dateFormat.getMinutes()
let seconds = dateFormat.getSeconds()
let formatDate = hours + ":" + minutes + ":" + seconds

client.say(channel, `${username}, são ${formatDate} em ${args[0]} agora.`)

});

}

module.exports.config = {
name: "hora",
aliases: ["time"],
description: "Mostra o horário atual de um país",
usage: "hora [país]"
}
