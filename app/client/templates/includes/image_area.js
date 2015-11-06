/**
 * Created by chenhao on 15/10/13.
 */

function getHandler(dropped) {
    return FS.EventHandlers.insertFiles(Collections.Images, {
        metadata: function (fileObj) {
            return {
                owner: Meteor.userId(),
                foo: "bar",
                dropped: dropped
            };
        },
        after: function (error, fileObj) {
            if (!error) {
                console.log("FileInserted", fileObj.name(), " | ", fileObj._id);
                // alert("Inserted : " + fileObj._id);

                var multiImage = Session.get('uploadMultiImages');
                console.log( "FileInserted multi : ", this.multi);
                if (multiImage) {
                    var uploadIds = Session.get('uploadedFileIds');
                    if (!uploadIds)
                        uploadIds = [];

                    uploadIds.push(fileObj._id);
                    Session.set('uploadedFileIds', uploadIds);
                }
                else {
                    Session.set('uploadedFileIds', fileObj._id);
                }
            }
        }
    });
}

Template.imagesArea.onCreated(function () {
    delete Session.keys['uploadedFileIds'];
    console.log("params : " , this.multi);
    // console.log(Session.get('uploadedFileIds'))
});

Template.imagesArea.events({
    'dropped .imageArea': getHandler(true),
    'dropped .imageDropArea': getHandler(true),
    'change input.images': getHandler(false)
});

Template.imagesArea.helpers({
    curImageIds: function () {
        return Session.get('uploadedFileIds');
    }
});