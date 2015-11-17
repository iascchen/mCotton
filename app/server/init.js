/**
 * Created by chenhao on 15/10/10.
 */

Meteor.startup(function () {
    //UploadServer.init({
    //    tmpDir: process.env.PWD + '/.uploads/tmp',
    //    uploadDir: process.env.PWD + '/.uploads/',
    //    checkCreateDirectories: true //create the directories for you
    //})

    Collections.Devices._ensureIndex({"project_id": 1});

    Collections.DataEvents._ensureIndex({"device_id": 1});
    Collections.ControlEvents._ensureIndex({"device_id": 1});
});