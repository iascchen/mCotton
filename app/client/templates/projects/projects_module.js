Meteor.subscribe('modules');

Template.projectModule.helpers({
    _: function () {
        return Collections.Modules.findOne({_id: this.id});
    }
});