Meteor.subscribe('images');

Template.projectImage.helpers({
    _: function () {
        return Collections.Images.findOne({_id: this.id});
    }
});