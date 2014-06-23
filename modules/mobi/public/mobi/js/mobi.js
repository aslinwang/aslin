;
(function(){
var parseApi = 'http://' + document.location.host + '/mobi/trans';
var mobiData = null;
var parseData = function(el){
  //@todo validate form
  
  var fields = ['inputTitle', 'inputAuthor', 'inputCover', 'inputUrl'];//先以class为准，在查询id
  var data = {};
  $.each(fields, function(idx, field){
    var input = $('.' + field, el);
    if(input.length == 0){
      input = $('#' + field, el);
    }
    if(input.length > 1){
      data[field] = [];
      $.each(input, function(idx1, item){
        data[field].push($(item).val());
      });
    }
    else{
      data[field] = input.val();
    }
  });

  send(data);
};

var send = function(data){
  var btnPreview = $('.btnPreview');
  $.post(parseApi, data, function(data){
    console.log(data);
    if(data.code == '0'){
      mobiData = data.data;
      btnPreview.show();
    }
  });
};

//下载mobi文件，ajax content
var download = function(){

};

$('.btnTrans').click(function(e){
  parseData($('.mobiform'));

  e.preventDefault();
});

$('.btnPreview').click(function(e){
  console.log(mobiData);
  var content='';
  $.each(mobiData, function(idx,item){
    if(item.content){
      content += item.content;
    }
  });
  $(this).dialog({
    width : 850,
    height : 500,
    title : '预览',
    content : content,
    ok : '下载',
    okfun : function(){

    }
  });

  e.preventDefault();
});

}())