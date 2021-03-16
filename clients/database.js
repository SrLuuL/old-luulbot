const { Client } = require("pg");
const connectionURI = process.env.DATABASE_URLL;
const options = {
 user: 'waanqlbezgjabs',
 password: 'f4e8c028930a2b89dd87a73d2090c0c24e81e6ccf8ee75f8fa985b60658483d2',
 database: 'dd7rfjbn2rp2uo',
 port: 5432,
 host: 'ec2-52-1-95-247.compute-1.amazonaws.com' 
}



const db = new Client(options)

db.connect()
.catch(err => {console.log(err)});

db.on("error", (err) => {console.log(err)});

module.exports = {db}
