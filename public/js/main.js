function obj2str(obj){
	var res=[];
	for(var key in obj){
		res.push(key+"="+obj[key]);
	}
	return res.join("&");
}



function ajax(type,url,obj,timeout,success,error){
	var xmlhttp=new XMLHttpRequest();
	var str=obj2str(obj);
	var timer;
	if(type==="GET"){
		xmlhttp.open(type,url+"?"+str,true);
		xmlhttp.send();
	}
	else{
		xmlhttp.open(type,url,true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		console.log(str);
		xmlhttp.send(str);
	}
	xmlhttp.onreadystatechange=function(ev2){
		if(xmlhttp.readyState===4){
			clearInterval(timer);
			if(xmlhttp.status>=200&&xmlhttp.status<300||xmlhttp.status===304){
				success(xmlhttp);
			}else{
				error(xmlhttp);
			}
		}
	}
	if(timeout){
		timer=setInterval(function(){
			xmlhttp.abort();
			clearInterval(timer);
		},timeout);
	}
}


function CheckForm(obj, comBtn){
	this.obj = obj;
	this.comBtn = comBtn;
	this.elObjs = {}; // 所有表单输入框对应的js对象
	this.success = function() {
		alert("验证通过！");
	};
	this.error = function(msg) {
		if(msg) {
			alert("验证失败：" + msg);
		}else {
			alert("验证失败！");
		}
	};
}
CheckForm.prototype.initInputEvent = function(errClass) {
	errClass = '.' + errClass;
	var obj = this.obj;
	var elObjs = this.elObjs;
	var key, $el, elObj;
	for(key in obj) {
		$el = $(key);
		elObj = createElobj(obj[key]);
		elObjs[key] = elObj;
		bindEvent($el, elObj);
	}
	function createElobj(val) {
		var req, re, msg, elObj;
		req = val.req;
		if(val.re) {
			re = val.re[0];
			msg = val.re[1];
		}
		elObj = {status: false, type: "req"};
		elObj.req = req;
		elObj.msg = msg;
		elObj.re = re;
		return elObj;
	}
	function bindEvent($el, elObj) {
		$el.on("input", function() {
			var inputVal = $(this).val();
			var req = elObj.req;
			var re = elObj.re;
			var msg = elObj.msg;
			if(req && inputVal === "") {
				showErrorMsg($el, req);
				elObj.type = "req";
				elObj.status = false;
				return;
			}
			if(re && !re.test(inputVal)) {
				elObj.type = "msg";
				elObj.status = false;
				showErrorMsg($el, msg);
				return;
			}
			elObj.type = "";
			elObj.status = true;
			showErrorMsg($el, "");
		});
	}
	function showErrorMsg( $el, msg) {
		$label = $el.parent().find(errClass);
		$label.text(msg);
	}
};
CheckForm.prototype.getErrorMsg = function(elObj) {
	return elObj.status ? false : (elObj.type === "req" ? elObj.req : elObj.msg || elObj.req);
};
CheckForm.prototype.isError = function(key) {
	var elObj = this.elObjs[key];
	return !elObj.status;
};
CheckForm.prototype.hasError = function() {
	var elObjs = this.elObjs;
	var key;
	for(key in elObjs) {
		if(this.isError(key)) {
			return this.getErrorMsg(elObjs[key]);
		}
	}
	return false;
}
CheckForm.prototype.initCommitEvent = function() {
	var btn = this.comBtn;
	var success = arguments[0] || this.success;
	var error = arguments[1] || this.error;
	var that = this;
	$(btn).on("click", function() {
		var hasError = that.hasError()
		hasError === false ? success.call(that) : error.call(that, hasError);
	});
}