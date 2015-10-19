//Template.controlBoardChange.helpers({
//    control_type_icon: function () {
//        return controlTypeIcon(this.control_type, this.control_value);
//    },
//});

Template.controlBoardChange.events({
    'click .changeBtn': function (e) {
        e.preventDefault();

        // console.log("controlBoardChange", JSON.stringify(this));

        var device_id = this.device_id;
        var device = Collections.Devices.findOne({_id: device_id});
        // console.log("controlBoardChange", device_id, device);

        var value = !(this.control_value === "true");

        var entity = {
            control_name: this.control_name, control_type: this.control_type,
            device_id: this.device_id, owner_user_id: device.owner_user_id,
            control_value: value.toString(), control_submit_time: new Date(),
        };

        // console.log("ControlEvents.insert", entity);
        Collections.ControlEvents.insert(entity);
    }
});

Template.controlBoardClick.events({
    'click .clickBtn': function (e) {
        e.preventDefault();

        var device_id = this.device_id;
        var device = Collections.Devices.findOne({_id: device_id});

        var value = "1";

        var entity = {
            control_name: this.control_name, control_type: this.control_type,
            device_id: this.device_id, owner_user_id: device.owner_user_id,
            control_value: value, control_submit_time: new Date(),
        };

        // console.log("ControlEvents.insert", entity);
        Collections.ControlEvents.insert(entity);
    }
});

Template.controlBoardInput.events({
    'click .sendBtn': function (e) {
        e.preventDefault();

        var device_id = this.device_id;
        var device = Collections.Devices.findOne({_id: device_id});

        // Get value from form element
        var value = e.target.parentNode.text.value;

        var entity = {
            control_name: this.control_name, control_type: this.control_type,
            device_id: this.device_id, owner_user_id: device.owner_user_id,
            control_value: value, control_submit_time: new Date(),
        };

        // console.log("ControlEvents.insert", entity);
        Collections.ControlEvents.insert(entity);
    }
});