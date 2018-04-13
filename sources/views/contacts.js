import {JetView} from "webix-jet";
import {contacts} from "models/contacts";
//import Info from "views/contactsTemplate";
//import Form from "views/contactForm";

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
			template:"<span class='webix_icon fa-user-circle'></span>#FirstName# #LastName# #Email#",
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
			inputWidth:150,
			align:"center",
			icon:"plus",
			click:() => this.show("contactForm")
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
				//Info
				
			]
		};
	}
	init(view){
		this.list = view.queryView({view:"list"});
		this.list.sync(contacts);
	}
	urlChange(){
		contacts.waitData.then(() =>{
			let id = this.getParam("id");
			if(id !== this.list.getSelectedId()){
				if ( !id || !contacts.exists(id))
					id = contacts.getFirstId();
				this.list.select(id);
			}
		});
	}
	ready () {
		this.show("contactsTemplate");
	}
}