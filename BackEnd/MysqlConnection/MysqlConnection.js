const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "food_db",
});

conn.connect((err) => {
  if (!err) {
    console.log("connection successfull");
  } else {
    console.log(err);
  }
});

module.exports = conn;
