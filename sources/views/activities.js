import {JetView} from "webix-jet";
import {activities} from "models/activities";
import {activitytypes} from "models/activitytypes";
import {contacts} from "models/contacts";
import WindowView from "views/window";

export default class ActivityView extends JetView{
	config(){
		
		let segmented = {
			view:"segmented",
			inputWidth:700,
			options: [
				{"id":"allView", "value":"All"},
				{"id":"overdue", "value":"Overdue"},
				{"id":"completed", "value":"Completed"},
				{"id":"today", "value":"Today"},
				{"id":"tomorrow", "value":"Tomorrow"},
				{"id":"week", "value":"This week"},
				{"id":"month", "value":"This month"}
			]
		};

		let button = {
			view:"button", 
			width:150, 
			label:"Add activity",
			type:"iconButton", 
			icon:"plus-square", 
			click:() => {
				this._jetPopup.showWindow({}, false, false);
			}
		};

		let table = {     
			view: "datatable", 
			select:true,
			scrollX: false,
			columns:[
				{id:"State", header:"", template:"{common.checkbox()}", uncheckValue:"Open", checkValue:"Close", width:50},
				{id:"TypeID", header:["Activity type", {content:"selectFilter"}], sort:"text", collection:activitytypes, width:200},
				{id:"DueDate", header:["Due Date", {content:"datepickerFilter"}], sort:"date", format:webix.i18n.dateFormatStr},
				{id:"Details", header:["Details", {content:"textFilter"}], fillspace:true, sort:"string"},
				{id:"ContactID", header:["Contact", {content:"selectFilter"}], sort:"text", collection:contacts, width:200},
				{template:"{common.editIcon()}", width:50},
				{template:"{common.trashIcon()}", width:50}
			],
			onClick:{
				"fa-trash":(ev, id) => {
					webix.confirm ({
						text: "The data will be cleared. Continue?",
						callback:(result) => {
							if (result) {
								activities.remove(id);
							}
						}
					});
					return false;
				},
				"fa-pencil": (e, id) => {
					this._jetPopup.showWindow(this.table.getItem(id), true, false);
					return false;
				}
			}
		};  

		return {
			rows:[
				{cols:[segmented, button]},
				table
			]
		};
	}

	init(view){
		this.table = view.queryView({view:"datatable"});
		this.table.parse(activities);
		
		this._jetPopup = this.ui(WindowView);
	}
	
} 