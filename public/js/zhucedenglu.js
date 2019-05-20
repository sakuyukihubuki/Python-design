window.onload = function (ev) {
	var checkForm = new CheckForm({
		"#user": {
			req: "用户名不能为空",
			re: [/^[a-zA-Z0-9_-]{8,16}$/, "用户名必须是字母、数字和下划线组成，长度为8到16位"]
		},
		"#pwd": {
			req: "密码不能为空",
			re: [/^[a-zA-Z0-9_-]{8,16}$/, "密码必须是字母、数字和下划线组成，长度为8到16位"]
		},
		"#email": {
			req: "邮箱不能为空",
			re: [/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, "邮箱格式不对"]
		},
		"#sex": {
			req: "没有选择性别"
		}
	}, "#commit");
	checkForm.initInputEvent("error-msg");
	checkForm.initCommitEvent(function () {
		ajax("POST", "../api/register ", {
			"username": $(".user").val(),
			"pwd": $(".psw").val()
		}, 3000
			, function (xhr) {
				if (xhr.responseText == "0") {
					alert("用户名为空！");

				}
				else if (xhr.responseText == "1") {
					alert("密码为空！");
				}
				else if (xhr.responseText == "2") {
					alert("用户已存在！");
				}
				else if (xhr.responseText) {
					alert("注册成功");
					window.location.href = 'denglu.html';
				}
				else if (!xhr.responseText) {
					alert("注册失败");
				}
			}, function (xhr) {
				alert("shibai");
			});
	});
}