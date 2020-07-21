const channels = require("../credentials/login.js").channelOptions


  
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
  




module.exports = { options }
