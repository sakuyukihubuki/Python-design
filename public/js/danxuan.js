window.onload=function(ev){
	window.counter=0;
	window.leg=0;
	window.obj;
	var str=window.location.href.split('?');
	var res=str[0];
	var names=str[1];
	var patt=/danxuan/;
	zairu(counter);
	console.log(localStorage.tixing);
	function zairu(counter){
		ajax("GET","../api/paperDetail",{
					"paperId":names,
				},3000
				,function(xhr){
					console.log(xhr);
					    var s = JSON.parse(xhr.responseText);
						console.log(names);		
						obj=s;
						console.log(obj);	
						leg=obj.questions.length;
						if(patt.test(res)){
							du(counter);
						}
						else{
							counter=40;
							du2(counter);
							console.log(counter);
						}
				},function(xhr){
					alert(xhr.status+"连接失败");
				});
	}
	function du (counter) {
		if(counter<=39){
			duiwei(obj["questions"][counter].content,obj["questions"][counter].options[0],obj["questions"][counter].options[1],obj["questions"][counter].options[2],obj["questions"][counter].options[3]);
		}
		else{
			duiwei(counter,obj["questions"][counter].content,obj["questions"][counter].example[0].input,obj["questions"][counter].example[0].output);
		}
	}

	window.a1=new Array(leg);	
	function duiwei(timu,ar,br,cr,dr){
		var no,a,b,c,d;
		if(counter<=39){
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
		initCodeHighlight()
	}
	
	function huanye(){
		if(counter<39){
			$("#danxuan").css('display','block');
			$("#biancheng").css('display','none');
		}
		else{
			$("#danxuan").css('display','none');
			$("#biancheng").css('display','block');
		}
	}
	huanye();
	var Btnbefore=document.querySelector("#before");
	var Btnafter=document.querySelector("#after");
	var Btncheck=document.querySelector("#check");
	var Btnbefore2=document.querySelector("#before2");
	var Btnafter2=document.querySelector("#after2");
	var Btncheck2=document.querySelector("#check2");
	Btncheck.onclick=function(event){
		ajax("POST","/api/commitPaper",{
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
	function xiangqian(){
		if(counter<1){
			alert("已经是第一题了！");
			counter=0;
		}
		else if(counter>=leg-7&&counter<leg){
			counter--;	
			du(counter);
			shujuchuanshu();
		}
		else{
			shujuchuanshu();
			counter--;		
			du(counter);
			shujujiancha();
		}
	}
	var isInitEditor = false;
	function xianghou(){
		if(!isInitEditor && counter === 39) {
			editorInit("anwser1");
			isInitEditor = true;
		}
		if(counter>leg-7&&counter<leg){
			console.log(counter);
			counter++;	
			du(counter);
			shujuchuanshu();
		}
		else{
			shujuchuanshu();
			counter++;	
			du(counter);
			shujujiancha();
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
	
	var selectedtxt=document.querySelectorAll(".txt");
	var length=selectedtxt.length;
	for(var x=0; x<length;x++){
			selectedtxt[x].onclick=function(ev){
			$(this).prev().prop('checked',true);
		}
	}
	
	var obj2;
	ajax("GET","../api/discussForPaperOrderByQuestion",{
					"paperId":"[object Object]",
					"isSort":"true"
				},3000
				,function(xhr){
					console.log(xhr);
					    var s = JSON.parse(xhr.responseText);	
						obj2=s;
							console.log(obj);
				},function(xhr){
					alert(xhr.status+"连接失败");
				});
				
				
	function shujuchuanshu(){
		if($('input:radio[name="xuanze1"]:checked').val()!=null&&counter<=39)
		{
			a1[counter]=$('input:radio[name="xuanze1"]:checked').val();
		}
		else{
			a1[counter]=$("#anwser1").val();
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
	
	var Btntijiao=document.querySelector("#pingluntijiao");
	var pinglun=document.querySelector("#pinglun");
	Btntijiao.onclick=function(){
		/*ajax("POST","/api/discuss/commit",{
					"paperId":obj._id,
					"index": counter,
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
				});*/
		console.log(pinglun.value+"？"+names+"?"+counter);
		createText(localStorage.user);
	}
	var myDate = new Date();
	function createText(name){
		var $text = $(  
						"<div class=\"pinglunqu\">\n"+
				"	<div class=\"usernames\">"+name+":</div>\n"+
					"	<div class=\"pinglundehua\">"+pinglun.value+"</div>\n"+
				"	<div class=\"zancai\">"+"zan"+"&nbsp&nbsp&nbsp&nbsp"+"cai"+"</div>\n"+
				"	<div class=\"time\">"+myDate.toLocaleString()+"</div>\n"+
			"	</div>	")

		$(".commit").parent().append($text);
	}

	function editorInit(id) {
	var el = document.getElementById(id);
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
}

function initCodeHighlight() {
	var pres = document.querySelectorAll(".question-box pre")
	pres.forEach(function(pre) {
		hljs.highlightBlock(pre)
	})
}
}
