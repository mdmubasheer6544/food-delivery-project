app.controller(
  "fetchController",
  function ($scope, $http, $timeout, $location, mainFactory) {
    let ischeckUser = JSON.parse(localStorage.getItem("user"));
    $scope.isLogoutVisible = false;
    $scope.isLoginVisible = true;

    if (ischeckUser.name != "Guest" && ischeckUser.name != "Admin") {
      $scope.isLogoutVisible = true;
      $scope.isLoginVisible = false;
    } else if (ischeckUser.name === "Admin") {
      $scope.OrderhideAdmin = true;
      $scope.isLogoutVisible = true;
      $scope.isLoginVisible = false;
    }
    $scope.UserName;
    $scope.getDetails = function (dishName) {
      if (dishName != undefined || dishName != null) {
        $scope.recipes = [];
        let query = "q";
        mainFactory.fectchDetails(
          "search",
          dishName,
          query,
          function (response) {
            response.data.recipes.map((value) => {
              let itemObj = {
                title: value.title.substr(0, 14) + "...",
                imageUrl: value.image_url,
                recipe_id: value.recipe_id,
              };
              $scope.category = dishName;
              $scope.recipes.push(itemObj);
            });
          }
        );
      }
    };
    $scope.getDetails("pizza");
    $scope.tempTotal = 0;
    function priceFun() {
      var price = 0;
      var isGetPrice = true;
      while (isGetPrice) {
        var tempPrice = Math.random() * 20 * 20;
        if (tempPrice <= 150) {
          tempPrice = Math.random() * 20 * 20;
        } else {
          price = Math.floor(Math.round(tempPrice));
          isGetPrice = false;
        }
      }
      price = price.toString().substr(0, 2) + 9;
      return price;
    }
    $scope.CategoryDetails = function (reciptId) {
      if (reciptId != undefined || reciptId != null) {
        let query = "rId";
        $scope.contentData = [];
        mainFactory.fectchDetails("get", reciptId, query, function (response) {
          let calPrice = priceFun();
          $scope.tempTotal = calPrice;
          let obj = {
            title: response.data.recipe.title,
            publisher: response.data.recipe.publisher,
            recipe_id: response.data.recipe.recipe_id,
            source_url: response.data.recipe.source_url,
            image_url: response.data.recipe.image_url,
            ingredients: response.data.recipe.ingredients,
            price: calPrice,
          };
          $scope.tempTotal = Math.floor(
            $scope.tempTotal - $scope.tempTotal * 0.1
          );
          $scope.contentData.push(obj);
          $scope.ingrediants = $scope.contentData[0].ingredients;
        });
      }
    };

    $scope.CategoryDetails("47746");
    $scope.categoryCollection = mainFactory.categories;

    $scope.counter = 1;
    $scope.total = $scope.tempTotal;
    $scope.discount = "10%";

    // add quantity Function
    $scope.addQty = function (price, opration) {
      if (opration == "plus") {
        $scope.counter += 1;
      } else {
        if ($scope.counter > 1) {
          $scope.counter -= 1;
        }
      }
      let actualTot = price * $scope.counter;
      $scope.tempTotal = Math.floor(actualTot - actualTot * 0.1);
    };

    $scope.customerid = ischeckUser.customer_id;

    // Sing Up Request
    $scope.insertRecord = function () {
      $scope.customerid = Math.floor(Math.random() * 1000 + 100);
      let DatasObj = JSON.stringify({
        name: $scope.Datas.singUpName,
        gender: $scope.Datas.signUpGender,
        address: $scope.Datas.signUpAddress,
        email: $scope.Datas.singupEmail,
        phone: $scope.Datas.singupPhone,
        password: $scope.Datas.singUppassword,
        customer_id: $scope.customerid,
      });
      $http.post("/user/signUp", DatasObj);
      $location.path("/userLogin");
    };

    $scope.isMachedName = false;
    $scope.signIn = function (loginDetails) {
      $http.post("/user/Login", loginDetails).then((res) => {
        if (res.data == 0) {
          $scope.isMachedName = true;
          $timeout(function () {
            $scope.isMachedName = false;
          }, 3000);
          $location.path("/userLogin");
        } else {
          $scope.UserName = res.data[0];
          var exist = localStorage.getItem("user");
          exist = JSON.parse(exist);
          exist = res.data[0];
          localStorage.setItem("user", JSON.stringify(exist));
          if ($scope.UserName.name == "Admin") {
            $location.path("/adminProf");
          } else if (loginDetails.userName === $scope.UserName.name) {
            $location.path("/");
          }

          // else {
          //     alert("Invalid User Name");
          //     $location.path('/userLogin')
          // }
        }
      });
    };
    $scope.loginName = JSON.parse(localStorage.getItem("user"));

    // Confirm Order hide and show
    $scope.isVisible = false;
    $scope.isClassvar = false;
    $scope.userAddress = "";
    $scope.orderBox = function () {
      $scope.loginName = JSON.parse(localStorage.getItem("user"));
      let customer = {
        customerId: $scope.loginName.customer_id,
      };
      $http.post("/user/userdetails", customer).then((res) => {
        $scope.userAddress = res.data[0].address;
      });
      $scope.isVisible = !$scope.isVisible;
      $scope.isClassvar = !$scope.isClassvar;
    };

    ////book the order

    $scope.orderBook = function (data) {
      if (ischeckUser.name != "Guest") {
        $scope.isVisible = false;
        $scope.isClassvar = false;
        if (data != undefined) {
          let CurrentDate = new Date();
          let month = CurrentDate.getMonth() + 1;
          let day = CurrentDate.getDate();
          let year = CurrentDate.getFullYear();
          let Objdata = JSON.stringify({
            recipe_name: $scope.contentData[0].title,
            qty: $scope.counter,
            price: $scope.contentData[0].price,
            address: data,
            discount: $scope.discount,
            totalAmount: $scope.tempTotal,
            customer_id: $scope.customerid,
            Date: year + "-" + month + "-" + day,
          });
          $http.post("/order/bookOrder", Objdata);
          alert("Your order has been confirmed..!");
        }
      } else {
          alert("Please Login first")
        $location.path("/userLogin");
      }
    };

    //login logout show hide
    $scope.profile = function () {
      localStorage.setItem("user", JSON.stringify(data));
      $scope.isLogoutVisible = false;
      $scope.isLoginVisible = true;
      $scope.loginName = data;
    };

    ///show user panel routing
    $scope.userPanel = function () {
      let ischeckUser = JSON.parse(localStorage.getItem("user"));
      if (ischeckUser.name != "Guest") {
        if (ischeckUser.name == "Admin") {
          $location.path("/adminProf");
        } else {
          $location.path("/userProf");
        }
      }
    };

    // passwordShow function
    $scope.showPassword = false;
    $scope.toggleShowPassword = function () {
      $scope.showPassword = !$scope.showPassword;
    };
  }
);

//Admin controller
app.controller("adminController", function ($scope, $http, $location) {
  $scope.orderDetails = [];
  $scope.statuss;
  $scope.adminDetails = function () {
    $http.get("order/ordersummary").then((res) => {
      $scope.orderDetails = res.data;
    });
  };
  $scope.adminDetails();
  $scope.loginName = JSON.parse(localStorage.getItem("user"));
  $scope.status = ["Order Placed", "Order Accepted", "Order Delivered"];
  $scope.changeStatus = function (statuss, order_id) {
    if (statuss != undefined) {
      alert("Status Updated..!");
      let currentStatus = {
        status: statuss,
        orderid: order_id,
      };
      $http.post("order/changeStatus", currentStatus);
      $scope.adminDetails();
      $scope.Orderhistory();
    }
  };
  $scope.isHistory = false;
  $scope.isOrderDetails = true;
  $scope.Orderhistory = function () {
    $scope.orderHistory = [];
    $http.get("order/Orderhistory").then((res) => {
      $scope.orderHistory = res.data;
    });
  };
  //show tables
  $scope.showTales = function () {
    $scope.isHistory = true;
    $scope.isOrderDetails = false;
    $scope.Orderhistory();
  };

  $scope.Summary = function () {
    $scope.isHistory = false;
    $scope.isOrderDetails = true;
  };

  ///Logout Admin
  $scope.logOut = function () {
    let data = {
      name: "Guest",
      password: "",
      customer_id: "",
    };
    localStorage.setItem("user", JSON.stringify(data));
    $location.path("/");
  };
});

//Userpannel controller
app.controller("userController", function ($scope, $http, $location) {
  $scope.loginName = JSON.parse(localStorage.getItem("user"));
  $scope.userData = [];

  let customer = {
    customerId: $scope.loginName.customer_id,
  };
  $http.post("/order/allOrders", customer).then((res) => {
    $scope.userData = res.data;
  });

  //get Current Date/
  let CurrentDate = new Date();
  let month = CurrentDate.getMonth() + 1;
  let day = CurrentDate.getDate();
  let year = CurrentDate.getFullYear();
  let queryDate = year + "-" + month + "-" + day;
  let customerOrders = {
    customerId: $scope.loginName.customer_id,
    queryDate: queryDate,
  };

  ///Get Data on current Date base with track order///
  $scope.CurrentOrder = function () {
    $scope.progressData = [];
    $http.post("order/currentDateOrder", customerOrders).then((res) => {
      res.data.map((value) => {
        let tempObj = {
          max: 100,
          dynamic:
            value.order_status == "Order Placed"
              ? 0
              : value.order_status == "Order Accepted"
              ? 50
              : 100,
          order_id: value.order_id,
          recipe_name: value.recipe_name,
          qty: value.qty,
          totalAmount: value.totalAmount,
          orderDate: value.orderDate,
          price: value.price,
          address: value.address,
        };
        $scope.progressData.push(tempObj);
      });
    });
  };
  $scope.CurrentOrder();

  ///
  //Toggle details userProfile
  $scope.isMyOrders = false;
  $scope.isMyProfile = true;
  $scope.myOrders = function () {
    $scope.isMyOrders = true;
    $scope.isMyProfile = false;
    $scope.istrackVisible = false;
  };
  $scope.myProfile = function () {
    $scope.isMyProfile = true;
    $scope.isMyOrders = false;
    $scope.istrackVisible = false;
  };

  //is ediabled all fields
  $scope.isClicked = true;
  $scope.isSaveVisible = false;
  // $scope.isInVisible = true;
  $scope.editProfile = function () {
    alert("you can edit your profile..!");
    $scope.isClicked = false;
    $scope.isSaveVisible = true;
  };
  $scope.showProf = function () {
    $scope.userDetails = [];

    let customer = {
      customerId: $scope.loginName.customer_id,
    };
    $http.post("/user/showProflDetails", customer).then((res) => {
      $scope.userDetails = res.data[0];
    });
  };
  $scope.showProf();

  ///Update User Details
  $scope.updateUserDetails = function (userDetails) {
    let data = {
      name: userDetails.name,
      address: userDetails.address,
      email: userDetails.email,
      phone: userDetails.phone,
      password: userDetails.password,
      customer_id: $scope.loginName.customer_id,
    };
    $http.post("/user/updateUserDetails", data);
    alert("Record has been updated..!");
    $scope.isSaveVisible = false;
    $scope.showProf();
    $scope.isClicked = true;
  };

  //Logout User
  $scope.logOut = function () {
    let data = {
      name: "Guest",
      password: "",
      customer_id: "",
    };
    localStorage.setItem("user", JSON.stringify(data));
    $location.path("/");
  };

  //visible trackorder table
  $scope.istrackVisible = false;
  $scope.trackVisible = function () {
    $scope.istrackVisible = true;
    $scope.isMyProfile = false;
    $scope.isMyOrders = false;
  };

  ///cancel order function
  $scope.deleteRecord = function (order_id) {
    let orderid = {
      order_id: order_id,
    };
    $http.post("/order/cancelOrder", orderid);
    alert("Cancel Your order.!");
    $scope.CurrentOrder();
  };
});
