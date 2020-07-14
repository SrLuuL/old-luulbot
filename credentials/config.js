const db = require("quick.db")


db.fetch("channels")
db.push("channels", "#srluul")

const channels = db.get("channels")

exports = {channels}
