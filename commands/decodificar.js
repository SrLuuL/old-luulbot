module.exports.run = async (client, message, args, username, channel) => {

const fetch = require('node-fetch')

if (!args[0] || !args[1]) return client.say(channel, `${username}, insira uma criptografia e texto :/`)

let resMorse = await fetch(`http://www.morsecode-api.de/decode?string=${args.join(" ").slice(args[0].length)}`)
let dataMorse = await resMorse.json();
let textMorse = dataMorse.plaintext

switch(args[0]) {
case morse:
return client.say(channel, `${username}, ${textMorse}`)
}

}

module.exports.config = {
name: "decodificar",
aliases: ["dc"],
description: "decodifica um texto de uma criptografia",
usage: "decodificar [cript] [text]"
}
