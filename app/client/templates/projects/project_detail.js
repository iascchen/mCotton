/**
 * Created by chenhao on 15/4/7.
 */


Template.projectDetail.onCreated(function () {

    // 1. Initialization

    var instance = this;
    // console.log("Meteor UserID", Meteor.userId());
    // console.log("Project ID ", this.data._id);

    // initialize the reactive variables
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(RECOMMENDED_ITEMS);

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
        //console.log("Project ID ", this.data._id);

        return Collections.Devices.find({
                owner_user_id: Meteor.userId(),
                project_id: instance.data._id,
                'status': {$lt: STATUS_DISABLE}
            },
            {limit: RECOMMENDED_ITEMS, sort: {last_update_time: -1}});
    };

    instance.publicDevices = function () {
        //console.log("Project ID ", this.data._id);

        return Collections.Devices.find({
                project_id: instance.data._id,
                owner_user_id: {$ne: Meteor.userId()},
                share: SHARE_PUBLIC,
                'status': {$lt: STATUS_DISABLE}
            },
            {limit: RECOMMENDED_ITEMS, sort: {last_update_time: -1}});
    };
});

Template.projectDetail.helpers({
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
    },
    hasGPS: function () {
        var data_points = this.data_points;
        var gps_point = _.filter(data_points, function (point) {
            return point.data_type == 'GPS'
        });

        if (!gps_point || gps_point.length == 0)
            return false;

        return true;
    }
});

Template.projectDetail.events({
    'click .assemble': function (e) {
        e.preventDefault();
        Router.go('deviceSubmit', {}, {query: 'project_id=' + this._id});
    },

    'click .edit': function (e) {
        e.preventDefault();
        Router.go('projectEdit', {_id: this._id});
    },

    'click .remove': function (e) {
        e.preventDefault();

        if (confirm("Delete this project?")) {
            var currentId = this._id;
            Collections.Projects.remove(currentId);
            Router.go('projectsList');
        }
    },
});