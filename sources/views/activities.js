import {JetView} from "webix-jet";
import {activities} from "models/activities";
import {activitytypes} from "models/activitytypes";
import {contacts} from "models/contacts";
import WindowView from "views/window";

export default class ActivityView extends JetView{
	config(){
		const _ = this.app.getService("locale")._;

		let segmented = {
			view:"segmented",
			id:"filterActivities",
			inputWidth:800,
			options: [
				{id:"allView", value:_("All")},
				{id:"overdue", value:_("Overdue")},
				{id:"completed", value:_("Completed")},
				{id:"today", value:_("Today")},
				{id:"tomorrow", value:_("Tomorrow")},
				{id:"week", value:_("This week")},
				{id:"month", value:_("This month")}
			],
			on:{
				onChange:() => {
					this.$$("activityData").filterByAll();
				}
			}
		};

		let button = {
			view:"button", 
			width:200, 
			label:_("Add activity"),
			type:"iconButton", 
			icon:"plus-square", 
			click:() => {
				this._jetPopup.showWindow({}, false, false);
			}
		};

		let table = {     
			view: "datatable", 
			id:"activityData",
			select:true,
			scrollX: false,
			columns:[
				{id:"State", header:"", template:"{common.checkbox()}", uncheckValue:"Open", checkValue:"Close", width:50},
				{id:"TypeID", header:[_("Activity type"), {content:"selectFilter"}], sort:"text", collection:activitytypes, width:200},
				{id:"DueDate", header:[_("Due Date"), {content:"datepickerFilter"}], sort:"date", format:webix.i18n.dateFormatStr},
				{id:"Details", header:[_("Details"), {content:"textFilter"}], fillspace:true, sort:"string"},
				{id:"ContactID", header:[_("Contact"), {content:"selectFilter"}], sort:"text", collection:contacts, width:200},
				{template:"{common.editIcon()}", width:50},
				{template:"{common.trashIcon()}", width:50}
			],
			onClick:{
				"fa-trash":(ev, id) => {
					webix.confirm ({
						text: _("The data will be cleared. Continue?"),
						ok: _("Yes"),
						cancel: _("Cancel"),
						callback:(result) => {
							if (result) {
								activities.remove(id);
							}
						}
					});
					return false;
				},
				"fa-pencil": (e, id) => {
					this._jetPopup.showWindow(this.$$("activityData").getItem(id), true, false);
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
		this._jetPopup = this.ui(WindowView);
		this.$$("activityData").parse(activities);
		
		this.on(this.$$("activityData"), "onAfterFilter", () =>{
			let currentDate  = webix.Date.dayStart(new Date());
			let value = this.$$("filterActivities").getValue();
			this.$$("activityData").filter((obj) =>{
				switch (value){
					case "overdue": return obj.DueDate < currentDate  && obj.State == "Open";
					case "completed": return obj.State == "Close";
					case "today": return webix.Date.equal(obj.DueDate, currentDate);
					case "tomorrow": return webix.Date.equal(obj.DueDate, webix.Date.add(currentDate, 1, "day", true));
					case "week": return webix.Date.equal(webix.Date.weekStart(obj.DueDate), webix.Date.weekStart(currentDate));
					case "month": return webix.Date.equal(webix.Date.monthStart(obj.DueDate), webix.Date.monthStart(currentDate));
					default: return true;
				}
			}, "", true);
		});
	}
} 