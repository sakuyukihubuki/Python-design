window.onload=function(ev){
	var str=window.location.href.split('?');
	var leixing=str[1];
		console.log(localStorage.shijuan);
	if(leixing='0'){
		ajax("GET","/api/answerForPaper",{
					"paperId":localStorage.shijuan,
				},3000
				,function(xhr){
						var s = JSON.parse(xhr.responseText);
					    console.log(s);
				},function(xhr){
					alert(xhr.status+"连接失败");
			});
	}
	else{
		ajax("GET","/api/answerForQuestionType",{
					"paperId":localStorage.shijuan,
				},3000
				,function(xhr){
						var s = JSON.parse(xhr.responseText);
					    console.log(s);
				},function(xhr){
					alert(xhr.status+"连接失败");
			});
	}
	
	
	function Processor(data) {
        this.data = data;
    }
    // 转化数组为html string
    Processor.prototype.toHtmlStr = function() {
        var resultStr = ""
        var arr = this.data;
        for (var i = 0, len = arr.length; i <len; i++) {
            var trData = arr[i];
            var trStr = "";
            var tdStr = "";
            var indexData = trData.index;
            var answerData = trData.answer;
            var correctData = trData.correct_answer;
            var answerClass = answerData === correctData ? "right" : "error";
            tdStr += "<td>" + indexData + "</td>";
            tdStr += "<td class='" + answerClass + "'>" + answerData + "</td>";
            tdStr += "<td>" + correctData + "</td>";
            if (i === 0) {
                trStr += "<tr class='active'>" + tdStr + "</tr>";
            }else {
                trStr += "<tr>" + tdStr + "</tr>";
            }
            resultStr += trStr;
        }
        this.htmlStr = resultStr;
        return this;
    }
    Processor.prototype.toHtml = function() {
        if (!this.htmlStr) {
            this.toHtmlStr();
        }
        this.html = $(this.htmlStr);
        return this;
    }
    Processor.prototype.appendTo = function(selector) {
        if (!this.html) {
            this.toHtml();
        }
        this.html.appendTo($(selector));
        return this;
    }
    var processor = new Processor([
       /* {
            index: 0,
            answer: 'A',
            correct_answer: 'C'
        },
        {
            index: 0,
            answer: 'A',
            correct_answer: 'C'
        },
        {
            index: 0,
            answer: 'A',
            correct_answer: 'C'
        },
        {
            index: 0,
            answer: 'A',
            correct_answer: 'C'
        },
        {
            index: 0,
            answer: 'A',
            correct_answer: 'C'
        },
        {
            index: 1,
            answer: 'C',
            correct_answer: 'C'
        },
        {
            index: 1,
            answer: 'C',
            correct_answer: 'C'
        },
        {
            index: 1,
            answer: 'C',
            correct_answer: 'C'
        },
        {
            index: 1,
            answer: 'C',
            correct_answer: 'C'
        },
        {
            index: 1,
            answer: 'C',
            correct_answer: 'C'
        }*/
    ]);
    processor.appendTo('tbody');
}