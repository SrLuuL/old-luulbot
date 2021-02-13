module.exports.run = async ({args, user, client, cmd, alias, channel}) => {

  const db = require('../clients/database.js').db


  try {
  
const evaluated = await eval('(async () => {' +args.join(" ") + '})()')
const ev = String(evaluated)


if (!args[0]) return { reply: 'insira um código :/' }
else return { reply: `${ev}`, mode: 'say' }

    

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
