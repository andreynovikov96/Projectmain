import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView{
	config(){

		var header = {
			type:"header", template:"My Project"
		};

		var menu = {
			view:"menu", 
			id:"menu", 
			width:180, 
			layout:"y", 
			select:true,
			template:"<span class='webix_icon fa-#icon#'></span> #value# ",
			data:[
				{ value:"Contacts", id:"contacts", icon:"users"},
				{ value:"Activities", id:"activities", icon:"calendar" },
				{ value:"Settings", id:"settings", icon:"cog"}
			]
		};

		var ui = {
			type:"line", cols:[
				{ type:"clean", css:"app-left-panel",
					padding:10, margin:20, borderless:true, rows: [ header, menu ]},
				{ rows:[ 
					{ height:10}, 
					{ type:"clean", css:"app-right-panel", padding:4, rows:[
						{ $subview:true } 
					]}
				]}
			]
		};
		return ui;
	}
	init(){
		this.use(plugins.Menu, "menu");
	}
}