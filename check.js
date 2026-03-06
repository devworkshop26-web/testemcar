const Database = require('better-sqlite3');
const db = new Database('database.sqlite');
const row = db.prepare("SELECT data FROM content WHERE id = 'main'").get();
console.log(JSON.stringify(JSON.parse(row.data).en.clients, null, 2));
