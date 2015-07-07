/**
 * Created by chenhao on 15/4/12.
 */

/**
 * Created by chenhao on 15/4/12.
 */

var Schemas = {};

Schemas.ControlPoint = new SimpleSchema({
    app_kit_id: {
        type: String, label: "Related AppKit ID",
        optional: false,
    },

    control_name: {
        type: String, label: "Name",
        // regEx: /^[a-zA-Z-]{2,25}$/,
        optional: false,
    },

    control_type: {
        type: String, label: "Control Target, Such as led, switch, and so on",
        // regEx: /^[a-zA-Z-]{2,25}$/,
        optional: false,
    },
});

ControlPoints = new Mongo.Collection('controlPoints', Schemas.ControlPoint);