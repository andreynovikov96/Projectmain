import {JetView} from "webix-jet";
import {contacts} from "models/contacts";

export default class ContactsView extends JetView{
	config(){
		let header = {
			view: "template", 
			template:"Contacts",
			type:"header"
		};

		let contactsList = {
			view: "list",
			select:true,
			borderless:true,
			template: this.listContacts,
			on:{
				onAfterSelect: (id) =>{
					this.setParam("id", id, true);
				}
			}
		};

		let button = {
			view:"button",
			label:"Add contact",
			type:"iconButton", 
			inputWidth:130,
			align:"center",
			icon:"plus",
			click:() => {
				this.show("../contacts?id=new/contactsForm");
			}
		};

		return { 
			cols: [
				{gravity:0.4, 
					rows: [
						header,
						contactsList,
						button						
					]
				},
				{$subview:true}				
			]
		};
	}
	init(view){
		this.list = view.queryView({view:"list"});
		this.list.parse(contacts);
		
		this.on(this.list.data, "onIdChange", (oldId, newId) =>{
			this.setParam("id", newId, true);
		});
	}
	urlChange(){
		contacts.waitData.then(() => {
			const id = this.getParam("id",true);
			if (id === undefined || !contacts.exists(id) && id !=="new") this.show(`../contacts?id=${contacts.getFirstId()}/contactsTemplate`);
			else if (id && id !=="new") {
				this.list.select(id);
				this.list.showItem(id);
			}
		});
	}
	listContacts(obj){
		return `
			<div><img class="listImage" src="${obj.Photo || "https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png"}"> ${obj.FirstName || ""} ${obj.LastName || ""} ${obj.Email || ""}</div>`;
	} 
}