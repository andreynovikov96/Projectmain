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
				//Info
				
			]
		};
	}
	init(view){
		this.list = view.queryView({view:"list"});
		this.list.parse(contacts);
	}
	urlChange(){
		contacts.waitData.then(() => {
			const id = this.getParam("id",true);
			if (id === undefined || contacts.getIndexById(id) == -1 && id !=="new") this.show(`../contacts?id=${contacts.getFirstId()}/contactsTemplate`);
			else if (id && id !=="new") this.list.select(id);
		});
	}
}