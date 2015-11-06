/**
 * Created by chenhao on 15/4/8.
 */
Template.moduleEdit.events({
    'submit form': function (e) {
        e.preventDefault();

        var currentmoduleId = $(e.target).find('[name=_id]').val();
        console.log("moduleEdit", currentmoduleId);

        var moduleProperties = {
            name: $(e.target).find('[name=name]').val(),
            desc: $(e.target).find('[name=desc]').val(),
            img_id: $(e.target).find('[name=img_id]').val(),
        };

        console.log("moduleEdit", moduleProperties);

        var errors = validateModule(moduleProperties);
        if (errors.name || errors.desc)
            return Session.set('moduleEditErrors', errors);

        var now = new Date();
        var entity = _.extend(moduleProperties, {
            last_update_time: now,
        });

        console.log("moduleEdit", entity);

        Collections.Modules.update(currentmoduleId, {$set: entity}, function (error) {
            if (error) {
                throwError(error.reason);
            } else {
                Router.go('moduleDetail', {_id: currentmoduleId});
                //Router.go('modulesList');
            }
        });
    },

    'click .cancel': function (e) {
        Router.go('modulesList');
    }
});

Template.moduleEdit.created = function () {
    Session.set('moduleEditErrors', {});
    Session.set('uploadMultiImages', false);
    delete Session.keys['uploadedFileIds'];
};

Template.moduleEdit.helpers({
    errorMessage: function (field) {
        return Session.get('moduleSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('moduleSubmitErrors')[field] ? 'has-error' : '';
    },
    image: function () {
        var imgId = Session.get('uploadedFileIds') ? Session.get('uploadedFileIds') : this.img_id;
        return Collections.Images.findOne({_id: imgId}); // Where Images is an FS.Collection instance
    },
    image_val: function () {
        return Session.get('uploadedFileIds');
    }
});