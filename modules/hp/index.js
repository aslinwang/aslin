/**
 * module - html previewer
 */
var express = require('express');
var path = require('path');

var VIEW_PATH = '../modules/hp/views/';//以app.set('views','')为准

function index(req, res){
  res.render(VIEW_PATH + 'index', {
    title : 'Html Previewer - Aslin`s Site',
    active : 'hp',
    moduleJs : '/hp/js/index.js'
  });
}

exports.init = function(app){
  app.use(express.static(path.join(__dirname, 'public')));//将模块的素材目录暴露出来供外部访问，这样是为了保证模块独立在一个目录下

  app.get('/hp', index);
}
