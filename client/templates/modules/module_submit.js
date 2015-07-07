/**
 * Created by chenhao on 15/4/8.
 */
Template.moduleSubmit.events({
    'submit form': function (e) {
        e.preventDefault();

        var module = {
            name: $(e.target).find('[name=name]').val(),
            desc: $(e.target).find('[name=desc]').val(),
            //picture_url: $(e.target).find('[name=picture_url]').val(),
            //pku: $(e.target).find('[name=pku]').val(),
            //store_url: $(e.target).find('[name=store_url]').val()
        };

        var errors = validateModule(module);
        if (errors.name || errors.desc)
            return Session.set('moduleSubmitErrors', errors);

        Meteor.call('moduleInsert', module, function (error, result) {
            if (error)
                return throwError(error.reason);

            if (result.sameNameModule)
                return throwError('This name has already been used（该PKU已经存在）');

            //Router.go('modulePage', {_id: result._id});

            Router.go('modulesList');
        });
    }
});


Template.moduleSubmit.created = function () {
    Session.set('moduleSubmitErrors', {});
};

Template.moduleSubmit.helpers({
    errorMessage: function (field) {
        return Session.get('moduleSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('moduleSubmitErrors')[field] ? 'has-error' : '';
    }
});