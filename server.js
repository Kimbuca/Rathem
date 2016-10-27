
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var path    = require("path");
var sess;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({secret: 'fsdjfnjbehngb'}));


//look for static files in the static directory of the application.
app.use(express.static('static'));
app.use(express.static('static/views'));

//app.set('views', __dirname + '/static');
//app.engine('html', require('ejs').renderFile);
//app.use(express.static(__dirname + '/static'));

//manjeador de urls, sirvelo como estatico
app.get('/', function (req, res) {
	sess=req.session;
	console.log(req.session);

	if(sess.userId){
			//ya hay una session, algo que hacer en homepage?
			console.log("ya hay session");

	}else{
			console.log("no hay session");

	}

	res.sendFile('static/index.html');


});



var router = express.Router();
//pefijo maestro para login :D
app.use('/api/login', require('./app/router/login'));

var port = process.env.PORT || 8000;
app.listen(port);
console.log('Listening on port ' + port);

module.exports = sess;
