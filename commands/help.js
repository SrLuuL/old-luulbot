module.exports.run = (client, message, args, username, channel, cmd, alias) => {

if (!args[0]) {
client.say(channel, `${username}, Prefixo: * | Comandos: https://luul.glitch.me/comandos | `)
}
else {
let command = cmd.get(alias.get(args[0].toLowerCase()) || args[0].toLowerCase());
if (!command) return client.say(channel, `${username}, não possuo esse comando :/ `)
command = command.config
client.say(channel, `${username}, * ${command.usage}(${command.aliases.join(", ")}) : ${command.description}.`)
}
}
  
module.exports.config = {
name: "help",
aliases: ["ajuda"],
description: "Mostra as informações sobre os comandos",
usage: "help [comando]"
}
