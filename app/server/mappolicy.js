// setup local CORS for Cordova testing

BrowserPolicy.content.allowOriginForAll("*");

//BrowserPolicy.content.allowOriginForAll("meteor.local");
//BrowserPolicy.content.allowOriginForAll("*.openstreetmap.org");
//BrowserPolicy.content.allowOriginForAll("*.tile.thunderforest.com");

// Listen to incoming HTTP requests, can only be used on the server
WebApp.connectHandlers.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
});
