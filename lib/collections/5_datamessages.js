/**
 * Created by chenhao on 15/4/16.
 */

Collections.DataMessages = new Mongo.Collection('datamessages');

Schemas.DataMessage = new SimpleSchema({
    owner_user_id: {
        type: String,
        label: "meteor.User _id",
        optional: false,
    },

    device_id: {
        type: String, label: "device_id",
        optional: false,
    },

    data_message: {
        type: String, label: "data_message",
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

    process_status: {
        type: String, label: "process_status",
        optional: true,
    },
});

Collections.DataMessages.attachSchema(Schemas.DataMessage);

Meteor.methods({
    dataMessageInsert: function (_attributes) {
        // console.log("dataMessageInsert", _attributes);

        var device_id = _attributes.device_id;

        var device = Collections.Devices.findOne({_id: device_id});
        if (!device) {
            return {
                notExistDevice: true,
                _id: device_id
            };
        }

        delete _attributes.device_id;

        var sid = _attributes.sid;
        delete _attributes.sid;

        var _data = JSON.stringify(_attributes);
        // console.log("_data", _data);

        var entity = {
            device_id: device_id,
            data_message: _data,
            data_submit_time: new Date(),
            owner_user_id: device.owner_user_id,
            process_status: "new"
        };

        if(sid){
            _.extend(entity, {
                sid: sid,
            });
        }

        var entityId = Collections.DataMessages.insert(entity);

        return {
            _id: entityId
        };
    }
});
