/**
 * Created by chenhao on 15/4/14.
 */

var Schemas = {};

Schemas.DataEvent = new SimpleSchema({
    owner_user_id: {
        type: String,
        label: "meteor.User _id",
        optional: false,
    },

    my_app_kit_id: {
        type: String, label: "my_app_kit_id",
        optional: false,
    },

    data_name: {
        type: String, label: "data_name",
        optional: false,
    },

    data_value: {
        type: String, label: "data_value",
        optional: false,
    },

    sid: {
        type: String, label: "sid",
    },

    data_submit_time: {
        type: Date, label: "data_submit_time",
    },

    data_type: {
        type: String, label: "data_type",
    },

    data_unit: {
        type: String, label: "data_unit",
    },

    status: {
        type: String, label: "retired",
    },
});

DataEvents = new Mongo.Collection('dataevents', Schemas.DataEvent);

Meteor.methods({
    dataEventInsert: function (_attributes) {
        // console.log("dataEventInsert", _attributes);

        var myappkit = MyAppKits.findOne({_id: _attributes.my_app_kit_id});

        if (!myappkit) {
            return {
                notExistMyAppKit: true,
                _id: _attributes.my_app_kit_id
            };
        }

        var entity = _.clone(_attributes);

        if (!entity.data_submit_time) {
            entity.data_submit_time = new Date();
        }
        if (!entity.owner_user_id) {
            entity.owner_user_id = myappkit.owner_user_id;
        }

        var datapoint = DataPoints.findOne({app_kit_id: myappkit.app_kit_id, data_name: entity.data_name});

        if (datapoint) {
            _.extend(entity, {
                data_type: datapoint.data_type,
                data_unit: datapoint.data_unit,
            });
        }
        else {
            return {
                notExistDatePoint: true,
                _id: _attributes.my_app_kit_id
            }
        }

        console.log("DataEvents", entity);

        var entityId = DataEvents.insert(entity);

        return {
            _id: entityId
        };
    },

    dataEventsQuerySmall: function (_attributes) {
        // console.log("controlEventsQuery", _attributes);
        var my_app_kit_id = _attributes.my_app_kit_id
        var myappkit = MyAppKits.findOne({_id: my_app_kit_id});

        if (!myappkit) {
            return {
                notExistMyAppKit: true,
                _id: _attributes.my_app_kit_id
            };
        }

        var now = new Date();
        var events = DataEvents.find({
                my_app_kit_id: my_app_kit_id,
                data_submit_time: {$gt: new Date(now - DATA_EVENT_RESEND_INTERVAL)}
            },
            {sort: {data_submit_time: -1}}).fetch();

        // console.log("controlEventsQuery", events.length);

        var ret = {};
        var _event;
        for (var i = events.length; i > 0; i--) {
            _event = events[i - 1];
            //console.log("controlEventsQuery", _event);

            ret[_event.data_name] = _event.data_value;
        }

        return ret;
    },

    dataEventsQuery: function (_attributes) {
        // console.log("dataEventsQuery", _attributes);
        var my_app_kit_id = _attributes.my_app_kit_id;
        var myappkit = MyAppKits.findOne({_id: my_app_kit_id});

        if (!myappkit) {
            return {
                notExistMyAppKit: true,
                _id: _attributes.my_app_kit_id
            };
        }

        var dataNames = DataPoints.find({app_kit_id: myappkit.app_kit_id},
            {fields: {data_name: true}}).fetch();

        var ret = {};
        var _event, _data_name;
        for (var i = 0; i < dataNames.length; i++) {
            _data_name = dataNames[i].data_name;
            // console.log("dataNames", _data_name);

            _event = DataEvents.findOne({my_app_kit_id: my_app_kit_id, data_name: _data_name},
                {sort: {data_submit_time: -1}});
            //console.log("data", _event);
            if (_event)
                ret[_data_name] = {value: _event.data_value, submit_time: _event.data_submit_time.valueOf()};
        }

        return ret;
    },

    cityDataEventsQuery: function (_attributes) {
        var my_app_kit_id = _attributes.my_app_kit_id;
        var event = DataEvents.findOne({my_app_kit_id: my_app_kit_id, data_name: 'Cell'},
            {sort: {sid: -1}, fields: {sid: true}});

        if (!event) {
            return;
        }

        // console.log("sid", event.sid);

        var events = DataEvents.find({my_app_kit_id: my_app_kit_id, data_name: 'Cell', sid: event.sid},
            {sort: {data_submit_time: -1}, fields: {sid: true, data_value: true, data_submit_time:true}}).fetch();
        // console.log("getMyCityJson", events);

        return events;
    }
});
