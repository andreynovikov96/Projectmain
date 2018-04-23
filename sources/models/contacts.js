import {deleteActivity} from "models/activities";
import {deleteFile} from "models/files";

export const contacts = new webix.DataCollection({ 
	url:"http://localhost:8096/api/v1/contacts/",
	save:"rest->http://localhost:8096/api/v1/contacts/",
	scheme:{
		$change:(obj) =>{
			obj.value = `${obj.FirstName} ${obj.LastName}`;
			let parser = webix.Date.strToDate("%d-%m-%Y");
			obj.Birthday = parser(obj.Birthday);
			obj.StartDate = parser(obj.StartDate);
		},
		$save:(obj) =>{
			let format = webix.Date.dateToStr("%d-%m-%Y");
			obj.Birthday = format(obj.Birthday);
			obj.StartDate = format(obj.StartDate);
		}
	},
	on:{
		onAfterDelete:(id) =>{
			deleteActivity(id);
			deleteFile(id);
		}
	}
});