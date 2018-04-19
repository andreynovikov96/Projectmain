export const files = new webix.DataCollection({ 
	data:[
		{id:1, Name:"file1.pdf", ChangeDate:"01-01-2001", Size:"1", ContactID:"1"},
		{id:2, Name:"file2.pdf", ChangeDate:"02-02-2002", Size:"2", ContactID:"2"},
		{id:3, Name:"file3.pdf", ChangeDate:"03-03-2003", Size:"3", ContactID:"3"}
	],
	scheme:{
		$init:(obj) =>{
			let parser = webix.Date.strToDate("%d-%m-%Y");
			obj.ChangeDate = parser(obj.ChangeDate);
		},
		$save:(obj) =>{
			let format = webix.Date.dateToStr("%d-%m-%Y");
			obj.ChangeDate = format(obj.ChangeDate);
		}
	}
});