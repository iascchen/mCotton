/**
 * Created by chenhao on 15/4/14.
 */

Meteor.subscribe('controlevents');

Template.deviceControl.helpers({
    gray: function () {
        var device_id = this.device_id;
        var device = Collections.Devices.findOne({_id: device_id});

        if (device.status >= STATUS_DISABLE) {
            return "gray";
        }
    },
    control_events: function () {
        var device_id = this.device_id;

        var device = Collections.Devices.findOne({_id: device_id});
        var project = Collections.Projects.findOne({_id: device.project_id});
        var ctrl_points = project.control_points;

        var ret = new Mongo.Collection(null);

        _.forEach(ctrl_points, function (point) {
            var event = Collections.ControlEvents.findOne({device_id: device_id, control_name: point.control_name},
                {sort: {control_submit_time: -1}});

            if (event) {
                // console.log("event.control_name", event.control_name, event.control_value, event.control_submit_time);
                ret.insert(event);
            } else {
                // console.log("point.control_name", ctrl_points[i].control_name);

                event = _.extend(point, {
                    device_id: device_id,
                    owner_user_id: device.owner_user_id,
                });

                ret.insert(event);
            }
        });
        return ret.find();
    }
});