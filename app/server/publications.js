/**
 * Created by chenhao on 15/4/7.
 */

Meteor.publish('secrets', function (group) {
    if (Roles.userIsInRole(this.userId, ['view-secrets', 'admin'], group)) {
        return Meteor.secrets.find({group: group});
    } else {
        // user not authorized. do not publish secrets
        this.stop();
        return;
    }
});

///////////////////
//
// Images & Files
//
///////////////////

Meteor.publish("images", function () {
    return Collections.Images.find();
});

Meteor.publish("files", function () {
    return Collections.Files.find();
});

///////////////////
//
// Modules
//
///////////////////

Meteor.publish('modules', function () {
    return Collections.Modules.find();
});

//Meteor.publish('modules', function (options) {
//    check(options, {
//        sort: Object,
//        limit: Number
//    });
//    return Collections.Modules.find({}, options);
//});

Meteor.publish('mymodules', function () {
    if (Roles.userIsInRole(this.userId, ['admin', 'customer-care'])) {
        return MyModules.find();
    } else {
        return MyModules.find({owner_user_id: this.userId});
    }
});


///////////////////
//
// Projects
//
///////////////////

Meteor.publish('projects', function (limit, sorter) {
    var _limit = limit ? limit : PROJECT_PAGINATION;
    var _sorter = sorter ? sorter : {name: 1};

    if (Roles.userIsInRole(this.userId, ['admin', 'project-approval'])) {
        return Collections.Projects.find({}, {limit: _limit, sort: {name: 1}});
    } else {
        return Collections.Projects.find({
                $or: [{author_user_id: this.userId},
                    {status: STATUS_NORMAL},
                    {status: STATUS_READONLY}]
            },
            {limit: _limit, sort: _sorter, fields: {name: 1, desc: 1, author_user_id: 1, img_ids: 1}}
        );
    }
});

Meteor.publish('project', function (id) {
    return Collections.Projects.find({_id: id});
});

Meteor.publish("projectImages", function (id) {
    var project = Collections.Projects.findOne({_id: id});
    var imgs = project.img_ids ? project.img_ids : [];

    return Collections.Images.find({_id: {$in: imgs}});
});

Meteor.publish('projectDevices', function (id, limit) {
    var project = Collections.Projects.findOne({_id: id});
    var _limit = limit ? limit : RECOMMENDED_ITEMS;

    if (Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
        return Collections.Devices.find({project_id: project._id}, {limit: _limit, sort: {last_update_time: -1}});
    } else {
        return Collections.Devices.find({
                $or: [{owner_user_id: this.userId, project_id: project._id},
                    {
                        share: SHARE_PUBLIC,
                        project_id: project._id,
                        $or: [{status: STATUS_NORMAL}, {status: STATUS_READONLY}]
                    }]
            },
            {limit: _limit, sort: {last_update_time: -1}});
    }
});

///////////////////
//
// Devices
//
///////////////////

Meteor.publish("devices", function (limit, sorter) {
    var _limit = limit ? limit : DEVICE_PAGINATION;
    var _sorter = sorter ? sorter : {last_update_time: -1};

    if (Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
        return Collections.Devices.find({}, {limit: _limit, sort: {last_update_time: -1}});
    } else {
        return Collections.Devices.find({
                $or: [{owner_user_id: this.userId},
                    {share: SHARE_PUBLIC, $or: [{status: STATUS_NORMAL}, {status: STATUS_READONLY}]}]
            },
            {
                limit: _limit, sort: _sorter,
                fields: {name: 1, desc: 1, project_id: 1, owner_user_id: 1, img_ids: 1, share: 1}
            });
    }
});

Meteor.publish('devicesPublic', function (limit, sorter) {
    var _limit = limit ? limit : DEVICE_PAGINATION;
    var _sorter = sorter ? sorter : {last_update_time: -1};

    return Collections.Devices.find({
            share: SHARE_PUBLIC, $or: [{status: STATUS_NORMAL}, {status: STATUS_READONLY}]
        },
        {
            limit: _limit, sort: _sorter,
            fields: {name: 1, desc: 1, project_id: 1, owner_user_id: 1, img_ids: 1, share: 1}
        });
});

Meteor.publish('device', function (id) {
    return Collections.Devices.find({_id: id});
});

Meteor.publish("deviceImages", function (id) {
    var device = Collections.Devices.findOne({_id: id});
    var imgs = device.img_ids ? device.img_ids : [];

    return Collections.Images.find({_id: {$in: imgs}});
});

Meteor.publish('deviceProject', function (id) {
    var device = Collections.Devices.findOne({_id: id});
    return Collections.Projects.find({_id: device.project_id});
});

Meteor.publish('deviceDataEvents', function (id, limit) {
    var _limit = limit ? limit : 200;

    return Collections.DataEvents.find({
        device_id: id
    }, {limit: _limit, sort: {data_submit_time: -1}});
});

Meteor.publish('deviceControlEvents', function (id, limit) {
    var _limit = limit ? limit : 50;

    return Collections.ControlEvents.find({
        device_id: id
    }, {limit: _limit, sort: {control_submit_time: -1}});
});

Meteor.publish('devicesDataEventsLater', function (ids, limit) {
    var _limit = limit ? limit : 200;
    var now = moment();
    // console.log(now.toDate());

    return Collections.DataEvents.find({
        device_id: {$in: ids},
        data_submit_time: {$gte: now.toDate()}
    }, {limit: _limit, sort: {data_submit_time: -1}});
});

Meteor.publish('devicesControlEventsLater', function (ids, limit) {
    var _limit = limit ? limit : 50;
    var now = moment();
    // console.log(now.toDate());

    return Collections.ControlEvents.find({
        device_id: {$in: ids},
        control_submit_time: {$gte: now.toDate()},
    }, {limit: _limit, sort: {control_submit_time: -1}});
});

//Meteor.publish('allGpsPublicDevices', function () {
//    return Collections.Devices.find({
//            share: SHARE_PUBLIC,
//            $or: [{status: STATUS_NORMAL}, {status: STATUS_READONLY}]
//        });
//});

Meteor.publish('dataeventsWithGPS', function () {
    return Collections.DataEvents.find({data_type: 'GPS'});
});

///////////////////
//
// Others
//
///////////////////

//Meteor.publish('gen_dev_id_reqs', function () {
//    return GenDeviceIDReqs.find();
//});

//Meteor.publish('messages', function (userid) {
//    // return DataMessages.find({owner_user_id: userid});
//    var self = this;
//    mqttClient.on("message", function (topic, message) {
//        var msg = {
//            message: message, topic: topic, ts: new Date()
//        };
//        self.added("messages", new Date().toString(), msg);
//    });
//    self.ready();
//    ready = true;
//});

