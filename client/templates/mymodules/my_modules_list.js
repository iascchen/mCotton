/**
 * Created by chenhao on 15/4/7.
 */

Meteor.subscribe('mymodules', Meteor.userId());

Template.myModulesList.helpers({
    my_modules: function () {
        return MyModules.find({'status': {$ne : "retired"}}, {sort: {name: 1}});
    }
});