export const activitytypes =  new webix.DataCollection({
	url:"http://localhost:8096/api/v1/activitytypes/",
	save:"rest->http://localhost:8096/api/v1/activitytypes/",
	sсheme: {
		$init: (obj) => {
			obj.value = obj.Value;
		}
	}
});
