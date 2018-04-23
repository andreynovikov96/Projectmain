import {JetView} from "webix-jet";

export default class SettingsTable extends JetView{

	config(){

		const _ = this.app.getService("locale")._;

		let addButton = {
			view:"button",
			type:"icon",
			icon:"plus",
			width:200,
			click: ()=> this.add()
		};

		let dataTable = {
			view:"datatable",
			select:true,
			editable:true,
			autoConfig:true,
			editaction:"dblclick",
			columns:[
				{id:"Value", header:_("Value"), fillspace:true, editor:"text"},
				{id:"Icon", header:_("Icon"), fillspace:true, editor:"text"},
				{id:"trash", header:"", template:"<span class='webix_icon fa-trash'></span>", width:40}
			],
            
			onClick:{
				"fa-trash":(e,id)=>{
					webix.confirm({
						text: _("The data will be cleared. Continue?"),
						ok: _("Yes"),
						cancel: _("Cancel"),
						callback:(result)=>{
							if(result){
								this.delete(id);
							}
						}
					});
					return false;
				}
			}
		};
	
		return { 
			rows:[
				{
					cols:[
						{},
						addButton,
						{}
					]
				},
				dataTable,
			]
		};
	}
}