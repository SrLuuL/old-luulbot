module.exports.run = async (client, message, args, username, channel) => {

  const db = require("../clients/database.js").db
  
  if (username !== "srluul") return;

  try {
  
let content = args.join(" ")

const evaluated = await eval('(async () => {' +args.join(" ") + '})()')
const ev = String(evaluated)

if (!args[0]) return client.say(channel, `${username}, insira um código :/`)
else client.say(channel, `${ev}`)

    

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
