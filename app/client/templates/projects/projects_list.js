/**
 * Created by chenhao on 15/4/7.
 */

/************
 * projectsList
 ************/

Template.projectsList.onCreated(function () {

    // 1. Initialization

    var instance = this;

    // initialize the reactive variables
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(PROJECT_PAGINATION);

    // 2. Autorun

    // will re-run when the "limit" reactive variables changes
    instance.autorun(function () {

        // get the limit
        var limit = instance.limit.get();

        console.log("Asking for "+limit+" projects…")

        // subscribe to the publication
        var subscription = instance.subscribe('projects', limit);

        // if subscription is ready, set limit to newLimit
        if (subscription.ready()) {
            console.log("> Received "+limit+" projects. \n\n")
            instance.loaded.set(limit);
        } else {
            console.log("> Subscription is not ready yet. \n\n");
        }
    });

    // 3. Cursor

    instance.projects = function() {
        //return Collections.Projects.find({'status': {$lt : STATUS_DISABLE}},
        //    {limit: instance.loaded.get() , sort: {last_update_time: -1}});
        return Collections.Projects.find({}, {limit: instance.loaded.get() ,sort: {name: 1}});
    }

});

Template.projectsList.helpers({
    //projects: function () {
    //    return Collections.Projects.find({}, {sort: {name: 1}});
    //}
    projects: function () {
        // return Collections.Devices.find({'status': {$lt : STATUS_DISABLE}}, {sort: {last_update_time: -1}});
        return Template.instance().projects();
    },
    // are there more posts to show?
    hasMoreEntities: function () {
        return Template.instance().projects().count() >= Template.instance().limit.get();
    },
});


Template.projectsList.events({
    'click .load-more': function (event, instance) {
        event.preventDefault();

        // get current value for limit, i.e. how many posts are currently displayed
        var limit = instance.limit.get();

        // increase limit by 5 and update it
        limit += PROJECT_PAGINATION;
        instance.limit.set(limit);
    }
});

/************
 * projectSummary
 ************/

Template.projectSummary.helpers({
    firstIamge: function () {
        if (this.img_ids && this.img_ids.length > 0)
            return Collections.Images.findOne({_id: this.img_ids[0]}); // Where Images is an FS.Collection instance
    },
});

Template.projectSummary.events({
    'click .assemble': function (e) {
        e.preventDefault();
        Router.go('deviceSubmit', {}, {query: 'project_id=' + this._id});
    },

    'click .detail': function (e) {
        e.preventDefault();
        Router.go('projectDetail', {_id: this._id});
    }
});
