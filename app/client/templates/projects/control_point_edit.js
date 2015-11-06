/**
 * Created by chenhao on 15/10/10.
 */

Template.controlPointEdit.helpers({
    json: function () {
        return JSON.stringify(this.control_points);
    },
});

Template.controlPointEdit.events({
    'click .delete': function (e) {
        e.preventDefault();

        var ent = this;
        // console.log("ent" , JSON.stringify(ent));

        var id = e.currentTarget.name;
        // console.log("id" , id);

        Collections.Projects.update({_id: id}, {$pull: {control_points: ent}});
    }
});
