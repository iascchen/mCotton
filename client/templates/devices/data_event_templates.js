//Template.controlBoardChange.helpers({
//    control_type_icon: function () {
//        return controlTypeIcon(this.control_type, this.control_value);
//    },
//});

Template.dataEventOne.helpers({});

Template.dataEventList.helpers({
    data_event_items: function () {
        var event = Collections.DataEvents.findOne({device_id: this.device_id, data_name: this.data_name},
            {sort: {sid: -1}, fields: {sid: true}});
        //console.log("sid", event.sid);

        if (event) {
            return Collections.DataEvents.find({device_id: this.device_id, data_name: this.data_name, sid: event.sid},
                {sort: {data_submit_time: -1}});
        }
        else {
            return Collections.DataEvents.find({device_id: this.device_id, data_name: this.data_name},
                {sort: {data_submit_time: -1}, limit: DATA_EVENT_SHOW_LIST_LIMIT});
        }
    }
});

Template.dataEventPictures.helpers({
    data_event_items: function () {
        return Collections.DataEvents.find({device_id: this.device_id, data_name: this.data_name},
            {sort: {data_submit_time: -1}, limit: DATA_EVENT_SHOW_LIST_LIMIT});
    }
});
