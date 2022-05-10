const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('Test.apkg');
db.get(".tables");
db.close();
