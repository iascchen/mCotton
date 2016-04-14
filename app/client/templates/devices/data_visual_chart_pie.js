// dataVisual Line

VIAUSL_JSON_DATA = "visual_json_data";
VIAUSL_FROM_TIME = "visual_from_time";
VIAUSL_TO_TIME = "visual_to_time";
VIAUSL_TIME_FORMAT = "visual_time_format";

Template.dataVisualPie.helpers({
    json_data: function () {
        delete Session.keys[VIAUSL_JSON_DATA];

        var hour = moment().hour();
        Session.setDefault(VIAUSL_FROM_TIME, moment(hour - 1, "HH").valueOf());
        Session.setDefault(VIAUSL_TO_TIME, moment(hour + 1, "HH").valueOf());
        Session.setDefault(VIAUSL_TIME_FORMAT, "HH:mm");

        var timeStart = getDateFromSession(VIAUSL_FROM_TIME);
        var events = Collections.DataEvents.find({
                device_id: this._id,
                data_submit_time: {$gte: timeStart.toDate()}
            },
            {sort: {data_name: 1, data_submit_time: 1}}).fetch();

        // console.log("dataVisualEvents", events.length);
        if (events.length <= 0) return;

        // TODO

        console.log("retjson", retjson);
        Session.set(VIAUSL_JSON_DATA, retjson);

        // return JSON.stringify(retjson);
        return;
    },
    //from_time: function () {
    //    return getDateFromSession(VIAUSL_FROM_TIME);
    //},
    //to_time: function () {
    //    return getDateFromSession(VIAUSL_TO_TIME);
    //},
});

Template.dataVisualPie.rendered = function () {

};