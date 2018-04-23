import {JetView} from "webix-jet";
import tableStatus from "views/settingsStatus";
import tableType from "views/settingsType";

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
		
		return {
			rows:[Language, 
				{cols: [tableStatus, tableType]}
			]
		};

	}
	toggleLanguage(){
		const langs = this.app.getService("locale");
		const value = this.getRoot().queryView({ name:"lang" }).getValue();
		langs.setLang(value);
	}
}