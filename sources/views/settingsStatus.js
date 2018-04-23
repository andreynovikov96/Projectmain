import SettingsTable from "views/settingsTable";
import {statuses} from "models/statuses";

export default class StatusesView extends SettingsTable{

	init(view){

		const _ = this.app.getService("locale")._;

		view.queryView({view:"datatable"}).parse(statuses);
		this.button = this.getRoot().queryView({view:"button"});
		this.button.define("label", _("Add status"));
		this.button.refresh();
	}

	add(){
		const _ = this.app.getService("locale")._;
		
		statuses.add({
			Value:_("New status"), Icon: "New icon"
		});
	}

	delete(id){
		if(id)
			statuses.remove(id);
	}

}