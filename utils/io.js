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