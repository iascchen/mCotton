//Meteor.subscribe('module');

Template.myModuleItem.helpers({
    gray: function () {
        if (this.status >= STATUS_DISABLE) {
            return "gray";
        }
    },
});

Template.myModuleItem.events({
    'click .remove': function (e) {
        e.preventDefault();

        var currentId = this._id;

        if (confirm("Remove this module?")) {
            var now = new Date();
            MyModules.update(currentId, {$set: {status: 'removed', last_update_time: now}}, function (error) {
                if (error) {
                    throwError(error.reason);
                } else {
                    Router.go('myModulesList');
                }
            });
        }

        Router.go('myModulesList');
    }
});

