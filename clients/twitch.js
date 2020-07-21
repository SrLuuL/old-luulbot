const channels = require("../credentials/login.js").channelOptions

const login = require("../credentials/login.js").options
const tmi = require("tmi.js")
const client = new tmi.client(login)

client.connect()

client.on("connected", async () => {
  console.log(`Conectado nos canais: ${channels.join(" ")}`)
});

module.exports = { client }
