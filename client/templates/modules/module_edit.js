/**
 * Created by chenhao on 15/4/8.
 */
Template.moduleEdit.events({
    'submit form': function (e) {
        e.preventDefault();

        var currentmoduleId = this._id;

        var moduleProperties = {
            name: $(e.target).find('[name=name]').val(),
            desc: $(e.target).find('[name=desc]').val(),
            //picture_url: $(e.target).find('[name=picture_url]').val(),
            //pku: $(e.target).find('[name=pku]').val(),
            //store_url: $(e.target).find('[name=store_url]').val()
        };

        var errors = validateModule(moduleProperties);
        if (errors.name || errors.desc)
            return Session.set('moduleEditErrors', errors);

        var now = new Date();
        var entity = _.extend(moduleProperties, {
            last_update_time: now,
        });

        Modules.update(currentmoduleId, {$set: entity}, function (error) {
            if (error) {
                throwError(error.reason);
            } else {
                // Router.go('modulePage', {_id: currentmoduleId});
                Router.go('modulesList');
            }
        });
    },

    'click .delete': function (e) {
        e.preventDefault();

        if (confirm("Delete this module?")) {
            var currentmoduleId = this._id;
            Modules.remove(currentmoduleId);
            Router.go('modulesList');
        }
    }
});

Template.moduleEdit.created = function () {
    Session.set('moduleEditErrors', {});
};

Template.moduleEdit.helpers({
    errorMessage: function (field) {
        return Session.get('moduleEditErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('moduleEditErrors')[field] ? 'has-error' : '';
    }
});