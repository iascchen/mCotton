/**
 * Created by chenhao on 15/4/7.
 */

Meteor.subscribe('mymodules');

Template.myModulesList.helpers({
    my_modules: function () {
        return MyModules.find({'status': {$lt: STATUS_DISABLE}}, {sort: {name: 1}});
    }
});