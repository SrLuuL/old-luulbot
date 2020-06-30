const fs = require("fs")
const db = require("quick.db")
let today = new Date()

module.exports.run = (client, message, args, username, channel) => {

if (!args[0]) {
return client.say(channel, `${username}, insira uma sugestão :/`)
}

const content = args.join(" ")
let logger = fs.createWriteStream("suggest.txt", {flags: "a"})

let date = ("0" + today.getDate()).slice(-2);
let month = ("0" + (today.getMonth() + 1)).slice(-2);
let year = today.getFullYear();
let formatDate = date + "/" + month + "/" + year
client.say(channel, `${username}, sua sugestão foi anotada :D 📝)
logger.write(`\n${formatDate} | ${username}: ${args.join(" ")}`)

}

module.exports.config = {
name: "sugerir",
aliases: ["suggest"],
description: "Sugere uma nova função para o bot",
usage: "sugerir [sugestão]
}
