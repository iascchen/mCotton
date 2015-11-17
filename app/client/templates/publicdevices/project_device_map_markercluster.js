// dataVisual Line

//Meteor.subscribe('mapmarkers');

VISUAL_JSON_DATA = "visual_json_data";

Template.projectDeviceMapMarkers.created = function () {
    delete Session.keys[VISUAL_JSON_DATA];
    Session.setDefault(VISUAL_JSON_DATA, {lan: 39.87, lng: -243});
};

Template.projectDeviceMapMarkers.helpers({
    json_data: function () {
        var devices = this.fetch();
        console.log(devices);

        var retjson = [];
        _.forEach(devices, function (dev) {
            var event = Collections.DataEvents.findOne({
                device_id: dev._id,
                data_type: 'GPS'
            }, {sort: {data_submit_time: -1}, fields: {data_value: true}});

            if (event) {
                var loc = JSON.parse(event.data_value);
                retjson.push([loc.lat, loc.lng, dev.name]);
            }
        });

        Session.set(VISUAL_JSON_DATA, retjson);

        return JSON.stringify(retjson);
        //return;
    }
});

Template.projectDeviceMapMarkers.rendered = function () {
    var width = 600;
    $("#area").height(width);

    var graph = Session.get(VISUAL_JSON_DATA);

    if(!graph) alert("Data not ready!");

    var map, markers;

    Mapbox.debug = true;
    Mapbox.load({
        plugins: ['markercluster']
    });

    this.autorun(function () {
        if (Mapbox.loaded()) {

            graph = Session.get(VISUAL_JSON_DATA);
            console.log("json_data", graph);

            L.mapbox.accessToken = MAPBOX_TOKEN;
            map = L.mapbox.map('map');
            map.addLayer(L.mapbox.tileLayer('mapbox.streets'));

            map.setView([graph[0][0], graph[0][1]], 14);

            markers = new L.MarkerClusterGroup();

            for (var i = 0; i < graph.length; i++) {
                var a = graph[i];
                var title = a[2];
                var marker = L.marker(new L.LatLng(a[0], a[1]), {
                    icon: L.mapbox.marker.icon({'marker-color': '0044FF'}),
                    title: title
                });
                marker.bindPopup(title);
                markers.addLayer(marker);
            }

            map.addLayer(markers);
        }
    });

    var animate = function () {
        if (map && markers) {
            graph = Session.get(VISUAL_JSON_DATA);
            if (graph) return;
        }

        requestAnimationFrame(animate);
    };

    animate();
};