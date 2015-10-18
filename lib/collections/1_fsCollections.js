/**
 * Created by chenhao on 15/10/12.
 */

Collections.Images = new FS.Collection("images", {
    stores: [
        Stores.images,
        Stores.thumbs
    ],
    filter: {
        maxSize: 20 * 1024 * 1024, //in bytes
        allow: {
            contentTypes: ['image/*']
        },
        onInvalid: function (message) {
            Meteor.isClient && alert(message);
        }
    }
});

Collections.Files = new FS.Collection("files", {
    stores: [Stores.any],
    chunkSize: 4 * 1024 * 1024
});

//Collections.Images.allow({
//    insert: function (userId, doc) {
//        return true;
//    },
//    update: function (userId, doc, fieldNames, modifier) {
//        return true;
//    },
//    download: function (userId) {
//        return true;
//    }
//});

function trueFunc(userId) {
    if (!userId) {
        // must be logged in
        return false;
    }

    return true;
};

function downloadFunc() {return true;}

function falseFunc() {return false;}

Collections.Files.allow({
    insert: trueFunc,
    update: trueFunc,
    remove: trueFunc,
    download: trueFunc
});

Collections.Files.deny({
    insert: falseFunc,
    update: falseFunc,
    remove: falseFunc,
    download: falseFunc
});

Collections.Images.allow({
    insert: trueFunc,
    update: trueFunc,
    remove: trueFunc,
    download: trueFunc
});

Collections.Images.deny({
    insert: falseFunc,
    update: falseFunc,
    remove: falseFunc,
    download: falseFunc
});
