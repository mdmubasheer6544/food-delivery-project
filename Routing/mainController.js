var app = angular.module("DemoApp", ['ngRoute','ui.directives','ui.filters','ngMessages']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: "../pages/Home.html",
            controller: 'fetchController'
        }).when('/userProf', {
            templateUrl: '../pages/userPannel.html',
            controller: ''
        }).when('/adminProf', {
            templateUrl: '../pages/adminPannel.html',
            controller: 'adminController'
            
        }).when('/userLogin', {
            templateUrl: '../pages/login.html',
            controller:"fetchController"
        }).when('/singUp',{
            templateUrl:"../pages/singup.html",
            controller:"fetchController"
        }).when('/userProf',{
            templateUrl:"../pages/userPannel.html",
            controller:"userController"
        })
})