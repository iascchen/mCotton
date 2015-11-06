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
    var ret = DATA_POINTS[data_type].icon;
    if (!ret)
        ret = "/imgs/unknown.png";
    return ret;
};

controlTypeIcon = function (control_type, control_value) {
    var ret = "/imgs/unknown.png";

    if (_.contains(["LED", "SWT"], control_type)) {
        ret = (control_value == "true") ? CONTROL_POINTS[control_type].icons[1] : CONTROL_POINTS[control_type].icons[0];
    } else if (_.contains(CONTROL_POINT_TYPES, control_type)) {
        ret = CONTROL_POINTS[control_type].icons[0];
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

    return "/citytypes/city_type_" + ret + ".png";
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

anchorScroll = function () {
    var hash = Session.get('hash');
    console.log("hash", hash);
    if (hash) {
        var offset = $('a[name="' + hash + '"]').offset();
        if (offset) {
            $('html, body').animate({scrollTop: offset.top}, 400);
        }
    }
    Session.set('hash', '');
};

getEnv = function (key, dft) {
    var env = process.env[key];
    if (env)
        return env;

    env = Meteor.settings[key];
    if (env)
        return env;

    return dft;
};