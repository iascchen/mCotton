/**
 * Created by chenhao on 15/4/29.
 */

Template.myAppKitItem.helpers({
    gray : function(){
        if( this.status == "retired"){
            return "gray";
        }
    },
});

Template.myAppKitItem.events({
    'click .disassemble': function (e) {
        e.preventDefault();

        var currentId = this._id;
        var _de = DataEvents.find({my_app_kit_id: currentId}).count();
        var _ce = ControlEvents.find({my_app_kit_id: currentId}).count();

        if (_de > 0 || _ce > 0) {
            if (confirm("Retire this Device?")){
                var now = new Date();
                MyAppKits.update(currentId, {$set: {status : 'retired', last_update_time: now}}, function (error) {
                    if (error) {
                        throwError(error.reason);
                    } else {
                        Router.go('myAppKitsList');
                    }
                });
            }
        }
        else {
            if (confirm("Delete this Device?")) {
                MyAppKits.remove(currentId);
            }
        }

        Router.go('myAppKitsList');
    },
    'click .selectAppKit': function (e) {
        e.preventDefault();

        // TODO

        var currentId = this._id;
        var _de = DataEvents.find({my_app_kit_id: currentId}).count();
        var _ce = ControlEvents.find({my_app_kit_id: currentId}).count();

        if (_de > 0 || _ce > 0) {
            if (confirm("Retire this Device?")){
                var now = new Date();
                MyAppKits.update(currentId, {$set: {status : 'retired', last_update_time: now}}, function (error) {
                    if (error) {
                        throwError(error.reason);
                    } else {
                        Router.go('myAppKitsList');
                    }
                });
            }
        }
        else {
            if (confirm("Delete this Device?")) {
                MyAppKits.remove(currentId);
            }
        }

        Router.go('myAppKitsList');
    }
});
