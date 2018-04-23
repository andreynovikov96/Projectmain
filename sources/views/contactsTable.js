import {JetView} from "webix-jet";
import {activities} from "models/activities";
import {activitytypes} from "models/activitytypes";
import {files} from "models/files";
import WindowView from "views/window";

export default class TabbarContacts extends JetView{
	config(){
		
		let table = [
			{
				header:"Activities",
				body:{
					rows:[ 
						{
							view: "datatable", 
							id: "tableActivities",
							borderless:true,
							select:true,
							scrollX: false,
							columns:[
								{id:"State", header:"", template:"{common.checkbox()}", uncheckValue:"Open", checkValue:"Close", width:50},
								{id:"TypeID", header:["Activity type", {content:"selectFilter"}], sort:"string", collection:activitytypes, width:200},
								{id:"DueDate", header:["Due Date", {content:"datepickerFilter"}], sort:"date", format:webix.i18n.dateFormatStr},
								{id:"Details", header:["Details", {content:"textFilter"}], fillspace:true, sort:"string"},
								{template:"{common.editIcon()}", width:50},
								{template:"{common.trashIcon()}", width:50}
							],
							onClick:{
								"fa-trash":(ev, id) => {
									webix.confirm ({
										text: "The data will be cleared. Continue?",
										callback: (result) => {
											if (result) {
												activities.remove(id);
												this.show("contactsTemplate");
											}
										}
									});
									return false;
								},
								"fa-pencil":(e,id)=>{
									this._jetPopup.showWindow(this.$$("tableActivities").getItem(id), true, true);
									return false;
								}
							}
						},
						{
							view:"button", 
							label:"Add activity",
							type:"iconButton",
							icon:"plus-square",  
							inputWidth:130,
							align:"right",
							click: () => {
								let id = this.getParam("id",true);
								this._jetPopup.showWindow({ContactID:id}, false, true);
							}
						}
					]	
				}	
			},
			{
				header:"Files",
				body:{
					rows: [
						{
							view: "datatable", 
							id: "tableFiles",
							borderless:true,
							select:true,
							scrollX: false,
							columns:[
								{id:"name", header:"Name", sort:"string", fillspace:true},
								{id:"lastModifiedDate", header:"Change date",  sort:"date", width:200, format:webix.i18n.dateFormatStr},
								{id:"size", header:"Size", sort:"int"},
								{id:"", header:"", template:"{common.trashIcon()}", width:50}
							],
							onClick:{
								"fa-trash":(ev, id) => {
									webix.confirm ({
										text: "The data will be cleared. Continue?",
										callback: (result) => {
											if (result) {
												files.remove(id);
											}
										}
									});
									return false;
								}
							}
						},
						{
							view:"uploader",
							type:"iconButton",
							icon:"cloud-upload",
							label:"Upload file", 
							autosend:false, 
							multiple:false,
							inputWidth:120,
							align:"center",		
							on:{
								onBeforeFileAdd: (upload) => {    
									let file = upload.file;
									let id = this.getParam("id", true);
									file.ContactID = id;
									files.add(file);
								}
							}
						}
					]
				}
			}
		];  

		return {cols:[
			{ 
				view:"tabview", 
				cells:table
			}
		]
		};
	}
	init() {
		$$("tableFiles").parse(files);
		this._jetPopup = this.ui(WindowView);
		
		this.on(this.$$("tableActivities"), "onAfterFilter", () =>{
			let id = this.getParam("id", true);

			this.$$("tableActivities").filter((obj) =>{
				return obj.ContactID == id;
			}, "", true);
		});	
	}
	urlChange(){
		activities.waitData.then(() => {
			let id = this.getParam("id",true);
			this.$$("tableActivities").sync(activities, function(){
				this.filter(function(data){
					return data.ContactID == id;
				});
			});
			this.$$("tableActivities").filterByAll(); 
		});

		files.waitData.then(() => {
			let id = this.getParam("id",true);
			this.$$("tableFiles").sync(files, function(){
				this.filter(function(data){
					return data.ContactID == id;
				});
			});
		});
	}
}