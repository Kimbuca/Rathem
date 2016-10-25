
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('static'));


//manjeador de urls
app.get('/', function (req, res, next) {
	res.sendFile('static/index.html');
});


var router = express.Router();

//pefijo maestro para login :D
app.use('/api/login', require('./app/router/login'));


var port = process.env.PORT || 8000;
app.listen(port);
console.log('Listening on port ' + port);
