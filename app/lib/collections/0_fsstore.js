/**
 * Created by chenhao on 15/10/12.
 */

Stores = {};

/****************************
 * AWS S3
 ****************************/

// var imageStore = new FS.Store.S3("images", {
//   accessKeyId: Meteor.settings.accessKeyId, //required
//   secretAccessKey: Meteor.settings.secretAccessKey, //required
//   bucket: Meteor.settings.imageStoreBucket //required
// });

// var anyStore = new FS.Store.S3("any", {
//   accessKeyId: Meteor.settings.accessKeyId, //required
//   secretAccessKey: Meteor.settings.secretAccessKey, //required
//   bucket: Meteor.settings.anyStoreBucket //required
// });

/****************************
 * GridFS
 ****************************/

//Stores.images = new FS.Store.GridFS("images");
//
//Stores.thumbs = new FS.Store.GridFS("thumbs", {
//    beforeWrite: function (fileObj) {
//        // We return an object, which will change the
//        // filename extension and type for this store only.
//        return {
//            extension: 'png',
//            type: 'image/png'
//        };
//    },
//    transformWrite: function (fileObj, readStream, writeStream) {
//        // Transform the image into a 200px x 200px PNG thumbnail
//        gm(readStream).resize(200).stream('PNG').pipe(writeStream);
//        // The new file size will be automatically detected and set for this store
//    }
//});
//
//Stores.any = new FS.Store.GridFS("any");

/****************************
 * FileSystem
 ****************************/

/////////////////
// !!! IMPORTANT
// FS System base
/////////////////

// SYS_BASE = "/data";     // all upload images and files will be stored in this folder, please make sure you have access rights.
SYS_BASE = "/Users/chenhao";

Stores.images = new FS.Store.FileSystem("images", {
    path: SYS_BASE + "/uploads/images",
});

Stores.thumbs = new FS.Store.FileSystem("thumbs", {
    path: SYS_BASE + "/uploads/thumbs",

    beforeWrite: function (fileObj) {
        // We return an object, which will change the
        // filename extension and type for this store only.
        return {
            extension: 'png',
            type: 'image/png'
        };
    },
    transformWrite: function (fileObj, readStream, writeStream) {
        // Transform the image into a 200px x 200px PNG thumbnail
        gm(readStream).resize(400, 400, '^').gravity('Center').crop(400, 400).stream('PNG').pipe(writeStream);
        // The new file size will be automatically detected and set for this store
    }
});

Stores.any = new FS.Store.FileSystem("any", {
    path: SYS_BASE + "/uploads/any",
});