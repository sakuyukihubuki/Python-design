window.onload=function(ev){
			var oBtn=document.querySelector("button");
			oBtn.onclick=function(ev1){
				var text=document.querySelector(".psw");
				var patt=/^[a-z0-9A-Z\.]+$/;
			if(patt.test(text.value))
			{
				ajax("POST","../api/longin",{
					"username":$(".user").val(),
					"pwd":$(".psw").val()
				},3000
				,function(xhr){
					if(xhr.responseText){
							alert("登录成功");
						}
						else{
							alert("登录失败");
						}
				},function(xhr){
					alert("404");
				});
			}
			}
		}