;
(function(){
  $('.btnClear').click(function(e){
    $('.code').val('');
  });

  $('.btnPreview').click(function(e){
    var content = $('.code').val();
    if(content.trim() == ''){
      alert('请输入代码!');
      return;
    }
    if(content.indexOf('<html') == -1){//不含有<html>标签
      content = '<!DOCTYPE html><html><head><title>html代码预览</title></head><body>' + content + '</body></html>';
    }
    $(this).dialog({
      width : 850,
      height : 500,
      title : '预览',
      content : content,
      ok : '确定'
    });
  });
}())
