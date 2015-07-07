/**
 * Created by chenhao on 15/4/7.
 */

Meteor.publish('appkits', function () {
    return AppKits.find();
});

Meteor.publish('modules', function () {
    return Modules.find();
});

Meteor.publish('datapoints', function () {
    return DataPoints.find();
});

Meteor.publish('controlpoints', function () {
    return ControlPoints.find();
});

Meteor.publish('myappkits', function (userid) {
    return MyAppKits.find({owner_user_id: userid});
});

Meteor.publish('mymodules', function (userid) {
    return MyModules.find({owner_user_id: userid});
});

Meteor.publish('dataevents', function (userid) {
    return DataEvents.find({owner_user_id: userid});
});

Meteor.publish('controlevents', function (userid) {
    return ControlEvents.find({owner_user_id: userid});
});

Meteor.publish('datamessages', function (userid) {
    return DataMessages.find({owner_user_id: userid});
});

//Meteor.publish('gen_dev_id_reqs', function () {
//    return GenDeviceIDReqs.find();
//});