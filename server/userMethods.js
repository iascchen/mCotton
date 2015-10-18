/**
 * Created by chenhao on 15/10/18.
 */

Meteor.methods({
    ///**
    // * delete a user from a specific group
    // *
    // * @method deleteUser
    // * @param {String} targetUserId _id of user to delete
    // * @param {String} group Company to update permissions for
    // */
    //deleteUser: function (targetUserId, group) {
    //    var loggedInUser = Meteor.user()
    //
    //    if (!loggedInUser ||
    //        !Roles.userIsInRole(loggedInUser,
    //            ['manage-users', 'support-staff'], group)) {
    //        throw new Meteor.Error(403, "Access denied")
    //    }
    //
    //    // remove permissions for target group
    //    Roles.setUserRoles(targetUserId, [], group)
    //
    //    // do other actions required when a user is removed...
    //},

    /**
     * update a user's permissions
     *
     * @param {Object} targetUserId Id of user to update
     * @param {Array} roles User's new permissions
     * @param {String} group Company to update permissions for
     */
    updateRoles: function (targetUserId, roles, group) {
        var loggedInUser = Meteor.user()

        if (!loggedInUser ||
            !Roles.userIsInRole(loggedInUser,
                ['manage-users', 'support-staff'], group)) {
            throw new Meteor.Error(403, "Access denied")
        }

        Roles.setUserRoles(targetUserId, roles, group)
    }
});
