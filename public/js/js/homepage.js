window.onload=function(ev){
	$.ajax({
					type:"get",
					url:"../php/text.php",
					success:function(xhr){
						var s=eval("("+xhr+")");
						
						$.each(s.shijuan,function(key,value){
							var number=$(this)[0].no;
							createText(number);
						})
					},
					error:function(xhr){
						alert(xhr.status+"连接失败");
					}
			})
	
	function createText(number){
		var $text = $("<div class=\"contextdiv\">\n"+
				"	<ol>\n"+
					"	<li class=\"contextli\">2018年试题</li>\n"+
					"	<li class=\"contextdanxuan\" id="+number+">单选题</li>\n"+
					"	<li class=\"contextli\">判断题</li>\n"+
					"	<li class=\"contextli\">编程题</li>\n"+
				"	<ol>\n"+
			"	</div>	")

		$(".context").append($text);
	}

	
	$(".context").delegate(".contextdanxuan","click",function(){
		console.log($(this).attr('id'));
	})
}
