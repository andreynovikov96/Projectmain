import {JetView} from "webix-jet";
import {statuses} from "models/statuses";
import {activitytypes} from "models/activitytypes";
import StatusView from "views/settingsStatus";
import TypeView from "views/settingsType";

export default class settingsView extends JetView{
	config(){
		const _ = this.app.getService("locale")._;

		let Language = {
			rows:[
				{ template:_("Settings"), type:"header"},
				{ name:"lang", optionWidth: 120, view:"segmented", label: _("Language"), options:[
					{ id:"en", value:_("English")},
					{ id:"ru", value:_("Russian")}
				], click:() => this.toggleLanguage()},
				{}
			]
		};

		let tableStatus = {
			rows: [
				{
					view: "datatable", 
					id: "tableStatuses",
					borderless:true,
					select:true,
					scrollX: false,
					columns: [
						{id: "Value", header: [_("Value"), {content: "selectFilter"}], sort: "text", fillspace:true},
						{id: "Icon", header: [_("Icon"), {content: "selectFilter"}], sort: "text", template: "<span class='webix_icon fa-#Icon#'></span>"},
						{template:"{common.editIcon()}", width:50},
						{template:"{common.trashIcon()}", width:50}	
					],
					onClick:{
						"fa-trash":(ev, id) => {
							webix.confirm ({
								text: _("The data will be cleared. Continue?"),
								ok: _("Yes"),
								cancel: _("Cancel"),
								callback: (result) => {
									if (result) {
										statuses.remove(id);
									}
								}
							});
						},
						"fa-pencil": (e, id) => {
							this.StatusView.showWindow(id);
							this.app.callEvent("onSettingStatus", [this.$$("tableStatuses").getItem(id)]);
						}
					}
				},
				{
					view:"button", 
					label:_("Add status"),
					type:"iconButton",
					icon:"plus-square",  
					inputWidth:180,
					align:"right",
					click:() => {
						this.StatusView.showWindow();
					}
				}
			]
		};

		let tableType = {
			rows: [
				{
					view: "datatable", 
					id: "tableTypes",
					borderless:true,
					select:true,
					scrollX: false,
					columns: [
						{id: "Value", header: [_("Value"), {content: "selectFilter"}], sort: "text", fillspace:true},
						{id: "Icon", header: [_("Icon"), {content: "selectFilter"}], sort: "text", template: "<span class='webix_icon fa-#Icon#'></span>"},
						{template:"{common.editIcon()}", width:50},
						{template:"{common.trashIcon()}", width:50}
					],
					onClick:{
						"fa-trash":(ev, id) => {
							webix.confirm ({
								text: _("The data will be cleared. Continue?"),
								ok: _("Yes"),
								cancel: _("Cancel"),
								callback: (result) => {
									if (result) {
										activitytypes.remove(id);
									}
								}
							});
						},
						"fa-pencil": (e, id) => {
							this.TypeView.showWindow(id);
							this.app.callEvent("onSettingType", [this.$$("tableTypes").getItem(id)]);
						}
					}
				},
				{
					view:"button", 
					label:_("Add type"),
					type:"iconButton",
					icon:"plus-square",  
					inputWidth:180,
					align:"right",
					click:() => {
						this.TypeView.showWindow();
					}
				}
			]
		};
				
		return {
			rows:[Language, 
				{cols: [tableStatus, tableType]}
			]
		};

	}
	init() {
		$$("tableStatuses").parse(statuses);
		$$("tableTypes").parse(activitytypes);
		
		this.StatusView= this.ui(StatusView);
		this.TypeView = this.ui(TypeView);
	}
	toggleLanguage(){
		const langs = this.app.getService("locale");
		const value = this.getRoot().queryView({ name:"lang" }).getValue();
		langs.setLang(value);
	}
}