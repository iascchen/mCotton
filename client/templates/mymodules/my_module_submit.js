/**
 * Created by chenhao on 15/4/8.
 */
Template.myModuleSubmit.events({
    'submit form': function (e) {
        e.preventDefault();

        var entity = {
            module_id: this.module_id,
            name: $(e.target).find('[name=name]').val(),
        };

        console.log(entity);

        var errors = validateMyAppKit(entity);
        if (errors.name || errors.module_id)
            return Session.set('myModuleSubmitErrors', errors);

        Meteor.call('myModuleInsert', entity, function (error, result) {
            if (error)
                return throwError(error.reason);
        });

        Router.go('myModulesList');
    }
});


Template.myModuleSubmit.created = function () {
    Session.set('myModuleSubmitErrors', {});
};

Template.myModuleSubmit.helpers({
    errorMessage: function (field) {
        return Session.get('myModuleSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('myModuleSubmitErrors')[field] ? 'has-error' : '';
    }
});