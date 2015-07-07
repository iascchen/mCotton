/**
 * Created by chenhao on 15/4/14.
 */

Meteor.subscribe("dataevents", Meteor.userId());

Template.dataEvent.helpers({
    dataEventTemplate: function () {
        if (this.show_list) {
            switch (this.data_type) {
                case 'PIC':
                    return Template.dataEventPictures;
            }
            return Template.dataEventList;
        }
        return Template.dataEventOne;
    }
});