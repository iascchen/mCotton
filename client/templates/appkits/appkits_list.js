/**
 * Created by chenhao on 15/4/7.
 */

Meteor.subscribe('appkits');

Template.appKitsList.helpers({
    appkits: function () {
        return AppKits.find();
    }
});