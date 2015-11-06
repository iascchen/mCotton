Template.moduleModuleItem.helpers({
    _: function () {
        return Collections.Modules.findOne({_id: this._id});
    },
});
