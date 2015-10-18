/**
 * Created by chenhao on 15/4/7.
 */

Meteor.publish('secrets', function (group) {
    if (Roles.userIsInRole(this.userId, ['view-secrets','admin'], group)) {
        return Meteor.secrets.find({group: group});
    } else {
        // user not authorized. do not publish secrets
        this.stop();
        return;

    }
});

Meteor.publish("images", function() {
    return Collections.Images.find();
});

Meteor.publish("files", function() {
    return Collections.Files.find();
});

Meteor.publish('modules', function () {
    return Collections.Modules.find();
});

Meteor.publish('projects', function () {
    return Collections.Projects.find();
});

Meteor.publish('devices', function (userid) {
    return Collections.Devices.find({owner_user_id: userid});
});

Meteor.publish('mymodules', function (userid) {
    return MyModules.find({owner_user_id: userid});
});

Meteor.publish('dataevents', function (userid) {
    return Collections.DataEvents.find({owner_user_id: userid});
});

Meteor.publish('controlevents', function (userid) {
    return Collections.ControlEvents.find({owner_user_id: userid});
});

Meteor.publish('datamessages', function (userid) {
    return Collections.DataMessages.find({owner_user_id: userid});
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