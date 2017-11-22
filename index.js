const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');


const app = express();
var cool = require('cool-ascii-faces');

app.set('port', (process.env.PORT || 3007));
app.set('frontend', (process.env.FRONTEND || "http://localhost:3000"))

const corsOptions = {
  "origin": "*",
  "Access-Control-Allow-Origin": "*",
  "methods": "GET, POST, PUT",
  "preflightContinue": true,
  "optionsSuccessStatus": 204,
  "credentials": true
};

app.use(express.static(__dirname + '/busycards/build'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api', routes);

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(req, res) {
  res.send(cool());
});

app.get('/times', function(req, res) {
  var result = ''
  var times = process.env.TIMES || 5
  for (var i=0; i < times; i++)
    result += i + ' ';
  res.send(result);
}); 

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
