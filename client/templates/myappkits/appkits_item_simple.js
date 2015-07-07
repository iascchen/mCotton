Template.appKitItemSimple.helpers({
    _: function(_id) {
        return AppKits.findOne({_id: this._id })
    }
});