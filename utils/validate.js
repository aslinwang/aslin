var Util = require('./util.js');
/**
 * utils - validate 类
 * 提供数据检验类的工具
 */

exports.REQUIRED = '1';//required
exports.URL = '2';//url

var PASSED = true;
var REASONS = [];//校验失败的校验器

//REQUIRED校验
function required(data){
  if(!data || data.trim() == ''){
    return false;
  }
  return true;
}

//URL校验
function url(data){
  if(/^http\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?$/.test(data)){
    return true;
  }
  return false;
}

function action(calibrator, data, name){
  if(Util.getType(data) == 'Array'){
    data.forEach(function(item){
      return action(calibrator, item, name);
    });
  }
  if(Util.getType(calibrator) == 'Array'){
    calibrator.forEach(function(item){
      return action(item, data, name);
    });
  }

  if(Util.getType(data) != 'Array' && Util.getType(calibrator) != 'Array'){
    switch(calibrator){
      case exports.REQUIRED:
        if(!required(data)){
          REASONS.push({name : name, type : exports.REQUIRED});
        }
        break;
      case exports.URL:
        if(!url(data)){
          REASONS.push({name : name, type : exports.URL});
        }
        break;
    }
  }

  return this;
}

/**
 * validate function
 * @param {array} calibrators calibrators
 * @param {Object} data source data
 * @return {[type]} [description]
 * @example
 *
 * validate('1', data1).then('2', data2).then('3', data3).block(fun).pass(fun);
 */
exports.validate = function(calibrator, data, name){
  REASONS = [];

  return action.call(this, calibrator, data, name);
}

exports.then = function(calibrator, data, name){
  return action.call(this, calibrator, data, name);
}

exports.block = function(fun){
  PASSED = REASONS.length == 0;
  if(typeof fun == 'function' && !PASSED){
    fun(REASONS);
  }
  return this;
}

exports.pass = function(fun){
  PASSED = REASONS.length == 0;
  if(typeof fun == 'function' && PASSED){
    fun();
  }
  return this;
}