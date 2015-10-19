/**
 * Created by chenhao on 15/4/12.
 */

Collections.Devices = new Mongo.Collection('devices');

Schemas.Device = new SimpleSchema({
    owner_user_id: {
        type: String,
        label: "meteor.User _id",
        optional: false,
    },

    project_id: {
        type: String,
        optional: false,
    },

    name: {
        type: String,
        label: "Name",
        optional: false,
    },

    desc: {
        type: String,
        label: "Description",
        optional: true,
    },

    img_ids: {
        type: [String], label: "Images",
        optional: true,
    },

    create_time: {
        type: Date, label: "Create date this information",
        optional: false,
    },

    last_update_time: {
        type: Date, label: "Last date this information was updated",
        optional: false,
    },

    share: {
        type: Number, label: "Share",
        optional: true,
        allowedValues: SHARES_TYPES,
        autoValue: function () {
            return SHARE_FRIENDS;
        },
        autoform: {
            options: SHARES_AUTO_FORM
        }
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

Collections.Devices.attachSchema(Schemas.Device);

Collections.Devices.allow({
    update: function (userId, entity) {
        return autherEntity(userId, entity) || grantedEntity(userId, 'admin');
    },
    remove: function (userId, entity) {
        return autherEntity(userId, entity) || grantedEntity(userId, 'admin');
    },
});

Collections.Devices.deny({
    update: function (userId, entity, fieldNames) {
        // may only edit the following fields:
        return (_.without(fieldNames, 'name', 'desc', 'share', 'status', 'last_update_time', 'img_ids').length > 0);
    }
});

validateDevice = function (entity) {
    var errors = {};

    if (!entity.name)
        errors.name = "Please fill in a name";

    if (!entity.project_id)
        errors.project_id = "Please fill in a project_id";

    return errors;
};

Meteor.methods({
    deviceInsert: function (_attributes) {
        var user = Meteor.user();
        if (user) {
            _attributes.owner_user_id = user._id;
        }

        console.log("deviceInsert user_id", _attributes.owner_user_id);

        check(_attributes, {
            project_id: String,
            name: String,
            desc: String,
            owner_user_id: String,
        });

        var errors = validateDevice(_attributes);
        if (errors.name || errors.project_id)
            throw new Meteor.Error('invalid-device', "You must set a name and project_id for your device");

        var entityWithSameName = Collections.Devices.findOne({
            owner_user_id: _attributes.owner_user_id,
            name: _attributes.name,
            'status': {$lt: STATUS_DISABLE}
        });
        if (entityWithSameName) {
            console.log("entityWithSameName", entityWithSameName);
            return {
                sameNameDevice: true,
                _id: entityWithSameName._id
            }
        }

        var now = new Date();

        var entity = _.extend(_attributes, {
            create_time: now,
            last_update_time: now
        });

        // console.log("deviceInsert", entity);
        var entityId = Collections.Devices.insert(entity);

        return {
            _id: entityId
        };
    }
});
