module.exports.run = async (client, message, args, username, channel) => {

const fetch = require('node-fetch')

if (!args[0] || !args[1]) return client.say(channel, `${username}, insira uma criptografia e texto :/`)

  
let resMorse = await fetch(`http://www.morsecode-api.de/decode?string=${args.join(" ").slice(args[0].length + 1).replace(/\//g, "")}`)
let dataMorse = await resMorse.json();
let textMorse = dataMorse.plaintext
if (textMorse === "" && args[0] == "morse") return client.say(channel, `${username}, morse inválido :/`)

const base64 = require("js-base64").Base64
let textBase64 = await base64.decode(args.join(" ").slice(args[0].length + 1))
if (textBase64 === "" && args[0] == "base65") return client.say(channel, `${username}, base64 inválido :/`)

const bin = require("binary-code")
let textBinary = await bin.text(args.join(" ").slice(args[0].length + 1))
if (textBinary === "" && args[0] == "binary") return client.say(channel, `${username}, binário inválido :/`)


switch(args[0]) {
case "morse":
return client.say(channel, `${username}, ${textMorse.toLowerCase()}`)
case "base64":
return client.say(channel, `${username}, ${textBase64}`) 
case "binary":
return client.say(channel, `${username}, ${textBinary}`)   
}

  
}

module.exports.config = {
name: "decodificar",
aliases: ["dc"],
description: "decodifica um texto de uma criptografia",
usage: "decodificar [cript] [text]"
}
