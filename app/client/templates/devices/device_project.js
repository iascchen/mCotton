Template.projectItemSimple.helpers({
    project: function(_id) {
        return Collections.Projects.findOne({_id: this._id })
    }
});