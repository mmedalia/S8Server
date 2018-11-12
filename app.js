var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

// //MIDDLEWARE EXAMPLE - WOULD RUN EVERY TIME THE APP IS LOADED
// var logger = function(req, res, next){
// 	console.log('Logging...');
// 	next();
// }

// app.use(logger);

//VIEW ENGINE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//BODY PARSER MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//SET STATIC PATH
app.use(express.static(path.join(__dirname, 'public')));

//ROUTE TO ROOT
app.get('/', function(req, res){
	//CURRENTLY JUST SHOWING THE SAMPLE SCENE
	res.render('index', {
		title: "GET RICH"
	});
});


//ROUTE TO THE SAMPLE SCENE
app.get('/example', (req, res) => {
	res.render('index', {
		title: "GET RICH"
	});
});

//ROUTE TO THE API SCENE FUNCTIONALITY
//EXAMPLE USING THE params OBJECT FROM THE REQUEST
//ADD MULTIPLE PARAMS WITH /api/scenes/:id/:name
app.get('/api/scenes/:id', (req, res) => {
	res.send(`This should load scene ${req.params.id}`);
});
//EXAMPLE USING query string FUNCTIONALITY
//SENDING INFO IN Q STRING: /api/scenes?sortBy=name
//USE QUERY STRING FOR "OPTIONAL" INFORMATION
/*
app.get('/api/scenes/&', (req, res) => {
	//USE THE query NAME TO LIST THE QUERY STRING INFO
	res.send(req.query);
});
*/

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}...`));

