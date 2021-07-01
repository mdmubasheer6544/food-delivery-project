const mysql = require("mysql");
const express = require("express");
const bodyparser = require("body-parser");
var app = express();


const conn = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "",
    database: "food_db"
});

conn.connect((err) => {
    if (!err) {
        console.log("connection successfull");
    }
    else {
        console.log(err);
    }
});
app.use(express.static('F:/FoodProject'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.get('/', (req, res) => {
    res.redirect('../index.html');
})

// SingUp request
app.post('/singUps', (req, res) => {
    var data = {
        name: req.body.name,
        gender: req.body.gender,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        customer_id: req.body.customer_id
    }
    // let data=req.body;
    conn.query('insert into login_tbl set?', data, (err, rows, fields) => { });
})


// Login Request
app.post('/Logins', (req, res) => {
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


// Book order request
app.post('/bookOrder', (req, res) => {
    let Orderdata = {
        recipe_name: req.body.recipe_name,
        qty: req.body.qty,
        price: req.body.price,
        address: req.body.address,
        discount: req.body.discount,
        totalAmount: req.body.totalAmount,
        customer_id: req.body.customer_id,
        orderDate:req.body.Date
    };
    conn.query('insert into order_tbl set?', Orderdata, (err, rows, fields) => { });
})






///get data for admin pannel
app.get('/admin', (req, res) => {
    conn.query("SELECT * FROM order_tbl where order_status not in('Order Delivered')", (err, rows, fields) => {
        res.send(rows)
    })
})



//change status
app.post("/changeStatus", (req, res) => {
    let orderid = req.body.orderid;
    let orderStatus = req.body.status;
    conn.query("update order_tbl set order_status= ? where order_id=? ", [orderStatus, orderid], (err, rows, fields) => {
    })
})


///Show order History
app.get("/Orderhistory", (req, res) => {
    conn.query("Select * from order_tbl where order_status='Order Delivered'", (err, rows, fields) => {
        res.send(rows);
    })

})




//User Pannel Details
app.post('/userdetails', (req, res) => {
    let customerid = req.body.customerId;
    conn.query("select * from order_tbl where customer_id= ?", [customerid], (err, rows, fields) => {
        res.send(rows)
    })
})

//Current Date for Query
app.post("/getDate",(req,res)=>{
   let crDate=req.body.qDate;
   conn.query("select * from order_tbl where orderDate= ?", [crDate], (err, rows, fields) => {
    res.send(rows)
}) 
})

//Show user Details
app.post("/showProflDetails", (req, res) => {
    let customerid = req.body.customerId;
    conn.query("select * from login_tbl where customer_id=?", [customerid], (err, rows, fields) => {
        res.send(rows);
    })
})


//update and edit user details
app.post("/updateUserDetails", (req, res) => {
    let data = {
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        customer_id: req.body.customer_id
    }
    conn.query("update login_tbl set name= ?,address=?,email=?,phone=?,password=? where customer_id=?", [data.name, data.address, data.email, data.phone, data.password, data.customer_id], (err, rows, fields) => {
   
    })
})

///cancel order Request
app.post("/cancelOrder",(req,res)=>{
    let order_id=req.body.order_id;
    conn.query("delete from order_tbl where order_id=?",[order_id],(err,rows,fields)=>{
        
    })
})


app.listen(8080, () => {
    console.log("server listening the port no 8080");
})
