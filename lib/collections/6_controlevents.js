/**
 * Created by chenhao on 15/4/12.
 */
Collections.ControlEvents = new Mongo.Collection('controlevents');

Schemas.ControlEvent = new SimpleSchema({
    owner_user_id: {
        type: String,
        label: "meteor.User _id",
        optional: false,
    },

    device_id: {
        type: String, label: "device_id",
        optional: false,
    },

    control_name: {
        type: String, label: "Name",
        // regEx: /^[a-zA-Z-]{2,25}$/,
        optional: false,
    },

    control_value: {
        type: String, label: "control_value",
        optional: false,
    },

    control_submit_time: {
        type: Date, label: "control_submit_time",
        optional: false,
    },

    control_type: {
        type: String, label: "Control Target, Such as led, switch, and so on",
        optional: false,
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

Collections.ControlEvents.attachSchema(Schemas.ControlEvent);

Collections.ControlEvents.allow({
    insert: function (userId, entity) {
        return autherEntity(userId, entity) || grantedEntity(userId, 'admin');
    }
});

Meteor.methods({
    controlEventInsert: function (_attributes) {
        // console.log("controlEventInsert", _attributes);

        var myappkit = Collections.Devices.findOne({_id: _attributes.device_id});

        if (!myappkit) {
            return {
                notExistDevice: true,
                _id: _attributes.device_id
            };
        }

        var entity = _.clone(_attributes);

        if (!entity.control_submit_time) {
            entity.control_submit_time = new Date();
        }
        if (!entity.owner_user_id) {
            entity.owner_user_id = myappkit.owner_user_id;
        }

        var controlpoint = ControlPoints.findOne({
            project_id: myappkit.project_id,
            control_name: entity.control_name
        });

        if (controlpoint) {
            _.extend(entity, {
                control_type: controlpoint.control_type,
            });
        }
        else {
            return {
                notExistControlPoint: true,
                _id: _attributes.device_id
            }
        }

        // console.log("ControlEvents", entity);

        var entityId = Collections.ControlEvents.insert(entity);

        return {
            _id: entityId
        };
    },

    controlEventsQuerySmall: function (_attributes) {
        // console.log("controlEventsQuery", _attributes);
        var device_id = _attributes.device_id
        var myappkit = Collections.Devices.findOne({_id: device_id});

        if (!myappkit) {
            return {
                notExistDevice: true,
                _id: _attributes.device_id
            };
        }

        var now = new Date();
        var events = Collections.ControlEvents.find({
                device_id: device_id,
                control_submit_time: {$gt: new Date(now - CONTROL_EVENT_RESEND_INTERVAL)}
            },
            {sort: {control_submit_time: -1}}).fetch();

        // console.log("controlEventsQuerySmall", events.length);

        var ret = {};
        var _event;
        for (var i = events.length; i > 0; i--) {
            _event = events[i - 1];
            //console.log("controlEventsQuerySmall", _event);

            ret[_event.control_name] = _event.control_value;
        }

        return ret;
    },

    controlEventsQuery: function (_attributes) {
        // console.log("controlEventsQuery", _attributes);
        var device_id = _attributes.device_id;
        var myappkit = Collections.Devices.findOne({_id: device_id});

        if (!myappkit) {
            return {
                notExistDevice: true,
                _id: _attributes.device_id
            };
        }

        var controlNames = ControlPoints.find({project_id: myappkit.project_id},
            {fields: {control_name: true}}).fetch();

        var ret = {};
        var _event, _ctrl_name;

        _.forEach(controlNames , function(controlName){
            _ctrl_name = controlName.control_name;
            // console.log("controlName", _ctrl_name);

            _event = Collections.ControlEvents.findOne({device_id: device_id, control_name: _ctrl_name},
                {sort: {control_submit_time: -1}});
            //console.log("control", _event);
            if (_event)
                ret[_ctrl_name] = {value: _event.control_value, submit_time: _event.control_submit_time.valueOf()};
        });

        //for (var i = 0; i < controlNames.length; i++) {
        //    _ctrl_name = controlNames[i].control_name;
        //    // console.log("controlName", _ctrl_name);
        //
        //    _event = Collections.ControlEvents.findOne({device_id: device_id, control_name: _ctrl_name},
        //        {sort: {control_submit_time: -1}});
        //    //console.log("control", _event);
        //    if (_event)
        //        ret[_ctrl_name] = {value: _event.control_value, submit_time: _event.control_submit_time.valueOf()};
        //}

        return ret;
    }
})
;
