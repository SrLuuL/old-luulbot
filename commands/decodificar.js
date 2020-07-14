module.exports.run = async (client, message, args, username, channel) => {

const fetch = require('node-fetch')

if (!args[0] || !args[1]) return client.say(channel, `${username}, insira uma criptografia e texto :/`)
if (args[0] !== "morse" || args[0] !== "base64") return client.say(channel, `${username}, criptografia inválida :/`)
  
let resMorse = await fetch(`http://www.morsecode-api.de/decode?string=${args.join(" ").slice(args[0].length + 1).replace(/\//g, "")}`)
let dataMorse = await resMorse.json();
let textMorse = dataMorse.plaintext
if (textMorse === "" && args[0] == "morse") return client.say(channel, `${username}, morse inválido :/`)

const base64 = require("js-base64")
let textBase64 = await base64.decode(args.join(" ").slice(args[0].length + 1))
if (textBase64 === "" && args[0] == "base65") return client.say(channel, `${username}, base64 inválido :/`)
  
switch(args[0]) {
case "morse":
return client.say(channel, `${username}, ${textMorse.toLowerCase()}`)
case "base64":
return client.say(channel, `${username}, ${textBase64}`)
}

  
}

module.exports.config = {
name: "decodificar",
aliases: ["dc"],
description: "decodifica um texto de uma criptografia",
usage: "decodificar [cript] [text]"
}
