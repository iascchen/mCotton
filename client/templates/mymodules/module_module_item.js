Template.moduleModuleItem.helpers({
    _: function () {
        return Modules.findOne({_id: this._id});
    },
});
