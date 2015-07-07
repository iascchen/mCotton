/**
 * Created by chenhao on 15/4/12.
 */

/**
 * Created by chenhao on 15/4/7.
 */

if (Modules.find().count() === 0) {
    var now = new Date().getTime();

    // create two users
    var tomId = Meteor.users.insert({
        profile: {name: 'Tom'}
    });
    var tom = Meteor.users.findOne(tomId);

    var jerryId = Meteor.users.insert({
        profile: {name: 'Jerry'}
    });
    var jerry = Meteor.users.findOne(jerryId);

    // ==============================

    var _module_id_1 = Modules.insert({name: 'Microduino-Core+', desc: 'Core+',});
    var _module_id_6 = Modules.insert({name: 'Microduino-Core', desc: 'Core',});

    var _module_id_2 = Modules.insert({name: 'Microduino-USBTTL', desc: 'Program download',});
    var _module_id_3 = Modules.insert({name: 'Microduino-WiFi', desc: 'WiFi module',});
    var _module_id_4 = Modules.insert({name: 'Microduino-OLED', desc: 'Info. Display',});

    var _module_id_5 = Modules.insert({name: 'Microduino-Weather', desc: 'Sensor extension board',});

    var _app_kit_id = AppKits.insert({
        name: 'Weather Station', desc: 'Acquiring the weather information.',
        module_ids: [
            Modules.findOne({name: 'Microduino-Core+'})._id,
            Modules.findOne({name: 'Microduino-USBTTL'})._id,
            Modules.findOne({name: 'Microduino-WiFi'})._id,
            Modules.findOne({name: 'Microduino-OLED'})._id,
            Modules.findOne({name: 'Microduino-Weather'})._id,
        ],
    });

    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Temperature", data_type: "TEM", data_unit: "℃",});
    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Humidity", data_type: "HUM", data_unit: "%",});
    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Light", data_type: "LUX", data_unit: "Lux",});
    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Air Pressure", data_type: "AP", data_unit: "kPa",});
    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "PM", data_type: "PM", data_unit: "μg/m3",});
    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Air Pollution", data_type: "APL", data_unit: "ppm",});

    ControlPoints.insert({app_kit_id: _app_kit_id, control_name: "Status", control_type: "LED",});

    // MyAppKits

    var _my_appkit_id = MyAppKits.insert({
        owner_user_id: jerry._id, name: 'My Weather Station',
        app_kit_id: _app_kit_id, create_time: now, last_update_time: now,
    });

    MyModules.insert({
        owner_user_id: jerry._id, name: 'My Microduino-Core+',
        module_id: _module_id_1, create_time: now, last_update_time: now,
    });

    MyModules.insert({
        owner_user_id: jerry._id, name: 'My Microduino-USBTTL',
        module_id: _module_id_2, create_time: now, last_update_time: now,
    });

    MyModules.insert({
        owner_user_id: jerry._id, name: 'My Microduino-WiFi',
        module_id: _module_id_3, create_time: now, last_update_time: now,
    });

    MyModules.insert({
        owner_user_id: jerry._id, name: 'My Microduino-OLED',
        module_id: _module_id_4, create_time: now, last_update_time: now,
    });

    DataEvents.insert({
        data_name: "tem", data_type: "TEM", data_value: "30.1", data_unit: "C",
        data_submit_time: "12112321323", my_app_kit_id: _my_appkit_id, owner_user_id: jerry._id,
    });

    DataEvents.insert({
        data_name: "hum", data_type: "HUM", data_value: "25", data_unit: "%",
        data_submit_time: "12112321323", my_app_kit_id: _my_appkit_id, owner_user_id: jerry._id,
    });

    DataEvents.insert({
        data_name: "lux", data_type: "LUX", data_value: "100", data_unit: "Lus",
        data_submit_time: "12112321323", my_app_kit_id: _my_appkit_id, owner_user_id: jerry._id,
    });

    ControlEvents.insert({
        control_name: "status", control_type: "LED", control_value: "1",
        control_submit_time: "12112321323", my_app_kit_id: _my_appkit_id, owner_user_id: jerry._id,
    });

    //==========================================

    _app_kit_id = AppKits.insert({
        name: 'Smart City', desc: 'Smart City Simulation.', show_chart: "MY_CITY",
        module_ids: [
            Modules.findOne({name: 'Microduino-Core+'})._id,
        ],
    });

    DataPoints.insert({
        app_kit_id: _app_kit_id, data_name: "Cell", data_type: "JSN", show_list: true,
    });

    ControlPoints.insert({app_kit_id: _app_kit_id, control_name: "Scan", control_type: "BTN",});
    ControlPoints.insert({app_kit_id: _app_kit_id, control_name: "Reset", control_type: "BTN",});

    //==========================================

    _app_kit_id = AppKits.insert({
        name: 'Time-lapse Camera', desc: 'Time-lapse Camera.',
        module_ids: [
            Modules.findOne({name: 'Microduino-Core+'})._id,
        ],
    });

    DataPoints.insert({
        app_kit_id: _app_kit_id, data_name: "Picture", data_type: "PIC", show_list: true
    });

    ControlPoints.insert({app_kit_id: _app_kit_id, control_name: "Shutter", control_type: "BTN",});

    //==========================================

    _app_kit_id = AppKits.insert({
        name: '3D Garden', desc: 'Smart 3D Garden.',
        // show_chart: "MY_CITY",
        module_ids: [
            Modules.findOne({name: 'Microduino-Core+'})._id,
        ],
    });

    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Temperature P1", data_type: "TEM", data_unit: "℃",});
    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Humidity P1", data_type: "HUM", data_unit: "%",});
    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Light P1", data_type: "LUX", data_unit: "Lux",});

    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Temperature P2", data_type: "TEM", data_unit: "℃",});
    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Humidity P2", data_type: "HUM", data_unit: "%",});
    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Light P2", data_type: "LUX", data_unit: "Lux",});

    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Temperature P3", data_type: "TEM", data_unit: "℃",});
    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Humidity P3", data_type: "HUM", data_unit: "%",});
    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Light P3", data_type: "LUX", data_unit: "Lux",});

    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Temperature P3", data_type: "TEM", data_unit: "℃",});
    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Humidity P3", data_type: "HUM", data_unit: "%",});
    DataPoints.insert({app_kit_id: _app_kit_id, data_name: "Light P3", data_type: "LUX", data_unit: "Lux",});

    ControlPoints.insert({app_kit_id: _app_kit_id, control_name: "Water", control_type: "SWT",});
    ControlPoints.insert({app_kit_id: _app_kit_id, control_name: "Light", control_type: "LED",});
}