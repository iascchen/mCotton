/**
 * Created by chenhao on 15/4/7.
 */

/************
 * modulesList
 ************/

Template.modulesList.helpers({
    modules: function () {
        return Collections.Modules.find({}, {sort: {name: 1}});
    }
});

/************
 * moduleSummary
 ************/

Template.moduleSummary.events({
    'click .have': function (e) {
        e.preventDefault();
        // var enc = base64UrlEncode(this.name);
        Router.go('myModuleSubmit', {}, {query: 'module_id=' + this._id + "&name=" + this.name});
    },

    //'click .buy': function (e) {
    //    e.preventDefault();
    //    Router.go('buyModule', {module_id: this._id});
    //}
});