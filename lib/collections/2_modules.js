/**
 * Created by chenhao on 15/4/12.
 */
Collections.Modules = new Mongo.Collection('modules');

Schemas.Module = new SimpleSchema({
    name: {
        type: String, label: "Name",
        optional: false,
        unique: true,
    },

    desc: {
        type: String, label: "Description",
        optional: true,
    },

    img_id: {
        type: String, label: "Image",
        optional: true,
    },

    author_user_id: {
        type: String, label: "meteor.User that created this module",
        optional: false,
    },

    create_time: {
        type: Date, label: "Create date this information",
        optional: false,
    },

    last_update_time: {
        type: Date, label: "Last date this information was updated",
        optional: false,
        autoValue: function () {
            return new Date();
        }
    },

    status: {
        type: Number, label: "Status",
        optional: false,
        allowedValues: STATUS_TYPES,
        autoform: {
            options: STATUS_AUTO_FORM
        }
    },
});

Collections.Modules.attachSchema(Schemas.Module);

Collections.Modules.allow({
    update: function (userId, entity) {
        return autherEntity(userId, entity) || grantedEntity(userId, 'admin');
    },
    remove: function (userId, entity) {
        return autherEntity(userId, entity) || grantedEntity(userId, 'admin');
    },
});

Collections.Modules.deny({
    update: function (userId, entity, fieldNames) {
        // may only edit the following fields:
        // console.log(fieldNames);
        return (_.without(fieldNames, 'name', 'desc', 'img_id', 'last_update_time', 'status').length > 0);
    }
});

validateModule = function (entity) {
    var errors = {};

    if (!entity.name)
        errors.name = "Please fill in a name";

    return errors;
};

Meteor.methods({
    moduleInsert: function (_attributes) {
        // check(this.owner_user_id, String);

        check(_attributes, {
            name: String,
            desc: String,
            img_id: String,
        });

        var errors = validateModule(_attributes);
        if (errors.name)
            throw new Meteor.Error('invalid-post', "You must set a name for your module");

        var entityWithSameName = Collections.Modules.findOne({name: _attributes.name, status: {$lt: STATUS_DISABLE}});
        if (entityWithSameName) {
            return {
                sameNameModule: true,
                _id: entityWithSameName._id
            }
        }

        // console.log("moduleInsert");

        var user = Meteor.user();
        var now = new Date();

        var entity = _.extend(_attributes, {
            author_user_id: user._id,
            create_time: now,
            last_update_time: now,
            status: STATUS_NORMAL
        });

        Schemas.Module.clean(_attributes);

        console.log("moduleInsert", entity);

        try {
            check(entity, Schemas.Module);
            Schemas.Module.clean(entity);
        } catch (e) {
            throw new Meteor.Error(e);
        };

        var entityId = Collections.Modules.insert(entity);

        return {
            _id: entityId
        };
    }
});
