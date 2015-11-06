/**
 * Created by chenhao on 15/4/7.
 */

Meteor.subscribe('devices', Meteor.userId());

Template.devicesList.helpers({
    devices: function () {
        return Collections.Devices.find({'status': {$lt : STATUS_DISABLE}}, {sort: {last_update_time: -1}});
    },
    owner: function () {
        return JSON.stringify(Meteor.user());
    }
});

Template.devicesList.rendered = function (){
    anchorScroll();
};