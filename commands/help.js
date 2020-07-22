module.exports.run = (client, message, args, username, channel, cmd, alias) => {

 let donoCmds = ["db", "eval"]
 
if (!args[0]) {
 let commands = cmd.map(c => `${c.config.name}`).filter(c => `${c.config.name.includes(!donoCmds)}`).join(", ");

  
client.say(channel, `${username}, Prefixo: = | Comandos: ${commands} | `)
} else {
let command = cmd.get(alias.get(args[0].toLowerCase()) || args[0].toLowerCase());
if (!command) return client.say(channel, `${username}, não possuo esse comando :/ `)
command = command.config
client.say(channel, `${username}, =${command.name}(=${command.aliases.join("/=")}): ${command.description}.`)
}
  
}
  
module.exports.config = {
name: "help",
aliases: ["ajuda", "comandos"],
description: "Mostra as informações sobre os comandos",
usage: "help [comando]"
}
