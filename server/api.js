/**
 * Created by chenhao on 15/4/16.
 */

CONTROL_EVENT_RESEND_INTERVAL = 2 * 60000;
DATA_EVENT_RESEND_INTERVAL = 2 * 60000;
DEVICE_ID_REQ_TIMEOUT = 1 * 60000;

// Global API configuration
Restivus.configure({
    useAuth: true,
    prettyJson: false,
    enableCors: true
});

// Fetch Batch Data Upload SessionID
Restivus.addRoute(':version/sid', {authRequired: false}, {
    get: function () {
        var now = new Date();
        return {
            sid: now.getTime(),
        };
    }
});

// Upload Data Message
Restivus.addRoute(':version/d', {authRequired: false}, {
    post: function () {
        // console.log("request", this.request.body);
        var msg = _.clone(this.request.body);
        var my_app_kit_id = msg.my_app_kit_id;

        var ret = Meteor.call('dataMessageInsert', msg);
        if (ret) {
            var ctrl_ret = Meteor.call('controlEventsQuerySmall', {my_app_kit_id: my_app_kit_id});
            if (ctrl_ret) {
                _.extend(ret, ctrl_ret);
            }

            console.log("/d posted: ", ret);
            return ret;
        }
        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to add DataMessage"}
        };
    }
});

// Upload Control Event
Restivus.addRoute(':version/ce', {authRequired: false}, {
    post: function () {
        // console.log("request", this.request.body);
        var msg = _.clone(this.request.body);

        var ret = Meteor.call('controlEventInsert', msg);
        if (ret) {
            // return {status: "excused", data: ret};
            console.log("/ce posted: ", ret);
            return ret;
        }
        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to add ControlEvent"}
        };
    }
});

// Get Latest Control Event
Restivus.addRoute(':version/ce/:my_app_kit_id', {authRequired: false}, {
    get: function () {
        var my_app_kit_id = this.params.my_app_kit_id;
        //console.log("ce/:my_app_kit_id", my_app_kit_id);

        var ret = Meteor.call('controlEventsQuery', {my_app_kit_id: my_app_kit_id});
        if (ret) {
            console.log("ce/" + my_app_kit_id, ret);
            return ret;
        }
        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to get ControlEvent"}
        };
    }
});

// Get Latest Data Event
Restivus.addRoute(':version/de/:my_app_kit_id', {authRequired: false}, {
    get: function () {
        var my_app_kit_id = this.params.my_app_kit_id;
        //console.log("ce/:my_app_kit_id", my_app_kit_id);

        var ret = Meteor.call('dataEventsQuery', {my_app_kit_id: my_app_kit_id});
        if (ret) {
            console.log("de/" + my_app_kit_id, ret);
            return ret;
        }
        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to get DataEvent"}
        };
    }
});

// Get AppKit
Restivus.addRoute(':version/appkits', {authRequired: false}, {
    get: function () {
        var ret = AppKits.find({'status': {$ne: "retired"}}).fetch();

        if (ret) {
            //console.log("appkits/", ret);
            return ret;
        }
        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to get AppKits"}
        };
    }
});

// Create MyDevice
Restivus.addRoute(':version/myappkits', {authRequired: true}, {
    put: function () {
        var body = _.clone(this.request.body);
        console.log("user_id", this.userId);

        var entity = _.extend(body, {owner_user_id: this.userId});
        console.log("body:", entity);

        var ret = Meteor.call('myAppKitInsert', entity);
        if (ret) {
            // return {status: "excused", data: ret};
            console.log("myAppKitInsert", ret);
            return ret;
        }
        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to create MyDevice"}
        };
    },
    get: function () {
        // console.log("user_id", this.userId);
        var ret = MyAppKits.find({owner_user_id: this.userId, 'status': {$ne: "retired"}}).fetch();

        if (ret) {
            //console.log("myappkits/", ret);
            return ret;
        }
        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to get MyDevice"}
        };
    }
});

// Get Line Data Chart
Restivus.addRoute(':version/vis/:my_app_kit_id/:period', {authRequired: true}, {
    get: function () {
        // console.log("In Visualization");

        var my_app_kit_id = this.params.my_app_kit_id;
        var period = this.params.period;

        // console.log("my_app_kit_id / period : ", my_app_kit_id+ " / "+ period);

        var timeStart, timeinfo;

        if (period == "h") {
            timeinfo = moment().hour();
            timeStart = moment(timeinfo - 1, "HH");
        } else if (period == "d") {
            timeinfo = moment().date();
            timeStart = moment(timeinfo - 1, "DD");
        } else if (period == "w") {
            timeinfo = moment().week();
            timeStart = moment(timeinfo - 1, "WW");
        }

        var events = DataEvents.find({
                my_app_kit_id: my_app_kit_id,
                data_submit_time: {$gte: timeStart.toDate()}
            },
            {sort: {data_name: 1, data_submit_time: 1}}).fetch();

        if (events.length <= 0) return {};

        var currentKey;
        var retjson = [], values = [];
        var currentSerial;
        var nm, vl, dt;
        for (var i = 0; i < events.length; i++) {
            nm = events[i].data_name;
            vl = parseFloat(events[i].data_value);
            dt = events[i].data_submit_time.getTime();

            //console.log("getDataEvent", nm, vl, dt);

            if (nm != currentKey) {
                if (currentKey) {
                    currentSerial = {
                        key: currentKey,
                        values: values
                    };
                    retjson.push(currentSerial);
                }

                currentKey = nm;
                values = [];
            }

            if (vl != 0)
                values.push({x: dt, y: vl});
        }

        currentSerial = {
            key: currentKey,
            values: values
        };
        retjson.push(currentSerial);

        //console.log("vis/" + my_app_kit_id, retjson);
        return retjson;
    }
});

/**************************************
 * REST API Communicate with Arduino device
 **************************************/

// Reg Device to Server for generate Device ID
Restivus.addRoute(':version/regDevId', {authRequired: false}, {
    post: function () {
        var entity = _.clone(this.request.body);
        var deviceIp = this.request.headers["x-forwarded-for"];

        entity.dev_ip = deviceIp;

        return Meteor.call('regDevId', entity);
    }
});

// Reg Device to Server for generate Device ID
Restivus.addRoute(':version/genDevId', {authRequired: false}, {
    post: function () {
        var entity = _.clone(this.request.body);
        var deviceIp = this.request.headers["x-forwarded-for"];

        entity.dev_ip = deviceIp;

        return Meteor.call('genDevId', entity);
    }
});

/**************************************
 * REST API Communicate with Mobile APP
 **************************************/

// On Mobile Wait Device send genDeviceID request
Restivus.addRoute(':version/waitDevId', {authRequired: true}, {
    post: function () {
        var clientIp = "" + this.request.connection.remoteAddress;
        console.log("clientIp", clientIp);

        var entity = _.clone(this.request.body);
        entity.owner_user_id = this.userId;
        entity.dev_ip = clientIp;

        return Meteor.call('waitDevId', entity);
    }
});


/**************************************
 * REST API for test Client Ip Address
 **************************************/

Restivus.addRoute(':version/clientIp', {authRequired: false}, {
    get: function () {
        var xForward = this.request.headers["x-forwarded-for"];
        console.log("x-forwarded-for:", xForward);

        var deviceIp = this.request.connection.remoteAddress;
        console.log("remoteAddress:", deviceIp);

        return {
            xforward: xForward,
            deviceIp: deviceIp
        };
    }
});

/*
 Restivus.addRoute(':version/testRegexFilter', {authRequired: false}, {
 get: function () {
 var genreqs = GenDeviceIDReqs.find({
 dev_ip: {$regex: "(^192\.168\.)|(^127\.0\.0\.1$)"}
 }, {sort: {request_time: -1}, limit:5}).fetch();

 return genreqs;
 }
 });
 */

// Get Latest Data Event
Restivus.addRoute(':version/de_city/:my_app_kit_id', {authRequired: false}, {
    get: function () {
        var my_app_kit_id = this.params.my_app_kit_id;

        var ret = Meteor.call('cityDataEventsQuery', {my_app_kit_id: my_app_kit_id});
        if (ret) {
            console.log("de_city/" + my_app_kit_id, ret);
            return ret;
        }
        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to get CityDataEvent"}
        };
    }
});

// Get Line Data Chart
Restivus.addRoute(':version/vis_city/:my_app_kit_id', {authRequired: true}, {
    get: function () {
        // console.log("In Visualization");

        var my_app_kit_id = this.params.my_app_kit_id;

        var events = Meteor.call('cityDataEventsQuery', {my_app_kit_id: my_app_kit_id});

        if (events) {
            var nodes_map = {}, nodes = [], links = [];
            var cell, from_node_id, to_node_id, cell_dir, to_node_name;

            // handle nodes
            var node_length = 0;
            for (var i = 0; i < events.length; i++) {
                cell = events[i].data_value;

                if (!nodes_map[cell.ID]) {
                    nodes_map[cell.ID] = {
                        _id: node_length
                    };

                    nodes.push({
                        name: cell.ID,
                        group: cell.T,
                    });

                    node_length++;
                }
            }
            // console.log("nodes", nodes);

            // handle links
            for (var i = 0; i < events.length; i++) {
                cell = events[i].data_value;

                from_node_id = nodes_map[cell.ID]._id;

                cell_dir = cell.D;
                for (var dir in cell_dir) {
                    if (cell_dir.hasOwnProperty(dir)) {
                        to_node_name = cell_dir[dir];

                        if (to_node_name && to_node_name != '0') {

                            to_node_id = nodes_map[to_node_name]._id;

                            links.push({
                                source: from_node_id,
                                target: to_node_id,
                                dir: dir,
                                value: 1,
                            });
                        }
                    }
                }
            }
            // console.log("links", links);

            var retjson = {
                nodes: nodes,
                links: links
            };

            return retjson;
        }
        return;
    }
});