const channels = require("../credentials/luulbotChannels.js").channelOptions

const login = {
  options: {
    debug: false,
  },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: "LuuLBot",
    password: "oauth:4lcd5inaptc5tncqsumrugzxro2p6l",
  },
  channels: channels
}

const tmi = require("tmi.js")
const client = new tmi.client(login)

client.connect()

client.on("connected", async () => {
  console.log(`Conectado nos canais: ${channels.join(" ")}`)
});

module.exports = { client }
