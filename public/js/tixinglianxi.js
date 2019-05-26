window.onload=function(ev){
	window.counter=0;
	window.leg=0;
	window.obj;

window.com;
	var tixing=localStorage.tixing;
	var Btntixing=document.querySelector("#tixing");
	var Btntixing2=document.querySelector("#tixing2");
	Btntixing.onclick=function(event){
		localStorage.tixing='e';
	}
	Btntixing2.onclick=function(event){
		localStorage.tixing='f';
	}
	var username = document.querySelector("#username");
	username.innerHTML=localStorage.user;
	if(tixing=='e'){
		zairuxuanze("select");
	}
	if(tixing=='f'){
		zairuxuanze("base");
	}

	function zairuxuanze(sa){
		ajax("GET","../api/questionByType",{
					"type":sa
				},3000
				,function(xhr){
					    var s=JSON.parse(xhr.responseText);	
						window.obj=s;
						leg=obj.questions.length;
						du2(counter);
					console.log(window.obj);
						chuancanshu(window.obj);
				},function(xhr){
					alert(xhr.status+"连接失败");
				});
				
					console.log(window.obj);
	}
	function chuancanshu(obj){
		var biancheng=counter;
		if(tixing=='f'){biancheng=counter+40;}
		ajax("GET","../api/discussForQuestion",{
					"paperId":obj["questions"][counter]["_id"],
					"index":biancheng
				},3000
				,function(xhr){
						var number=0;
					    var s = JSON.parse(xhr.responseText);	
					    	window.com=s;
					    	console.log(s[number]["time"]);  
					    	console.log(getMyDate(s[number]["time"]));
							console.log(new Date(parseInt(s[number]["time"]) * 1000).toLocaleString().replace(/:\d{1,2}$/,' '));
						$.each(s,function(key,value){
							createText(null,1,s[number]["username"],s[number]["comment"],s[number]["star"],s[number]["cai"],number,getMyDate(s[number]["time"]));	
							number++;
						})
		
				},function(xhr){
					alert(xhr.status+"连接失败");
			});
	}
	
function getMyDate(str){  
   var oDate = new Date(str),  
   oYear = oDate.getFullYear(),  
   oMonth = oDate.getMonth()+1,  
   oDay = oDate.getDate(),  
   oHour = oDate.getHours(),  
   oMin = oDate.getMinutes(),  
   oSen = oDate.getSeconds(),  
   oTime = oYear +'/'+ getzf(oMonth) +'/'+ getzf(oDay) +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);//最后拼接时间  
   return oTime;  
}; 
//补0操作
function getzf(num){  
	 if(parseInt(num) < 10){  
	     num = '0'+num;  
	 }  
	 return num;  
}

						    
	function du2 (counter) {
		if(leg==80){
			console.log(counter);
			duiwei(obj["questions"][counter]["questions"].content,obj["questions"][counter]["questions"].options[0],obj["questions"][counter]["questions"].options[1],obj["questions"][counter]["questions"].options[2],obj["questions"][counter]["questions"].options[3]);
		}
		else{
			duiwei(counter,obj["questions"][counter]["questions"].content,obj["questions"][counter]["questions"].example[0].input,obj["questions"][counter]["questions"].example[0].output);
		}
	}

	window.a1=new Array(leg);	
	function duiwei(timu,ar,br,cr,dr){
		var no,a,b,c,d;
		if(tixing=='e'){
		no = document.querySelector("#no");
		a = document.querySelector("#A");
		b = document.querySelector("#B");
		c = document.querySelector("#C");
		d = document.querySelector("#D");
		ccount=counter+1;
		no.innerHTML="&nbsp&nbsp&nbsp&nbsp"+ccount+"."+timu;
		a.innerHTML=ar;
		b.innerHTML=br;
		c.innerHTML=cr;
		d.innerHTML=dr;
		}
		else{
		no = document.querySelector("#no2");
		a = document.querySelector("#content");
		b = document.querySelector("#example");
		c = document.querySelector("#attention");;
		ccount=counter+1;
		no.innerHTML="&nbsp&nbsp&nbsp&nbsp"+ccount+"."+ar;
		b.innerHTML="example:  "+"</br>"+"input:"+br+"</br>"+"output:"+cr;
		}
		initCodeHighlight();
	}
	
	function huanye(){
		if(tixing=='e'){
			$("#danxuan").css('display','block');
			$("#biancheng").css('display','none');
		}
		else if(tixing=='f'){
			$("#danxuan").css('display','none');
			$("#biancheng").css('display','block');
		}
		$(".commith").empty();
	}
	huanye();
	var Btnbefore=document.querySelector("#before");
	var Btnafter=document.querySelector("#after");
	var Btncheck=document.querySelector("#check");
	var Btnbefore2=document.querySelector("#before2");
	var Btnafter2=document.querySelector("#after2");
	var Btncheck2=document.querySelector("#check2");
	Btncheck.onclick=function(event){
		if(tixing=='e'){
			ajax("POST","/api/commitAnswersByType",{
					"paperId":obj._id,
					"answers": JSON.stringify(a1)
				},3000
				,function(xhr){
					if(xhr.responseText){
							alert("提交成功");	
						}
						else{
							alert("提交失败");
						}
				},function(xhr){
					alert("shibai");
				});
		}
		
	}
	function xiangqian(){
		if(counter<1){
			alert("已经是第一题了！");
			counter=0;
		}
		else if((tixing=='e'||tixing=='f')&&counter>=1){
			counter--;
			du2(counter);
			shujuchuanshu();
			shujujiancha();
			chuancanshu(window.obj);
		}
	}
	function xianghou(){
		if((tixing=='e'||tixing=='f')&&counter<=leg-2){
			counter++;
			du2(counter);
			shujuchuanshu();
			shujujiancha();
			chuancanshu(window.obj);
		}
		else if(counter==leg-1){
			alert("已完成答题");
		}
	}
	Btnbefore.onclick=function(event){
		huanye();
		xiangqian();
	}
	Btnbefore2.onclick=function(event){
		huanye();
		xiangqian();
	}
	Btnafter.onclick=function(event){
		huanye();
		xianghou();
	}
	Btnafter2.onclick=function(event){
		huanye();
		xianghou();
	}
	
	function shujuchuanshu(){
		if(($('input:radio[name="xuanze1"]:checked').val()!=null&&counter<=39&&tixing=='a')||tixing=='e')
		{
			a1[counter]=$('input:radio[name="xuanze1"]:checked').val();
		}
		else{
			a1[counter]=$("#anwser1").val();
		}
	}
	
	var selectedtxt=document.querySelectorAll(".txt");
	var length=selectedtxt.length;
	for(var x=0; x<length;x++){
			selectedtxt[x].onclick=function(ev){
			$(this).prev().prop('checked',true);
		}
	}
	
	function shujujiancha(){
		if(a1[counter]!=null){
			var shu=10;
			if(a1[counter]=='A'){
				shu=0;
			}
			if(a1[counter]=='B'){
				shu=1;
			}
			if(a1[counter]=='C'){
				shu=2;
			}
			if(a1[counter]=='D'){
				shu=3;
			}
			if(shu!=10){
				$("input[name='xuanze1']").get(shu).checked=true;
			}	
		}
		else{
			qingchuxuanze();
		}
	}
	var selected=document.querySelectorAll(".xuanxiang");
	function qingchuxuanze(){
		for(var x=0; x<length;x++){
			selected[x].checked=false;
		}
	}
	
	var shijian = parseInt(3600);
	function timer(shijian){
    window.setInterval(function(){
    var hour=0,
        minute=0,
        second=0;//时间默认值        
    if(shijian > 0){
        hour = Math.floor(shijian / (60 * 60));
        minute = Math.floor(shijian / 60) - (hour * 60);
        second = Math.floor(shijian)  - (hour * 60 * 60) - (minute * 60);
    }
    if (minute <= 9) minute = '0' + minute;
    if (second <= 9) second = '0' + second;
    $('#hour_show').html('<s id="h"></s>'+hour+'时');
    $('#minute_show').html('<s></s>'+minute+'分');
    $('#second_show').html('<s></s>'+second+'秒');
    shijian--;
   	 }, 1000);
	} 
	$(function(){
 	   timer(shijian);
	}); 

	var Btntijiao=document.querySelector("#pingluntijiao");
	var pinglun=document.querySelector("#pinglun");
	Btntijiao.onclick=function(){
		ajax("POST","/api/discuss/commit",{
					"paperId":obj.questions[counter]._id,
					"index":obj.questions[counter].questions.index,
					"comment":pinglun.value
				},3000
				,function(xhr){
					if(xhr.responseText){
							alert("提交成功");	
						}
						else{
							alert("提交失败");
						}
				},function(xhr){
					alert("shibai");
				});
		console.log(pinglun.value+"？"+localStorage.user+"?"+counter);
		createText(localStorage.user,0,null,null,null,null,0);
	}
	var myDate = new Date();
	function createText(name,choose,id,commit,ding,cai,cishu,shijian){
		if(choose==0){
			var timestamp = Date.parse(new Date());
			var jieguo=getMyDate(timestamp);
			var $text = $(  
						"<div class=\"pinglunqu\">\n"+
				"	<div class=\"usernames\">"+name+":</div>\n"+
					"	<div class=\"pinglundehua\">"+pinglun.value+"</div>\n"+
				"	<div class=\"zancai\"><img src=\"img/文章详情-赞踩-01.png\"  class=\"ding\"><span class=\"dingcai\">"+0+"</span>&nbsp&nbsp&nbsp<img src=\"img/文章详情-赞踩-02.png\" class=\"cai\">"+"<span class=\"dingcai\">"+0+"</span>"+"</div>\n"+
				"	<div class=\"time\">"+jieguo+"</div>\n"+
			"	</div>	")

		}
		else{
			console.log(com);
			console.log(counter);
			var $text = $(  
						"<div class=\"pinglunqu\">\n"+
				"	<div class=\"usernames\" id="+com[cishu]["discussId"]+">"+id+":</div>\n"+
					"	<div class=\"pinglundehua\">"+commit+"</div>\n"+
				"	<div class=\"zancai\"><img src=\"img/文章详情-赞踩-01.png\" class=\"ding\">"+"<span class=\"dingcai\">"+ding+"</span>"+"&nbsp&nbsp&nbsp<img src=\"img/文章详情-赞踩-02.png\" class=\"cai\">"+"<span class=\"dingcai\">"+cai+"</span>"+"</div>\n"+
				"	<div class=\"time\">"+shijian+"</div>\n"+
			"	</div>	")
		}
		
		$(".commith").prepend($text);
	}
	$(".commith").delegate(".ding","click",function(){
		var shuliang=parseInt($(this).next().text());
		console.log($(this).next().next().next().css("color"));
		if($(this).next().css("color")=="rgb(255, 0, 0)"||$(this).next().next().next().css("color")=="rgb(255, 0, 0)"){alert("您已经评论!")}
		else{					
				shuliang++;
				console.log(shuliang);
				$(this).next().text(shuliang);
				$(this).next().css("color","red");
			ajax("POST","/api/discuss/star",{
					"discussId":$(this).parent().prev().prev().attr("id")
				},3000
				,function(xhr){

				},function(xhr){
					alert("404");
				});
		}
	})
	$(".commith").delegate(".cai","click",function(){
		var shuliang=parseInt($(this).next().text());
		console.log($(this).prev().prev());
		if($(this).next().css("color")=="rgb(255, 0, 0)"||$(this).prev().css("color")=="rgb(255, 0, 0)"){alert("您已经评论!")}
		else{					
				shuliang++;
				console.log(shuliang);
				$(this).next().text(shuliang);
				$(this).next().css("color","red");
			ajax("POST","/api/discuss/cai",{
					"discussId":$(this).parent().prev().prev().attr("id")
				},3000
				,function(xhr){

				},function(xhr){
					alert("404");
				});
		}
	})
	editorInit("anwser1");
}

function editorInit(id) {
	var el = document.getElementById(id);
	var runCodeBtn = document.getElementById("runcode");
	var version = "# version: Python3\n\n";
	var codeTip = "'''\nThis function is the entry of this program, \nthe args is the input params and\nit must be return your answer of current question.\n'''\n";
	var code = "def solution(args):\n\tpass";
    var initValue = version + codeTip + code;
    var myCodeMirror = CodeMirror.fromTextArea(el, {
        mode: "python",
        theme: "leetcode",
        keyMap: "sublime",
        lineNumbers: true,
        smartIndent: true,
        indentUnit: 4,
        indentWithTabs: true,
        lineWrapping: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
        foldGutter: true,
        autofocus: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
    });
    myCodeMirror.setOption("value", initValue);
    myCodeMirror.on("keypress", function() {
        myCodeMirror.showHint(); // 注意，注释了CodeMirror库中show-hint.js第131行的代码（阻止了代码补全，同时提供智能提示）
	});
	runCodeBtn.addEventListener("click", function() {
		var code = myCodeMirror.getValue();
		runCode(code)
	})
	function runCode(code) {
		var paperId = "5ca06e9201257519105a7882";
		var index = 40;
		$.ajax({
			url: "/api/code/commit",
			method: "post",
			data: {
				paperId: paperId, index: index, code: code
			},
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				console.log(data)
			},
			error: function() {

			}
		});
	}
}

function initCodeHighlight() {
	var pres = document.querySelectorAll(".question-box pre")
	pres.forEach(function(pre) {
		hljs.highlightBlock(pre)
	})
}
