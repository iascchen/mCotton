/**
 * Created by chenhao on 15/4/15.
 */

DATA_EVENT_SHOW_LIST_LIMIT = 20;

base64Encode = function (unencoded) {
    return new Buffer(unencoded || '').toString('base64');
};

base64Decode = function (encoded) {
    return new Buffer(encoded || '', 'base64').toString('utf8');
};

base64UrlEncode = function (unencoded) {
    var encoded = Meteor.call('base64Encode', unencoded);
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

base64UrlDecode = function (encoded) {
    encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (encoded.length % 4)
        encoded += '=';
    return Meteor.call('base64Decode', encoded);
};

dataTypeIcon = function (data_type) {
    var ret = "/imgs/unknown.png";
    switch (data_type) {
        case "TEM":
            ret = "/imgs/datapoint_temperature.png";
            break;
        case "HUM":
            ret = "/imgs/datapoint_wet.png";
            break;
        case "LUX":
            ret = "/imgs/datapoint_lux.png";
            break;
        case "AP":
            ret = "/imgs/datapoint_airpressure.png";
            break;
        case "PM":
            ret = "/imgs/datapoint_pm.png";
            break;
        case "APL":
            ret = "/imgs/datapoint_airpollution.png";
            break;
        case "JSN":
            ret = "/imgs/datapoint_json.png";
            break;
        case "PIC":
            ret = "/imgs/datapoint_picture.png";
            break;
    }
    return ret;
};

controlTypeIcon = function (control_type, control_value) {
    var ret = "/imgs/unknown.png";
    switch (control_type) {
        case "LED":
            ret = (control_value == "true") ? "/imgs/green-led.png" : "/imgs/green-led-off.png";
            break;
        case "SWT":
            ret = (control_value == "true") ? "/imgs/switch-on.png" : "/imgs/switch-off.png";
            break;
        case "BTN":
            ret = "/imgs/button.png";
            break;
    }
    return ret;
};

CITY_GROUP = ["空地", "别墅", "公寓", "绿化",
    "轻工厂", "重工厂", "垃圾处理厂", "火力发电",
    "风力发电", "娱乐场所", "医院", "供水厂",
    "学校", "商场", "文化场馆", "道路"];

imageByCityGroup = function (group_index) {
    var ret = 0;
    if (group_index < CITY_GROUP.length) {
        ret = group_index;
    }

    return "/imgs/city_type_" + ret + ".png";
};

labelByCityGroup = function (group_index) {
    var ret;
    if (group_index < CITY_GROUP.length) {
        ret = CITY_GROUP[group_index];
        return ret;
    }
    return "Type : " + group_index;
};

addDateToSession = function (key, d) {
    Session.set(key, d.valueOf());
};

getDateFromSession = function (key) {
    var ts = Session.get(key);
    return moment(ts);
};