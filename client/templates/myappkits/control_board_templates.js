//Template.controlBoardChange.helpers({
//    control_type_icon: function () {
//        return controlTypeIcon(this.control_type, this.control_value);
//    },
//});

Template.controlBoardChange.events({
    'click .changeBtn': function (e) {
        e.preventDefault();

        var my_app_kit_id = this.my_app_kit_id;
        var my_app_kit = MyAppKits.findOne({_id: my_app_kit_id});

        var value = !(this.control_value === "true");

        var entity = {
            control_name: this.control_name, control_type: this.control_type,
            my_app_kit_id: this.my_app_kit_id, owner_user_id: my_app_kit.owner_user_id,
            control_value: value.toString(), control_submit_time: new Date(),
        };

        // console.log("ControlEvents.insert", entity);
        ControlEvents.insert(entity);
    }
});

Template.controlBoardClick.events({
    'click .clickBtn': function (e) {
        e.preventDefault();

        var my_app_kit_id = this.my_app_kit_id;
        var my_app_kit = MyAppKits.findOne({_id: my_app_kit_id});

        var value = this.control_value;

        var entity = {
            control_name: this.control_name, control_type: this.control_type,
            my_app_kit_id: this.my_app_kit_id, owner_user_id: my_app_kit.owner_user_id,
            control_value: value.toString(), control_submit_time: new Date(),
        };

        // console.log("ControlEvents.insert", entity);
        ControlEvents.insert(entity);
    }
});

Template.controlBoardInput.events({
    'click .sendBtn': function (e) {
        e.preventDefault();

        var my_app_kit_id = this.my_app_kit_id;
        var my_app_kit = MyAppKits.findOne({_id: my_app_kit_id});

        // Get value from form element
        var value = e.target.parentNode.text.value;

        var entity = {
            control_name: this.control_name, control_type: this.control_type,
            my_app_kit_id: this.my_app_kit_id, owner_user_id: my_app_kit.owner_user_id,
            control_value: value, control_submit_time: new Date(),
        };

        // console.log("ControlEvents.insert", entity);
        ControlEvents.insert(entity);
    }
});