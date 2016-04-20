/**
 * Created by chenhao on 15/4/14.
 */

Collections.DataEvents = new Mongo.Collection('dataevents');

Schemas.DataEvent = new SimpleSchema({
    owner_user_id: {
        type: String,
        label: "meteor.User _id",
        optional: false,
    },

    device_id: {
        type: String, label: "device_id",
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
        optional: true,
    },

    data_submit_time: {
        type: Date, label: "data_submit_time",
        optional: false,
    },

    data_type: {
        type: String, label: "data_type",
        optional: false,
    },

    data_unit: {
        type: String, label: "data_unit",
        optional: true,
    },

    'data_show_list': {
        optional: true,
        type: Boolean, label: "Show Data As List"
    },

    status: {
        type: Number, label: "Status",
        optional: false,
        allowedValues: STATUS_TYPES,
        autoValue: function () {
            return STATUS_NORMAL;
        },
        autoform: {
            options: STATUS_AUTO_FORM
        }
    },
});

Collections.DataEvents.attachSchema(Schemas.DataEvent);

Collections.DataEvents.allow({
    insert: function (userId, entity) {
        return ownsEntity(userId, entity) || grantedEntity(userId, 'admin');
    },
    remove: function (userId, entity) {
        return ownsEntity(userId, entity) || grantedEntity(userId, 'admin');
    },
});

Meteor.methods({
    dataEventsQuerySmall: function (_attributes) {
        // console.log("dataEventsQuerySmall", _attributes);
        var device_id = _attributes.device_id
        var device = Collections.Devices.findOne({_id: device_id});

        if (!device) {
            return {
                notExistDevice: true,
                _id: _attributes.device_id
            };
        }

        var now = new Date();
        var events = Collections.DataEvents.find({
                device_id: device_id,
                data_submit_time: {$gt: new Date(now - CONTROL_EVENT_RESEND_INTERVAL)}
            },
            {sort: {data_submit_time: -1}}).fetch();

        // console.log("controlEventsQuerySmall", events.length);

        var ret = {};
        var _event;
        for (var i = events.length; i > 0; i--) {
            _event = events[i - 1];
            //console.log("controlEventsQuerySmall", _event);

            ret[_event.data_name] = _event.data_value;
        }

        console.log("dataEventsQuerySmall", ret);
        return ret;
    },

    dataEventsQuery: function (_attributes) {
        // console.log("dataEventsQuery", _attributes);
        var device_id = _attributes.device_id;
        var device = Collections.Devices.findOne({_id: device_id});
        var project = Collections.Projects.findOne({_id: device.project_id});

        if (!device) {
            return {
                notExistDevice: true,
                _id: _attributes.device_id
            };
        }

        var ret = {};
        var _event, _data_name;

        var datapoints = project.data_points;
        _.forEach(datapoints, function (point) {
            _data_name = point.data_name;
            _event = Collections.DataEvents.findOne({device_id: device_id, data_name: _data_name},
                {sort: {data_submit_time: -1}});

            //console.log("data", _event);

            if (_event)
                ret[_data_name] = {value: _event.data_value, submit_time: _event.data_submit_time.valueOf()};
        });

        console.log("dataEventsQuery", ret);
        return ret;
    },

    cityDataEventsQuery: function (_attributes) {
        var device_id = _attributes.device_id;
        var event = Collections.DataEvents.findOne({device_id: device_id, data_name: 'Cell'},
            {sort: {sid: -1}, fields: {sid: true}});

        if (!event) {
            return;
        }

        // console.log("sid", event.sid);

        var events = Collections.DataEvents.find({device_id: device_id, data_name: 'Cell', sid: event.sid},
            {sort: {data_submit_time: -1}, fields: {sid: true, data_value: true, data_submit_time: true}}).fetch();
        // console.log("getMyCityJson", events);

        return events;
    }
});