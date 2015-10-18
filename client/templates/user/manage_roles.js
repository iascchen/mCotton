/**
 * Created by chenhao on 15/10/18.
 */
Template.manageRoles.helpers({
    users: function() {
        return Meteor.users.find({});
        //return {
        //    id: this._id,
        //    other: this.other,
        //    hard: 'Lolcats'
        //}
    }
});