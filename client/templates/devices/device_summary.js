/**
 * Created by chenhao on 15/4/29.
 */

Template.deviceSummary.helpers({
    gray : function(){
        if (this.status >= STATUS_DISABLE) {
            return "gray";
        }
    },
});

Template.deviceSummary.events({
    'click .disassemble': function (e) {
        e.preventDefault();

        var currentId = this._id;
        var _de = Collections.DataEvents.find({device_id: currentId}).count();
        var _ce = Collections.ControlEvents.find({device_id: currentId}).count();

        if (_de > 0 || _ce > 0) {
            if (confirm("Retire this Device?")){
                var now = new Date();
                Collections.Devices.update(currentId, {$set: {status : 'retired', last_update_time: now}}, function (error) {
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
    'click .selectAppKit': function (e) {
        e.preventDefault();

        // TODO

        var currentId = this._id;
        var _de = Collections.DataEvents.find({device_id: currentId}).count();
        var _ce = Collections.ControlEvents.find({device_id: currentId}).count();

        if (_de > 0 || _ce > 0) {
            if (confirm("Retire this Device?")){
                var now = new Date();
                Collections.Devices.update(currentId, {$set: {status : 'retired', last_update_time: now}}, function (error) {
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
