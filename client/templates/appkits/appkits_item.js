/**
 * Created by chenhao on 15/4/13.
 */

Meteor.subscribe('datapoints');
Meteor.subscribe('controlpoints');

Template.appKitItem.helpers({
    controlpoints: function () {
        return ControlPoints.find({app_kit_id: this._id});
    },

    datapoints: function () {
        return DataPoints.find({app_kit_id: this._id});
    },
});

Template.appKitItem.events({
    'click .assemble': function (e) {
        e.preventDefault();
        Router.go('myAppKitSubmit', {}, {query: 'app_kit_id=' + this._id});
    },

    'click .buy': function (e) {
        e.preventDefault();
        Router.go('buyAppKit', {app_kit_id: this._id});
    }
});