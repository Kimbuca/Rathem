var mysql = require('mysql');

//Start connection
var connection = mysql.createConnection({
  host     : 'localhost',
  port     :  3306,
  user     : 'root',
  password : '',
  database : 'rathem'
});


connection.connect(function(err){
  if(!err){
    console.log("Database is connected :D ...");
  }else{
    console.log("Error in connecting with database :( ... ");
  }
});


module.exports = connection;
