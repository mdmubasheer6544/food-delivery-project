const express = require("express");
const Users = require("./Router/User");
const Orders = require("./Router/Order");
var app = express();

app.use(express.static("F:/FoodProject"));

app.get("/", (req, res) => {
  res.redirect("../index.html");
});

// SingUp and login request,show User Pannel Details,Show user Details
app.use("/user", Users);

//  Book order request, cancel orders ,Show order History,
// ordersummary data for admin pannel,change order status,show Current Date order
app.use("/order", Orders);

app.listen(8080, () => {
  console.log("server listening the port no 8080");
});
