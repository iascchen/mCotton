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
        Session.setDefault(VIAUSL_TIME_FORMAT, "%H:%M");

        var timeStart = getDateFromSession(VIAUSL_FROM_TIME);
        var events = DataEvents.find({
                my_app_kit_id: this._id,
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
    from_time: function () {
        return getDateFromSession(VIAUSL_FROM_TIME);
    },
    to_time: function () {
        return getDateFromSession(VIAUSL_TO_TIME);
    },
});

Template.dataVisualPie.events({
    "click .showHour": function () {
        console.log("click .showHour");
        var timeinfo = moment().hour();
        addDateToSession(VIAUSL_FROM_TIME, moment(timeinfo - 1, "HH"));
        addDateToSession(VIAUSL_TO_TIME, moment(timeinfo + 1, "HH"));
        Session.set(VIAUSL_TIME_FORMAT, "HH:mm");
    },
    "click .showDay": function () {
        console.log("click .showDay");
        var timeinfo = moment().date();
        addDateToSession(VIAUSL_FROM_TIME, moment(timeinfo - 1, "DD"));
        addDateToSession(VIAUSL_TO_TIME, moment(timeinfo + 1, "DD"));
        Session.set(VIAUSL_TIME_FORMAT, "MM/DD HH:00");
    },
    "click .showWeek": function () {
        console.log("click .showWeek");
        var timeinfo = moment().week();
        addDateToSession(VIAUSL_FROM_TIME, moment(timeinfo - 1, "WW"));
        addDateToSession(VIAUSL_TO_TIME, moment(timeinfo + 1, "WW"));
        Session.set(VIAUSL_TIME_FORMAT, "MM/DD");
    }
});

Template.dataVisualPie.rendered = function () {

};