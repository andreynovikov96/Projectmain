import {JetView} from "webix-jet";
import {activitytypes} from "models/activitytypes";

export default class TypeWindowView extends JetView{
	config(){
		const _ = this.app.getService("locale")._;

		let form = {
			view:"form",
			elements: [ {
				rows: [
					{view:"text", label:_("Value"), name:"Value"},
					{view:"text", label:_("Icon"), name:"Icon"},
					{
						cols:[
							{
								view:"button",
								name:"buttonType",
								label:_("Add"),
								click: () => {
									if( this.form.validate() ){
										let values = this.form.getValues();

										values.Value = values.Value.replace(/<.*?>/g, "");

										if(values.id && activitytypes.exists(values.id)){
											activitytypes.updateItem(values.id, values);
										} else{
											activitytypes.add(values);
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
				Value:webix.rules.isNotEmpty,
				Icon:webix.rules.isNotEmpty
			}
		};

		let winType = {
			view:"window",
			position:"center",
			width:400,
			body: form,
			head: _("Add type")
		};
		return winType;
	}
	init(view) {
		const _ = this.app.getService("locale")._;

		this.form = view.queryView({view:"form"});

		this.on(this.app, "onSettingType", (data) =>{
			this.form.setValues(data);
			view.getHead().setHTML(_("Edit type"));
			view.queryView({name:"buttonType"}).setValue(_("Save"));
		});

		this.on(view, "onHide", () =>{
			this.form.clear();
			this.form.clearValidation();
			view.getHead().setHTML(_("Add type"));
			view.queryView({name:"buttonType"}).setValue(_("Add"));
		});
	}
	showWindow() {
		this.getRoot().show();
	}
	
}