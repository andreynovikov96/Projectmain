import {JetView} from "webix-jet";
import {activities} from "models/activities";
import {activitytypes} from "models/activitytypes";
//import {statuses} from "models/statuses";
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
			],
			/* on: {
				onChange: function () {
					$$("mytable").filterByAll();
				}
			} */
		};

		let button = {
			view:"button", 
			width:150, 
			label:"Add activity",
			type:"iconButton", 
			icon:"plus-square", 
			click:() => {
				//this.app.callEvent("mytable");
				this._jetPopup.showWindow();
			}
		};

		let table = {     
			view: "datatable", 
			id: "mytable",
			select:true,
			scrollX: false,
			columns:[
				{id:"State", header:"", template:"{common.checkbox()}", width:50},
				{id:"TypeID", header:["Activity type", {content:"selectFilter"}], sort:"text", collection:activitytypes, width:150},
				{id:"DueDate", header:["Due Date", {content:"datepickerFilter"}], sort:"date", format:webix.i18n.dateFormatStr},
				{id:"Details", header:["Details", {content:"textFilter"}], fillspace:true, sort:"string"},
				{id:"ContactID", header:["Contact", {content:"selectFilter"}], sort:"text", collection:contacts, width:200},
				{template:"{common.editIcon()}", width:50},
				{template:"{common.trashIcon()}", width:50}
			],
			/* scheme: {
				$init:(item) => {
					if (item.State == "Open") item.State = 0;
					else item.State = 1;
				}
			}, */
			onClick:{
				"fa-trash":(ev, id) => {
					webix.confirm ({
						text: "The data will be cleared. Continue?",
						callback:function (result) {
							if (result) {
								//$$("mytable").remove(id);
								activities.remove(id);
							}
						}
					});
					return false;
				},
				"fa-pencil": (e, id) => {
					this.app.callEvent("onActivityEdit", [this.table.getItem(id)]);

					this._jetPopup.showWindow();
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

	init(){
		this.table = this.$$("mytable");
		this.table.sync(activities);
		
		this._jetPopup = this.ui(WindowView);

		/* activitytypes.waitData.then(()=>{
			this.table.getColumnConfig("TypeID").collection = activitytypes;
			$$("mytable").refreshColumns();
		});

		contacts.waitData.then(()=>{
			this.table.getColumnConfig("ContactID").collection = contacts;
			$$("mytable").refreshColumns();
		});  */
	}
	
} 