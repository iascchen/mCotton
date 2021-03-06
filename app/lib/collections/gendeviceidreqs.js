/**
 * Created by chenhao on 15/5/16.
 */

/**
 * Created by chenhao on 15/4/12.
 */

Schemas.GenDeviceIDReq = new SimpleSchema({

    request_time: {
        type: Date, label: "Create date this information",
        optional: false,
    },

    dev_ip: {
        type: String, label: "Device IP Address",
        //regEx: /^[a-zA-Z-]{2,1024}$/,
        optional: false,
    },

    project_name: {
        type: String, label: "Project Name",
        //regEx: /^[a-zA-Z-]{2,1024}$/,
        optional: false,
    },

    name: {
        type: String, label: "Device Name",
        //regEx: /^[a-zA-Z-]{2,1024}$/,
        optional: false,
    },

    mac_adr: {
        type: String, label: "MAC Address",
        //regEx: /^[a-zA-Z-]{2,1024}$/,
        optional: false,
    },

    device_id: {
        type: String, label: "Generated device_id",
    },
});

GenDeviceIDReqs = new Mongo.Collection('gendeviceidreqs', Schemas.GenDeviceIDReq);

Meteor.methods({
    // for Restful Device Call
    regDevId: function (_attributes) {
        var entity = _.clone(_attributes);

        var clientIp = "";
        if (this.connection) {
            clientIp = "" + this.connection.clientAddress;
            console.log("clientIp", clientIp);
            entity.dev_ip = clientIp;
        }

        console.log("regDevId input : ", entity);

        var now = new Date();
        entity.request_time = now;

        var ret = GenDeviceIDReqs.insert(entity);
        if (ret) {
            console.log("regDevId/", ret);
            return ret;
        }

        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to Reg DeviceID"}
        };
    },

    genDevId: function (_attributes) {
        var entity = _.clone(_attributes);

        var clientIp = "";
        if (this.connection) {
            clientIp = "" + this.connection.clientAddress;
            console.log("clientIp", clientIp);
            entity.dev_ip = clientIp;
        }

        console.log("genDevId input : ", entity);

        var now = new Date();

        var ret = GenDeviceIDReqs.findOne({
            mac_adr: entity.mac_adr, dev_ip: entity.dev_ip, project_name: entity.project_name,
            request_time: {$gt: new Date(now - DEVICE_ID_REQ_TIMEOUT)},
            device_id: {$ne: null}
        }, {sort: {request_time: -1}});

        if (ret) {
            return {device_id: ret.device_id};
        }
        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to find gen DeviceID"}
        };
    },

    // for Mobile APP
    waitDevId: function (_attributes) {
        var input = _.clone(_attributes);

        var user = Meteor.user();
        if (user) {
            input.owner_user_id = user._id;
        }

        var clientIp = "";
        if (this.connection) {
            clientIp = "" + this.connection.clientAddress;
            console.log("clientIp", clientIp);
            input.dev_ip = clientIp;
        }

        console.log("waitDevId input : ", input);

        check(input, {
            mac_adr: String,
            owner_user_id: String,
            dev_ip: String
        });

        var genreq, ret;

        var now = new Date();
        if (input.dev_ip.indexOf("192.168") == 0
            || input.dev_ip.indexOf("127.0.0.1") == 0) {

            console.log("in Lan : ", input);

            genreq = GenDeviceIDReqs.findOne({
                dev_ip: {$regex: "(^192\.168\.)|(^127\.0\.0\.1$)"},
                mac_adr: input.mac_adr,
                request_time: {$gt: new Date(now - DEVICE_ID_REQ_TIMEOUT)}
            }, {sort: {request_time: -1}});

        } else {
            console.log("in Wan : ", input);

            genreq = GenDeviceIDReqs.findOne({
                dev_ip: input.dev_ip,
                mac_adr: input.mac_adr,
                request_time: {$gt: new Date(now - DEVICE_ID_REQ_TIMEOUT)}
            }, {sort: {request_time: -1}});
        }

        console.log("GenDeviceIDReq find:", genreq);

        if (genreq == null) {
            return {
                statusCode: 400,
                body: {status: "fail", message: "Unable to find registering device"}
            };
        }

        if (genreq.device_id != null) {
            return {
                device_id: genreq.device_id
            };
        }

        var project = Collections.Projects.findOne({name: genreq.project_name});

        var entity = {
            owner_user_id: input.owner_user_id,
            name: genreq.name,
            project_id: project._id,
            create_time: now,
            last_update_time: now,
        };
        console.log("body:", entity);

        ret = Collections.Devices.insert(entity);

        if (ret) {
            console.log("waitDevId", ret);
            console.log("waitDevId genreq", genreq);

            GenDeviceIDReqs.update(genreq._id, {$set: {device_id: ret}}, function (error) {
                if (error) {
                    console.error(error);
                }
            });

            return {
                device_id: ret
            };
        }

        return {
            statusCode: 400,
            body: {status: "fail", message: "Unable to create Device"}
        };
    }
});
