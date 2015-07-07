/**
 * Created by chenhao on 15/4/8.
 */
Template.moduleItem.helpers({
    //ownModule: function() {
    //    return this.userId === Meteor.userId();
    //},
});

Template.moduleItem.events({
    'click .have': function (e) {
        e.preventDefault();
        // var enc = base64UrlEncode(this.name);
        Router.go('myModuleSubmit', {}, {query: 'module_id=' + this._id + "&name=" + this.name});
    },

    'click .buy': function (e) {
        e.preventDefault();
        Router.go('buyModule', {module_id: this._id});
    }
});