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
			let value = this.$$("filterActivities").getValue();
			let today = new Date();
			today.setHours(0, 0, 0, 0);
			let tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);
			let startWeek = new Date(today);
			startWeek.setDate(today.getDate() - today.getDay() + 1);
			let endWeek = new Date(today);
			endWeek.setDate(today.getDate() - today.getDay() + 7);
			let startMonth = new Date(today);
			startMonth.setDate(1);
			let endMonth = new Date(today);
			endMonth.setMonth(today.getMonth() + 1);
			endMonth.setDate(0);

			this.$$("activityData").filter((obj) =>{
				switch (value){
					case "overdue": return obj.State === "Open" && obj.DueDate < today;
					case "completed": return obj.State === "Close";
					case "today": return !(obj.DueDate - today);
					case "tomorrow": return !(obj.DueDate - tomorrow);
					case "week": return obj.DueDate >= startWeek && obj.DueDate <= endWeek;
					case "month": return obj.DueDate >= startMonth && obj.DueDate <= endMonth;
					default: return true;
				}
			}, "", true);
		});
	}
	
} 