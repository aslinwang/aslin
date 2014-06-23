/**
 * core js
 * @dependences jquery.js bootstrap.js
 */
var X = {};
(function(){
$.fn.dialog = (function(){
  var $body = null;
  var modal = null;
  var tmpl = [
  '<div class="modal fade in" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false">',
    '<div class="modal-dialog">',
      '<div class="modal-content">',
        '<div class="modal-header">',
          '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
          '<h4 class="modal-title" id="myModalLabel">Modal title</h4>',
        '</div>',
        '<div class="modal-body">...</div>',
        '<div class="modal-footer">',
          '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>',
          '<button type="button" class="btn btn-primary" data-dismiss="modal">Save changes</button>',
        '</div>',
      '</div>',
    '</div>',
  '</div>'].join('');
  var okfun;

  var addEvents = function(){
    $body.on('click', '.btn-primary', function(e){
      if(okfun){
        okfun();
      }
    });
  };
  /**
   * 显示对话框
   * @param  {object} cfg 配置项
   * @cfg {int} width 自定义宽度
   * @cfg {string} title 标题
   * @cfg {string} content 内容
   * @cfg {string} ok 确认按钮文案
   * @return {[type]}     [description]
   */
  return function(cfg){
    if(!$body){
      $body = $(tmpl);
      $(document.body).append($body);

      addEvents();
    }
    modal = $('#myModal').modal();
    if(cfg.width){
      $('.modal-dialog', $body).css('width', cfg.width);
    }
    if(cfg.height){
      $('.modal-body', $body).css({
        'height': cfg.height,
        'overflow-y' : 'auto'
      });
    }
    if(cfg.title){
      $('#myModalLabel').html(cfg.title);
    }
    if(cfg.content){
      $('.modal-body', $body).html(cfg.content);
    }
    if(cfg.ok){
      $('.btn-primary', $body).html(cfg.ok);
    }
    okfun = cfg.okfun;
  };
}());

}());