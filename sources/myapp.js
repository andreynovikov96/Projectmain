import "./styles/app.css";
import {JetApp, plugins} from "webix-jet";

webix.ready(() => {
	var app = new JetApp({
		id:			APPNAME,
		version:	VERSION,
		start:		"/top/contacts",
		debug:true
	});
	app.use(plugins.Locale);
	app.render();

	app.attachEvent("app:error:resolve", function(name, error){
		window.console.error(error);
	});
});