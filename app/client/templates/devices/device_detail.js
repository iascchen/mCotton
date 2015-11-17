/**
 * Created by chenhao on 15/4/29.
 */

// Meteor.subscribe('device');

Template.deviceDetail.helpers({
    share_label: function () {
        if(this.share)
            return SHARES[this.share].label;
        else
            return SHARES[SHARE_PRIVATE].label;
    },
    project: function () {
        return Collections.Projects.findOne({_id: this.project_id});
    }
});

Template.deviceDetail.events({
    'click .remove': function (e) {
        e.preventDefault();

        var currentId = this._id;
        var _de = Collections.DataEvents.find({device_id: currentId}).count();
        var _ce = Collections.ControlEvents.find({device_id: currentId}).count();

        if (_de > 0 || _ce > 0) {
            if (confirm("Remove this Device?")) {
                var now = new Date();
                Collections.Devices.update(currentId, {$set: {status: STATUS_DELETE, last_update_time: now}},
                    function (error) {
                        if (error) {
                            throwError(error.reason);
                        } else {
                            Router.go('devicesList');
                        }
                    });
            }
        }
        else {
            if (confirm("Delete this Device?")) {
                Collections.Devices.remove(currentId);
            }
        }

        Router.go('devicesList');
    },
    'click .selectProject': function (e) {
        e.preventDefault();

        // TODO

        var currentId = this._id;
        var _de = Collections.DataEvents.find({device_id: currentId}).count();
        var _ce = Collections.ControlEvents.find({device_id: currentId}).count();

        if (_de > 0 || _ce > 0) {
            if (confirm("Retire this Device?")) {
                var now = new Date();
                Collections.Devices.update(currentId, {
                    $set: {
                        status: 'retired',
                        last_update_time: now
                    }
                }, function (error) {
                    if (error) {
                        throwError(error.reason);
                    } else {
                        Router.go('devicesList');
                    }
                });
            }
        }
        else {
            if (confirm("Delete this Device?")) {
                Collections.Devices.remove(currentId);
            }
        }

        Router.go('devicesList');
    }
});


Template.moduleDetail.events({
    'click .have': function (e) {
        e.preventDefault();
        // var enc = base64UrlEncode(this.name);
        Router.go('myModuleSubmit', {}, {query: 'module_id=' + this._id + "&name=" + this.name});
    },

    'click .delete': function (e) {
        e.preventDefault();

        if (confirm("Delete this module?")) {
            var currentmoduleId = this._id;
            Collections.Modules.remove(currentmoduleId);
            Router.go('modulesList');
        }
    },

    'click .buy': function (e) {
        e.preventDefault();
        Router.go('buyModule', {module_id: this._id});
    }
});