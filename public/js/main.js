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
