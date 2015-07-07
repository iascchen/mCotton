/**
 * Created by chenhao on 15/4/7.
 */

Meteor.startup(function () {
    //GoogleMaps.load();
    //
    //Tracker.autorun(function() {
    //    console.log('There are ' + Posts.find().count() + ' posts');
    //});

    Template.registerHelper("formatDate", function (timestamp) {
        return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
    });

    Template.registerHelper("formatDateHour", function (timestamp) {
        return moment(timestamp).format("YYYY-MM-DD HH:00");
    });

    Template.registerHelper("showControlTypeIcon", function (control_type, control_value) {
        return controlTypeIcon(control_type, control_value);
    });

    Template.registerHelper("showDataTypeIcon", function (data_type) {
        return dataTypeIcon(data_type);
    });

    UI.registerHelper('equals', function (a, b) {
        return a == b;
    });

    UI.registerHelper('obj2String', function (obj) {
        if( typeof obj != 'object' )
            return obj;

        return JSON.stringify(obj);
    });

    UI.registerHelper('autherOfEntity', function () {
        var userId = Meteor.userId();
        return this && this.author_user_id === userId;
    });
});

