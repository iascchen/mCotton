/**
 * Created by chenhao on 15/10/11.
 */

Template.imageStore.helpers({
    uploadedImages: function () {
        return Collections.Images.find({}, {sort: {uploadedAt: -1}});
    },
    multiImage: function () {
        Session.set('uploadMultiImages', true);
        return true;
    }
});