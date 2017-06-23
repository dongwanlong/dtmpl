var fs = require('fs');

function escapeXML(str) {
	let _MATCH_HTML = /[&<>'"]/g;
	let _ENCODE_HTML_RULES = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&#34;",
		"'": "&#39;",
	};
	var xx = String(str).replace(_MATCH_HTML, c=>{
	  return _ENCODE_HTML_RULES[c] || c;
	});
	
	return xx;
}

function templateTrans(tmp0, tmp1, obj) {
	let c = tmp1.substr(0,1), res = "";
	obj.escapeXML = escapeXML;
	obj.templateRender = templateRender;

	switch(c){
		case '='://转义变量解析
			res = `res+=escapeXML(${tmp1.substr(1)});`;
			break;
		case '-'://非转义变量解析
			res = `res+=${tmp1.substr(1)};`;
			break;	
		case '?'://if开关解析
			let arr = tmp1.substr(1).split(':');
			if(arr.length==2){
			let fn = new Function(`with(this){return ${arr[0]};}`);
			if(fn.call(obj))res = `res+='${arr[1]}';`;
			}
			break;
		case '#'://引用外部模板
			let str = fs.readFileSync(tmp1.substr(1)).toString();
			res = `res+=templateRender('${str}',this);`;
			break;
		case '<'://'[]'字符串输出
			res = 'res+="[";';
			break;
		case '>':
			res = 'res+="]";';
			break;
		default://代码解析
			res = `${tmp1};`;
	}
	
	return res;
}

function getLineCode(...arg) {
	let code = "";
	if(arg.length==1){//HTML拼接
		return `res+='${arg[0]}';`
	}else if(arg.length==3){//模板替换
		//let tm = templateTrans(...arg);
		return templateTrans(...arg);
	}else{//异常
		return "";
	}
}

function templateRender(html,options) {
    var re = /\[([^\[\]]+)?\]/g;//基础解析

	var code = 'var res="";\n with(this){\n', cursor = 0;
	
    while(match = re.exec(html)) {
		code += getLineCode(html.slice(cursor, match.index));
		code += getLineCode(match[0],match[1],options);
        cursor = match.index + match[0].length;
    }
	
	code += getLineCode(html.substr(cursor, html.length - cursor));
    code += '};return res;';
	
    return new Function(code.replace(/[\r\t\n]/g, '')).call(options);
}

module.exports.templateRender = templateRender;