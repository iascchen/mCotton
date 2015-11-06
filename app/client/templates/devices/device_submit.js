/**
 * Created by chenhao on 15/4/8.
 */
Template.deviceSubmit.events({
    'submit form': function (e) {
        e.preventDefault();

        var entity = {
            project_id: $(e.target).find('[name=project_id]').val(),
            name: $(e.target).find('[name=name]').val(),
            desc: $(e.target).find('[name=desc]').val(),
        };

        // console.log(entity);

        var errors = validateDevice(entity);
        if (errors.name || errors.project_id)
            return Session.set('deviceSubmitErrors', errors);

        Meteor.call('deviceInsert', entity, function (error, result) {
            if (error)
                return throwError(error.reason);

            if (result.sameNameDevice)
                return throwError('This same name Project has already been added');
        });

        Router.go('devicesList');
    }
});