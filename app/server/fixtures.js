/**
 * Created by chenhao on 15/4/12.
 */

if (Meteor.users.find().count() === 0) {

    var now = new Date().getTime();

    /********************************
     * Default Users
     ********************************/

    var users = [
        {
            name: "Normal User", email: "normal@example.com", password: "123456", roles: ['user'],
            photo: "/test/photo1.jpg"
        },

        {
            name: "Editor", email: "editor@microduino.cc", password: "123456", roles: ['editor'],
            photo: "/test/photo2.jpg"
        },
        {
            name: "Project Approval", email: "pm@microduino.cc", password: "123456", roles: ['project-approval'],
            photo: "/test/photo1.jpg"
        },
        {
            name: "Customer Care", email: "cc@microduino.cc", password: "123456", roles: ['customer-care'],
            photo: "/test/photo1.jpg"
        },
        {
            name: "Admin User", email: "admin@microduino.cc", password: "12345678", roles: ['admin'],
            photo: "/test/photo1.jpg"
        },
        {
            name: "Iasc Chen", email: "iasc@163.com", password: "123456", roles: ['admin', 'editor'],
            photo: "/test/photo1.jpg"
        }
    ];

    _.each(users, function (user) {
        var id;

        id = Accounts.createUser({
            email: user.email,
            password: user.password,
            profile: {name: user.name, photo: user.photo}
        });

        if (user.roles.length > 0) {
            // Need _id of existing user record so this call must come
            // after `Accounts.createUser` or `Accounts.onCreate`
            Roles.addUsersToRoles(id, user.roles);
        }

    });

    /********************************
     * Default Modules
     ********************************/

    var sysAdmin = Meteor.users.findOne({"emails.address": "admin@microduino.cc"});
    var iasc = Meteor.users.findOne({"emails.address": "iasc@163.com"});

    var modules = [
        {name: 'Microduino-Core', desc: 'Core'},
        {name: 'Microduino-Core+', desc: 'Core+'},
        {name: 'Microduino-USBTTL', desc: 'Program download'},
        {name: 'Microduino-WiFi', desc: 'WiFi module'},
        {name: 'Microduino-OLED', desc: 'Info. Display'},
        {name: 'Microduino-Weather', desc: 'Sensor extension board'}
    ];

    _.each(modules, function (module) {
        var entity = _.extend(module, {
            author_user_id: sysAdmin._id, create_time: now, last_update_time: now, status: STATUS_NORMAL
        });
        Collections.Modules.insert(entity);
    });

    /********************************
     * Default Projects
     ********************************/

    var projects = [
        {
            name: 'Weather Station', desc: 'Acquiring the weather information.',
            module_ids: [
                Collections.Modules.findOne({name: 'Microduino-Core+'})._id,
                Collections.Modules.findOne({name: 'Microduino-USBTTL'})._id,
                Collections.Modules.findOne({name: 'Microduino-WiFi'})._id,
                Collections.Modules.findOne({name: 'Microduino-OLED'})._id,
                Collections.Modules.findOne({name: 'Microduino-Weather'})._id,
            ],
            data_points: [
                {data_name: "Temperature", data_type: "TEM"},
                {data_name: "Humidity", data_type: "HUM"},
                {data_name: "Lightness", data_type: "LUX"},
                {data_name: "Air Pressure", data_type: "APR"},
                {data_name: "PM 10", data_type: "P10"},
                {data_name: "Air Pollution", data_type: "APL"},

                {data_name: "Location", data_type: "GPS"}
            ],
            control_points: [
                {control_name: "Status", control_type: "LED"}
            ]
        },
        {
            name: 'Smart City', desc: 'Smart City Simulation.', show_chart: "MY_CITY",
            module_ids: [
                Collections.Modules.findOne({name: 'Microduino-Core+'})._id,
            ],
            data_points: [
                {data_name: "Cell", data_type: "JSN", data_show_list: true},
            ],
            control_points: [
                {control_name: "Scan", control_type: "BTN"},
                {control_name: "Reset", control_type: "BTN"}
            ]
        },
        {
            name: '3D Garden', desc: 'Smart 3D Garden.',
            // show_chart: "MY_CITY",
            module_ids: [
                Collections.Modules.findOne({name: 'Microduino-Core+'})._id,
            ],
            data_points: [
                {data_name: "Temperature P1", data_type: "TEM"},
                {data_name: "Humidity P1", data_type: "HUM"},
                {data_name: "Lightness P1", data_type: "LUX"},

                {data_name: "Temperature P2", data_type: "TEM"},
                {data_name: "Humidity P2", data_type: "HUM"},
                {data_name: "Lightness P2", data_type: "LUX"},

                {data_name: "Temperature P3", data_type: "TEM"},
                {data_name: "Humidity P3", data_type: "HUM"},
                {data_name: "Lightness P3", data_type: "LUX"},

                {data_name: "Temperature P4", data_type: "TEM"},
                {data_name: "Humidity P4", data_type: "HUM"},
                {data_name: "Lightness P4", data_type: "LUX"},
            ],
            control_points: [
                {control_name: "Water", control_type: "SWT"},
                {control_name: "Light", control_type: "LED"}
            ]
        },
        {
            name: 'THU Sensors', desc: 'Sensor of IOT',
            // show_chart: "MY_CITY",
            module_ids: [
                Collections.Modules.findOne({name: 'Microduino-Core+'})._id,
            ],
            data_points: [
                {data_name: "Temperature", data_type: "TEM"},
                {data_name: "Humidity", data_type: "HUM"},
                {data_name: "Lightness", data_type: "LUX"},
                {data_name: "PIR", data_type: "PIR"},
            ]
        },
        {
            name: 'THU Monitor', desc: 'Monitor of IOT',
            // show_chart: "MY_CITY",
            module_ids: [
                Collections.Modules.findOne({name: 'Microduino-Core+'})._id,
            ],
            control_points: [
                {control_name: "Message", control_type: "TXT"},
                {control_name: "Buzz", control_type: "BUZ"},
                {control_name: "Light", control_type: "LED"},
            ]
        },
        {
            name: 'Smart Flower Pot', desc: 'Smart Flower Pot with ',
            // show_chart: "MY_CITY",
            module_ids: [
                Collections.Modules.findOne({name: 'Microduino-Core+'})._id,
            ],
            data_points: [
                {data_name: "Temperature", data_type: "TEM"},
                {data_name: "Humidity", data_type: "HUM"},
                {data_name: "Soil Humidity", data_type: "HUM"},
                {data_name: "Lightness", data_type: "LUX"},
            ],
            control_points: [
                {
                    control_name: "Water On",
                    control_type: "TXT",
                    control_desc: "Begin water when earth humidity less than this threshold"
                },
                {
                    control_name: "Water Off",
                    control_type: "TXT",
                    control_desc: "Stop water when earth humidity great than this threshold"
                },
                {control_name: "Light", control_type: "TXT", control_desc: "Adjust light with this lux threshold"},
            ]
        },
        {
            name: 'Time-lapse Camera', desc: 'Time-lapse Camera.',
            module_ids: [
                Collections.Modules.findOne({name: 'Microduino-Core+'})._id,
            ],
            data_points: [
                {data_name: "Picture", data_type: "IMG", show_list: true},
            ],
            control_points: [
                {control_name: "Shutter", control_type: "BTN"},
            ]
        },
        {
            name: 'Noise Detector', desc: 'Noise Detector in School',
            module_ids: [
                Collections.Modules.findOne({name: 'Microduino-Core+'})._id,
            ],
            data_points: [
                {data_name: "Max", data_type: "NOI"},
                {data_name: "Min", data_type: "NOI"},
                {data_name: "Average", data_type: "NOI"},
                {data_name: "Best Acceleration", data_desc: "Accelerate from 1 to 100km", data_type: "TIM"},
            ],
            control_points: [
                {control_name: "OnOff", control_type: "SWT", control_desc: "Switch of device"},
            ]
        },
        {
            name: 'mRace', desc: 'mRace',
            module_ids: [
                Collections.Modules.findOne({name: 'Microduino-Core+'})._id,
            ],
            data_points: [
                {data_name: "Max Speed", data_type: "SPD"},
                {data_name: "Running Time", data_type: "TIM"},
                {data_name: "Best Single lap", data_type: "TIM"},
                {data_name: "Best Acceleration", data_desc: "Accelerate from 1 to 100km", data_type: "TIM"},
            ]
        },
        {
            name: 'Vulture Egg', desc: 'Smart vulture egg',
            module_ids: [
                Collections.Modules.findOne({name: 'Microduino-Core+'})._id,
            ],
            data_points: [
                {data_name: "Temperature 01", data_type: "TEM", data_desc: "Egg Info"},
                {data_name: "Temperature 02", data_type: "TEM", data_desc: "Egg Info"},
                {data_name: "Temperature 03", data_type: "TEM", data_desc: "Egg Info"},
                {data_name: "Temperature 04", data_type: "TEM", data_desc: "Egg Info"},
                {data_name: "Temperature 05", data_type: "TEM", data_desc: "Egg Info"},
                {data_name: "Temperature 06", data_type: "TEM", data_desc: "Egg Info"},
                {data_name: "Temperature 07", data_type: "TEM", data_desc: "Egg Info"},
                {data_name: "Temperature 08", data_type: "TEM", data_desc: "Egg Info"},
                {data_name: "Temperature 09", data_type: "TEM", data_desc: "Egg Info"},
                {data_name: "Temperature 10", data_type: "TEM", data_desc: "Egg Info"},
                {data_name: "Temperature 11", data_type: "TEM", data_desc: "Egg Info"},
                {data_name: "Temperature 12", data_type: "TEM", data_desc: "Egg Info"},
                {data_name: "Temperature 13", data_type: "TEM", data_desc: "Egg Info"},
                {data_name: "Temperature 14", data_type: "TEM", data_desc: "Egg Info"},
                {data_name: "Temperature 15", data_type: "TEM", data_desc: "Egg Info"},
                {data_name: "Temperature 16", data_type: "TEM", data_desc: "Egg Info"},

                {data_name: "Humidity", data_type: "HUM", data_desc: "Egg Info"},

                {data_name: "Quaternion 1", data_type: "DOF", data_desc: "Egg Info"},
                {data_name: "Quaternion 2", data_type: "DOF", data_desc: "Egg Info"},
                {data_name: "Quaternion 3", data_type: "DOF", data_desc: "Egg Info"},
                {data_name: "Quaternion 4", data_type: "DOF", data_desc: "Egg Info"}
            ],
            control_points: [
                {control_name: "HumInterval", control_type: "TXT", control_desc: "Data collecting interval of humidity"},
                {control_name: "TemInterval", control_type: "TXT", control_desc: "Data collecting interval of temperature"},
                {control_name: "QuaInterval", control_type: "TXT", control_desc: "Data collecting interval of mpu6050"},
            ]
        },
        {
            name: 'Vulture Egg Station', desc: 'Smart vulture egg Station',
            module_ids: [
                Collections.Modules.findOne({name: 'Microduino-Core+'})._id,
            ],
            data_points: [
                {data_name: "Env Temperature", data_type: "TEM", data_desc: "Environment Info"},
                {data_name: "Env Humidity", data_type: "HUM", data_desc: "Environment Info"},
                {data_name: "Env Lightness", data_type: "LUX", data_desc: "Environment Info"},
                {data_name: "Env Air Pressure", data_type: "APR", data_desc: "Environment Info"},
                {data_name: "PM 10", data_type: "P10", data_desc: "Environment Info"},
                {data_name: "Air Pollution", data_type: "APL", data_desc: "Environment Info"},

                {data_name: "Location", data_type: "GPS"}
            ]
        }
    ];

    var dps = [], cps = [];
    for (var key in DATA_POINT_TYPES) {
        dps.push({data_name: DATA_POINTS[DATA_POINT_TYPES[key]].label, data_type: DATA_POINT_TYPES[key]});
    }
    for (var key in CONTROL_POINT_TYPES) {
        cps.push({
            control_name: CONTROL_POINTS[CONTROL_POINT_TYPES[key]].label,
            control_type: CONTROL_POINT_TYPES[key]
        });
    }
    var test_project = {
        name: '0_Tester', desc: 'Test all data points and control points.',
        module_ids: [
            Collections.Modules.findOne({name: 'Microduino-Core+'})._id,
        ],
        data_points: dps,
        control_points: cps,
        author_user_id: iasc._id, create_time: now, last_update_time: now, status: STATUS_NORMAL
    };
    Collections.Projects.insert(test_project);

    _.each(projects, function (project) {
        entity = _.extend(project, {
            author_user_id: iasc._id, create_time: now, last_update_time: now, status: STATUS_NORMAL
        });
        Collections.Projects.insert(entity);
    });

    /********************************
     * Default Devices
     ********************************/

    var _project_id = Collections.Projects.findOne({name: "Weather Station"})._id;

    var _device_id = Collections.Devices.insert({
        owner_user_id: iasc._id, name: 'My Weather Station', project_id: _project_id,
        create_time: now, last_update_time: now, status: STATUS_NORMAL
    });

//MyModules.insert({
//    owner_user_id: sysAdmin._id, name: 'My Microduino-Core+',
//    module_id: _module_id_1, create_time: now, last_update_time: now,
//});
//
//MyModules.insert({
//    owner_user_id: sysAdmin._id, name: 'My Microduino-USBTTL',
//    module_id: _module_id_2, create_time: now, last_update_time: now,
//});
//
//MyModules.insert({
//    owner_user_id: jerry._id, name: 'My Microduino-WiFi',
//    module_id: _module_id_3, create_time: now, last_update_time: now,
//});
//
//MyModules.insert({
//    owner_user_id: sysAdmin._id, name: 'My Microduino-OLED',
//    module_id: _module_id_4, create_time: now, last_update_time: now,
//});

    Collections.DataEvents.insert({
        data_name: "tem", data_type: "TEM", data_value: "30.1", data_unit: "C",
        data_submit_time: 12112321323, device_id: _device_id, owner_user_id: iasc._id,
    });

    Collections.DataEvents.insert({
        data_name: "hum", data_type: "HUM", data_value: "25", data_unit: "%",
        data_submit_time: 12112321323, device_id: _device_id, owner_user_id: iasc._id,
    });

    Collections.DataEvents.insert({
        data_name: "lux", data_type: "LUX", data_value: "100", data_unit: "Lus",
        data_submit_time: 12112321323, device_id: _device_id, owner_user_id: iasc._id,
    });

    Collections.ControlEvents.insert({
        control_name: "status", control_type: "LED", control_value: "1",
        control_submit_time: 12112321323, device_id: _device_id, owner_user_id: iasc._id,
    });
}