const express = require("express");
const bodyparser = require("body-parser");
const conn = require("../MysqlConnection/MysqlConnection");
const router = express.Router();
router.use(bodyparser.urlencoded({ extended: true }));
router.use(bodyparser.json());

router.post("/", (req, res) => {
  var username = req.body.userName;
  var password = req.body.loginpassword;
  conn.query(
    "select name ,password,customer_id from login_tbl where name= ? and password = ?",
    [username, password],
    (err, results) => {
      if (!err) {
        if (results == 0) {
          console.log("InValid user");
          res.send(results);
        } else if (
          results[0].name === username &&
          results[0].password === password
        ) {
          console.log("Valid user");
          res.send(results);
          res.end();
        }
      }
    }
  );
});
module.exports = router;
