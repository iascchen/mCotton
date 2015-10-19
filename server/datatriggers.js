/**
 * Created by chenhao on 15/4/16.
 */

/*

TODO , Porting buffalo to Linux

////////////////////////
// AZURE Event Hub

var BSON = Meteor.npmRequire('buffalo');
var https = Meteor.npmRequire('https');

var create_sas_token = function (uri, key_name, key) {
    // Token expires in one hour
    var expiry = moment().add(1, 'hours').unix();

    var string_to_sign = encodeURIComponent(uri) + '\n' + expiry;
    var signature = CryptoJS.HmacSHA256(string_to_sign, key).toString();

    var rettoken = 'SharedAccessSignature sr=' + encodeURIComponent(uri)
        + '&sig=' + encodeURIComponent(signature)
        + '&se=' + expiry
        + '&skn=' + key_name;

    return rettoken;
};

var send_to_event_hub = function (jsonmsg) {
    console.log("send_to_event_hub: ", jsonmsg);

    var bsonObject = BSON.serialize(jsonmsg);

    var postheaders = {
        'Authorization': create_sas_token(Azure_SB_Uri, Azure_SB_Send_Key_Name, Azure_SB_Send_Key),
        'Content-Length': bsonObject.length,
        'Content-Type': 'application/atom+xml;type=entry;charset=utf-8',
        'Expect': '100-continue'
    };

    var optionspost = {
        host: Azure_SB_Namespace,
        port: 443,
        path: Azure_SB_Uri,
        method: 'POST',
        headers: postheaders
    };

    // Send the request
    var reqPost = https.request(optionspost, function (res) {
        //console.log("statusCode: ", res.statusCode);
        res.on('data', function (d) {
            process.stdout.write(d);
        });
    });

    // write the json data
    reqPost.write(bsonObject);
    reqPost.end();

    reqPost.on('error', function (e) {
        console.error(e);
    });
};
*/

////////////////////////
// MQTT

var contorl_cmd = "c";

var settings = {
    // keepalive: 10,
    // clean: false,
    // protocolId: 'MQIsdp',
    // protocolVersion: 3,
    // clientId: 'client-b',
    host: MQTT_HOST,
    port: MQTT_PORT
};

publishControl = function (event) {
    var controls = [MQTT_API_VER, contorl_cmd, event.owner_user_id, event.device_id];
    var control_topic = controls.join("/");

    var _setting = _.extend(settings, {
        username: event.owner_user_id,
        password: event.device_id
    });

    var client = mqtt.connect(_setting);

    var ret = {};
    ret[event.control_name] = event.control_value;

    console.log("publishControl", control_topic, JSON.stringify(ret));
    client.publish(control_topic, JSON.stringify(ret));

    client.end();
};

////////////////////////
// Init Data trigger when Meteor.startup

Meteor.startup(
    function () {
        var initializing = true;
        Collections.DataMessages.find().observeChanges({
            added: function (id, entity) {
                if (!initializing) {
                    // console.log("DataMessageAdded: ", entity);

                    var datas = JSON.parse(entity.data_message);

                    var device = Collections.Devices.findOne({_id: entity.device_id});
                    if (!device)
                        return;

                    var data_points = Collections.Projects.findOne({_id: device.project_id}).data_points;
                    if (!data_points)
                        return;

                    var _event;
                    for (var prop in datas) {
                        //console.log("datas[prop]: ", prop, datas[prop]);
                        var data_name = prop;

                        var data_value = datas[data_name];
                        if ((typeof data_value) === 'object') {
                            data_value = JSON.stringify(data_value);
                        }
                        // console.log("data_value", data_name, data_value);

                        var data_point = _.filter(data_points, function (point) {
                            return point.data_name == data_name;
                        });
                        // console.log("data_point", data_name, data_point);

                        if (!data_point)
                            return;

                        var dp = data_point[0];
                        // console.log("data_point", dp, DATA_POINTS[dp.data_type]);

                        _event = {
                            device_id: entity.device_id,
                            data_name: data_name,
                            data_value: data_value,
                            data_submit_time: entity.data_submit_time,
                            owner_user_id: entity.owner_user_id,
                        };
                        // console.log("event ", _event);

                        if (entity.sid) {
                            _.extend(_event, {
                                sid: entity.sid,
                            });
                        }

                        _.extend(_event, {
                            data_type: dp.data_type,
                            data_show_list: dp.data_show_list
                        });

                        var data_unit = DATA_POINTS[dp.data_type].unit;
                        if (data_unit) {
                            _.extend(_event, {data_unit: data_unit});
                        }

                        Collections.DataEvents.insert(_event);
                    }

                    /*
                    //////////////////////////////////
                    //// send to Azure Event Hubs

                    if (AZURE_ENABLE) {
                        var message = _.extend(datas, {
                            device_id: entity.device_id
                        });
                        send_to_event_hub(message);
                    }
                    */
                }
            }
        });

        // TODO, used for debug, remove it when product release
        Collections.DataEvents.find().observeChanges({
            added: function (id, entity) {
                if (!initializing) {
                    console.log("DataEventAdded: ", entity);
                }
            }
        });

        Collections.ControlEvents.find().observeChanges({
            added: function (id, entity) {
                if (!initializing) {
                    console.log("ControlEventAdded: ", entity);

                    //////////////////////////////////
                    // mqtt push -- control event

                    if (MQTT_ENABLE) {
                        publishControl(entity);
                    }
                }
            }
        });

        initializing = false;
    });
