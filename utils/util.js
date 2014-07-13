//获取value数据类型
exports.getType = function(v){
  return Object.prototype.toString.call(v).slice(8,-1);
}

exports.isObject = function(a){
  return"object" == typeof a;
}

exports.extend = function(){
  for (var a = arguments, b = a[0], c = 1; c < a.length; c++) {
      var f = a[c];
      if (f){
        for (var e in f){
          exports.isObject(b[e]) && exports.isObject(f[e]) ? exports.extend(b[e], f[e]) : b[e] = f[e];
        }
      }
  }
  return b;
}

/**
 * 极速微模板解析引擎mTpl v1.0: 
 * @author: fengzhen wang
 * @param {String}  模板id || 模板text
 * @param {Object}  数据源json 
 * @param {String}  可选 要匹配的开始选择符 '<%' 、'[%' 、'<#' ..., 默认为'<%'
 * @param {String}  可选 要匹配的结束选择符 '%>' 、'%]' 、'#>' ..., 默认为'%>'
 * @param {Boolean} 可选 默认为true 
 * @return {String}  
 * @notice & other 
 *    1、  输出"开始选择符"或"结束选择符"时, 至少其中一个字符要转成实体字符, 
 *      如可以写成<&#37; &#37;>, 输出其它字符不需要转义, 注释里面的字符不受此约束。  
 *    2、  "#"的实体"&#35;", "%"的实体"&#37;", 更多html实体对照表: 
 *      http://www.f2e.org/utils/html_entities.html
 *    3、  数据源尽量不要有太多的冗余数据。 
 *    4、  实例demo和测速demo: http://f2e.org/jt/mtpl
 */
exports.txTpl = (function(){
  var cache={};
  return function(str, data, startSelector, endSelector, isCache){
    var fn, d=data, valueArr=[], isCache=isCache!=undefined ? isCache : true;
    if(isCache && cache[str]){
      for (var i=0, list=cache[str].propList, len=list.length; i<len; i++){valueArr.push(d[list[i]]);}	
      fn=cache[str].parsefn;
    }else{
      var propArr=[], formatTpl=(function(str, startSelector, endSelector){
        if(!startSelector){var startSelector='<%';}
        if(!endSelector){var endSelector='%>';}
        var tpl=/[^\w\d_:\.-]/g.test(str) == false ? document.getElementById(str).innerHTML : str;
        return tpl
        .replace(/\\/g, "\\\\") 											
        .replace(/[\r\t\n]/g, " ") 											
        .split(startSelector).join("\t")										
        .replace(new RegExp("((^|"+endSelector+")[^\t]*)'","g"), "$1\r")	
        .replace(new RegExp("\t=(.*?)"+endSelector,"g"), "';\n s+=$1;\n s+='")  					
        .split("\t").join("';\n")											
        .split(endSelector).join("\n s+='")		
        .split("\r").join("\\'");		
      })(str, startSelector, endSelector);	
      for (var p in d) {propArr.push(p);valueArr.push(d[p]);}	
      fn = new Function(propArr, " var s='';\n s+='" + formatTpl+ "';\n return s");
      isCache && (cache[str]={parsefn:fn, propList:propArr});
    }

    try{
      return fn.apply(null,valueArr);
    }catch(e){
      function globalEval(strScript) {
        var ua = navigator.userAgent.toLowerCase(), head=document.getElementsByTagName("head")[0], script = document.createElement("script"); 
        if(ua.indexOf('gecko') > -1 && ua.indexOf('khtml') == -1){window['eval'].call(window, fnStr); return}				
        script.innerHTML = strScript; 
        head.appendChild(script); 
        head.removeChild(script);
      }	

      var fnName='txTpl' + new Date().getTime(), fnStr='var '+ fnName+'='+fn.toString();
      globalEval(fnStr);
      window[fnName].apply(null,valueArr);		
    }			
  }
}())

exports.encodeGB2312 = function(str){
  return str.replace(/[^\u0000-\u00FF]/g,function($0){return escape($0).replace(/(%u)(\w{4})/gi,"&#x$2;")});
}