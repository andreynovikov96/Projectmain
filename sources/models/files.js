export const files = new webix.DataCollection({ 
	data:[
		{id:1, name:"file1.pdf", lastModifiedDate:"01-01-2001", size:"1", ContactID:"1"},
		{id:2, name:"file2.pdf", lastModifiedDate:"02-02-2002", size:"2", ContactID:"2"},
		{id:3, name:"file3.pdf", lastModifiedDate:"03-03-2003", size:"3", ContactID:"3"}
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