var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


var indexRoutes = require('./routes/index');
var watsonServicesRoutes = require('./routes/watsonServices');

var utilsRoutes = require('./routes/utils');
app.use('/watson', watsonServicesRoutes);
app.use('/', indexRoutes);
app.use('/utils', utilsRoutes);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));

app.use(express.static('public'));


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;