Meteor.subscribe('modules');

Template.appKitModuleItem.helpers({
    _: function () {
        return Modules.findOne({_id: this.id});
    }
});