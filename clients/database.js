const pg = require('pg');
pg.defaults.ssl = true
const { Client } = require("pg");
const connectionURI = process.env.DATABASE_URLL;




const db = new Client({connectionString: connectionURI })

db.connect()
.catch(err => {console.log(err)});

db.on("error", (err) => {console.log(err)});

module.exports = {db}
