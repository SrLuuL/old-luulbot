module.exports.run = async (client, message, args, username, channel) => {

const unirest = require("unirest")

let res = await unirest("GET", `https://decapi.me/twitter/latest/${args[0]}?howlong&no_rts&lang=pt&precision=2`)
let tweet = await res.body
tweet = tweet.replace(/ago/g, "atrás")


if (!args[0]){
return client.say(channel, `${username}, insira um usuário :/`)
} else {
client.say(channel, `(${tweet})`)
}

}

module.exports.config = {
name: "lasttweet",
aliases: ["lt"],
description: "Pega um último tweet de um usuário do Twitter",
usage: "lasttweet [user]"
}

