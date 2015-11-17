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

Meteor.publish("images", function () {
    return Collections.Images.find();
});

Meteor.publish("files", function () {
    return Collections.Files.find();
});

Meteor.publish('modules', function () {
    return Collections.Modules.find();
});

Meteor.publish('projects', function (limit) {
    var _limit = limit ? limit : PROJECT_1ST_PAGEN;

    if (Roles.userIsInRole(this.userId, ['admin', 'project-approval'])) {
        return Collections.Projects.find({}, {limit: _limit, sort: {name: 1}});
    } else {
        return Collections.Projects.find({
                $or: [{author_user_id: this.userId},
                    {status: STATUS_NORMAL},
                    {status: STATUS_READONLY}]
            },
            {limit: _limit, sort: {name: 1}}
        );
    }
});

Meteor.publish('project', function (id) {
    return Collections.Projects.find({_id: id});
});

Meteor.publish('projectDevices', function (id, limit) {
    var project = Collections.Projects.findOne({_id: id});
    //return Collections.Projects.find({project_id: project._id});

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

//Meteor.publish('modules', function (options) {
//    check(options, {
//        sort: Object,
//        limit: Number
//    });
//    return Collections.Modules.find({}, options);
//});
//
//Meteor.publish('projects', function (options) {
//    check(options, {
//        sort: Object,
//        limit: Number
//    });
//    return Collections.Projects.find({}, options);
//});

Meteor.publish("devices", function (limit) {
    var _limit = limit ? limit : DEVICE_1ST_PAGEN;

    if (Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
        return Collections.Devices.find({}, {limit: _limit, sort: {last_update_time: -1}});
    } else {
        return Collections.Devices.find({
                $or: [{owner_user_id: this.userId},
                    {share: SHARE_PUBLIC, $or: [{status: STATUS_NORMAL}, {status: STATUS_READONLY}]}]
            },
            {limit: _limit, sort: {last_update_time: -1}});
    }
});

Meteor.publish('allPublicDevices', function () {
    return Collections.Devices.find({
        share: SHARE_PUBLIC,
        $or: [{status: STATUS_NORMAL}, {status: STATUS_READONLY}]
    });
});

Meteor.publish('devicesPublic', function (limit) {
    var _limit = limit ? limit : DEVICE_1ST_PAGEN;

    return Collections.Devices.find({
            share: SHARE_PUBLIC, $or: [{status: STATUS_NORMAL}, {status: STATUS_READONLY}]
        },
        {limit: _limit, sort: {last_update_time: -1}});
});

Meteor.publish('device', function (id) {
    return Collections.Devices.find({_id: id});
});

Meteor.publish('deviceProject', function (id) {
    var device = Collections.Devices.findOne({_id: id});
    return Collections.Projects.find({_id: device.project_id});
});

Meteor.publish('deviceDataEvents', function (id, limit) {
    var _limit = limit ? limit : 500;

    return Collections.DataEvents.find({
        device_id: id
    }, {limit: _limit, sort: {data_submit_time: -1}});
});

Meteor.publish('devicesControlEvents', function (id, limit) {
    var _limit = limit ? limit : 100;

    return Collections.ControlEvents.find({
        device_id: id
    }, {limit: _limit, sort: {control_submit_time: -1}});
});

//Meteor.publish('deviceDataEvents', function (id, limit_from) {
//    var _limit_from = limit_from ? limit_from : moment(moment().hour() - 1, "HH").toDate();
//
//    return Collections.DataEvents.find({
//        device_id: id,
//        $or: [ { data_submit_time: {$gte: _limit_from}} ,
//
//    ]
//    }, {sort: {data_submit_time: -1}});
//});
//
//Meteor.publish('devicesControlEvents', function (id, limit_from) {
//    var _limit_from = limit_from ? limit_from : moment(moment().hour() - 1, "HH").toDate();
//    return Collections.ControlEvents.find({
//        device_id: id,
//        control_submit_time: {$gte: _limit_from}
//    }, {sort: {control_submit_time: -1}});
//});

Meteor.publish('mymodules', function () {
    if (Roles.userIsInRole(this.userId, ['admin', 'customer-care'])) {
        return MyModules.find();
    } else {
        return MyModules.find({owner_user_id: this.userId});
    }
});

Meteor.publish('dataevents', function () {
    if (Roles.userIsInRole(this.userId, ['admin', 'customer-care'])) {
        return Collections.DataEvents.find();
    } else {
        return Collections.DataEvents.find({owner_user_id: this.userId});
    }
});

Meteor.publish('dataeventsWithGPS', function () {
    return Collections.DataEvents.find({data_type: 'GPS'});
});

Meteor.publish('controlevents', function () {
    if (Roles.userIsInRole(this.userId, ['admin', 'customer-care'])) {
        return Collections.ControlEvents.find();
    } else {
        return Collections.ControlEvents.find({owner_user_id: this.userId});
    }
});

Meteor.publish('datamessages', function () {
    if (Roles.userIsInRole(this.userId, ['admin', 'customer-care'])) {
        return Collections.DataMessages.find();
    } else {
        return Collections.DataMessages.find({owner_user_id: this.userId});
    }
});

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
