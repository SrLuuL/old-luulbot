module.exports.run = async (client, message, args, username, channel) => {

  const db = require('../clients/database.js').db
  const ms = require('pretty-ms');
  
  if (username !== "srluul") return;

  try {
  
let content = args.join(" ")

const startTime = Date.now()
const evaluated = await eval('(async () => {' +args.join(" ") + '})()')
const ev = String(evaluated)
const endTime = Date.now()

if (!args[0]) return client.say(channel, `${username}, insira um código :/`)
else client.say(channel, `${ev}(feito em ${ms(endTime - startTime)} ms`)

    

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
