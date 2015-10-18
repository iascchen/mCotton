/**
 * Created by chenhao on 15/4/8.
 */
Template.projectSubmit.events({
    'submit form': function (e) {
        e.preventDefault();

        var entity = {
            name: $(e.target).find('[name=name]').val(),
            desc: $(e.target).find('[name=desc]').val(),
            show_chart: $(e.target).find('[name=show_chart]').val(),
        };

        // console.log("projectSubmit", entity);

        var errors = validateProject(entity);
        if (errors.name || errors.desc)
            return Session.set('projectSubmitErrors', errors);

        Meteor.call('projectInsert', entity, function (error, result) {
            if (error)
                return throwError(error.reason);

            if (result.sameNameModule)
                return throwError('This name has already been used（该PKU已经存在）');

            Router.go('projectDetail', {_id: result._id});

            // Router.go('projectsList');
        });
    },

    'click .cancel': function (e) {
        Router.go('projectsList');
    }
});

Template.projectSubmit.created = function () {
    Session.set('projectSubmitErrors', {});
};

Template.projectSubmit.helpers({
    errorMessage: function (field) {
        return Session.get('projectSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('projectSubmitErrors')[field] ? 'has-error' : '';
    }
});