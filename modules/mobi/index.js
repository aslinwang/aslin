/**
 * module - mobi maker
 */
var express = require('express');
var path = require('path');
var https = require('https');
var qs = require('querystring');
var q = require('q');

var config = require('./config');
var util_io = require('../../utils/io');
var util_v = require('../../utils/validate');

var VIEW_PATH = '../modules/mobi/views/';//以app.set('views','')为准

var router = function(req, res){
  res.render(VIEW_PATH + 'index', {
    title: 'Aslin`s Site', 
    active: 'mobi', 
    moduleCss: '/mobi/css/mobi.css',
    moduleJs : '/mobi/js/mobi.js'
  });
};

//parse raw html page content
var parse = function(url){
  var defer = q.defer();
  var data = {
    token : config.TOKEN,
    url : url
  }
  var req = https.request({
    hostname : 'readability.com',
    port : 443,
    method : 'GET',
    path : '/api/content/v1/parser?' + qs.stringify(data)
  }, function(res){
    var _chunk;
    res.setEncoding('utf-8');
    res.on('data', function(chunk){
      _chunk = _chunk ? _chunk + chunk : chunk;
    });
    res.on('end', function(){
      var json = JSON.parse(_chunk);
      defer.resolve(json);
    });
  });

  req.on('error', function(){
    defer.reject('parse request error!');
  });

  req.end();

  return defer.promise;
};

//start transform
var trans = function(req, res){
  var data = req.body;
  
  //validate params
  util_v.validate([], data);

  var words = {
    err : 'something go wrong when parsing url'
  };

  parse('http://aslinwang.github.io/2014/06/fiddler-console/')
  .done(function(data){
    if(data && data.content){
      res.send(data.content);
    }
    else{
      res.send(util_io.formatResJson('-1002', words.err));
    }
  }, function(err){
     res.send(util_io.formatResJson('-1001', err));
  });
};

exports.init = function(app){
  app.use(express.static(path.join(__dirname, 'public')));//将mobi模块的素材目录暴露出来供外部访问，这样是为了保证模块独立在一个目录下

  app.get('/mobi', router);
  app.post('/mobi/trans', trans);
};