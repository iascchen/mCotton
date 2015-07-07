/**
 * Created by chenhao on 15/4/16.
 */
    
var Schemas = {};

Schemas.DataMessage = new SimpleSchema({
    owner_user_id: {
        type: String,
        label: "meteor.User _id",
        optional: false,
    },

    my_app_kit_id: {
        type: String, label: "my_app_kit_id",
        optional: false,
    },

    data_message: {
        type: String, label: "data_message",
        optional: false,
    },

    sid: {
        type: String, label: "sid",
    },

    data_submit_time: {
        type: Date, label: "data_submit_time",
    },

    process_status: {
        type: String, label: "process_status",
    },
});

DataMessages = new Mongo.Collection('datamessages', Schemas.DataMessage);

Meteor.methods({
    dataMessageInsert: function (_attributes) {
        // console.log("dataMessageInsert", _attributes);

        var my_app_kit_id = _attributes.my_app_kit_id;

        var myappkit = MyAppKits.findOne({_id: my_app_kit_id});
        if (!myappkit) {
            return {
                notExistMyAppKit: true,
                _id: my_app_kit_id
            };
        }

        delete _attributes.my_app_kit_id;

        var sid = _attributes.sid;
        delete _attributes.sid;

        var _data = JSON.stringify(_attributes);
        // console.log("_data", _data);

        var entity = {
            my_app_kit_id: my_app_kit_id,
            data_message: _data,
            data_submit_time: new Date(),
            owner_user_id: myappkit.owner_user_id,
            process_status: "new"
        };

        if(sid){
            _.extend(entity, {
                sid: sid,
            });
        }

        var entityId = DataMessages.insert(entity);

        return {
            _id: entityId
        };
    }
});
