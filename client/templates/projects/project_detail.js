/**
 * Created by chenhao on 15/4/7.
 */

Meteor.subscribe('projects');

Template.projectDetail.helpers({
    //images: function () {
    //    if(this.img_ids)
    //        return Collections.Images.find({_id: {"$in": this.img_ids}}); // Where Images is an FS.Collection instance
    //},
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