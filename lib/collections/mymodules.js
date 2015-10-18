/**
 * Created by chenhao on 15/4/12.
 */

Schemas.MyModule = new SimpleSchema({
    owner_user_id: {
        type: String,
        label: "meteor.User that own this module",
        optional: false,
    },

    module_id: {
        type: String,
        optional: false,
    },

    name: {
        type: String,
        label: "Name",
        // regEx: /^[a-zA-Z-]{2,25}$/,
        optional: false,
    },

    count: {
        type: Number, label: "Count",
        optional: true
    },

    create_time: {
        type: Date,
        label: "Create date this information",
        optional: true
    },

    last_update_time: {
        type: Date,
        label: "Last date this information was updated",
        optional: true
    },
});

MyModules = new Mongo.Collection('mymodules', Schemas.MyModule);

MyModules.allow({
    update: function (userId, entity) {
        return ownsEntity(userId, entity);
    },
    remove: function (userId, entity) {
        return ownsEntity(userId, entity);
    },
});

MyModules.deny({
    update: function (userId, entity, fieldNames) {
        // may only edit the following fields:
        return (_.without(fieldNames, 'name', 'module_id', 'status', 'last_update_time').length > 0);
    }
});

validateMyModule = function (entity) {
    var errors = {};

    if (!entity.name)
        errors.name = "Please fill in a name";

    if (!entity.module_id)
        errors.module_id = "Please fill in a module_id";

    return errors;
};

Meteor.methods({
    myModuleInsert: function (_attributes) {
        // check(this.owner_user_id, String);

        check(_attributes, {
            name: String,
            module_id: String,
        });

        var errors = validateMyModule(_attributes);
        if (errors.name || errors.module_id)
            throw new Meteor.Error('invalid-post', "You must set a name and project_id for your appkit");

        var user = Meteor.user();
        var now = new Date();

        var entity = _.extend(_attributes, {
            owner_user_id: user._id,
            create_time: now,
            last_update_time: now
        });

        // console.log("myModuleInsert", entity);

        var entityId = MyModules.insert(entity);

        return {
            _id: entityId
        };
    }
});
