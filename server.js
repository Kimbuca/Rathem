
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
//var mongoose   = require('mongoose');

//mongoose.connect('mongodb://localhost/urls');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('static'));

app.get('/', function (req, res, next) {
	res.sendFile('static/index.html');

});


//Start connection
var connection = mysql.createConnection({
  host     : 'localhost',
  port     :  3309,
  user     : 'root',
  password : 'kbau7',
  database : 'rathem'
});


connection.connect(function(err){
  if(!err){
    console.log("Database is connected :D ... nn");
  }else{
    console.log("Error in connecting with database ... nn");
  }
});



/*
app.use(function(req, res, next) {
  	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  	next();
});
*/

var router = express.Router();
app.use('/api/login', require('./app/router/login'));


var port = process.env.PORT || 8000;
app.listen(port);
console.log('Listening on port ' + port);
