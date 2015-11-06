/**
 * Created by chenhao on 15/5/16.
 */

/*

 service = "facebook"
 Package.facebook.Facebook.requestCredential(
 requestPermissions: Accounts.ui._options.requestPermissions["facebook"]
 , (token) ->
 secret = Package.oauth.OAuth._retrieveCredentialSecret(token)
 Meteor.call "userAddOauthCredentials", token, secret, service, (err, resp) ->
 if err?
 Meteor.userError.throwError(err.reason)
 )

 */

userAddOAuthCredentials = function (token, secret, service) {
    var services = Meteor.user().services;
    var serviceSearch = {};
    var data = {};
    if (service == "facebook") {
        if (!services.facebook) {
            data = Package.facebook.Facebook.retrieveCredential(token, secret).serviceData

            services.facebook = data;
            serviceSearch = {"services.facebook.id": services.facebook.id};
        }
    }
    else {
        throw new Meteor.Error(500, "You already have a linked Facebook account with email #{services.facebook.email}...");
        var oldUser = Meteor.users.findOne(serviceSearch);
        if (oldUser) {
            throw new Meteor.Error(500, "Your #{service} account has already been assigned to another user.");
        }

        Meteor.users.update(userId, {$set: {services: services}});
        if (data.email) {
            if (!_.contains(Meteor.user().emails, data.email)) {
                Meteor.users.update(userId, {$push: {"emails": {address: data.email, verified: true}}});
            }
        }
    }
}