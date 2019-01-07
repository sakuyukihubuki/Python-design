window.onload=function(){
	var app=new Vue({
		el:"#app",
		data:{
			name:'试卷1',
			type1:'单选',
			type2:'双选',
			type3:'填空',
			type4:'编程',
		}
	});
	Vue.component('biao',{
		template:''
	})
	var xuanze=new Vue({
		el:"#xuanze",
		data:{
			no:1,
			question:null,
			txt1:null,
			txt2:null,
			txt3:null,
			txt4:null,
		}
	})
}
