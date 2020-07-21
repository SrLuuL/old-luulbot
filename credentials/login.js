const channels = require("./credentials/luulbotChannels.js").channelOptions


  
const options = {
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
};
  

client.connect()

client.on("connected", async () => {
  console.log(`Conectado nos canais: ${channels.join(" ")}`)
}


module.exports = { options }
