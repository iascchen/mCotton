/**
 * Created by chenhao on 15/4/14.
 */

// Meteor.subscribe('dataevents');

Template.deviceData.helpers({
    gray: function () {
        var device_id = this.device_id;
        var device = Collections.Devices.findOne({_id: device_id});

        if (device.status >= STATUS_DISABLE) {
            return "gray";
        }
    },
    data_events: function () {
        var device_id = this.device_id;

        var device = Collections.Devices.findOne({_id: device_id});
        var project = Collections.Projects.findOne({_id: device.project_id});
        var data_points = project.data_points;

        var ret = new Mongo.Collection(null);
        _.forEach(data_points, function (point) {
            //console.log("event.datapoint", point;
            var event = Collections.DataEvents.findOne({device_id: device_id, data_name: point.data_name},
                {sort: {data_submit_time: -1}});
            if (event) {
                //console.log("event.dataevent", event);
                if (point.data_show_list) {
                    event.sid = point.sid;
                }
                ret.insert(event);
            }
        });

        return ret.find();
    },
});

Template.deviceData.events({
    "click .history": function () {
        //console.log("history" , this.device_id);
        Router.go('deviceDataVisual', {_id: this.device_id});
    }
});

