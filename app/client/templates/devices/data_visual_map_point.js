// dataVisual Line

//Meteor.subscribe('mapmarkers');

VISUAL_JSON_DATA = "visual_json_data";
VISUAL_FROM_TIME = "visual_from_time";
VISUAL_TO_TIME = "visual_to_time";
VISUAL_TIME_FORMAT = "visual_time_format";

Template.dataVisualMapPoint.helpers({
    json_data: function () {
        delete Session.keys[VISUAL_JSON_DATA];

        var hour = moment().hour();
        Session.setDefault(VISUAL_FROM_TIME, moment(hour - 1, "HH").valueOf());
        Session.setDefault(VISUAL_TO_TIME, moment(hour + 1, "HH").valueOf());
        Session.setDefault(VISUAL_TIME_FORMAT, "HH:mm");

        var timeStart = getDateFromSession(VISUAL_FROM_TIME);
        var events = Collections.DataEvents.find({
                device_id: this._id,
                data_type: 'GPS',
                data_submit_time: {$gte: timeStart.toDate()}
            },
            {sort: {data_name: 1, data_submit_time: 1}}).fetch();

        // console.log("dataVisualEvents", events.length);
        if (events.length <= 0) return;

        var retjson = [];
        var nm, vl;
        _.forEach(events, function (event) {
            nm = event.data_name;
            try {
                vl = JSON.parse(event.data_value);
                // console.log("getDataEvent", nm, vl);

                if (vl)
                    retjson.push(vl);
            }
            catch (err) {
                // ignore this data
            }
        });

        console.log("retjson", _.unique(retjson));

        _.uniq(retjson, function(item, key, a) {
            return item.a;
        });

        Session.set(VISUAL_JSON_DATA, _.unique(retjson));

        return JSON.stringify(retjson);
        //return;
    },
    from_time: function () {
        return getDateFromSession(VIAUSL_FROM_TIME);
    },
    to_time: function () {
        return getDateFromSession(VIAUSL_TO_TIME);
    },
});

Template.dataVisualMapPoint.events({
    "click .showHour": function () {
        console.log("click .showHour");
        var timeinfo = moment().hour();
        addDateToSession(VIAUSL_FROM_TIME, moment(timeinfo - 1, "HH"));
        addDateToSession(VIAUSL_TO_TIME, moment(timeinfo + 1, "HH"));
        Session.set(VIAUSL_TIME_FORMAT, "HH:mm");
    },
    "click .showDay": function () {
        console.log("click .showDay");
        var timeinfo = moment().date();
        addDateToSession(VIAUSL_FROM_TIME, moment(timeinfo - 1, "DD"));
        addDateToSession(VIAUSL_TO_TIME, moment(timeinfo + 1, "DD"));
        Session.set(VIAUSL_TIME_FORMAT, "MM/DD HH:00");
    },
    "click .showWeek": function () {
        console.log("click .showWeek");
        var timeinfo = moment().week();
        addDateToSession(VIAUSL_FROM_TIME, moment(timeinfo - 1, "WW"));
        addDateToSession(VIAUSL_TO_TIME, moment(timeinfo + 1, "WW"));
        Session.set(VIAUSL_TIME_FORMAT, "MM/DD");
    }
});

Template.dataVisualMapPoint.rendered = function () {
    $(window).resize(function () {
        $('#map').css('height', window.innerHeight);
    });
    $(window).resize(); // trigger resize event

    L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';

    var locations = Session.get(VIAUSL_JSON_DATA);
    if (!locations) {
        return;
    }

    var map = L.map('map', {
        doubleClickZoom: true
    }).setView([39.88220211159095, -243.54492187500003], 13);

    L.tileLayer.provider('Thunderforest.Outdoors').addTo(map);

    _.forEach(locations, function (loc) {
        console.log("loc", loc);
        var marker = L.marker(loc).addTo(map);
            //.on('click', function (event) {
            //    // map.removeLayer(marker);
            //    // Markers.remove({_id: document._id});
            //
            //    //var containerNode = document.createElement('div');
            //    //// Which template to use for the popup? Some data for it, and attach it to node
            //    //Blaze.renderWithData(Template.mapPopup, loc, containerNode);
            //    //// Finally bind the containerNode to the popup
            //    //marker.bindPopup(containerNode).openPopup();
            //});
    });

    map.on('click', function (event) {
        console.log("event.latlng", event.latlng);
        // Markers.insert({latlng: event.latlng});

        var marker = L.marker(event.latlng).addTo(map);
            //.on('click', function (event) {
            //    // map.removeLayer(marker);
            //    // Markers.remove({_id: document._id});
            //
            //    //var containerNode = document.createElement('div');
            //    //// Which template to use for the popup? Some data for it, and attach it to node
            //    //Blaze.renderWithData(Template.mapPopup, event.latlng, containerNode);
            //    //// Finally bind the containerNode to the popup
            //    //marker.bindPopup(containerNode).openPopup();
            //});

    });

    //map.on('dblclick', function(event) {
    //    Markers.insert({latlng: event.latlng});
    //});

    //var query = Markers.find();
    //query.observe({
    //    added: function (document) {
    //        var marker = L.marker(document.latlng).addTo(map)
    //            .on('click', function(event) {
    //                map.removeLayer(marker);
    //                Markers.remove({_id: document._id});
    //            });
    //    },
    //    removed: function (oldDocument) {
    //        layers = map._layers;
    //        var key, val;
    //        for (key in layers) {
    //            val = layers[key];
    //            if (val._latlng) {
    //                if (val._latlng.lat === oldDocument.latlng.lat && val._latlng.lng === oldDocument.latlng.lng) {
    //                    map.removeLayer(val);
    //                }
    //            }
    //        }
    //    }
    //});
};