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

    Handlebars.registerHelper('isAdminUser', function() {
        return Roles.userIsInRole(Meteor.user(), ['admin']);
    });

    UI.registerHelper('equals', function (a, b) {
        return a == b;
    });

    UI.registerHelper('obj2String', function (obj) {
        if (typeof obj != 'object')
            return obj;

        return JSON.stringify(obj);
    });

    UI.registerHelper('isAutherOrGrantedRole', function (role) {
        var user = Meteor.user();
        var isAuthor = this && this.author_user_id === user._Id;
       //var isGranted = (user && role) ? _.contains(user.roles, role) : false;
        var isGranted = Roles.userIsInRole(Meteor.user(), [role]);

        return isAuthor || isGranted;
    });

    UI.registerHelper('isOwnerOrGrantedRole', function (role) {
        var user = Meteor.user();
        var isOwner = this && this.owner_user_id === user._Id;

        //var isGranted = (user && role) ? _.contains(user.roles, role) : false;
        var isGranted = Roles.userIsInRole(Meteor.user(), [role]);

        return isOwner || isGranted;
    });

    UI.registerHelper('isGranted', function (role) {
        // var user = Meteor.user();
        // return (user && role) ? _.contains(user.roles, role) : false;
        return Roles.userIsInRole(Meteor.user(), [role]);
    });

    Template.registerHelper('log', function () {
        console.log(this, arguments);
    });

    //Uploader.uploadUrl = Meteor.absoluteUrl("upload"); // Cordova needs absolute URL
});