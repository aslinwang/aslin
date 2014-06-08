;
(function(){
var parseApi = 'http://' + document.location.host + '/mobi/trans';
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
  console.log(data);
  $.post(parseApi, data, function(data){
    console.log(data);
  });
};

$('.btnTrans').click(function(e){
  parseData($('.mobiform'));

  e.preventDefault();
});

}())