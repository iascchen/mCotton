/**
 * Created by chenhao on 15/10/17.
 */

Meteor.subscribe('devices', Meteor.userId());

Template.deviceEdit.events({
    'submit form': function (e) {
        e.preventDefault();

        var currentId = $(e.target).find('[name=_id]').val();

        var properties = {
            name: $(e.target).find('[name=name]').val(),
            desc: $(e.target).find('[name=desc]').val(),
            share: $(e.target).find('[name=share]').val(),
        };

        console.log("deviceEdit", properties);

        var errors = validateDevice(properties);
        if (errors.name || errors.desc)
            return Session.set('deviceSubmitErrors', errors);

        var now = new Date();
        var entity = _.extend(properties, {
            last_update_time: now,
        });

        console.log("deviceEdit", entity);

        Collections.Devices.update(currentId, {$set: entity}, function (error) {
            if (error) {
                throwError(error.reason);
            } else {
                Router.go('deviceDetail' , { _id: currentId});
            }
        });
    },
});

Template.deviceEdit.created = function () {
    Session.set('deviceEditErrors', {});
};

Template.deviceEdit.helpers({
    errorMessage: function (field) {
        return Session.get('deviceEditErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('deviceEditErrors')[field] ? 'has-error' : '';
    }
});