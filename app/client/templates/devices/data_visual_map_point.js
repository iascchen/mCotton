// dataVisual Line

//Meteor.subscribe('mapmarkers');

VISUAL_JSON_DATA = "visual_json_data";

Template.dataVisualMapPoint.created = function () {
    delete Session.keys[VISUAL_JSON_DATA];
    Session.setDefault(VISUAL_JSON_DATA, {lan: 0, lng: 0});
};

Template.dataVisualMapPoint.helpers({
    json_data: function () {
        var event = Collections.DataEvents.findOne({
                device_id: this._id,
                data_type: 'GPS'
            },
            {sort: {data_submit_time: -1}});

        // console.log("dataVisualEvents", event);
        if (!event) return;

        var retjson = event.data_value;
        Session.set(VISUAL_JSON_DATA, JSON.parse(retjson));

        return JSON.stringify(retjson);
        //return;
    }
});

Template.dataVisualMapPoint.rendered = function () {
    var width = 600;
    $("#area").height(width);

    var location = Session.get(VISUAL_JSON_DATA);
    var map, marker;

    Mapbox.debug = true;
    Mapbox.load({
        plugins: ['markercluster']
    });

    this.autorun(function () {
        if (Mapbox.loaded()) {
            // console.log("json_data", location);

            L.mapbox.accessToken = MAPBOX_TOKEN;
            map = L.mapbox.map('map')
                .addLayer(L.mapbox.tileLayer('mapbox.streets'))
                .setView([location.lat, location.lng], 16);

            marker = L.marker(location, {
                icon: L.mapbox.marker.icon({'marker-color': '#f86767'})
            });

            marker.addTo(map);
        }
    });

    var animate = function () {
        if (map && marker) {
            location = Session.get(VISUAL_JSON_DATA);
            map.setView([location.lat, location.lng], map.getZoom());
            marker.setLatLng(location);
        }

        requestAnimationFrame(animate);
    };

    animate();
};