/**
 * Created by chenhao on 15/4/14.
 */

Meteor.subscribe('dataevents', Meteor.userId());

Template.myAppKitData.helpers({
    gray: function () {
        var my_app_kit_id = this.my_app_kit_id;
        var my_app_kit = MyAppKits.findOne({_id: my_app_kit_id});

        if (my_app_kit.status == "retired") {
            return "gray";
        }
    },
    data_events: function () {

        var my_app_kit_id = this.my_app_kit_id;

        var my_app_kit = MyAppKits.findOne({_id: my_app_kit_id});
        var distinct_data_points = DataPoints.find({app_kit_id: my_app_kit.app_kit_id},
            {sort: {data_name: 1}, fields: {data_name: true, show_list: true}}).fetch();

        //console.log("event.data_name.length", distinct_data_points.length);

        var ret = new Mongo.Collection(null);
        for (var i = 0; i < distinct_data_points.length; i++) {
            //console.log("event.datapoint", distinct_data_points[i]);
            var event = DataEvents.findOne({my_app_kit_id: my_app_kit_id, data_name: distinct_data_points[i].data_name},
                {sort: {data_submit_time: -1}});
            if (event) {
                //console.log("event.dataevent", event);
                if (distinct_data_points[i].show_list) {
                    event.show_list = distinct_data_points[i].show_list;
                }
                ret.insert(event);
            }
        }
        return ret.find();
    },
});

Template.myAppKitData.events({
    "click .history": function () {
        //console.log("history" , this.my_app_kit_id);
        Router.go('myAppKitDataVisual', {_id: this.my_app_kit_id});
    }
});

