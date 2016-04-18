/**
 * Created by chenhao on 15/4/16.
 */

var Fiber = Npm.require('fibers');
var mosca = Npm.require('mosca');

// Accepts the connection if the user_id and device_id are valid
var authenticate = function (client, user_id, device_id, callback) {
    // console.log("user", user_id, device_id.toString());
    var authorized = false;
    var deviceId = device_id.toString();

    Fiber(function () {
        var user = Meteor.users.findOne({_id: user_id});
        var device = Collections.Devices.findOne({_id: deviceId});
        // console.log('mqtt authenticate', user, device);

        if (user && device && device.owner_user_id == user_id) {
            authorized = true;
            console.log('mqtt client authenticate', authorized);

            client.user = user_id;
            client.device = deviceId;
        }
        callback(null, authorized);
    }).run();
};

// In this case the client authorized as alice can publish to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
var authorizePublish = function (client, topic, payload, callback) {
    var ok = ( client.user === topic.split('/')[2]);

    // we can alter the message here
    if (ok)
        callback(null, payload);
    else
        callback(null, false);
};

// In this case the client authorized as alice can subscribe to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
var authorizeSubscribe = function (client, topic, callback) {
    var ok = ( client.user === topic.split('/')[2]);

    callback(null, ok);
};

Meteor.startup(function () {
    var mqttDbUrl = getEnv("mqttDbUrl", "mongodb://localhost:3001/mqtt");

    var settings = {
        port: MQTT_PORT,
        backend: {
            type: 'mongo',
            url: mqttDbUrl,
            pubsubCollection: 'ascoltatori',
            mongo: {}
        }
    };

    console.log("mqtt mosca settings", settings);

    var server = new mosca.Server(settings);

    // fired when the mqtt server is ready
    function setup() {
        server.authenticate = authenticate;
        server.authorizePublish = authorizePublish;
        server.authorizeSubscribe = authorizeSubscribe;

        console.log('mCotton mqtt server is up and running');
    }

    server.on('ready', setup);

    server.on('clientConnected', function (client) {
        console.log('mqtt client connected', client.id);
    });

// fired when a message is received
    server.on('published', function (packet, client) {
        var topic = packet.topic;
        var payload = packet.payload;

        if (topic.indexOf("$SYS") > -1)
            return;

        // console.log('Published', topic, payload.toString());

        var mqttcmd = topic.split("/")[1];

        switch (mqttcmd) {
            case 'c':
                Fiber(function () {
                    var message = payload.toString();
                    var event = JSON.parse(message);

                    if (event.device_id) {
                        var ret = Meteor.call('controlEventInsert', event);
                        console.log('mqtt controlEventInsert', ret);
                    }
                }).run();
                break;
            case 'd':
                Fiber(function () {
                    var message = payload.toString();
                    var event = JSON.parse(message);

                    if (event.device_id) {
                        var ret = Meteor.call('dataMessageInsert', event);
                        console.log('mqtt dataMessageInsert', ret);
                    }
                }).run();
                break;
        }
    });
});

// TODO : MQTT SSL Demo Code, not tested
//
//Meteor.startup(function () {
//    var mqttDbUrl = getEnv("mqttDbUrl", "mongodb://localhost:3001/mqtt");
//
//    var SECURE_KEY = __dirname + '/../../test/secure/tls-key.pem';
//    var SECURE_CERT = __dirname + '/../../test/secure/tls-cert.pem';
//
//    var settings = {
//        port: MQTT_SSL_PORT,
//        logger: {
//            name: "secureMqtt",
//            level: 40,
//        },
//        secure : {
//            keyPath: SECURE_KEY,
//            certPath: SECURE_CERT,
//        },
//        backend: {
//            type: 'mongo',
//            url: mqttDbUrl,
//            pubsubCollection: 'ascoltatori',
//            mongo: {}
//        }
//    };
//
//    console.log("mqtt mosca settings", settings);
//
//    var server = new mosca.Server(settings);
//
//    // fired when the mqtt server is ready
//    function setup() {
//        server.authenticate = authenticate;
//        server.authorizePublish = authorizePublish;
//        server.authorizeSubscribe = authorizeSubscribe;
//
//        console.log('mCotton mqtt server is up and running');
//    }
//
//    server.on('ready', setup);
//
//    server.on('clientConnected', function (client) {
//        console.log('mqtt client connected', client.id);
//    });
//
//// fired when a message is received
//    server.on('published', function (packet, client) {
//        var topic = packet.topic;
//        var payload = packet.payload;
//
//        if (topic.indexOf("$SYS") > -1)
//            return;
//
//        // console.log('Published', topic, payload.toString());
//
//        var mqttcmd = topic.split("/")[1];
//
//        switch (mqttcmd) {
//            case 'c':
//                Fiber(function () {
//                    var message = payload.toString();
//                    var event = JSON.parse(message);
//
//                    if (event.device_id) {
//                        var ret = Meteor.call('controlEventInsert', event);
//                        console.log('mqtt controlEventInsert', ret);
//                    }
//                }).run();
//                break;
//            case 'd':
//                Fiber(function () {
//                    var message = payload.toString();
//                    var event = JSON.parse(message);
//
//                    if (event.device_id) {
//                        var ret = Meteor.call('dataMessageInsert', event);
//                        console.log('mqtt dataMessageInsert', ret);
//                    }
//                }).run();
//                break;
//        }
//    });
//});
