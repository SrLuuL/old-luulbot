module.exports.run = async (client, message, args, username, channel) => {

  const db = require("quick.db")
  
  if (username !== "srluul") return;

  try {
  
let content = args.join(" ")

const evaluated = await eval('(async () => {+args.join(" ")})()')


if (!args[0]) return client.say(channel, `${username}, insira um código :/`)
else return client.say(channel, `${username}, código executado! (${String(evaluated)})`)

  } catch (err) {
    return client.say(channel, `${username}, ocorreu algum erro (${err}) :/`)
  }
    
}

module.exports.config = {
name: "eval",
aliases: ["dankeval"],
description: "Executa um código do bot(uso privado)",
usage: "eval [conteúdo]"
}
