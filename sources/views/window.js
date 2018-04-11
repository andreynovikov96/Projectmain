import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {activitytypes} from "models/activitytypes";
import {activities} from "models/activities";

export default class WindowView extends JetView{
	config(){
		let form = {
			view:"form",
			elements: [ {
				rows: [
					{view:"textarea", label:"Details", height:150, name:"Details"},
					{view:"combo", label:"Type", name:"TypeID", options:{data:activitytypes, body:{template:"#Value#"}}},
					{view:"combo", label:"Contact", name:"ContactID", options:{data:contacts, body:{template:"#FirstName#"}}},
					{cols:[
						{view:"datepicker", label:"Date", name:"DueDate"},
						{view:"datepicker", label:"Time", type:"time", name:"Time"}
					]
					},
					{view:"checkbox", label:"Completed"},
					{
						cols:[
							{
								view:"button", 
								label:"Save",
								click: () => {
									let values = this.getRoot().queryView({view:"form"}).getValues();
									this.app.callEvent("onFormSave", [values]);
									activities.add(values);
									this.$$("popup").hide();
								}
							},
							/* {
								view:"button", 
								label:"Save",
								click: () => { 
									let values = this.$$("form").getValues();
									values.Details=values.Details.replace(/<.*?>/g, "");
									//if(!values.validate())return false;
									if(!values.ContactID || !values.TypeID) {
										webix.alert("Please, fill in the form");
										return false;
									}
									if(values.id){
										activities.updateItem(values.id, values);
										this.$$("popup").hide();
									} else{
										activities.add(values);
										this.$$("popup").hide();
									}
								}
							}, */
							{view:"button", label:"Cancel", click:() => this.$$("popup").hide()},
						]
					}
				]
			}
			]
		};

		let win = {
			view:"window",
			id:"popup",
			position:"center",
			width:550,
			body: form,
			head: {template:"Add activity"}
		};
		return win;
	}
	init(view) {
		this.on(this.app, "dataActivityEdit", (data) => {
			if (data) {
				view.queryView({view:"form"}).setValues(data);
			}
		});		
	}
	showWindow() {
		this.getRoot().show();
	}
	
}