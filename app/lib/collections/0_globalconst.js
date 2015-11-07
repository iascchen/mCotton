/**
 * Created by chenhao on 15/10/8.
 */

Collections = {};
Meteor.isClient && Template.registerHelper("Collections", Collections);

Schemas = {};
Meteor.isClient && Template.registerHelper("Schemas", Schemas);

FS.debug = false;

// default GET request headers
FS.HTTP.setHeadersForGet([
    ['Cache-Control', 'public, max-age=31536000']
]);

// GET request headers for the "any" store
FS.HTTP.setHeadersForGet([
    ['foo', 'bar']
], 'any');

/////////////////
// Share
/////////////////

SHARE_PRIVATE = 0;
SHARE_GROUP = 1;
SHARE_FRIENDS = 2;
SHARE_PUBLIC = 3;

SHARES = [
    {label: "Private", value: SHARE_PRIVATE},
    {label: "Group", value: SHARE_GROUP},
    {label: "Friend", value: SHARE_FRIENDS},
    {label: "Public", value: SHARE_PUBLIC}
];

SHARES_TYPES = _.map(SHARES, function (share) {
    return share.value
});

SHARES_AUTO_FORM = SHARES;

/////////////////
// Status
/////////////////

STATUS_SUBMIT = 0;
STATUS_NORMAL = 1;
STATUS_READONLY = 2;
STATUS_DISABLE = 3;
STATUS_DELETE = 4;

STATUS = [
    {label: "Submit", value: STATUS_SUBMIT},
    {label: "Normal", value: STATUS_NORMAL},
    {label: "Read Only", value: STATUS_READONLY},
    {label: "Disable", value: STATUS_DISABLE},
    {label: "Deleted", value: STATUS_DELETE}
];

STATUS_TYPES = _.map(STATUS, function (status) {
    return status.value
});

STATUS_AUTO_FORM = STATUS;

STATUS = [STATUS_SUBMIT, STATUS_NORMAL, STATUS_READONLY, STATUS_DISABLE, STATUS_DELETE];

/////////////////
// Data Points Type
/////////////////

DATA_POINTS = {
    BLD: {label: "Blood Pressure", icon: "/datapoints/blood_pressure.png", unit: "s"},
    APR: {label: "Air Pressure", icon: "/datapoints/airpressure.png", unit: "kPa"},
    APL: {label: "Air Pollution", icon: "/datapoints/airpollution.png", unit: "ppm"},
    CSH: {label: "Crash", icon: "/datapoints/crash.png"},
    DST: {label: "Distance", icon: "/datapoints/distance.png", unit: "m"},
    DOF: {label: "G-Senser & Gyroscope", icon: "/datapoints/dof.png", unit: "G"},
    GPS: {label: "GPS Location", icon: "/datapoints/gps.png"},
    GRY: {label: "Gray Sensor", icon: "/datapoints/gray_sensor.png"},
    HAL: {label: "Holzer", icon: "/datapoints/holzer.png", unit: ""},
    HUM: {label: "Humidity", icon: "/datapoints/wet.png", unit: "%"},
    IMG: {label: "Image", icon: "/datapoints/image.png", unit: ""},
    JSN: {label: "Json", icon: "/datapoints/json.png", unit: ""},
    LVL: {label: "Level", icon: "/datapoints/level.png", unit: ""},
    LUX: {label: "Lightness", icon: "/datapoints/lightness.png", unit: "Lux"},
    MIC: {label: "Microphone", icon: "/datapoints/mic.png"},
    MOT: {label: "Motion", icon: "/datapoints/motion.png"},
    NOI: {label: "Noise", icon: "/datapoints/noise.png", unit: "db"},
    PIR: {label: "PIR", icon: "/datapoints/pir.png", unit: ""},
    P10: {label: "PM 10", icon: "/datapoints/pm.png", unit: "μg/m3"},
    PUS: {label: "Pulse", icon: "/datapoints/pulse.png", unit: "times/min"},
    SHK: {label: "Shake", icon: "/datapoints/shake.png"},
    SPD: {label: "Speed", icon: "/datapoints/speed.png", unit: "km/h"},
    TEM: {label: "Temperature", icon: "/datapoints/temperature.png", unit: "℃"},
    TIM: {label: "Timer", icon: "/datapoints/timer.png", unit: "s"},
};

DATA_POINT_TYPES = _.keys(DATA_POINTS);

DATA_POINT_AUTO_FORM = function () {
    var ret = [];

    for (var key in DATA_POINT_TYPES) {
        ret.push({label: DATA_POINTS[DATA_POINT_TYPES[key]].label, value: DATA_POINT_TYPES[key]});
    }
    return ret;
};

/////////////////
// Control Points Type
/////////////////

CONTROL_POINTS = {
    BTN: {label: "Button", icons: ["/controlpoints/button.png"]},   // click = 1
    BUZ: {label: "Buzz", icons: ["/controlpoints/buzzer.png"]},     // buzz frequency
    CLR: {label: "Color", icons: ["/controlpoints/color.png"]},     // Color RGB
    IMG: {label: "Image", icons: ["/controlpoints/image.png"]},     // Image binary
    LED: {label: "LED Light", icons: ["/controlpoints/led.png", "/controlpoints/led-on.png"]},  // off. on
    MTR: {label: "Motor", icons: ["/controlpoints/motor.png"]},     // direction and speed
    PLY: {label: "Sound/Video Player", icons: ["/controlpoints/player.png"]}, // stop, play, pause, prev, next
    RTC: {label: "RTC Time Sync", icons: ["/controlpoints/rtc.png"]},  // timestamp
    SRV: {label: "Servo", icons: ["/controlpoints/servo.png"]},     // direction and speed
    SND: {label: "Sound", icons: ["/controlpoints/sound.png"]},     // Sound binary
    STP: {label: "Stepper", icons: ["/controlpoints/stepper.png"]}, // direction and speed
    SWT: {label: "Switch", icons: ["/controlpoints/switch-off.png", "/controlpoints/switch-on.png"]},
    TXT: {label: "Text", icons: ["/controlpoints/text.png"]},       // text message or some data threshold
    NUM: {label: "Number", icons: ["/controlpoints/text.png"]},       // Number message or some data threshold
    JSN: {label: "Json", icons: ["/controlpoints/json.png"]},       // Json message
    VLM: {label: "Voice volume", icons: ["/controlpoints/volume.png"]}, // 1-100, or 1-255
    VDO: {label: "Video", icons: ["/controlpoints/video.png"]},     // Video binary
};

CONTROL_POINT_TYPES = _.keys(CONTROL_POINTS);

CONTROL_POINT_AUTO_FORM = function () {
    var ret = [];

    for (var key in CONTROL_POINT_TYPES) {
        ret.push({label: CONTROL_POINTS[CONTROL_POINT_TYPES[key]].label, value: CONTROL_POINT_TYPES[key]});
    }
    return ret;
};

/////////////////
// Visualization Chart Type
/////////////////

CHARTS = {
    PIE: {label: "NVD3 - Pie Chart"},
    BAR: {label: "NVD3 - Bar Chart"},
    LINE: {label: "NVD3 - Line Chart"},
    MY_CITY: {label: "D3 - My City"},
    EGG: {label: "WebGL - Smart Egg"},

    MPH: {label: "Map - Heat Map"},
    MPM: {label: "Map - Marker Cluster"},
    MPP: {label: "Map - Point"},
    MPT: {label: "Map - Trace"}
};

CHART_TYPES = _.keys(CHARTS);

CHART_AUTO_FORM = function () {
    var ret = [];
    for (var key in CHART_TYPES) {
        ret.push({label: CHARTS[CHART_TYPES[key]].label, value: CHART_TYPES[key]});
    }
    return ret;
};

/////////////////
// Modules
/////////////////
