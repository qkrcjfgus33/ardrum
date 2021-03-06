//server open

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);



// view engine setup
//app.set('view engine', 'html');
//app.set('views', path.join(__dirname, 'views'));
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});






//arduino

var led_sensor = require('./sensor/led.js');
var btn_sensor = require('./sensor/btn.js');
var gyr_sensor = require('./sensor/gyr.js');

var arduino = require('duino');

var board = new arduino.Board({
    //debug: true
});

board.on('ready', function(){
    
    console.log('board-ready');
    
     gyr_sensor(io, arduino, board, 2);
     btn_sensor(io, arduino, board, 3);
     btn_sensor(io, arduino, board, 4);
     btn_sensor(io, arduino, board, 5);
     btn_sensor(io, arduino, board, 6);
    
    io.sockets.on('connection', function (socket) {
        console.log('connection');
    });
    
});



board.on('connected', function(){
    http.listen(3000, function(){
      console.log('listening on *:3000');
    });
})

