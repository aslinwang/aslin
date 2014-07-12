/**
 * module - mobi maker
 */
var express = require('express');
var path = require('path');
var https = require('https');
var qs = require('querystring');
var q = require('q');
var fs = require('fs');
var cp = require('child_process');

var config = require('./config');
var util = require('../../utils/util');
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
var parse = (function(){
  //'http://aslinwang.github.io/2014/06/fiddler-console/'
  var jsons = [];
  var defer = q.defer();

  var action = function(urls){
    var url = urls.shift();
    if(!url){
      defer.resolve(jsons);
      jsons = [];
      return
    }
    console.log(url);
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
        jsons.push(json);

        action(urls);
      });
    });

    req.on('error', function(){
      defer.reject('parse request error!');
    });

    req.end();

    return defer.promise;
  }

  return action;
}());

//cure html string to kindlegen
var cureHtml = function(str){
	str = str.replace(/<img>/g, '');//remove img tags that have no src attribute
	return str;
}

//info = {
//  file : '20140706',//文件名不带后缀
//  title : 'mobi demo',
//  author : 'aslinwang',
//  cover : 'http://xxx.jpg',
//  pages : []
//}
var makeMobi = function(info){
  //make html 文件操作
  var dest = './modules/mobi/data/' + info.file + '.html';
  var html = [
    '<html>',
      '<head>',
        '<title><%=title%></title>',
      '</head>',
      '<body>',
      '<%for(var i=0;i<pages.length;i++){%>',
        '<h1><%=pages[i].title%></h1>',
        '<%=pages[i].content%>',
      '<%}%>',
      '</body>',
    '</html>'
  ].join('');
  html = util.txTpl(html, info);
	html = cureHtml(html);
  fs.writeFile(dest, html, function(e){
    //html -> mobi
    cp.exec('kindlegen ' + dest, function(err, stdout, stderr){
      console.log('kindlegen log>>>', stdout);
      console.log('kindlegen err>>>', stderr);
    });
  });
};

//系统调用kindlegen生成mobi文件  html->mobi
var download = function(req, res){

};

//start transform
var trans = function(req, res){
  var data = req.body;
  var words = {
    err : 'something go wrong when parsing url'
  };
 
  //validate params
  util_v.validate(util_v.REQUIRED, data.inputTitle, 'input title error')
  .then(util_v.REQUIRED, data.inputAuthor, 'input author error')
  .then([util_v.REQUIRED, util_v.URL], data.inputUrl, 'input url error')
  .pass(function(){
    //@tode get urls
    parse(data.inputUrl)
    .done(function(data){
      if(data){
        res.send(util_io.formatResJson('0', '', data));
      }
      else{
        res.send(util_io.formatResJson('-1002', words.err));
      }
    }, function(err){
       res.send(util_io.formatResJson('-1001', err));
    });
  }).block(function(reason){
    //校验失败
    res.send(util_io.formatResJson('-1003', reason[0].type + '-' + reason[0].name));
  });
};

//在shell中转换文件
var shellTrans = function(file){
  var config = require('./data/' + file);
  parse(config.urls).done(function(data){
    makeMobi(util.extend(config, {pages : data, file : file.replace('.js', '')}));
  });
};

exports.init = function(app){
  app.use(express.static(path.join(__dirname, 'public')));//将mobi模块的素材目录暴露出来供外部访问，这样是为了保证模块独立在一个目录下

  app.get('/mobi', router);
  app.post('/mobi/trans', trans);
  app.post('/mobi/download', download);

  if(app.command && app.command == '-mobi'){
    var cfg = process.argv[3];
    if(cfg){
      shellTrans(cfg);
    }
  }
};
