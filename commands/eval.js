module.exports.run = async ({args, user, client, cmd, alias, channel}) => {

  const db = require('../clients/database.js').db;
  const {performance} = require('perf_hooks');

  try {
const beforeTime = performance.now()
const evaluated = await eval('(async () => {' +args.join(" ") + '})()')
const ev = String(evaluated) || ''
const afterTime = performance.now()


if (!args[0]) return { reply: 'insira um código :/' }
else return { reply: `${ev}, executado em: ${(afterTime - beforeTime).toFixed(4)} ms`, mode: 'say' }

    

  } catch (err) {
    return { reply: `ocorreu algum erro (${err}) :/` }
  }
    
}

module.exports.config = {
name: "eval",
aliases: [],
description: "Executa um código do bot",
usage: "eval [conteúdo]",
level: 'Dono',
cooldown: 500
}
