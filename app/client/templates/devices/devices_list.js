/**
 * Created by chenhao on 15/4/7.
 */

Template.devicesList.onCreated(function () {

    // 1. Initialization

    var instance = this;
    // console.log("Meteor UserID", Meteor.userId());


    // initialize the reactive variables
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(DEVICE_PAGINATION);

    // 2. Autorun

    // will re-run when the "limit" reactive variables changes
    instance.autorun(function () {

        // get the limit
        var limit = instance.limit.get();

        //console.log("Asking for "+limit+" devices…")

        // subscribe to the publication
        var subscription = instance.subscribe('devices', limit);

        // if subscription is ready, set limit to newLimit
        if (subscription.ready()) {
            // console.log("> Received "+limit+" devices. \n\n")
            instance.loaded.set(limit);
        } else {
            // console.log("> Subscription is not ready yet. \n\n");
        }
    });

    // 3. Cursor

    instance.myDevices = function () {
        return Collections.Devices.find({owner_user_id: Meteor.userId(), 'status': {$lt: STATUS_DISABLE}},
            {limit: instance.loaded.get(), sort: {last_update_time: -1}});
    };

    instance.publicDevices = function () {
        return Collections.Devices.find({
                owner_user_id: {$ne: Meteor.userId()},
                share: SHARE_PUBLIC,
                'status': {$lt: STATUS_DISABLE}
            },
            {limit: DEVICE_PAGINATION, sort: {last_update_time: -1}});
    };
});

Template.devicesList.helpers({
    myDevices: function () {
        // return Collections.Devices.find({'status': {$lt : STATUS_DISABLE}}, {sort: {last_update_time: -1}});
        return Template.instance().myDevices();
    },
    publicDevices: function () {
        // return Collections.Devices.find({'status': {$lt : STATUS_DISABLE}}, {sort: {last_update_time: -1}});
        return Template.instance().publicDevices();
    },
    // are there more posts to show?
    hasMoreEntities: function () {
        return Template.instance().myDevices().count() >= Template.instance().limit.get();
    },
    owner: function () {
        return JSON.stringify(Meteor.user());
    }
});

Template.devicesList.events({
    'click .load-more': function (event, instance) {
        event.preventDefault();

        // get current value for limit, i.e. how many posts are currently displayed
        var limit = instance.limit.get();

        // increase limit by 5 and update it
        limit += DEVICE_PAGINATION;
        instance.limit.set(limit);
    }
});