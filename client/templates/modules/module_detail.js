/**
 * Created by chenhao on 15/4/8.
 */
Template.moduleDetail.helpers({
    image: function(){
        return Collections.Images.findOne({_id: this.img_id});
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