Template.vidoePlayer.rendered = function () {
    videojs("test.mp4",
        {controls: true, autoplay: true, techOrder: ["flash", "html5"], preload: "auto"},
        function () {
            // Player (this) is initialized and ready.
        });
};

Template.header.helpers({
    uurl: function () {
        // return "http://192.168.190.134:8080/";
        return "test.mp4";
    },
    "video.thumbs": function () {
        return "test.png";
    }
});