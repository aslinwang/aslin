var html = '<img class="alignnone size-full wp-image-63778" alt="resource2" src="http://jbcdn2.b0.upaiyun.com/2014/03/ecb6345d63134dc84dbebd7fac166ffb.png"></a></p><p><a target="_blank" rel="nofollow" href="http://www.jobdeer.com/?fr=jobbole"><img src="http://jbcdn2.b0.upaiyun.com/2014/06/8b8517e334ae87e4094570d9ce62c7f7.png"></a></p>';

var match = html.match(/src=\"[\w:\/\.]*\"/g);
var matchObj = {};

function escapeRegExp(str){
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function strReplaceAll(str, find, replace){
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

//var replace = html.replace(/src=\"[\w:\/\.]*/g, 'src="');
for(var i = 0; i < match.length; i++){
  matchObj[match[i]] = i;
}

for(var key in matchObj){
  console.log(key);
  html = strReplaceAll(html, key, 'src="' + matchObj[key] + '"');
}

console.log(html);