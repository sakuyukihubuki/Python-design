window.onload=function(ev){
	window.number=0;
	window.obj;
	var str=window.location.href.split('?');
	var res=str[1];
	
	var username = document.querySelector("#username");
	username.innerHTML=localStorage.user;	ajax("GET","../api/paperList",{},3000
				,function(xhr){
					console.log(xhr.responseText);
						var s=JSON.parse(xhr.responseText);
						$.each(s.result,function(key,value){
							obj=eval("("+xhr.responseText+")");
							console.log(obj.result[0].name);
							createText(number);
							number++;
						})
						
				},function(xhr){
					alert(xhr.status+"连接失败");
				});
	
	function createText(number){
		var $text = $("<div class=\"contextdiv\">\n"+
				"	<ol>\n"+
					"	<li class=\"contextli\" id="+number+"\_a\>"+obj.result[number].name+"</li>\n"+
					"	<li class=\"contextdanxuan\" id="+number+"\_b\>单选题</li>\n"+
					"	<li class=\"contextli\" id="+number+"\_c\>基础编程题</li>\n"+
					"	<li class=\"contextli\" id="+number+"\_d\>编程题</li>\n"+
				"	<ol>\n"+
			"	</div>	")

		$(".context").append($text);
	}
	var Btntixing=document.querySelector("#tixing");
	var Btntixing2=document.querySelector("#tixing2");
	Btntixing.onclick=function(event){
		localStorage.tixing='e';
	}
	Btntixing2.onclick=function(event){
		localStorage.tixing='f';

	}
	$(".context").delegate("li","click",function(){
		var tiqu=this.id.split('_');
		var tiqu1=tiqu[0];
		var tiqu2 =tiqu[1];
		console.log(tiqu1+tiqu2);
		localStorage.timu=tiqu1;
		localStorage.tixing=tiqu2;
		window.location.href="danxuan.html"+'?'+obj.result[tiqu1]._id;

	})
	
}
