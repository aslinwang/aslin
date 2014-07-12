/**
 * utils - io 类
 * 提供与网络请求相关的工具
 */

exports.CODES = {
  '0' : 'success',
  '-1001' : 'request error!',//there is error when request
  '-1002' : 'can not get content!',
  '-1003' : 'data invalid'
};

//将返回内容格式化为json数据
//调用此方法是，code必须为exports.CODES中的值，便于规范错误码的定义及查询
exports.formatResJson = function(code, msg, data){
  if(!exports.CODES[code]){
    throw new Error('response code is not defined in IO.CODES!');
  }
  var res = {
    code : code,
    msg : msg ? msg : exports.CODES[code]
  };
  if(data){
    res.data = data;
  }
  return res;
};

var fs = require('fs');

//循环创建目录
//http://www.cnblogs.com/rubylouvre/archive/2011/11/28/2264717.html
exports.mkdirSync = function(url,mode,cb){
  var path = require("path"), fs = require("fs"), arr = url.split("/");
  mode = mode || 0755;
  cb = cb || function(){};
  if(arr[0]==="."){//处理 ./aaa
    arr.shift();
  }
  if(arr[0] == ".."){//处理 ../ddd/d
    arr.splice(0,2,arr[0]+"/"+arr[1])
  }
  function inner(cur){
    if(!path.existsSync(cur)){//不存在就创建一个
      fs.mkdirSync(cur, mode)
    }
    if(arr.length){
      inner(cur + "/"+arr.shift());
    }else{
      cb();
    }
  }
  arr.length && inner(arr.shift());
}