/**
 * Created by chenhao on 15/4/8.
 */
Template.appKitEdit.events({
    'submit form': function (e) {
        e.preventDefault();

        var currentAppKitId = this._id;

        var appKitProperties = {
            name: $(e.target).find('[name=name]').val(),
            desc: $(e.target).find('[name=desc]').val(),
            //picture_url: $(e.target).find('[name=picture_url]').val(),
            //pku: $(e.target).find('[name=pku]').val(),
            //store_url: $(e.target).find('[name=store_url]').val()
        };

        var errors = validateAppKit(appKitProperties);
        if (errors.name || errors.desc)
            return Session.set('appKitEditErrors', errors);

        var now = new Date();
        var entity = _.extend(appKitProperties, {
            last_update_time: now,
        });

        AppKits.update(currentAppKitId, {$set: entity}, function (error) {
            if (error) {
                throwError(error.reason);
            } else {
                Router.go('appKitsList');
            }
        });
    },

    'click .delete': function (e) {
        e.preventDefault();

        if (confirm("Delete this AppKit?")) {
            var currentAppKitId = this._id;
            AppKits.remove(currentAppKitId);
            Router.go('AppKitsList');
        }
    }
});

Template.appKitEdit.created = function () {
    Session.set('appKitEditErrors', {});
};

Template.appKitEdit.helpers({
    errorMessage: function (field) {
        return Session.get('appKitEditErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('appKitEditErrors')[field] ? 'has-error' : '';
    }
});