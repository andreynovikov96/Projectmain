import {JetView} from "webix-jet";
//import {activities} from "models/activities";
//import {activitytypes} from "models/activitytypes";
//import {statuses} from "models/statuses";

export default class infoContacts extends JetView{
	config(){
		
		let info = {
			view:"template",
			template:"<div class='contacts'><div class='contactsName'>#FirstName# #LastName#</div><img src='https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png'><div class='webix_icon fas fa-envelope infoContacts'> Email: #Email#</div><div class='webix_icon fas fa-birthday-cake infoContacts'> Birthday: #Birthday#</div><div class='webix_icon fab fa-skype infoContacts'> Skype: #Skype#</div><div class='webix_icon fas fa-map-marker infoContacts'> Location: #Address#</div><div class='webix_icon fas fa-building infoContacts'> Company: #Company#</div><div class='webix_icon fa-chrome infoContacts'> Website: #Website#</div><div class='webix_icon fas fa-phone infoContacts'> Phone: #Phone#</div></div>"			
		};
		
		let button = {
			cols: [
				{},
				{view:"button", width:100, label:"Add", type:"iconButton", icon:"edit", click:() => {this.add();}},
				{view:"button", width:100, label:"Delete", type:"iconButton", icon:"trash", click:() => {this.delete();}},
			]
		};

		return {rows: [button, info]};
	}
	init(view) {
		this.on(this.app, "onContactSelect", (data) => {
			if(data){
				view.queryView({view:"template"}).setValues(data);
			}
		});
	}
	add() {

	}
	delete() {
		
	}
}