/**
 * Created by chenhao on 15/10/20.
 */

Collections.MapMakers = new Meteor.Collection('mapmarkers');

Schemas.MapMaker = new SimpleSchema({
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

Collections.MapMakers.attachSchema(Schemas.MapMaker);