const db = require("quick.db")


db.fetch("channels")

const channels = db.get("channels")

exports = {channels}