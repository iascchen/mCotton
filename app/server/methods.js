/**
 * Created by chenhao on 15/11/6.
 */

var Future = Npm.require("fibers/future");
var fs = Npm.require('fs');

/////////////////////////
// PAY ATTENTION !!!
// Please make sure this folder is NOT under project, because new file generated will let server refresh.
// You should make another folder can be mapped as "/datadump" on http proxy.

DATA_DOWNLOAD_SERVER = SYS_BASE + DATA_DOWNLOAD_PATH;

Meteor.methods({
    "projectsCount": function () {
        return Collections.Projects.find({
            status: {$ne: STATUS_DELETE}
        }).count();
    },

    "devicesCount": function () {
        return Collections.Devices.find({
            status: {$ne: STATUS_DELETE}
        }).count();
    },

    "publicDevicesCount": function () {
        return Collections.Devices.find({
            share: SHARE_PUBLIC,
            $or: [{status: STATUS_NORMAL}, {status: STATUS_READONLY}]
        }).count();
    },

    "dumpDeviceData": function (device_id, date_str) {
        console.log("dumpDeviceData", device_id + "," + date_str);

        var file_name = device_id + "_" + date_str + '.json';
        var zip_name = device_id + "_" + date_str + '.zip';
        var path = DATA_DOWNLOAD_SERVER + "/" + zip_name;
        var timeinfo = moment(date_str, DATA_TIME_FORMAT);

        if (fs.existsSync(path)){
            console.log("dumpDeviceData", "File is exists");
            return zip_name;
        }

        console.log("dumpDeviceData", "Prepare new file");
        var future = new Future();

        var data = Collections.DataEvents.find(
            {
                device_id: device_id,
                data_submit_time: {$lt: timeinfo.toDate()}
            },
            {sort: {data_submit_time: -1}}).fetch();

        var zip = new JSZip();
        zip.file(file_name, JSON.stringify(data));
        zip.saveAs(path, function (error, result) {

            if (error) {
                console.log(error);
                return future.return("Failed");
            }
            if (result) {
                return future.return(zip_name);
            }
        });

        return future.wait();
    },

    // TODO ,don't know how to do it
    //"dumpProjectData": function (project_id) {
    //    var data = Collections.DataEvents.find({device_id: project_id}, {sort: {data_submit_time: -1}}).fetch();
    //
    //    var zip = new JSZip();
    //    zip.file('data.json', data);
    //    zip.saveAs("/Users/chenhao/data.zip", function (error, result) {
    //        if (error) {
    //            console.log(error);
    //            return false;
    //        }
    //        if (result) {
    //            console.log(error);
    //            return true;
    //        }
    //    });
    //}
});