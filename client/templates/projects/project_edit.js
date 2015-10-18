/**
 * Created by chenhao on 15/4/8.
 */
Template.projectEdit.events({
    'submit form': function (e) {
        e.preventDefault();

        var currentProjectId = $(e.target).find('[name=_id]').val();

        var projectProperties = {
            name: $(e.target).find('[name=name]').val(),
            desc: $(e.target).find('[name=desc]').val(),
            show_chart: $(e.target).find('[name=show_chart]').val(),
        };

        console.log("projectEdit", projectProperties);

        var errors = validateProject(projectProperties);
        if (errors.name || errors.desc)
            return Session.set('projectSubmitErrors', errors);

        var now = new Date();
        var entity = _.extend(projectProperties, {
            last_update_time: now,
        });

        console.log("projectEdit", entity);

        Collections.Projects.update(currentProjectId, {$set: entity}, function (error) {
            if (error) {
                throwError(error.reason);
            } else {
                Router.go('projectDetail' , { _id: currentProjectId});
            }
        });
    },
});

Template.projectEdit.created = function () {
    Session.set('projectEditErrors', {});
};

Template.projectEdit.helpers({
    errorMessage: function (field) {
        return Session.get('projectEditErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('projectEditErrors')[field] ? 'has-error' : '';
    }
});