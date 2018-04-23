import SettingsTable from "views/settingsTable";
import {activitytypes} from "models/activitytypes";

export default class TypesView extends SettingsTable{

	init(view){

		const _ = this.app.getService("locale")._;

		view.queryView({view:"datatable"}).parse(activitytypes);
		this.button = this.getRoot().queryView({view:"button"});
		this.button.define("label", _("Add type"));
		this.button.refresh();
	}

	add(){
		const _ = this.app.getService("locale")._;
		activitytypes.add({
			Value:_("New value"), Icon:"New icon"
		});
	}
    
	delete(id){
		if(id)
			activitytypes.remove(id);
	}
}