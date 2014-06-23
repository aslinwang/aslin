//获取value数据类型
exports.getType = function(v){
  return Object.prototype.toString.call(v).slice(8,-1);
}