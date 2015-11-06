/**
 * Created by chenhao on 15/10/10.
 */

Template.dataPointEdit.helpers({
    json: function () {
        return JSON.stringify(this.data_points);
    },
    unit: function () {
        return DATA_POINTS[this.data_type].unit;
    },
});

Template.dataPointEdit.events({
    'click .delete': function (e) {
        e.preventDefault();

        var ent = this;
        // console.log("ent" , JSON.stringify(ent));

        var id = e.currentTarget.name;
        // console.log("id" , id);

        Collections.Projects.update({_id: id}, {$pull: {data_points: ent}});
    }
});
