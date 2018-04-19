import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {statuses} from "models/statuses";
import {activities} from "models/activities";
import {activitytypes} from "models/activitytypes";
import {files} from "models/files";
import WindowView from "views/window";

export default class infoContacts extends JetView{
	config(){
		
		let info = (obj) => {
			let status = "";

			if( statuses.exists(obj.StatusID) ){
				status = statuses.getItem(obj.StatusID).Value;
			}
			return `<div class='contacts'>
						<div class='contactsName'>${obj.FirstName} ${obj.LastName}</div>
						<img src='https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png'>
						<div class='webix_icon fas fa-envelope infoContacts'> Email: ${obj.Email}</div>
						<div class='webix_icon fas fa-birthday-cake infoContacts'> Birthday: ${obj.Birthday}</div>
						<div class='webix_icon fab fa-skype infoContacts'> Skype: ${obj.Skype}</div>
						<div class='webix_icon fas fa-map-marker infoContacts'> Location: ${obj.Address}</div>
						<div class='webix_icon fa-tag infoContacts'> Job: ${obj.Job}</div>
						<div class='webix_icon fas fa-building infoContacts'> Company: ${obj.Company}</div>
						<div class='webix_icon fa-chrome infoContacts'> Website: ${obj.Website}</div>
						<div class='webix_icon fas fa-phone infoContacts'> Phone: ${obj.Phone}</div>
						<div class='statusContacts'> Status: ${status}</div>
					</div>`;			
		};
		
		let infoContacts =
			{	
				view:"template",
				borderless:true,
				id:"info",
				template:info
			};
		
		let button = {
			cols: [
				{},
				{view:"button", width:100, label:"Edit", type:"iconButton", icon:"edit", click:() => {
					this.show("../contactsForm");			
				}}, 
				{view:"button", width:100, label:"Delete", type:"iconButton", icon:"trash", 
					click:()=>{
						var id = this.getParam("id", true);
						webix.confirm({
							text:"Are you sure you want to delete this item?",
							callback:(result) => {
								if(result){
									contacts.remove(id);
									this.app.show("top/contacts");
								}
							}
						});
						return false;
					}},
			]
		};

		let table = [
			{
				header:"Activities",
				body:{
					rows:[ {
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
							"fa-pencil": (e, id) => {
								this._jetPopup.showWindow();
								this.app.callEvent("onActivityEdit", [this.$$("tableActivities").getItem(id)]);
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
						click:() => {
							this._jetPopup.showWindow();
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
								{id:"Name", header:"Name", sort:"string", fillspace:true},
								{id:"ChangeDate", header:"Change date",  sort:"date", width:200, format:webix.i18n.dateFormatStr},
								{id:"Size", header:"Size", sort:"int"},
								{id:"trash", header:"", template:"{common.trashIcon()}", width:50}
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
									files.add (
										{
											Name:file.name,
											ChangeDate:file.lastModifiedDate, 
											Size:file.size,
											ContactID:id
										});
									return false;
								}
							}
						}
					]
				}
			}
		];  

		return {
			rows: [button, infoContacts, 
				{cols:[
					{ 
						view:"tabview", 
						cells:table
					}
				]
				}
			]
		};
	}
	init() {
		$$("tableFiles").parse(files);

		this._jetPopup = this.ui(WindowView);
	}
	urlChange(){
		webix.promise.all([
			contacts.waitData,
			activities.waitData
		]).then(()=>{
			let id = this.getParam("id",true);
			if (id) {
				let data = contacts.getItem(id);
				this.$$("info").setValues(data);
			}
			this.$$("tableActivities").sync(activities, function(){
				this.filter(function(data){
					return data.ContactID == id;
				});
			});
		});
	}
}