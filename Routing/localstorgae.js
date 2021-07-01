let data={
    name: "Guest",
    password: "",
    customer_id:''
}
var users = localStorage.getItem('user');
if(users==null){
    localStorage.setItem('user', JSON.stringify(data));
}