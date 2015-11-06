/**
 * Created by chenhao on 15/10/13.
 */

Template.thumbnail.helpers({
    thumb: function () {
        // console.log("thumbnail", this.id);
        if (this.id)
            return Collections.Images.findOne({_id: this.id});
    }
});