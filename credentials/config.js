const db = require("quick.db")


db.set("channels")

const channels = db.get("channels")

exports = {channels}
