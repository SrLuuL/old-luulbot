module.exports.run = async (client, message, args, username, channel) => {

const fetch = require("node-fetch");
const hastebin = require("hastebin-gen");
let userid;

if (!args[0]) {
userid = username
} else {
userid = args[0]
}

let req = await fetch(`https://modlookup.3v.fi/api/user-v3/${userid}`)
let req2 = await fetch(`https://modlookup.3v.fi/api/user-totals/${userid}`)

let data = await req.json()
let channels = data.channels
let num = Object.keys(channels).length
let list = [];
for(let x = 0; x < num; x++) {
list.push(channels[x].name)
}
  
const haste = hastebin(list, {extension: "txt"})  

let data2 = await req2.json()
let user = data2.user
let views = data2.views
let follows = data2.follows
let total = data2.total
let partners = data2.partners



if (!args[0]) {

return client.say(channel, `${username}, você é mod em ${total} canais, ${partners} sendo parceiros | Views totais: ${views} | Follows totais: ${follows} | Canais: ${haste} `)

} else {
return client.say(channel, `${username}, ${user} é mod em ${total} canais, ${partners} sendo parceiros | Views totais: ${views} | Follows totais: ${follows} | Canais: ${haste} `)
}

}

module.exports.config = {
name: "modstats",
aliases: ["modinfo","faxineiro"],
description: "Mostra informações de mod de um usuário",
usage: "modstats"
}




