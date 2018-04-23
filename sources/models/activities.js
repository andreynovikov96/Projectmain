export const activities =  new webix.DataCollection({
	url:"http://localhost:8096/api/v1/activities/",
	save:"rest->http://localhost:8096/api/v1/activities/",
	scheme:{
		$init:(obj) =>{
			let parser = webix.Date.strToDate("%d-%m-%Y");
			obj.DueDate = parser(obj.DueDate);
		},
		$save:(obj) =>{
			let format = webix.Date.dateToStr("%d-%m-%Y");
			obj.DueDate = format(obj.DueDate);
		}
	}
});

export function deleteActivity(id) {
	activities.data.each((obj) =>{
		if( obj.ContactID == id)
			activities.remove(obj.id);
	});