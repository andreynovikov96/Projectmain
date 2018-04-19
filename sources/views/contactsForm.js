import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {statuses} from "models/statuses";

export default class contactForm extends JetView{
	config(){
		const _ = this.app.getService("locale")._;

		let header = {
			view: "label", 
			id: "form:header",
			label:_("Edit contacts"),
			align:"center"
		};

		let form = {
			view:"form",
			elements: [
				{margin:40, cols: [
					{margin:10, rows:[
						{view:"text", label:_("First Name"), name:"FirstName", invalidMessage:"Please, enter your first name.", labelWidth:100},
						{view:"text", label:_("Last Name"), name:"LastName", invalidMessage:"Please, enter your last name.", labelWidth:100},
						{view:"datepicker", label:_("Joining date"), name:"DueDate", labelWidth:100},
						{view:"combo", label:_("Status"), name:"Status", labelWidth:100, options:{data:statuses, body:{template:"#Value#"}}},
						{view:"text", label:_("Job"), name:"Job", labelWidth:100},
						{view:"text", label:_("Company"), name:"Company", labelWidth:100},
						{view:"text", label:_("Website"), name:"Website", labelWidth:100},
						{view:"text", label:_("Address"), name:"Location", labelWidth:100},
						{}
					]},
					{margin:10, rows:[
						{view:"text", label:_("Email"), name:"Email",invalidMessage:"Wrong email.", labelWidth:100},
						{view:"text", label:_("Skype"), name:"Skype", labelWidth:100},
						{view:"text", label:_("Phone"), name:"Phone", labelWidth:100},
						{view:"text", label:_("Location"), name:"Address", labelWidth:100},
						{view:"datepicker", label:_("Birthday"), name:"Birthday", labelWidth:100},
						{template: "Place for user's photo", id: "photo"},
						{ 
							view:"uploader", 
							value:_("Upload image"),
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
						{view:"button", value:_("Delete photo"), click:() => 
						{
							$$("photo").setHTML("Place for user's photo");
						}},
						{}
					]}
				]},
				{cols: [
					{},
					{view:"button", label:_("Cancel"), type: "iconButton", icon: "ban", width:150, align:"right", click:() => {
						this.app.show("top/contacts");
					}},
					{view:"button", label:_("Save contact"), type: "iconButton", icon: "plus-square", width:150, align:"right",
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

		return {rows: [header, form]};
	}
	init(view){
		this.form = view.queryView({view:"form"});
	}
	urlChange(view) {
		contacts.waitData.then(() => {
			var id = this.getParam("id", true);
			if (id) {
				let data = contacts.getItem(id);
				view.queryView({view:"form"}).setValues(data);
			}
		});
	}
}