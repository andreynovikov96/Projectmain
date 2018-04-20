import {JetView} from "webix-jet";
import {statuses} from "models/statuses";

export default class StatusWindowView extends JetView{
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
								name:"buttonStatus",
								label:_("Add"),
								click: () => {
									if( this.form.validate() ){
										let values = this.form.getValues();

										values.Value = values.Value.replace(/<.*?>/g, "");

										if(values.id && statuses.exists(values.id)){
											statuses.updateItem(values.id, values);
										} else{
											statuses.add(values);
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

		let winStatus = {
			view:"window",
			position:"center",
			width:400,
			body: form,
			head: _("Add status")
		};
		return winStatus;
	}
	init(view) {
		const _ = this.app.getService("locale")._;

		this.form = view.queryView({view:"form"});

		this.on(this.app, "onSettingStatus", (data) =>{
			this.form.setValues(data);
			view.getHead().setHTML(_("Edit status"));
			view.queryView({name:"buttonStatus"}).setValue(_("Save"));
		});

		this.on(view, "onHide", () =>{
			this.form.clear();
			this.form.clearValidation();
			view.getHead().setHTML(_("Add status"));
			view.queryView({name:"buttonStatus"}).setValue(_("Add"));
		});
	}
	showWindow() {
		this.getRoot().show();
	}
	
}