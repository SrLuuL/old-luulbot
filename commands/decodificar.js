module.exports.run = async (client, message, args, username, channel) => {

const fetch = require('node-fetch')

if (!args[0] || !args[1]) return client.say(channel, `${username}, insira uma criptografia e texto :/`)

  
const Morse = require("morse")
let dataMorse = await Morse.decode(`${args.join(" ").slice(args[0].length + 1)}`)
if (dataMorse === "" && args[0] == "morse") return client.say(channel, `${username}, morse inválido :/`)

const base64 = require("js-base64").Base64
let textBase64 = await base64.decode(args.join(" ").slice(args[0].length + 1))
if (textBase64 === "" && args[0] == "base65") return client.say(channel, `${username}, base64 inválido :/`)

const bin = require("binary-code")
let textBinary = await bin.text(args.join(" ").slice(args[0].length + 1))
if (textBinary === "" && args[0] == "binary") return client.say(channel, `${username}, binário inválido :/`)


switch(args[0]) {
case "morse":
return client.say(channel, `${username}, ${dataMorse.toLowerCase()}`)
case "base64":
return client.say(channel, `${username}, ${textBase64}`) 
case "binary":
return client.say(channel, `${username}, ${textBinary}`)   
}

  
}

module.exports.config = {
name: "decodificar",
aliases: ["dc"],
description: "decodifica um texto de uma criptografia. Criptografias: morse, base64 e binário",
usage: "decodificar [cript] [text]"
}
