/**
 * Created by chenhao on 15/4/14.
 */

var rVarDumping;

Template.deviceData.created = function () {
    rVarDumping = new ReactiveVar(false);
},

    Template.deviceData.helpers({
        gray: function () {
            var device_id = this.device_id;
            var device = Collections.Devices.findOne({ _id: device_id });

            if (device.status >= STATUS_DISABLE) {
                return "gray";
            }
        },
        data_events: function () {
            var device_id = this.device_id;

            var device = Collections.Devices.findOne({ _id: device_id });
            var project = Collections.Projects.findOne({ _id: device.project_id });
            var data_points = project.data_points;

            data_points = _.sortBy(data_points, function (point) {
                return point.data_name;
            });

            var ret = new Mongo.Collection(null);
            _.forEach(data_points, function (point) {
                //console.log("event.datapoint", point;
                var event = Collections.DataEvents.findOne({ device_id: device_id, data_name: point.data_name },
                    { sort: { data_submit_time: -1 } });
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
        dumping: function () {
            return rVarDumping.get();
        },
    });

Template.deviceData.events({
    "click .history": function () {
        //console.log("history" , this.device_id);
        Router.go('deviceDataVisual', { _id: this.device_id });
    },

    "click .dump": function () {
        console.log("dump", this.device_id);

        var date_str = moment().format(DATA_TIME_FORMAT);
        rVarDumping.set(true);

        var link = null;
        Meteor.call("dumpDeviceData", this.device_id, date_str, function (error, result) {
            rVarDumping.set(false);

            console.log("dumpDeviceData", result);

            if (result != "Failed") {
                link = DATA_DOWNLOAD_PATH + "/" + result;
                window.open(link, '_blank');
            }
            else {
                alert("Dump Failed : " + error);
            }
        });
    }
});

