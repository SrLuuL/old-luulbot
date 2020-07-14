const db = require("quick.db")


db.set("channels")
db.push("channels.items", "#srluul")

const channels = db.get("channels.items")

exports = {channels}
