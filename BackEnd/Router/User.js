const express = require("express");
const bodyparser = require("body-parser");
const conn = require("../MysqlConnection/MysqlConnection");
const router = express.Router();
router.use(bodyparser.urlencoded({ extended: true }));
router.use(bodyparser.json());


// Login Request
router.post('/Login', (req, res) => {
    var username = req.body.userName;
    var password = req.body.loginpassword;
    conn.query("select name ,password,customer_id from login_tbl where name= ? and password = ?", [username, password], (err, results) => {
        if (!err) {
            if (results == 0) {
                console.log("InValid user");
                res.send(results);
            }
            else if (results[0].name === username && results[0].password === password) {
                console.log("Valid user");
                res.send(results);
                res.end();

            }

        }
    })
})

// sign Up Request
router.post("/signUp", (req, res) => {
    var data = {
      name: req.body.name,
      gender: req.body.gender,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      customer_id: req.body.customer_id,
    };
    conn.query("insert into login_tbl set?", data, (err, rows, fields) => {});
  });




  //User Pannel Details
router.post("/userdetails", (req, res) => {
    let customerid = req.body.customerId;
    conn.query(
      "select * from order_tbl where customer_id= ?",
      [customerid],
      (err, rows, fields) => {
        res.send(rows);
      }
    );
  });



  //update and edit user details
router.post("/updateUserDetails", (req, res) => {
    let data = {
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      customer_id: req.body.customer_id,
    };
    conn.query(
      "update login_tbl set name= ?,address=?,email=?,phone=?,password=? where customer_id=?",
      [
        data.name,
        data.address,
        data.email,
        data.phone,
        data.password,
        data.customer_id,
      ],
      (err, rows, fields) => {}
    );
  });


  //Show user Details
router.post("/showProflDetails", (req, res) => {
    let customerid = req.body.customerId;
    conn.query(
      "select * from login_tbl where customer_id=?",
      [customerid],
      (err, rows, fields) => {
        res.send(rows);
      }
    );
  });
  






module.exports=router;