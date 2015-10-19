/**
 * Created by chenhao on 15/10/20.
 */

Accounts.registerLoginHandler(function(loginRequest) {
    //there are multiple login handlers in meteor.
    //a login request go through all these handlers to find it's login hander
    //so in our login handler, we only consider login requests which has admin field
    if(!loginRequest.admin) {
        return undefined;
    }

    //we create a admin user if not exists, and get the userId
    var userId = null;
    var user = Meteor.users.findOne({username: 'admin'});
    if(!user) {
        userId = Meteor.users.insert({username: 'admin'});
    } else {
        userId = user._id;
    }

    //send loggedin user's user id
    return {
        id: userId
    }
});