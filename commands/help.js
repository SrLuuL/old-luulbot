module.exports.run = (context) => {

 
if (!context.args[0]) {
return { reply: 'https://luulbot.herokuapp.com/comandos' }
} 
 else {
let command = context.cmd.get(context.alias.get(context.args[0].toLowerCase()) || context.args[0].toLowerCase());
if (!command) return { reply: 'comando não existe :/' }
  
command = command.config

return {
 reply: `=${command.name}[${command.aliases}]: ${command.description} | ${(command.cooldown/1000)}s cooldown`
}

}
  
}
  
module.exports.config = {
name: "help",
aliases: ["ajuda", "comandos"],
description: "Mostra as informações sobre os comandos",
usage: "help [comando]",
level: 'Todos',
cooldown: 4000
}
