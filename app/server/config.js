/**
 * Created by chenhao on 15/9/30.
 */

DEBUG = "info";

///////////////
// Azure

AZURE_ENABLE = false;

DATE_FORMATS = "MM-DD HH:mm:ss";

Azure_SB_Namespace = "mcotton-01.servicebus.chinacloudapi.cn";
Azure_SB_Hubname = 'eventhub-01';

Azure_SB_Send_Key_Name = 'SendRule';
Azure_SB_Send_Key = 'MMV/FhBpQJi2b7WIQne+iQX7xH0NdlEBPaNP/jcEzgc=';

Azure_SB_Path = '/' + Azure_SB_Hubname + '/messages';
Azure_SB_Uri = 'https://' + Azure_SB_Namespace + Azure_SB_Path;

///////////////
// MQTT

MQTT_ENABLE = true;

MQTT_API_VER = "v1.0";

MQTT_PORT = 1883;
MQTT_SSL_PORT = 8883;

//MQTT_HOST = "localhost";

//MQTT_DB_URL = Meteor.settings.mqttDbUrl || ? Meteor.settings.mqttDbUrl : 'mongodb://localhost:3001/mqtt';
//
//MQTT_STORE = {
//    type: 'mongo',
//    url: MQTT_DB_URL,
//    pubsubCollection: 'ascoltatori',
//    mongo: {}
//};