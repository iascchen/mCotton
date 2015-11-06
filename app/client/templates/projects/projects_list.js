/**
 * Created by chenhao on 15/4/7.
 */

Meteor.subscribe('projects');

/************
 * projectsList
 ************/

Template.projectsList.helpers({
    projects: function () {
        return Collections.Projects.find({}, {sort: {name: 1}});
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