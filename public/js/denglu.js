window.onload = function (ev) {
	var checkFrom = new CheckForm({
		"#user": {
			req: "用户名不能为空",
			re: [/^[a-zA-Z0-9_-]{8,16}$/, "用户名必须是字母、数字和下划线组成，长度为8到16位"]
		},
		"#psw": {
			req: "密码不能为空",
			re: [/^[a-zA-Z0-9_-]{8,16}$/, "用户名必须是字母、数字和下划线组成，长度为8到16位"]
		}
	}, "#commit");
	checkFrom.initInputEvent("error-msg");
	checkFrom.initCommitEvent(function() {
		ajax("POST", "../api/login", {
			"username": $(".user").val(),
			"pwd": $(".psw").val()
		}, 3000 , function (xhr) {
				if (xhr.responseText) {
					alert("登录成功");
					window.location.href = 'homepage.html' + "?" + $(".user").val();
				}
				else {
					alert("登录失败");
				}
			}, function (xhr) {
				alert("404");
				console.log(xhr.responseText);
			});
	}); 
}