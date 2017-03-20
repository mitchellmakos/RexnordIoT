/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var cfenv = require('cfenv');
var http = require('http');
var path = require('path');
var fs = require('fs');

var errorHandler = require('errorhandler');


var routes = require('./routes');
var user = require('./routes/user');


var app = express();

var appEnv = cfenv.getAppEnv();


// all environments
app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.engine('html', require('hbs').renderFile);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// view engine setup
//app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

// Express Sessions Config
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport Config
app.use(passport.initialize());
app.use(passport.session());

// Express Validator Config
// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// Flash msg config
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


app.get('/', routes.index);


//app.use('/', routes);
//app.use('/users', users);



// Route protection set up
//app.get('*', function(req, res, next){
//  res.locals.user = req.user || null;
//  next();
//});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});


http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
