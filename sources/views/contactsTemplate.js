import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {statuses} from "models/statuses";
import Tabbar from "views/contactsTable";

export default class infoContacts extends JetView{
	config(){
		const _ = this.app.getService("locale")._;

		let formatDate = webix.i18n.dateFormatStr;

		let info = (obj) => {
			let status = "";
			if( statuses.exists(obj.StatusID) ){
				status = statuses.getItem(obj.StatusID).Value;
			}
			return `<div class='contacts'>
						<div class='contactsName'>${obj.FirstName} ${obj.LastName}</div>
						<div><img src="${obj.Photo || "https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png"}"></div>
						<div class='webix_icon fas fa-envelope infoContacts'> Email: ${obj.Email}</div>
						<div class='webix_icon fas fa-birthday-cake infoContacts'> Birthday: ${formatDate(obj.Birthday)}</div>
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
				{view:"button", width:150, label:_("Edit"), type:"iconButton", icon:"edit", click:() => {
					this.show("../contactsForm");			
				}}, 
				{view:"button", width:100, label:_("Delete"), type:"iconButton", icon:"trash", 
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

		return {
			rows: [button, infoContacts, Tabbar]
		};
	}
	
	urlChange(){
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			var id = this.getParam("id", true);
			if (id) {
				let data = contacts.getItem(id);
				this.$$("info").setValues(data);
			}
		});
	}
}