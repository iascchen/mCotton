// dataVisual Line

//Meteor.subscribe('mapmarkers');

VISUAL_JSON_DATA = "visual_json_data";

Template.dataVisualMapTrace.created = function () {
    delete Session.keys[VISUAL_JSON_DATA];
    Session.setDefault(VISUAL_JSON_DATA, {lan: 39.87, lng: -243});
};

Template.dataVisualMapTrace.helpers({
    json_data: function () {
        var event = Collections.DataEvents.findOne({device_id: this._id, data_type: 'GPS'},
            {sort: {sid: -1}, fields: {sid: true}});

        if (!event) {
            return;
        }
        // console.log("sid", event.sid);

        var events = Collections.DataEvents.find({device_id: this._id, data_type: 'GPS', sid: event.sid},
            {sort: {data_submit_time: 1}}).fetch();
        // console.log("getMyCityJson", events);

        var locations = [];
        _.forEach( events, function(event){
            locations.push( JSON.parse(event.data_value) );
        });

        var event = Collections.DataEvents.findOne({
                device_id: this._id,
                data_type: 'GPS'
            },
            {sort: {data_submit_time: -1}});

        // console.log("dataVisualEvents", event);
        if (!event) return;

        var retjson = {name: event.data_name, value: JSON.parse(event.data_value)};
        Session.set(VISUAL_JSON_DATA, retjson);

        return JSON.stringify(retjson);
        //return;
    }
});

Template.dataVisualMapTrace.rendered = function () {
    var width = 600;
    $("#area").height(width);

    var data = Session.get(VISUAL_JSON_DATA);
    var location = data.value;
    var map, marker;

    Mapbox.debug = true;
    Mapbox.load({
        plugins: ['markercluster']
    });

    this.autorun(function () {
        if (Mapbox.loaded()) {
            // console.log("json_data", location);

            L.mapbox.accessToken = MAPBOX_TOKEN;
            map = L.mapbox.map('map');
            map.addLayer(L.mapbox.tileLayer('mapbox.streets'))
                .setView([location.lat, location.lng], 16);

            marker = L.marker(location, {
                icon: L.mapbox.marker.icon({
                    'marker-color': '#f86767'
                })
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