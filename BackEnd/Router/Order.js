const express = require("express");
const bodyparser = require("body-parser");
const conn = require("../MysqlConnection/MysqlConnection");
const router = express.Router();
router.use(bodyparser.urlencoded({ extended: true }));
router.use(bodyparser.json());

//  order book Request
router.post("/bookOrder", (req, res) => {
  let Orderdata = {
    recipe_name: req.body.recipe_name,
    qty: req.body.qty,
    price: req.body.price,
    address: req.body.address,
    discount: req.body.discount,
    totalAmount: req.body.totalAmount,
    customer_id: req.body.customer_id,
    orderDate: req.body.Date,
  };

  conn.query(
    "insert into order_tbl set?",
    Orderdata,
    (err, rows, fields) => {}
  );
});

// cancel order request
router.post("/cancelOrder", (req, res) => {
  let order_id = req.body.order_id;
  conn.query(
    "delete from order_tbl where order_id=?",
    [order_id],
    (err, rows, fields) => {
      res.end();
    }
  );
});

//All my orders
router.post("/allOrders", (req, res) => {
  let customerid = req.body.customerId;
  conn.query(
    "select * from order_tbl where customer_id= ?",
    [customerid],
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

///Show order History for last month,tody date,All
router.post("/Orderhistory", (req, res) => {
  const { filter } = req.body;
  let query;
  if (filter === "lastMonth") {
    query =
      "select * from food_db.order_tbl where month(orderDate)=month(now())-1 and order_status='Order Delivered'";
  } else if (filter === "today") {
    let currentDate = new Date();
    const todayDate =
      currentDate.getFullYear() +
      "-" +
      (currentDate.getMonth() + 1) +
      "-" +
      currentDate.getDate();
    console.log(todayDate);
    query = `select * from food_db.order_tbl where orderDate = '${todayDate}' and order_status ='Order Delivered'`;
    console.log(query);
  } else if (filter === "All") {
    query = `Select * from food_db.order_tbl where order_status='Order Delivered'`;
  }
  conn.query(query, (err, rows, fields) => {
    res.send(rows);
    console.log(rows);
  });
});

// Order Summary for Admin
router.get("/ordersummary", (req, res) => {
  conn.query(
    "SELECT * FROM order_tbl where order_status not in('Order Delivered')",
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

//change status
router.post("/changeStatus", (req, res) => {
  let orderid = req.body.orderid;
  let orderStatus = req.body.status;
  conn.query(
    "update order_tbl set order_status= ? where order_id=? ",
    [orderStatus, orderid],
    (err, rows, fields) => {}
  );
});

// show Current Date order
router.post("/currentDateOrder", (req, res) => {
  let crDate = req.body.queryDate;
  let customer_id = req.body.customerId;
  conn.query(
    "select * from order_tbl where orderDate= ? and customer_id=?",
    [crDate, customer_id],
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

module.exports = router;
