
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Aslin`s Site' });
};
