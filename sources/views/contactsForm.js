import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {statuses} from "models/statuses";

export default class contactForm extends JetView{
	config(){

		let form = {
			view:"form",
			elements: [
				{view:"template", template:"", borderless:true, height:40, name:"labelForm"},
				{margin:40, cols: [
					{margin:10, rows:[
						{view:"text", label:"First Name", name:"FirstName", invalidMessage:"Please, enter your first name.", labelWidth:100},
						{view:"text", label:"Last Name", name:"LastName", invalidMessage:"Please, enter your last name.", labelWidth:100},
						{view:"datepicker", label:"Joining date", name:"StartDate", labelWidth:100},
						{view:"combo", label:"Status", name:"Status", labelWidth:100, options:{data:statuses, body:{template:"#Value#"}}},
						{view:"text", label:"Job", name:"Job", labelWidth:100},
						{view:"text", label:"Company", name:"Company", labelWidth:100},
						{view:"text", label:"Website", name:"Website", labelWidth:100},
						{view:"text", label:"Address", name:"Location", labelWidth:100},
						{}
					]},
					{margin:10, rows:[
						{view:"text", label:"Email", name:"Email",invalidMessage:"Wrong email.", labelWidth:100},
						{view:"text", label:"Skype", name:"Skype", labelWidth:100},
						{view:"text", label:"Phone", name:"Phone", labelWidth:100},
						{view:"text", label:"Location", name:"Address", labelWidth:100},
						{view:"datepicker", label:"Birthday", name:"Birthday", labelWidth:100},
						{template: "Place for user's photo", id: "photo"},
						{ 
							view:"uploader", 
							value:"Upload image",
							accept:"image/jpg, image/png",       
							autosend:false, 
							multiple:false,
							on: {
								onBeforeFileAdd(file) {
									let reader = new FileReader();
									reader.onload = (event) => {
										let url = event.target.result;
										$$("photo").setHTML(`<img class='contactsFormImg' src='${url}'></img>`);
									};
									reader.readAsDataURL(file.file);
									return false;
								}
							}
						}, 
						{view:"button", value:"Delete photo", click:() => 
						{
							$$("photo").setHTML("Place for user's photo");
						}},
						{}
					]}
				]},
				{cols: [
					{},
					{view:"button", label:"Cancel",  width:100, align:"right", click:() => {
						this.app.show("top/contacts");
					}},
					{view:"button", name:"buttonSaveAdd", width:100, align:"right",
						click: () => {
							if( this.form.validate() ){
								let values = this.form.getValues();
								if(values.id){
									contacts.updateItem(values.id, values);
								} else{
									contacts.add(values);
								}
								this.app.show("top/contacts");
							}
						},
						on:{
							onHide () {
								this.clear();
								this.clearValidation();
							}
						}
					}
				]}
			],
			rules:{
				"FirstName":webix.rules.isNotEmpty,
				"LastName":webix.rules.isNotEmpty,
				"Email":webix.rules.isEmail
			}
		};

		return {rows: [form]};
	}
	init(view){
		this.form = view.queryView({view:"form"});
	}
	urlChange(view) {
		contacts.waitData.then(() => {
			var id = this.getParam("id", true);
			if (id && id !== "new") {
				let data = contacts.getItem(id);
				this.form.setValues(data);
				view.queryView({name:"labelForm"}).setHTML("Edit contact");
				view.queryView({name:"buttonSaveAdd"}).setValue("Save");
			}
			else {
				view.queryView({name:"labelForm"}).setHTML("Add contact");
				view.queryView({name:"buttonSaveAdd"}).setValue("Add"); 
			}
		});
	}
}