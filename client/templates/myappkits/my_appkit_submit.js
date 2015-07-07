/**
 * Created by chenhao on 15/4/8.
 */
Template.myAppKitSubmit.events({
    'submit form': function (e) {
        e.preventDefault();

        var entity = {
            app_kit_id: this.app_kit_id,
            name: $(e.target).find('[name=name]').val(),
        };

        console.log(entity);

        var errors = validateMyAppKit(entity);
        if (errors.name || errors.app_kit_id)
            return Session.set('myAppKitSubmitErrors', errors);

        Meteor.call('myAppKitInsert', entity, function (error, result) {
            if (error)
                return throwError(error.reason);

            if (result.sameNameMyAppKit)
                return throwError('This same name AppKit has already been added');
        });

        Router.go('myAppKitsList');
    }
});


Template.myAppKitSubmit.created = function () {
    Session.set('myAppKitSubmitErrors', {});
};

Template.myAppKitSubmit.helpers({
    errorMessage: function (field) {
        return Session.get('myAppKitSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('myAppKitSubmitErrors')[field] ? 'has-error' : '';
    }
});