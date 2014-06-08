/**
 * utils - validate 类
 * 提供数据检验类的工具
 */

exports.REQUIRED = '1';//required
exports.URL = '2';//url

/**
 * validate function
 * @param {array} calibrators calibrators
 * @param {Object} data source data
 * @return {[type]} [description]
 * @example
 *     validate(['1,2', '1'], {
 *       a : 'http://a.com',
 *       b : 'test validate'
 *     });
 *
 *     validate(['1,2', '1'], ['http://a.com', 'test validate']);
 *
 * @attentions 参数1与参数2严格对应，参数1中的多个检验器用","隔开
 *
 * 这种方式好像不太适合，使用校验链呢
 * validate('1', data1).then('2', data2).then('3', data3).done(block,pass);
 */
exports.validate = function(calibrators, data){

}