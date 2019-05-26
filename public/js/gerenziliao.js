window.onload = function() {
    var btn = document.getElementById("bianji");
    var spanMem = {
        username: document.getElementById("username"),
        pwd: document.getElementById("pwd"),
        email: document.getElementById("email"),
        sex: document.getElementById("sex"),
        birthday: document.getElementById("birthday")
    }
    var inputMem = {};
    var isEdit = false;
    btn.addEventListener("click", function() {
        var key, spanTextObj = {};
        isEdit = !isEdit;
        if(isEdit) {
            btn.innerText = "确定";
            for (key in spanMem) {
                switchToInput(spanMem[key]);
            }
        }else {
            btn.innerText = "编辑";
            for (key in inputMem) {
                switchToSpan(inputMem[key]);
                spanTextObj[key] = spanMem[key].innerText;
            }
            $.ajax({
                url: "/api/rewriteUser",
                data: spanTextObj,
                success: function(data) {
                    console.log(data);
                },
                error: function() {

                }
            })
        }
    });
    function switchToInput(el, givenId) {
        switchEl(el, givenId, inputMem, "input");
    }
    function switchToSpan(el, givenId) {
        switchEl(el, givenId, spanMem, "span");
    }
    function switchEl(el, givenId, mem, tag) {
        var id = givenId || el.id;
        var targetEl = mem[id];
        if(!targetEl) {
            targetEl = document.createElement(tag);
            targetEl.id = id;
            mem[id] = targetEl;
        }
        if (tag === 'input') {
            targetEl.value = el.innerText;
        }else {
            targetEl.innerText = el.value;
        }
        el.parentNode.appendChild(targetEl);
        el.parentNode.removeChild(el);
    }
};