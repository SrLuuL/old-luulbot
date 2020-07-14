const db = require("quick.db")
db.set('channels', [''])

  
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
  channels: ["srluul", `${db.get('channels')`]
};
  
module.exports = { options }
