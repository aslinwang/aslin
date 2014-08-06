
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

//modules require
var mobi = require('./modules/mobi/index');
var hp = require('./modules/hp/index');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
//app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//-mobi cfgFile 命令行获取mobi文件,cfgFile为配置文件 eg : node app.js -mobi 20140706.js
if(process.argv.length > 2){
  app.command = process.argv[2];
}

app.param('id', function(req, res, next, id){
	next();
});

app.get('/', routes.index);
app.get('/users', user.list);
//app.get('/^\/user\/:([^\/]+)\/?/', function(req,res){
app.get('/user/:id', function(req,res){
	//console.log(req.params);
	res.send(req.params.id);
});

//modules init
mobi.init(app);
hp.init(app);

if(!app.command){
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
}
