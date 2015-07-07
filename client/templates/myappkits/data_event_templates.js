//Template.controlBoardChange.helpers({
//    control_type_icon: function () {
//        return controlTypeIcon(this.control_type, this.control_value);
//    },
//});

Template.dataEventOne.helpers({});

Template.dataEventList.helpers({
    data_event_items: function () {
        var event = DataEvents.findOne({my_app_kit_id: this.my_app_kit_id, data_name: this.data_name},
            {sort: {sid: -1}, fields: {sid: true}});
        //console.log("sid", event.sid);

        if (event) {
            return DataEvents.find({my_app_kit_id: this.my_app_kit_id, data_name: this.data_name, sid: event.sid},
                {sort: {data_submit_time: -1}});
        }
        else {
            return DataEvents.find({my_app_kit_id: this.my_app_kit_id, data_name: this.data_name},
                {sort: {data_submit_time: -1}, limit: DATA_EVENT_SHOW_LIST_LIMIT});
        }
    }
});

Template.dataEventPictures.helpers({
    data_event_items: function () {
        return DataEvents.find({my_app_kit_id: this.my_app_kit_id, data_name: this.data_name},
            {sort: {data_submit_time: -1}, limit: DATA_EVENT_SHOW_LIST_LIMIT});
    }
});
