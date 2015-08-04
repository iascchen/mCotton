/**
 * Created by chenhao on 15/4/7.
 */

Meteor.subscribe('myappkits', Meteor.userId());

Template.myAppKitsList.helpers({
    my_appkits: function () {
        return MyAppKits.find({'status': {$ne : "retired"}}, {sort: {last_update_time: -1}});
    },
    owner: function () {
        return JSON.stringify(Meteor.user());
    },
});

Template.myAppKitsList.rendered = function (){
    anchorScroll();
};