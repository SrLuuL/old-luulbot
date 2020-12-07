const channels = require("../credentials/login.js").channelOptions

const login = {
  options: {
    debug: false,
  },
  connection: {
    secure: true,
    reconnect: true,
    server: 'irc-ws.chat.twitch.tv',
    port: 80
  },
  identity: {
    username: "LuuLBot",
    password: process.env.TWITCH_AUTH,
  },
  channels: channels
}

const tmi = require("tmi.js")
const client = new tmi.client(login)

client.connect()
.catch(err => console.err(err))

client.on("connected", async () => {
  console.log(`Conectado nos canais: ${channels.length}`)
});

module.exports = { client }
