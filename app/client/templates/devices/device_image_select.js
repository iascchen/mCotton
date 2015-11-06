/**
 * Created by chenhao on 15/10/14.
 */

/////////////
// deviceImagesSelect
/////////////

Template.deviceImagesSelect.helpers({
    json: function () {
        return JSON.stringify(this);
    },
    all_images_ids: function () {
        if (this.img_ids)
            return Collections.Images.find({owner: Meteor.userId(), _id: {$nin: this.img_ids}}, {fields: {_id: 1}, sort: {uploadedAt: -1}});
        else {
            return Collections.Images.find({owner: Meteor.userId() }, {fields: {_id: 1}, sort: {uploadedAt: -1}});
        }
    },
});

/////////////
// deviceImagesAll
/////////////

Template.deviceImagesAll.helpers({
    _: function () {
        return Collections.Images.findOne({_id: this.id});
    }
});

Template.deviceImagesAll.events({
    'click .select': function (e) {
        e.preventDefault();

        var ent = this;
        //console.log("ent" , JSON.stringify(ent));

        var id = e.currentTarget.name;
        //console.log("id" , id);

        Collections.Devices.update({_id: id}, {$push: {img_ids: ent.id}});
    }
});

/////////////
// deviceImagesSelected
/////////////

Template.deviceImagesSelected.helpers({
    _: function () {
        return Collections.Images.findOne({_id: this.id});
    }
});

Template.deviceImagesSelected.events({
    'click .delete': function (e) {
        e.preventDefault();

        var ent = this;
        // console.log("ent" , JSON.stringify(ent));

        var id = e.currentTarget.name;
        //console.log("id" , id);

        Collections.Devices.update({_id: id}, {$pull: {img_ids: ent.id}});
    }
});

