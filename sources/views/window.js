import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {activitytypes} from "models/activitytypes";
import {activities} from "models/activities";

export default class WindowView extends JetView{
	config(){
		let form = {
			view:"form",
			id:"form",
			elements: [ {
				rows: [
					{view:"textarea", label:"Details", height:150, name:"Details"},
					{view:"combo", label:"Type", name:"TypeID", invalidMessage:"Can’t be empty!", options:{data:activitytypes, body:{template:"#Value#"}}},
					{view:"combo", label:"Contact", name:"ContactID", invalidMessage:"Can’t be empty!", options:{data:contacts, body:{template:"#FirstName# #LastName#"}}},
					{cols:[
						{view:"datepicker", label:"Date", name:"DueDate"},
						{view:"datepicker", label:"Time", type:"time", name:"Time"}
					]
					},
					{view:"checkbox", label:"Completed", name:"State", uncheckValue:"Open", checkValue:"Close"},
					{
						cols:[
							{
								view:"button",
								id:"buttonAddSave",
								label:"Add",
								click: () => {
									if( this.form.validate() ){
										let values = this.form.getValues();

										values.Details = values.Details.replace(/<.*?>/g, "");

										if(values.id && activities.exists(values.id)){
											activities.updateItem(values.id, values);
										} else{
											activities.add(values);
										}
										this.getRoot().hide();
									}
								}
							},
							{view:"button", label:"Cancel", click:() => this.getRoot().hide()
							},
						]
					}
				]
			}
			],
			rules:{
				TypeID:webix.rules.isNotEmpty,
				ContactID:webix.rules.isNotEmpty
			}
		};

		let win = {
			view:"window",
			id:"popup",
			position:"center",
			width:550,
			body: form,
			head: "Add activity"
		};
		return win;
	}
	init(view) {
		this.form = this.$$("form");

		this.on(this.app, "onActivityEdit", (data) =>{
			this.form.setValues(data);
			view.getHead().setHTML("Edit activity");
			this.$$("buttonAddSave").setValue("Save");
		});

		this.on(view, "onHide", () =>{
			this.form.clear();
			this.form.clearValidation();
			view.getHead().setHTML("Add activity");
			this.buttonAS.setValue("Add");
		});
	}
	showWindow() {
		this.getRoot().show();
	}
	
}