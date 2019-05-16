window.onload=function(ev){
			var oBtn=document.querySelector("button");
			oBtn.onclick=function(ev1){
				var text=document.querySelector(".psw");
				var patt=/^[a-z0-9A-Z\.]+$/;
			if(patt.test(text.value))
			{
				ajax("POST","../api/register ",{
					"username":$(".user").val(),
					"pwd":$(".psw").val()
				},3000
				,function(xhr){
					if(xhr.responseText=="0"){
							alert("用户名为空！");
							
						}
						else if(xhr.responseText=="1"){
							alert("密码为空！");
						}
						else if(xhr.responseText=="2"){
							alert("用户已存在！");
						}
						else if(xhr.responseText){
							alert("注册成功");
							window.location.href='denglu.html';
						}
						else if(!xhr.responseText){
							alert("注册失败");
						}
				},function(xhr){
					alert("shibai");
				});
			}
				

				/*ajax({
					type:"post",
					url:"../api/register",
					dataType:"json",
					data:{
						username:$(".user").value,
						pwd:$(".psw").value
					},
					success:function(xhr){
						if(xhr.responseText=="0"){
							alert("用户名为空！");
						}
						else if(xhr.responseText=="1"){
							alert("密码为空！");
						}
						else if(xhr.responseText=="2"){
							alert("用户已存在！");
						}
						else if(xhr.responseText){
							alert("注册成功");
						}
						else if(!xhr.responseText){
							alert("注册失败");
						}
					},
					error:function(xhr){
						console.log(xhr.status);
					}
				})*/
			}
		}