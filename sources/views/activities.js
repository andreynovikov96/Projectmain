import {JetView} from "webix-jet";
import {activities} from "models/activities";
import {activitytypes} from "models/activitytypes";
//import {statuses} from "models/statuses";
import {contacts} from "models/contacts";
import WindowView from "views/window";

export default class ActivityView extends JetView{
	config(){
		
		let tabbar = {
			view:"tabbar",
			id:"tabbarFilter", 
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
				this.app.callEvent("mytable");
				this._jetPopup.showWindow();
			}
		};

		let table = {     
			view: "datatable", 
			id: "mytable",
			select:true,
			scrollX: false,
			columns:[
				{id:"State", header:"", template:"{common.checkbox()}", width:40},
				{id:"TypeID", header:["Activity type", {content:"selectFilter"}], fillspace:true, sort:"string", collection:activitytypes},
				{id:"DueDate", header:["Due Date", {content:"dateFilter"}], sort:"string"},
				{id:"Details", header:["Details", {content:"textFilter"}], sort:"string"},
				{id:"ContactID", header:["Contact", {content:"selectFilter"}], sort:"int", collection:contacts},
				{template:"{common.editIcon()}", width:40},
				{template:"{common.trashIcon()}", width:40}
			],
			scheme: {
				$init:(item) => {
					if (item.State == "Open") item.State = 0;
					else item.State = 1;
				}
			},
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
				"fa-pencil":(e,id)=>{
					this.setParam("id", id, true);
					let item = this.$$("mytable").getSelectedItem();
					this.app.callEvent("dataActivityEdit", [item]);
					this._jetPopup.showWindow(); 

				}
			}
		};  

		return {
			rows:[
				{cols:[tabbar, button]},
				table
			]
		};
	}

	init(view){
		view.queryView({view:"datatable"}).sync(activities);
		this._jetPopup = this.ui(WindowView);

		/* activitytypes.waitData.then(()=>{
			this.table.getColumnConfig("TypeID").collection = activitytypes;
			$$("mytable").refreshColumns();
		});

		contacts.waitData.then(()=>{
			this.table.getColumnConfig("ContactID").collection = contacts;
			$$("mytable").refreshColumns();
		}); */
	}
	
} 