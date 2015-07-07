/**
 * Created by chenhao on 15/4/14.
 */

Meteor.subscribe('controlevents');

Template.myAppKitControl.helpers({
    gray : function(){
        var my_app_kit_id = this.my_app_kit_id;
        var my_app_kit = MyAppKits.findOne({_id: my_app_kit_id});

        if( my_app_kit.status == "retired"){
            return "gray";
        }
    },
    controlpoints: function () {
        var my_app_kit_id = this.my_app_kit_id;

        var my_app_kit = MyAppKits.findOne({_id: my_app_kit_id});
        var ctrl_points = ControlPoints.find({app_kit_id: my_app_kit.app_kit_id}).fetch();

        var ret = new Mongo.Collection(null);
        for (var i = 0; i < ctrl_points.length; i++) {
            // console.log("event.data_name", distinct_data_names[i]);
            var event = ControlEvents.findOne({my_app_kit_id: my_app_kit_id, control_name: ctrl_points[i].control_name},
                {sort: {control_submit_time: -1}});

            if (event) {
                // console.log("event.control_name", event.control_name, event.control_value, event.control_submit_time);
                ret.insert(event);
            } else {
                // console.log("point.control_name", ctrl_points[i].control_name);

                event = _.extend(ctrl_points[i], {
                    my_app_kit_id: this.my_app_kit_id,
                    owner_user_id: my_app_kit.owner_user_id,
                });

                ret.insert(event);
            }
        }
        return ret.find();
    }
});