/**
 * Created by chenhao on 15/4/12.
 */

var Schemas = {};

Schemas.Module = new SimpleSchema({
    name: {
        type: String, label: "Name",
        // regEx: /^[a-zA-Z-]{2,25}$/,
        optional: false, unique: true,
    },

    desc: {
        type: String, label: "Description",
        // regEx: /^[a-zA-Z-]{2,1024}$/,
        optional: true,
    },

    author_user_id: {
        type: String, label: "meteor.User that created this module",
        optional: true,
    },

    create_time: {
        type: Date, label: "Create date this information",
    },

    last_update_time: {
        type: Date, label: "Last date this information was updated",
    },

    status:{
        type: String, label: "retired",
    },
});

Modules = new Mongo.Collection('modules', Schemas.Module);

Modules.allow({
    update: function (userId, entity) {
        return autherEntity(userId, entity);
    },
    remove: function (userId, entity) {
        return autherEntity(userId, entity);
    },
});

Modules.deny({
    update: function (userId, entity, fieldNames) {
        // may only edit the following fields:
        return (_.without(fieldNames, 'name', 'desc', 'status', 'last_update_time').length > 0);
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
        });

        var errors = validateModule(_attributes);
        if (errors.name)
            throw new Meteor.Error('invalid-post', "You must set a name for your module");

        var entityWithSameName = Modules.findOne({name: _attributes.name, status: {$ne : "retired"}});
        if (entityWithSameName) {
            return {
                sameNameModule: true,
                _id: entityWithSameName._id
            }
        }

        console.log("moduleInsert");

        var user = Meteor.user();
        var now = new Date();

        var entity = _.extend(_attributes, {
            author_user_id: user._id,
            create_time: now,
            last_update_time: now
        });

        console.log("moduleInsert", entity);

        var entityId = Modules.insert(entity);

        return {
            _id: entityId
        };
    }
});
