const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "db.sqlite";
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message);
      throw err;
    } else {
      console.log('Connected to the SQLite database.');
      db.run(`CREATE TABLE expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT, 
            amount REAL, 
            date TEXT,
            icon TEXT
            )`,
      (err) => {
        if (err) {
          // Table already created
        } else {
          // Table just created, creating some rows
          const insert = 'INSERT INTO expenses (description, amount, date, icon) VALUES (?,?,?,?)';
          db.run(insert, ["Ice Cream", 5.00, "2023-10-27", "🍦"]);
          db.run(insert, ["Toy Car", 12.50, "2023-10-26", "🚗"]);
        }
      });  
    }
});
module.exports = db;
