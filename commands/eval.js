module.exports.run = async (args) => {

  const db = require('../clients/database.js').db


  try {
  
let content = args.join(" ")


const evaluated = await eval('(async () => {' +args.join(" ") + '})()')
const ev = String(evaluated)


if (!args[0]) return { reply: 'insira um código :/' }
else return { reply: `${ev}` }

    

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
