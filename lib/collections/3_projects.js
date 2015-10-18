/**
 * Created by chenhao on 15/4/12.
 */

Collections.Projects = new Mongo.Collection('projects');

Schemas.Project = new SimpleSchema({
    name: {
        type: String,
        optional: false,
        unique: true,
    },

    desc: {
        type: String, label: "Description",
        optional: true,
    },

    author_user_id: {
        type: String, label: "meteor.User that created this Project",
        optional: false,
    },

    img_ids: {
        type: [String], label: "Images",
        optional: true,
    },

    module_ids: {
        type: [String], label: "List of modules used in this Project?",
        optional: true,
    },

    show_chart: {
        type: String, label: "Visualization",
        optional: true,
        allowedValues: CHART_TYPES,
        autoform: {
            options: CHART_AUTO_FORM
        }
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
        autoValue: function () {
            return STATUS_SUBMIT;
        },
        autoform: {
            options: STATUS_AUTO_FORM
        }
    },

    /////////////////////
    // Data Points
    /////////////////////

    data_points: {
        type: Array, label: "Data Points",
        optional: true
    },
    'data_points.$': {
        type: Object
    },
    'data_points.$.data_type': {
        type: String, label: "Data Type",
        optional: true,
        allowedValues: DATA_POINT_TYPES,
        autoform: {
            options: DATA_POINT_AUTO_FORM
        }
    },
    'data_points.$.data_name': {
        type: String, label: "Data Name",
        optional: true,
    },
    'data_points.$.data_desc': {
        optional: true,
        type: String, label: "Data Description",
    },
    'data_points.$.data_show_list': {
        optional: true,
        type: Boolean, label: "Show Data As List"
    },

    /////////////////////
    // Control Points
    /////////////////////

    control_points: {
        type: Array, label: "Control Points",
        optional: true
    },
    'control_points.$': {
        type: Object
    },
    'control_points.$.control_type': {
        type: String, label: "Control Type",
        optional: true,
        allowedValues: CONTROL_POINT_TYPES,
        autoform: {
            options: CONTROL_POINT_AUTO_FORM
        }
    },
    'control_points.$.control_name': {
        type: String, label: "Control Name",
        optional: true
    },
    'control_points.$.control_desc': {
        type: String, label: "Control Description",
        optional: true
    }
});

Collections.Projects.attachSchema(Schemas.Project);

Collections.Projects.allow({
    update: function (userId, entity) {
        return autherEntity(userId, entity) || grantedEntity(userId, 'admin');
    },
    remove: function (userId, entity) {
        return autherEntity(userId, entity) || grantedEntity(userId, 'admin');
    },
});

Collections.Projects.deny({
    update: function (userId, entity, fieldNames) {
        // may only edit the following fields:
        // console.log(fieldNames);
        return (_.without(fieldNames,
            'name', 'desc', 'show_chart', 'status', 'last_update_time',
            'img_ids', 'module_ids', 'data_points', 'control_points').length > 0);
    }
});

validateProject = function (entity) {
    var errors = {};

    if (!entity.name)
        errors.name = "Please fill in a name";

    return errors;
};

Meteor.methods({
    projectInsert: function (_attributes) {

        console.log("projectInsert", _attributes);

        check(_attributes, {
            name: String,
            desc: String,
            show_chart: String,
        });

        var errors = validateProject(_attributes);
        if (errors.name)
            throw new Meteor.Error('invalid-post', "You must set a name for your project");

        var entityWithSameName = Collections.Projects.findOne({name: _attributes.name, status: {$lt: STATUS_DISABLE}});
        if (entityWithSameName) {
            return {
                sameNameModule: true,
                _id: entityWithSameName._id
            }
        }

        //console.log("projectInsert 2");

        var user = Meteor.user();
        var now = new Date();

        var entity = _.extend(_attributes, {
            author_user_id: user._id,
            create_time: now,
            last_update_time: now
        });

        console.log("projectInsert", entity);

        var entityId = Collections.Projects.insert(entity);

        return {
            _id: entityId
        };
    }
});
