window.onload=function(ev){
			var oBtn=document.querySelector("button");
			oBtn.onclick=function(ev1){
				var text=document.querySelector(".psw");
				var patt=/^[a-z0-9A-Z\.]+$/;
			if(patt.test(text.value))
			{
				ajax("POST","../api/login",{
					"username":$(".user").val(),
					"pwd":$(".psw").val()
				},3000
				,function(xhr){
					if(xhr.responseText){
							alert("登录成功");
							window.location.href='homepage.html'+"?"+$(".user").val();
						}
						else{
							alert("登录失败");
						}
				},function(xhr){
					alert("404");
					console.log(xhr.responseText);
				});
			}
			}
		}