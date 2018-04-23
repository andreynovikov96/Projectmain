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
						<img src='https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png'>
						<div class='webix_icon fas fa-envelope infoContacts'> ${obj.Email}</div>
						<div class='webix_icon fas fa-birthday-cake infoContacts'> ${formatDate(obj.Birthday)}</div>
						<div class='webix_icon fab fa-skype infoContacts'> ${obj.Skype}</div>
						<div class='webix_icon fas fa-map-marker infoContacts'> ${obj.Address}</div>
						<div class='webix_icon fa-tag infoContacts'> ${obj.Job}</div>
						<div class='webix_icon fas fa-building infoContacts'> ${obj.Company}</div>
						<div class='webix_icon fa-chrome infoContacts'> ${obj.Website}</div>
						<div class='webix_icon fas fa-phone infoContacts'> ${obj.Phone}</div>
						<div class='statusContacts'> ${status}</div>
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