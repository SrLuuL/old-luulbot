const { Client } = require("pg")
const connectionURI = "postgres://waanqlbezgjabs:f4e8c028930a2b89dd87a73d2090c0c24e81e6ccf8ee75f8fa985b60658483d2@ec2-52-1-95-247.compute-1.amazonaws.com:5432/dd7rfjbn2rp2uo"



const db = new Client({connectionString: connectionURI})

db.connect()
.catch(err => {console.log(err)});

db.on("error", (err) => {console.log(err)});

module.exports = {db}
