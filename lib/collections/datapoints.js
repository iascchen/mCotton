/**
 * Created by chenhao on 15/4/12.
 */

/**
 * Created by chenhao on 15/4/12.
 */

var Schemas = {};

Schemas.DataPoint = new SimpleSchema({

    app_kit_id: {
        type: String, label: "Related AppKit ID",
        optional: false,
    },

    data_name: {
        type: String, label: "Name",
        // regEx: /^[a-zA-Z-]{2,25}$/,
        optional: false,
    },

    data_type: {
        type: String, label: "Measure Target, Such as temperature, heart rate, and so on",
        // regEx: /^[a-zA-Z-]{2,25}$/,
        optional: false,
    },

    data_unit: {
        type: String, label: "Unit of value",
        optional: false,
    },

    show_list:{
        type: Boolean, label: "default is false",
        optional: true,
    },

});

DataPoints = new Mongo.Collection('dataPoints', Schemas.DataPoint);