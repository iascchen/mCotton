// Meteor.subscribe('project_sources');

Template.projectSource.helpers({
    _: function () {
        return Collections.ProjectSources.findOne({_id: this.id});
    }
});