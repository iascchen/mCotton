/**
 * Created by chenhao on 15/4/14.
 */

Meteor.subscribe("dataevents");

Template.dataEvent.helpers({
    json: function(){
        return JSON.stringify(this);
    },
    dataEventTemplate: function () {
        // console.log(this);
        if (this.data_show_list) {
            switch (this.data_type) {
                case 'PIC':
                    return Template.dataEventPictures;
            }
            return Template.dataEventList;
        }
        return Template.dataEventOne;
    }
});