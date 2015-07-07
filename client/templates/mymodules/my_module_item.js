//Meteor.subscribe('module');

Template.myModuleItem.helpers({
    gray: function () {
        if ((this.status == "used") || (this.status == "retired")) {
            return "gray";
        }
    },
});

Template.myModuleItem.events({
    'click .retire': function (e) {
        e.preventDefault();

        var currentId = this._id;

        if (confirm("Retire this module?")) {
            var now = new Date();
            MyModules.update(currentId, {$set: {status: 'retired', last_update_time: now}}, function (error) {
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

