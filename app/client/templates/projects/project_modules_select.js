/**
 * Created by chenhao on 15/10/14.
 */

/////////////
// projectModulesSelect
/////////////

Template.projectModulesSelect.helpers({
    json: function () {
        return JSON.stringify(this);
    },
    all_module_ids: function () {
        if (this.module_ids)
            return Collections.Modules.find({_id: {$nin: this.module_ids}}, {fields: {_id: 1}, sort: {name: 1}});
        else {
            return Collections.Modules.find({}, {fields: {_id: 1}, sort: {name: 1}});
        }
    },
});

/////////////
// projectModulesAll
/////////////

Template.projectModulesAll.helpers({
    _: function () {
        return Collections.Modules.findOne({_id: this.id});
    }
});

Template.projectModulesAll.events({
    'click .select': function (e) {
        e.preventDefault();

        var ent = this;
        //console.log("ent" , JSON.stringify(ent));

        var id = e.currentTarget.name;
        //console.log("id" , id);

        Collections.Projects.update({_id: id}, {$push: {module_ids: ent.id}});
    }
});

/////////////
// projectModulesSelected
/////////////

Template.projectModulesSelected.helpers({
    _: function () {
        return Collections.Modules.findOne({_id: this.id});
    }
});

Template.projectModulesSelected.events({
    'click .delete': function (e) {
        e.preventDefault();

        var ent = this;
        // console.log("ent" , JSON.stringify(ent));

        var id = e.currentTarget.name;
        //console.log("id" , id);

        Collections.Projects.update({_id: id}, {$pull: {module_ids: ent.id}});
    }
});

