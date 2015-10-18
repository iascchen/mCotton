/**
 * Created by chenhao on 15/4/21.
 */

ownsEntity = function (userId, entity) {
    return entity && entity.owner_user_id === userId;
};

autherEntity = function (userId, entity) {
    return entity && entity.author_user_id === userId;
};

grantedEntity = function (userId, role) {
    var user = Meteor.users.findOne({"_id": userId});
    if (_.contains(user.roles, role))
        return true;
};