/**
 * Created by chenhao on 15/4/29.
 */

Template.deviceSummarySimple.helpers({
    firstIamge: function () {
        if (this.img_ids && this.img_ids.length > 0)
            return Collections.Images.findOne({_id: this.img_ids[0]}); // Where Images is an FS.Collection instance
    },
});