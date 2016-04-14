/**
 * Created by chenhao on 15/7/20.
 */

var index = 0;
var img_index = 0;

//_imgs = ["/imgs/cover.png", "/imgs/mcookie.jpg", "/imgs/mic_light.png", "/imgs/music_box.png"];
var _imgs = ["/imgs/cover.png"];
var rVarProjectsCount = new ReactiveVar(0), rVarDevicesCount = new ReactiveVar(0),
    rVarPublicDevicesCount = new ReactiveVar(0);

Template.home.helpers({
    ultraVisualData: function () {
        var _data = [
            {
                "title": "<strong> " + rVarProjectsCount.get() + " Awesome Projects </strong>",
                "description": "Smart Vulture Egg, Weather Station, City Block",
                "buttons": [
                    {label: "Projects ...", href: "/projects"},
                ]
            },
            {}, {
                "title": "<strong> " + rVarDevicesCount.get() + " IoT Devices </strong>",
                "description": "Push data or pull control via API of RESTful, WebSocket, MQTT, ...",
                "buttons": [
                    {label: "microduino", href: "https://www.microduino.cc/store"},
                    {label: "mCookie", href: "https://www.microduino.cc/store"}
                ]
            },
            {}, {
                "title": "<strong> " + rVarPublicDevicesCount.get() + " Open Data Devices</strong>",
                "description": "Share your data to public, and dump it as your wish.",
                "buttons": [
                    {label: "Public Devices ...", href: "/publicdevices"},
                    //{label: "Map ...", href: "/pdmap"}
                ]
            },
            {}, {
                "title": "<strong> Data Visualization </strong>",
                "description": "Data visualized by SVG, D3.js, WebGL, GIS, ...",
            },
            {}, {
                "title": "<strong> Open Source Software </strong>",
                "description": "We built full stack open sources software for open sources hardware",
                "buttons": [
                    {label: "Fork from Github", href: "https://github.com/iascchen/mCotton"}
                ]
            },
            {}, {
                "title": "<strong> In Javascript </strong>",
                "description": "All platform built in Javascript, includes clouds, gateways, even in embedded devices"
            },
            {}, {
                "title": "<strong> Android, iOS, HTML5 </strong>",
                "description": "Control devices via mobile apps or browser. provides sample code in iOS Swift, Android, and H5"
            },
            {}, {
                "title": "<strong> Wireless Connection </strong>",
                "description": "Via BLE 4, Wifi, Zigbee"
            }
        ];

        return _data;
    }
});


Template.home.rendered = function () {
    //rVarProjectsCount = new ReactiveVar(0);
    //rVarDevicesCount = new ReactiveVar(0);
    //rVarPublicDevicesCount = new ReactiveVar(0);

    Meteor.call('projectsCount', function (error, result) {
        if (result) {
            rVarProjectsCount.set(result);
        }
    });
    Meteor.call('devicesCount', function (error, result) {
        if (result) {
            rVarDevicesCount.set(result);
        }
    });
    Meteor.call('publicDevicesCount', function (error, result) {
        if (result) {
            rVarPublicDevicesCount.set(result);
        }
    });
};

Template.scroll_item.helpers({
    background: function () {
        var img_index2 = (img_index + 1) % _imgs.length;
        return _imgs[img_index2];
    }
});