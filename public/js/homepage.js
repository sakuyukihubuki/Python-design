window.onload=function(ev){
	window.number=0;
	window.obj;
	var str=window.location.href.split('?');
	var res=str[1];
	
	var username = document.querySelector("#username");
	username.innerHTML=res;	ajax("GET","../api/paperList",{},3000
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
					"	<li class=\"contextli\">"+obj.result[number].name+"</li>\n"+
					"	<li class=\"contextdanxuan\" id="+number+">单选题</li>\n"+
					"	<li class=\"contextli\">基础编程题</li>\n"+
					"	<li class=\"contextli\">编程题</li>\n"+
				"	<ol>\n"+
			"	</div>	")

		$(".context").append($text);
	}

	
	$(".context").delegate(".contextdanxuan","click",function(){
		window.location.href="danxuan.html"+'?'+obj.result[this.id]._id;
	})
}
