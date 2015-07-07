/**
 * Created by chenhao on 15/4/16.
 */

//DataMessages.find().observeChanges({
//    added: function(id, entity) {
//        if (!initializing) {
//            console.log(entity);
//        }
//    }
//});

var BSON = Meteor.npmRequire('buffalo');
var https = Meteor.npmRequire('https');

DATE_FORMATS = "MM-DD HH:mm:ss";

Azure_SB_Namespace = "mcotton-01.servicebus.chinacloudapi.cn";
Azure_SB_Hubname = 'eventhub-01';

Azure_SB_Send_Key_Name = 'SendRule';
Azure_SB_Send_Key = 'MMV/FhBpQJi2b7WIQne+iQX7xH0NdlEBPaNP/jcEzgc=';

Azure_SB_Path = '/' + Azure_SB_Hubname + '/messages';
Azure_SB_Uri = 'https://' + Azure_SB_Namespace + Azure_SB_Path;

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

Meteor.startup(
    function () {
        var initializing = true;
        DataMessages.find().observeChanges({
            added: function (id, entity) {
                if (!initializing) {
                    // console.log("DataMessageAdded: ", entity);

                    var datas = JSON.parse(entity.data_message);
                    var _event;
                    for (var prop in datas) {
                        // console.log("datas[prop]: ", prop, datas[prop]);
                        _event = {
                            my_app_kit_id: entity.my_app_kit_id,
                            data_name: prop,
                            data_value: datas[prop],
                            data_submit_time: entity.data_submit_time,
                            owner_user_id: entity.owner_user_id,
                        };

                        if (entity.sid) {
                            _.extend(_event, {
                                sid: entity.sid,
                            });
                        }

                        var myappkit = MyAppKits.findOne({_id: _event.my_app_kit_id});
                        var datapoint = DataPoints.findOne({
                            app_kit_id: myappkit.app_kit_id,
                            data_name: _event.data_name
                        });

                        if (datapoint) {
                            _.extend(_event, {
                                data_type: datapoint.data_type,
                                data_unit: datapoint.data_unit,
                            });
                        }
                        DataEvents.insert(_event);
                    }

                    //////////////////////////////////
                    //// send to Azure Event Hubs
                    //var message = _.extend(datas, {
                    //    my_app_kit_id: entity.my_app_kit_id,
                    //});
                    //send_to_event_hub(message);
                }
            }
        });

        // TODO, used for debug, remove it when product release
        DataEvents.find().observeChanges({
            added: function (id, entity) {
                if (!initializing) {
                    console.log("DataEventAdded: ", entity);
                }
            }
        });

        ControlEvents.find().observeChanges({
            added: function (id, entity) {
                if (!initializing) {
                    console.log("ControlEventAdded: ", entity);
                }
            }
        });

        initializing = false;
    });
