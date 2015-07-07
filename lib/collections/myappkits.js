/**
 * Created by chenhao on 15/4/12.
 */

/**
 * Created by chenhao on 15/4/12.
 */

var Schemas = {};

Schemas.MyAppKit = new SimpleSchema({
    owner_user_id: {
        type: String,
        label: "meteor.User _id",
        optional: false,
    },

    name: {
        type: String,
        label: "Name",
        // regEx: /^[a-zA-Z-]{2,25}$/,
        optional: false,
    },

    app_kit_id: {
        type: String,
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

MyAppKits = new Mongo.Collection('myappkits', Schemas.MyAppKit);

MyAppKits.allow({
    update: function (userId, entity) {
        return ownsEntity(userId, entity);
    },
    remove: function (userId, entity) {
        return ownsEntity(userId, entity);
    },
});

MyAppKits.deny({
    update: function (userId, entity, fieldNames) {
        // may only edit the following fields:
        return (_.without(fieldNames, 'name', 'app_kit_id', 'status', 'last_update_time').length > 0);
    }
});

validateMyAppKit = function (entity) {
    var errors = {};

    if (!entity.name)
        errors.name = "Please fill in a name";

    if (!entity.app_kit_id)
        errors.app_kit_id = "Please fill in a app_kit_id";

    return errors;
};

Meteor.methods({
    myAppKitInsert: function (_attributes) {
        var user = Meteor.user();
        if(user){
            _attributes.owner_user_id = user._id;
        }

        console.log("myAppKitInsert user_id", _attributes.owner_user_id);

        check(_attributes, {
            name: String,
            app_kit_id: String,
            owner_user_id: String,
        });

        var errors = validateMyAppKit(_attributes);
        if (errors.name || errors.app_kit_id)
            throw new Meteor.Error('invalid-post', "You must set a name and app_kit_id for your appkit");

        var entityWithSameName = MyAppKits.findOne({owner_user_id : _attributes.owner_user_id,
            app_kit_id: _attributes.app_kit_id,
            name: _attributes.name,
            'status': {$ne : "retired"}});
        if (entityWithSameName) {
            console.log("entityWithSameName", entityWithSameName);
            return {
                sameNameMyAppKit: true,
                _id: entityWithSameName._id
            }
        }

        var now = new Date();

        var entity = _.extend(_attributes, {
            create_time: now,
            last_update_time: now
        });

        // console.log("myAppKitInsert", entity);
        var entityId = MyAppKits.insert(entity);

        return {
            _id: entityId
        };
    }
});
