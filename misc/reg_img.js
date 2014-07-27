//var html = '<img class="alignnone size-full wp-image-63778" alt="resource2" src="http://jbcdn2.b0.upaiyun.com/2014/03/ecb6345d63134dc84dbebd7fac166ffb.png"></a></p><p><a target="_blank" rel="nofollow" href="http://www.jobdeer.com/?fr=jobbole"><img src="http://jbcdn2.b0.upaiyun.com/2014/06/8b8517e334ae87e4094570d9ce62c7f7.png"></a></p>';

var html = '<br> <img src="1.jpg" width="689" alt="SVG Sprite&#x4F7F;&#x7528;&#x793A;&#x610F;" class="alignnone"></p> <p>&#x6548;&#x679C;&#x4E3A;&#xFF1A;<br> <img width="327" alt="SVG&#x4F7F;&#x7528;&#x7684;&#x56FE;&#x6807;&#x6548;&#x679C;" class="alignnone"></p> <p>&#x603B;&#x7ED3;&#x4E0B;&#x5C31;&#x662F;&#xFF1A;';

var match = html.match(/src=\"[\w:\/\.\-\~]*\"/g);
var matchObj = {}, mediaCnt = 0;

function escapeRegExp(str){
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function strReplaceAll(str, find, replace){
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

//var replace = html.replace(/src=\"[\w:\/\.]*/g, 'src="');
/*
for(var i = 0; i < match.length; i++){
  matchObj[match[i]] = i;
}

for(var key in matchObj){
  console.log(key);
  html = strReplaceAll(html, key, 'src="' + matchObj[key] + '"');
}

console.log(html);
*/


var parseMedia = function(content){
  var matches = content.match(/src=\"[\w:\/\.\-\~]*\"/g);
  var ret = content;
  if(matches){
    for(var i = 0; i < matches.length; i++){
      var ext = matches[i].match(/.*(\.\w*)"/);
      if(ext && ext.length == 2){
        ext = ext[1];
      }
      else{
        ext = '';
      }
      var url = matches[i].replace(/src="(.*)"/g, '$1');
      matchObj[url] = (mediaCnt++ + ext);
    }
    for(var key in matchObj){
      ret = strReplaceAll(ret, key, matchObj[key]);
    }
  }
  return ret;
}

var parsedHtml = parseMedia(html);
//console.log(html);
//console.log(parsedHtml);
//console.log(html);
//console.log(html.replace(/<img[^>]*(?!\ssrc=)[^>]*>?/g, ''));
console.log(html.replace(/<img[^>]*(src)[^>]*>?/g, ''));
//console.log(html.match(/<img(?!\ssrc=)[^>]*>?/g));

// var imgHtml = parsedHtml.match(/<img[^>]*/);
// if(imgHtml){
//   imgHtml = imgHtml[0];
// }
// if(imgHtml.indexOf(' src=') == -1){
//   console.log(imgHtml);
// }
// else{
//   console.log('has src');
// }