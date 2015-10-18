/**
 * Created by chenhao on 15/10/14.
 */

/////////////
// projectModulesSelect
/////////////

Template.projectImagesSelect.helpers({
    json: function () {
        return JSON.stringify(this);
    },
    all_images_ids: function () {
        if (this.img_ids)
            return Collections.Images.find({_id: {$nin: this.img_ids}}, {fields: {_id: 1}, sort: {uploadedAt: -1}});
        else {
            return Collections.Images.find({}, {fields: {_id: 1}, sort: {uploadedAt: -1}});
        }
    },
});

/////////////
// projectModulesAll
/////////////

Template.projectImagesAll.helpers({
    _: function () {
        return Collections.Images.findOne({_id: this.id});
    }
});

Template.projectImagesAll.events({
    'click .select': function (e) {
        e.preventDefault();

        var ent = this;
        //console.log("ent" , JSON.stringify(ent));

        var id = e.currentTarget.name;
        //console.log("id" , id);

        Collections.Projects.update({_id: id}, {$push: {img_ids: ent.id}});
    }
});

/////////////
// projectModulesSelected
/////////////

Template.projectImagesSelected.helpers({
    _: function () {
        return Collections.Images.findOne({_id: this.id});
    }
});

Template.projectImagesSelected.events({
    'click .delete': function (e) {
        e.preventDefault();

        var ent = this;
        // console.log("ent" , JSON.stringify(ent));

        var id = e.currentTarget.name;
        //console.log("id" , id);

        Collections.Projects.update({_id: id}, {$pull: {img_ids: ent.id}});
    }
});

