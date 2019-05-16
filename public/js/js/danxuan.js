window.onload=function(ev){
	window.counter=0;
	var a1=new Array();
	function zairu(counter){
		$.ajax({
					type:"get",
					url:"../php/question.php",
					success:function(xhr){
						var s=eval("("+xhr+")");
						console.log(s.question1[0]);	
						duiwei(s.question1[counter].timu,s.question1[counter].A,s.question1[counter].B,s.question1[counter].C,s.question1[counter].D);
					},
					error:function(xhr){
						alert(xhr.status+"连接失败");
					}
			})
	}
	zairu(counter);
	
	function duiwei(timu,ar,br,cr,dr){
		var no = document.querySelector("#no");
		var a = document.querySelector("#A");
		var b = document.querySelector("#B");
		var c = document.querySelector("#C");
		var d = document.querySelector("#D");
		ccount=counter+1;
		no.innerHTML="&nbsp&nbsp&nbsp&nbsp"+ccount+"."+timu;
		a.innerHTML=ar;
		b.innerHTML=br;
		c.innerHTML=cr;
		d.innerHTML=dr;
	}
	
	var Btnbefore=document.querySelector("#before");
	var Btnafter=document.querySelector("#after");
	Btnbefore.onclick=function(event){
		if(counter<1){
			alert("已经是第一题了！");
			counter=0;
		}
		else{
			a1.pop();
			shujuchuanshu();
			counter--;
			zairu(counter);
			qingchuxuanze();
		}
	}
	Btnafter.onclick=function(event){
		if(counter>=1){
			alert("已完成答题 ");
		}
		else{
			shujuchuanshu();
			counter++;	
			zairu(counter);
			qingchuxuanze();
		}
	}
	
	var selectedtxt=document.querySelectorAll(".txt");
	var length=selectedtxt.length;
	for(var x=0; x<length;x++){
		selectedtxt[x].onclick=function(ev){
		$(this).prev().prop('checked',true);
	}
	}

	function shujuchuanshu(){
		var val=$('input:radio[name="xuanze1"]:checked').val();
		if(val==null){
			val=" ";
		}
		a1.push(val);
		console.log(a1);
	}
	var selected=document.querySelectorAll(".xuanxiang");
	function qingchuxuanze(){
		for(var x=0; x<length;x++){
			selected[x].checked=false;
		}
	}
}
