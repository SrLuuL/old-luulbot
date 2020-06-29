const login = require("../credentials/login.js").options
const tmi = require("tmi.js")
const client = new tmi.client(login)

module.exports = { client }