import {JetView} from "webix-jet";
//import {contacts} from "models/contacts";
import {statuses} from "models/statuses";

export default class contactForm extends JetView{
	config(){
		let header = {
			view: "template", 
			template:"Edit contacts",
			type:"header"
		};

		let form = {
			view:"form",
			elements: [
				{cols: [
					{rows:[
						{view:"text", label:"First Name", name:"FirstName", labelWidth:100},
						{view:"text", label:"Last Name", name:"LastName", labelWidth:100},
						{view:"datepicker", label:"Joining date", name:"DueDate", labelWidth:100},
						{view:"combo", label:"Status", name:"Status", labelWidth:100, options:{ data:statuses, body:{ template:"#Value#"}}},
						{view:"text", label:"Job", name:"Job", labelWidth:100},
						{view:"text", label:"Company", name:"Company", labelWidth:100},
						{view:"text", label:"Website", name:"Website", labelWidth:100},
						{view:"text", label:"Address", name:"Location", labelWidth:100},
						{}
					]},
					{width:40},
					{rows:[
						{view:"text", label:"Email", name:"Email", labelWidth:100},
						{view:"text", label:"Skype", name:"Skype", labelWidth:100},
						{view:"text", label:"Phone", name:"Phone", labelWidth:100},
						{view:"datepicker", label:"Birthday", name:"Birthday", labelWidth:100},
						{view:"button", value:"Change photo", labelWidth:100},
						{view:"button", value:"Delete photo", labelWidth:100},
						{}
						
					]}
				]}
			]

		};

		return {rows: [header, form]};
	}
/* 	urlChange(view) {
		contacts.waitData.then(() => {
			var id = this.getParam("id");
			if (id) {
				let data = contacts.getItem(id);
				view.queryView({view:"form"}).setValues(data);
			}
		});
	} */
}