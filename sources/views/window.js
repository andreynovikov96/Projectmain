import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {activitytypes} from "models/activitytypes";
import {activities} from "models/activities";

export default class WindowView extends JetView{
	config(){
		const _ = this.app.getService("locale")._;

		let form = {
			view:"form",
			elements: [ {
				rows: [
					{view:"textarea", label:_("Details"), height:150, name:"Details"},
					{view:"combo", label:_("Type"), name:"TypeID", invalidMessage:"Can’t be empty!", options:{data:activitytypes, body:{template:"#Value#"}}},
					{view:"combo", label:_("Contact"), name:"ContactID", invalidMessage:"Can’t be empty!", options:{data:contacts, body:{template:"#FirstName# #LastName#"}}},
					{cols:[
						{view:"datepicker", label:_("Date"), name:"DueDate"},
						{view:"datepicker", label:_("Time"), type:"time", name:"Time"}
					]
					},
					{view:"checkbox", label:_("Completed"), labelWidth:110, name:"State", uncheckValue:"Open", checkValue:"Close"},
					{
						cols:[
							{
								view:"button",
								name:"buttonAddSave",
								label:_("Add"),
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
							{view:"button", label:_("Cancel"), click:() => this.getRoot().hide()
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
			position:"center",
			width:550,
			body: form,
			head: _("Add activity")
		};
		return win;
	}
	init(view) {
		const _ = this.app.getService("locale")._;

		this.form = view.queryView({view:"form"});

		this.on(view, "onHide", () =>{
			this.form.clear();
			this.form.clearValidation();
			view.getHead().setHTML(_("Add activity"));
			view.queryView({name:"buttonAddSave"}).setValue(_("Add"));
		});
	}
	showWindow(data, edit, readOnly) {
		const _ = this.app.getService("locale")._;
		
		this.form.setValues(data);
		if(edit){
			this.getRoot().getHead().setHTML(_("Edit activity"));
			this.getRoot().queryView({name:"buttonAddSave"}).setValue(_("Save"));
		}
		if (readOnly){
			this.getRoot().queryView({name:"ContactID"}).disable();  
		}
		this.getRoot().show();
	}
}