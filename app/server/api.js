/**
 * Created by chenhao on 15/4/16.
 */

REST_API_VER = "v1.0";

CONTROL_EVENT_RESEND_INTERVAL = 2 * 60000;
DATA_EVENT_RESEND_INTERVAL = 2 * 60000;
DEVICE_ID_REQ_TIMEOUT = 1 * 60000;

var Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: false,
    enableCors: true
});

// Fetch Batch Data Upload SessionID
Api.addRoute(':version/sid', {authRequired: false}, {
    get: function () {
        var now = new Date();
        return {
            sid: now.getTime(),
        };
    }
});

// Upload Data Message
Api.addRoute(':version/d', {authRequired: false}, {
    post: function () {
        // console.log("request", this.request.body);
        var msg = _.clone(this.request.body);
        var device_id = msg.device_id;

        var ret = Meteor.call('dataMessageInsert', msg);
        if (ret) {
            var ctrl_ret = Meteor.call('controlEventsQuerySmall', {device_id: device_id});
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

// Get Latest Control Event
Api.addRoute(':version/ce/:device_id', {authRequired: false}, {
    get: function () {
        var device_id = this.urlParams.device_id;
        //console.log("ce/:device_id", device_id);

        var ret = Meteor.call('controlEventsQuery', {device_id: device_id});
        if (ret) {
            console.log("ce/" + device_id, ret);
            return ret;
        }
        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to get ControlEvent"}
        };
    }
});


// Upload Control Event
Api.addRoute(':version/ce', {authRequired: false}, {
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

// Get Latest Data Event
Api.addRoute(':version/de/:device_id', {authRequired: false}, {
    get: function () {
        var device_id = this.urlParams.device_id;
        console.log("ce/:device_id", device_id);

        var ret = Meteor.call('dataEventsQuery', {device_id: device_id});
        if (ret) {
            console.log("de/" + device_id, ret);
            return ret;
        }
        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to get DataEvent"}
        };
    }
});

// Get Project
Api.addRoute(':version/projects', {authRequired: false}, {
    get: function () {
        var ret = Collections.Projects.find({'status': {$lt: STATUS_DISABLE}}).fetch();

        if (ret) {
            //console.log("projects/", ret);
            return ret;
        }
        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to get Projects"}
        };
    }
});

// Create Device
Api.addRoute(':version/devices', {authRequired: true}, {
    put: function () {
        var body = _.clone(this.request.body);
        console.log("user_id", this.userId);

        var entity = _.extend(body, {owner_user_id: this.userId});
        console.log("body:", entity);

        var ret = Meteor.call('deviceInsert', entity);
        if (ret) {
            // return {status: "excused", data: ret};
            console.log("deviceInsert", ret);
            return ret;
        }
        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to create Device"}
        };
    },
    get: function () {
        // console.log("user_id", this.userId);
        var ret = Collections.Devices.find({owner_user_id: this.userId, 'status': {$lt: STATUS_DISABLE}}).fetch();

        if (ret) {
            //console.log("devices/", ret);
            return ret;
        }
        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to get Device"}
        };
    }
});

// Get Line Data Chart
Api.addRoute(':version/vis/:device_id/:period', {authRequired: true}, {
    get: function () {
        // console.log("In Visualization");

        var device_id = this.urlParams.device_id;
        var period = this.urlParams.period;

        // console.log("device_id / period : ", device_id+ " / "+ period);

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

        var events = Collections.DataEvents.find({
                device_id: device_id,
                data_submit_time: {$gte: timeStart.toDate()}
            },
            {sort: {data_name: 1, data_submit_time: 1}}).fetch();

        if (events.length <= 0) return {};

        var currentKey;
        var retjson = [], values = [];
        var currentSerial;
        var nm, vl, dt;

        _.forEach( events , function(event){
            nm = event.data_name;
            vl = parseFloat(event.data_value);
            dt = event.data_submit_time.getTime();

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
        } );

        //for (var i = 0; i < events.length; i++) {
        //    nm = events[i].data_name;
        //    vl = parseFloat(events[i].data_value);
        //    dt = events[i].data_submit_time.getTime();
        //
        //    //console.log("getDataEvent", nm, vl, dt);
        //
        //    if (nm != currentKey) {
        //        if (currentKey) {
        //            currentSerial = {
        //                key: currentKey,
        //                values: values
        //            };
        //            retjson.push(currentSerial);
        //        }
        //
        //        currentKey = nm;
        //        values = [];
        //    }
        //
        //    if (vl != 0)
        //        values.push({x: dt, y: vl});
        //}

        currentSerial = {
            key: currentKey,
            values: values
        };
        retjson.push(currentSerial);

        //console.log("vis/" + device_id, retjson);
        return retjson;
    }
});

/**************************************
 * REST API Communicate with Arduino device
 **************************************/

// Reg Device to Server for generate Device ID
Api.addRoute(':version/regDevId', {authRequired: false}, {
    post: function () {
        var entity = _.clone(this.request.body);
        var deviceIp = this.request.headers["x-forwarded-for"];

        entity.dev_ip = deviceIp;

        return Meteor.call('regDevId', entity);
    }
});

// Reg Device to Server for generate Device ID
Api.addRoute(':version/genDevId', {authRequired: false}, {
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
Api.addRoute(':version/waitDevId', {authRequired: true}, {
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

Api.addRoute(':version/clientIp', {authRequired: false}, {
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
 Api.addRoute(':version/testRegexFilter', {authRequired: false}, {
 get: function () {
 var genreqs = GenDeviceIDReqs.find({
 dev_ip: {$regex: "(^192\.168\.)|(^127\.0\.0\.1$)"}
 }, {sort: {request_time: -1}, limit:5}).fetch();

 return genreqs;
 }
 });
 */

// Get Latest Data Event
Api.addRoute(':version/de_city/:device_id', {authRequired: false}, {
    get: function () {
        var device_id = this.urlParams.device_id;

        var ret = Meteor.call('cityDataEventsQuery', {device_id: device_id});
        if (ret) {
            console.log("de_city/" + device_id, ret);
            return ret;
        }
        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to get CityDataEvent"}
        };
    }
});

// Get Line Data Chart
Api.addRoute(':version/vis_city/:device_id', {authRequired: true}, {
    get: function () {
        // console.log("In Visualization");

        var device_id = this.urlParams.device_id;

        var events = Meteor.call('cityDataEventsQuery', {device_id: device_id});

        if (events) {
            var nodes_map = {}, nodes = [], links = [];
            var cell, from_node_id, to_node_id, cell_dir, to_node_name;

            // handle nodes
            var node_length = 0;
            _.forEach( events , function(event){
            // for (var i = 0; i < events.length; i++) {
                cell = event.data_value;

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
            });
            // console.log("nodes", nodes);

            // handle links
            _.forEach( events , function(event){
            //for (var i = 0; i < events.length; i++) {
                cell = event.data_value;

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
            });
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