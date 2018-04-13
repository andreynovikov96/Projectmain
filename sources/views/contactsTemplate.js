import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
import {statuses} from "models/statuses";

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
						<div class='statusContacts'> Status: ${status}</div>
						<div class='webix_icon fas fa-envelope infoContacts'> Email: ${obj.Email}</div>
						<div class='webix_icon fas fa-birthday-cake infoContacts'> Birthday: ${obj.Birthday}</div>
						<div class='webix_icon fab fa-skype infoContacts'> Skype: ${obj.Skype}</div>
						<div class='webix_icon fas fa-map-marker infoContacts'> Location: ${obj.Address}</div>
						<div class='webix_icon fa-tag infoContacts'> Job: ${obj.Job}</div>
						<div class='webix_icon fas fa-building infoContacts'> Company: ${obj.Company}</div>
						<div class='webix_icon fa-chrome infoContacts'> Website: ${obj.Website}</div>
						<div class='webix_icon fas fa-phone infoContacts'> Phone: ${obj.Phone}</div>
					</div>`;			
		};
		let infoContacts =
			{	
				view:"template",
				borderless:true,
				id:"info",
				template:info,
				gravity: 3
			};
		
		let button = {
			cols: [
				{},
				{view:"button", width:100, label:"Edit", type:"iconButton", icon:"edit", click:() => this.show("contactForm")},
				{view:"button", width:100, label:"Delete", type:"iconButton", icon:"trash", click:() => {this.delete();}},
			]
		};

		return {rows: [button, infoContacts]};
	}
	urlChange(){
		contacts.waitData.then(() => {
			var id = this.getParam("id",true);
			if (id) {
				let data = contacts.getItem(id);
				this.$$("info").setValues(data);
			}
		});
	}
	delete() {
		
	}
}