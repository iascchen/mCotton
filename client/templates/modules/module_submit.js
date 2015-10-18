/**
 * Created by chenhao on 15/4/8.
 */

Template.moduleSubmit.events({
    'submit form': function (e) {
        e.preventDefault();

        //var imgs = [];
        //var tempimg = null;
        //$(e.target).find('[name^=imgs]').each(function () {
        //    tempimg = $(this).val();
        //    if (tempimg.length > 0)
        //        imgs.push($(this).val());
        //});

        var module = {
            name: $(e.target).find('[name=name]').val(),
            desc: $(e.target).find('[name=desc]').val(),
            img_id: $(e.target).find('[name=img_id]').val(),
        };

        console.log("moduleSubmit", module);

        var errors = validateModule(module);
        if (errors.name || errors.desc)
            return Session.set('moduleSubmitErrors', errors);

        Meteor.call('moduleInsert', module, function (error, result) {
            if (error) {
                return throwError(error.reason);
            }

            if (result.sameNameModule)
                return throwError('This name has already been used（该模块已经存在）');

            //Router.go('moduleDetail', {_id: result._id});
            Router.go('modulesList');
        });
    },

    'click .cancel': function (e) {
        Router.go('modulesList');
    },
});

Template.moduleSubmit.created = function () {
    Session.set('moduleSubmitErrors', {});
    Session.set('uploadMultiImages', false);
    delete Session.keys['uploadedFileIds'];
};

Template.moduleSubmit.helpers({
    errorMessage: function (field) {
        return Session.get('moduleSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('moduleSubmitErrors')[field] ? 'has-error' : '';
    },
    image: function () {
        var imgId = Session.get('uploadedFileIds');
        return Collections.Images.findOne({_id: imgId}); // Where Images is an FS.Collection instance
    },
    image_val: function () {
        return Session.get('uploadedFileIds');
    }
});