/**
 * Created by chenhao on 15/10/30.
 */
// dataVisual My City

var EVENTS_DATA = "events_data";

Template.dataVisualEgg.created = function () {
    Session.setDefault("slider", [40, 42]);
    Session.setDefault("colormap", "rainbow");
    Session.setDefault("isInside", true);

    delete Session.keys["hide_sensor"];
    Session.setDefault("hide_sensor", -1);
    Session.setDefault("mouse_on_sensor", -1);
};

Template.dataVisualEgg.helpers({
    data_events: function () {
        var device_id = this._id;

        var project = Collections.Projects.findOne({_id: this.project_id});
        var data_points = project.data_points;

        //data_points = _.sortBy(data_points, function (point) {
        //    return point.data_name;
        //});

        var result = new Mongo.Collection(null);
        _.forEach(data_points, function (point) {
            var event = Collections.DataEvents.findOne({device_id: device_id, data_name: point.data_name},
                {sort: {data_submit_time: -1}});
            if (event) {
                result.insert(event);
            }
        });

        var results = result.find();
        Session.set(EVENTS_DATA, results.fetch());

        var events = results.fetch();
        if (events.length > 0) {
            var retjson = {};
            _.forEach(events, function (e) {
                retjson[e.data_name] = e.data_value;
            });

            // Test data
            // retjson = {"Temperature 01":"21.3750","Temperature 02":"21.2500","Temperature 03":"21.1250","Temperature 04":"21.2500",
            //    "Temperature 05":"21.1250","Temperature 06":"21.2500","Temperature 07":"21.5000","Temperature 08":"21.6250",
            //    "Quaternion 1":"0.30","Quaternion 2":"0.92","Quaternion 3":"-0.10","Quaternion 4":"0.23"};
            Session.set(VISUAL_JSON_DATA, retjson);
        }

        return results;
    },
    json_data: function () {
        var ret = Session.get(VISUAL_JSON_DATA);
        return JSON.stringify(ret);
    },
    slider: function () {
        return Session.get("slider");
    }
});

Template.dataVisualEgg.events({
    'change .isRotate': function (e) {
        Session.set('isRotate', e.target.checked);
    },

    'change .isInside': function (e) {
        Session.set("isInside", e.target.checked);
    },

    'click .colormap': function (e) {
        Session.set("colormap", e.target.innerHTML.toLowerCase());
    },

    'mouseenter .mouse-on': function (e) {
        var name = e.target.id;
        if (name.startsWith("Temperature ")) {
            var index = parseInt(name.substr(12)) - 1;

            //console.log("mouse-enter", index);
            Session.set("mouse_on_sensor", index);
        }
    },

    'mouseleave .mouse-on': function (e) {
        var name = e.target.id;
        if (name.startsWith("Temperature ")) {
            var index = parseInt(name.substr(12)) - 1;

            //console.log("mouse-leave", index);
            Session.set("hide_sensor", index);
            Session.set("mouse_on_sensor", -1);
        }
    }
});

Template.dataVisualEgg.rendered = function () {
    this.$("#slider").noUiSlider({
        start: Session.get("slider"),
        connect: true,
        range: {
            'min': 20,
            'max': 50
        }
    }).on('slide', function (ev, val) {
        // set real values on 'slide' event
        var left = val[0];
        var right = val[1];

        Session.set('slider', [left, Math.max(right, left + 1)]);
    }).on('change', function (ev, val) {
        // round off values on 'change' event

        var left = Math.round(val[0]);
        var right = Math.round(val[1]);
        Session.set('slider', [left, Math.max(right, left + 1)]);
    });

    var graph = Session.get(VISUAL_JSON_DATA);
    // console.log("json_data", graph);
    if (!graph) {
        return;
    }

    var height = window.innerHeight;
    $("#visual").height(height);

    // ******************
    // Setting, these variable defined in vultureegg.js

    var colorMap = 'rainbow';
    var numberOfColors = 512;

    var backcolor = 0xd9d9d9;

    RENDER_EGG = "Egg";
    RENDER_LIGHT = "Light";
    var render_type = RENDER_LIGHT;
    var face_inverse = true;

    var isInside = true;

    HEIGHT_LAYOUT = "Height";
    var sensors_layout = HEIGHT_LAYOUT;

    // Calc this object center from obj file
    OBJ_CENTER = {'y': 0, 'x': 0, 'z': 0};

    // Please don't modify these number, they are related with egg.obj
    //MIN_Y = -0.845625;
    //MAX_Y = 1.479844;
    MIN_Y = -0.85;
    MAX_Y = 1.45;
    HEIGHT_Y = MAX_Y - MIN_Y;

    // ******************
    // Lut
    THREE.Lut = function (colormap, numberofcolors) {

        this.lut = new Array();
        this.map = THREE.ColorMapKeywords[colormap];
        this.n = numberofcolors;
        this.mapname = colormap;

        var step = 1.0 / this.n;

        for (var i = 0; i <= 1; i += step) {

            for (var j = 0; j < this.map.length - 1; j++) {

                if (i >= this.map[j][0] && i < this.map[j + 1][0]) {
                    var min = this.map[j][0];
                    var max = this.map[j + 1][0];

                    var color = new THREE.Color(0xffffff);
                    var minColor = new THREE.Color(0xffffff).setHex(this.map[j][1]);
                    var maxColor = new THREE.Color(0xffffff).setHex(this.map[j + 1][1]);

                    color = minColor.lerp(maxColor, ( i - min ) / ( max - min ));

                    this.lut.push(color);
                }
            }
        }

        return this.set(this);
    };

    THREE.Lut.prototype = {

        constructor: THREE.Lut,

        lut: [], map: [], mapname: 'rainbow', n: 256, minV: 0, maxV: 1, legend: null,

        set: function (value) {

            if (value instanceof THREE.Lut) {
                this.copy(value);
            }

            return this;
        },

        setMin: function (min) {
            this.minV = min;
            return this;
        },

        setMax: function (max) {
            this.maxV = max;
            return this;
        },

        changeNumberOfColors: function (numberofcolors) {
            this.n = numberofcolors;
            return new THREE.Lut(this.mapname, this.n);
        },

        changeColorMap: function (colormap) {
            if (this.mapname != colormap) {
                this.mapname = colormap;
                return new THREE.Lut(this.mapname, this.n);
            }
            else {
                return this;
            }
        },

        copy: function (lut) {
            this.lut = lut.lut;
            this.mapname = lut.mapname;
            this.map = lut.map;
            this.n = lut.n;
            this.minV = lut.minV;
            this.maxV = lut.maxV;

            return this;
        },

        getColor: function (alpha) {
            if (alpha <= this.minV) {
                alpha = this.minV;
            } else if (alpha >= this.maxV) {
                alpha = this.maxV;
            }

            alpha = ( alpha - this.minV ) / ( this.maxV - this.minV );

            var colorPosition = Math.round(alpha * this.n);
            colorPosition == this.n ? colorPosition -= 1 : colorPosition;

            return this.lut[colorPosition];
        }
    };

    THREE.ColorMapKeywords = {

        "rainbow": [
            [0.0, '0x0000FF'], [0.2, '0x00FFFF'], [0.5, '0x00FF00'], [0.8, '0xFFFF00'], [1.0, '0xFF0000']
        ],
        "cooltowarm": [
            [0.0, '0x3C4EC2'], [0.2, '0x9BBCFF'], [0.5, '0xDCDCDC'], [0.8, '0xF6A385'], [1.0, '0xB40426']
        ],
        "blackbody": [
            [0.0, '0x000000'], [0.2, '0x780000'], [0.5, '0xE63200'], [0.8, '0xFFFF00'], [1.0, '0xFFFFFF']
        ],
        "grayscale": [
            [0.0, '0x000000'], [0.2, '0x404040'], [0.5, '0x7F7F80'], [0.8, '0xBFBFBF'], [1.0, '0xFFFFFF']
        ]

    };

    // ******************
    // Draw variables

    // WebGL
    // if (!Detector.webgl) Detector.addGetWebGLMessage({parent: document.getElementById("info")});

    var radius = 5;
    var camera_distance = 4.5;

    var mouse_on_sensor = -1;

    var div_width = $("#visual").width(), div_height = $("#visual").height();

    var container;
    var camera, controls, scene, renderer;

    var loaded = false;

    var angle = 0;

    ///////////////////////

    FACE_INDICES = ['a', 'b', 'c', 'd'];

    var m_object = null;
    var m_mesh = null;

    var current_temperatures = null;
    var current_position = null;

    var lights = [];
    var env_lights = [];
    var light_points = [];

    var get_sensors_position = function (radius, height, count, offset) {
        var ret = [];
        var point;

        for (let i = 0; i < count; i++) {
            point = {
                'x': 0.0 + radius * Math.cos(Math.PI * (2 * i + offset) / count),
                'y': height,
                'z': 0.0 + radius * Math.sin(Math.PI * (2 * i + offset) / count)
            };
            ret.push(point);
        }

        return ret;
    };

    let get_height_lights_location = function (radius) {
        let delta = radius - MAX_Y;
        var height = HEIGHT_Y + 2 * delta;

        var r_adjust_1 = radius - 0.2 * height,
            r_adjust_2 = radius - 0.4 * height,
            r_adjust_3 = radius - 0.6 * height,
            r_adjust_4 = radius - 0.85 * height;

        var r_adjust_1_r = radius * 0.41,
            r_adjust_2_r = radius * 0.53,
            r_adjust_3_r = radius * 0.57,
            r_adjust_4_r = radius * 0.45;

        var eachRow = 4;
        var lights_location = [];

        lights_location = _.union(lights_location, get_sensors_position(r_adjust_1_r, r_adjust_1, eachRow, 0));
        lights_location = _.union(lights_location, get_sensors_position(r_adjust_2_r, r_adjust_2, eachRow, 1));
        lights_location = _.union(lights_location, get_sensors_position(r_adjust_3_r, r_adjust_3, eachRow, 0));
        lights_location = _.union(lights_location, get_sensors_position(r_adjust_4_r, r_adjust_4, eachRow, 1));

        return lights_location;
    };

    var get_lights_location = function (radius, sensors_layout) {
        if (sensors_layout == HEIGHT_LAYOUT) {
            return get_height_lights_location(radius);
        }
    };

    var LIGHT_POINTS_LOC = get_lights_location(1.48, sensors_layout);

    var loadModel = function (scene, render_type, face_inverse, sensors_layout, light_radius, light_intensity, light_type) {

        THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

        THREE.Texture.minFilter = THREE.LinearFilter;

        var texloader = new THREE.TextureLoader();
        texloader.load("/smartegg/texture.png", function (texture) {

            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.load('/smartegg/egg.mtl', function (materials) {
                materials.preload();
                materials.side = THREE.DoubleSide;
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load('/smartegg/egg.obj', function (object) {

                    // set the axis shapes
                    var axis_arrow = new THREE.AxisHelper();
                    axis_arrow.position.set(0, 0, 0);
                    axis_arrow.scale.x = axis_arrow.scale.y = axis_arrow.scale.z = 1.7;
                    object.add(axis_arrow);

                    if (render_type == RENDER_LIGHT) {
                        var lights_location = get_lights_location(light_radius, sensors_layout);
                        addBlackLights(object, lights_location, light_intensity, light_type, face_inverse);
                    }

                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            var geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
                            child.geometry = geometry;

                            if (render_type == RENDER_LIGHT) {
                                changeFaceOrientation(child.geometry);
                            }
                            else {
                                child.material.map = texture;
                                child.material.map.needsUpdate = true;

                                child.geometry.computeFaceNormals();
                                child.geometry.computeVertexNormals();
                            }

                            m_mesh = child;
                        }
                    });

                    addLightPoints(object, LIGHT_POINTS_LOC);

                    object.position.x = -OBJ_CENTER.x;
                    object.position.y = -OBJ_CENTER.y;
                    object.position.z = -OBJ_CENTER.z;

                    object.reflectivity = 0;
                    object.refractionRatio = 0;

                    m_object = object;
                    scene.add(object);

                    update_temperature(current_temperatures, render_type);
                });
            });
        });
    };

    var BLACK = new THREE.Color(0x000000);
    var EGG_COLOR = new THREE.Color(0xffddaa);
    var AMBIENT_COLOR = new THREE.Color(0xf0f0f0);

    var addEnvironmentBlackLights = function (scene) {

        var color = BLACK;

        var ambient = new THREE.AmbientLight(color);
        env_lights[0] = ambient;
        scene.add(ambient);

        var light = new THREE.PointLight(color, 0.2);
        light.position.set(100, 100, 100);
        env_lights[1] = light;
        scene.add(light);

        light = new THREE.HemisphereLight(color, color, 0.2);
        light.position.set(-100, -100, -100);
        env_lights[2] = light;
        scene.add(light);
    };

    var addBlackLights = function (obj, lights_location, intensity, type, face_inverse) {

        var _light, _loc, _color;

        _color = BLACK;
        for (var i = 0; i < lights_location.length; i++) {

            _loc = lights_location[i];

            if (type == 'directional')
                _light = new THREE.DirectionalLight(_color, intensity);
            else
                _light = new THREE.PointLight(_color, intensity);

            if (face_inverse)
                _light.position.set(-_loc.x, _loc.y, -_loc.z);
            else
                _light.position.set(_loc.x, _loc.y, _loc.z);

            lights[i] = _light;

            obj.add(_light);
        }
    };

    var LIGHT_POINTS_MAT_RED = new THREE.MeshPhongMaterial({color: 0xff0000, side: THREE.DoubleSide});
    var LIGHT_POINTS_MAT_WHITE = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});
    var LIGHT_POINTS_GEO = new THREE.SphereGeometry(0.05);

    var addLightPoints = function (obj, lights_location) {

        var _mesh, _loc;

        for (var i = 0; i < lights_location.length; i++) {

            _loc = lights_location[i];

            _mesh = new THREE.Mesh(LIGHT_POINTS_GEO, LIGHT_POINTS_MAT_WHITE);

            if (face_inverse)
                _mesh.position.set(-_loc.x, _loc.y, -_loc.z);
            else
                _mesh.position.set(_loc.x, _loc.y, _loc.z);

            _mesh.visible = false;

            light_points[i] = _mesh;
            obj.add(_mesh);
        }
    };

    var update_temperature = function (temperature_values, render_type) {
        var _color, _sensor_name, _sensor_value;
        if ((m_mesh != null) && (temperature_values != null)) {

            env_lights[0].color = BLACK;
            env_lights[1].color = BLACK;
            env_lights[2].color = BLACK;

            if (render_type == RENDER_LIGHT) {
                var _light;

                for (var j = 0; j < lights.length; j++) {
                    _light = lights[j];

                    _sensor_name = "Temperature " + String("00" + (j + 1)).slice(-2);

                    try {
                        _sensor_value = temperature_values[_sensor_name];
                        _color = lut.getColor(_sensor_value);

                        _light.color = _color;
                    } catch (error) {
                        // ignore
                    }
                }
            }
            else {
                //if (render_type == RENDER_EGG)
                env_lights[0].color = AMBIENT_COLOR;
                env_lights[1].color = EGG_COLOR;
                env_lights[2].color = EGG_COLOR;
            }
        }
    };

    var AXIS_Z = new THREE.Vector3(0, 0, 0);
    var AXIS_X = new THREE.Vector3(1, 0, 0);
    var Q_INIT = new THREE.Quaternion();
    Q_INIT.setFromAxisAngle(AXIS_X, Math.PI);

    var MPU6050_RAW2G = 16384.0;

    var update_position = function (obj, position_values) {
        // console.log("in update_position");

        var q = [];

        q[0] = position_values["Quaternion 1"]; // w
        q[1] = position_values["Quaternion 2"]; // x
        q[2] = position_values["Quaternion 3"]; // y
        q[3] = position_values["Quaternion 4"]; // z
        //console.log("Quaternion: %j", q);

        // console.log("euler: %j", euler);
        obj.lookAt(AXIS_Z);
        obj.quaternion.multiply(Q_INIT);

        var quaternion = new THREE.Quaternion(q[1], -q[3], q[2], q[0]);
        obj.quaternion.multiply(quaternion);
    };

    var ZERO = {x: 0, y: 0, z: 0};
    var DELTA = Math.PI / 180;

    var rotate_camera_with_yAxis = function (camera, radius, angle, target) {
        camera.position.x = radius * Math.cos(angle);
        camera.position.z = radius * Math.sin(angle);

        camera.lookAt(target);
    };

// Utils

    var calc_angle = function (vex) {
        var _x = vex.x - OBJ_CENTER.x;
        var _y = vex.y - OBJ_CENTER.y;
        var _z = vex.z - OBJ_CENTER.z;

        var _r_xz = Math.sqrt(_x * _x + _z * _z);

        var _theta_1 = Math.atan2(_r_xz, _y) / Math.PI;
        var _theta_2 = Math.atan2(_z, _x) / Math.PI;

        return {"theta_1": _theta_1, "theta_2": _theta_2};
    };

    var changeFaceOrientation = function (geometry) {

        //console.log(geometry);

        for (var i = 0; i < geometry.faces.length; i++) {
            var face = geometry.faces[i];
            if (face instanceof THREE.Face3) {
                var tmp = face.b;
                face.b = face.c;
                face.c = tmp;

            } else if (face instanceof THREE.Face4) {
                var tmp = face.b;
                face.b = face.d;
                face.d = tmp;
            }
        }
    };

    var init = function () {
        $("#animation_check").removeAttr("checked");
        $("#render_check").removeAttr("checked");

        // container

        container = document.createElement('div');
        document.getElementById("visual").appendChild(container);

        // scene

        scene = new THREE.Scene();

        // colormap

        // colorMap = Session.get("colormap");
        lut = new THREE.Lut(colorMap, numberOfColors);

        var color_temperature_range = Session.get("slider");
        lut.setMax(color_temperature_range[1]);
        lut.setMin(color_temperature_range[0]);

        // model
        // isInside = Session.get("isInside");
        loadModel(scene, render_type, face_inverse, sensors_layout,
            radius, 0.6, 'point');

        addEnvironmentBlackLights(scene);

        // renderer

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(div_width, div_height);
        renderer.setClearColor(backcolor, 1);
        container.appendChild(renderer.domElement);

        // camera

        camera = new THREE.PerspectiveCamera(40, div_width / div_height, 1, 100);
        camera.position.x = camera_distance;

        // controls

        controls = new THREE.TrackballControls(camera, container);

        window.addEventListener('resize', onWindowResize, false);
        controls.addEventListener('change', render);

        loaded = true;
    };

    var reinit = function () {
        scene.remove(m_object);

        loadModel(scene, render_type, face_inverse, sensors_layout,
            radius, 0.6, 'point');

        // camera.position.x = camera_distance;
        // angle = 0;

        loaded = true;
    };

    var onWindowResize = function () {
        var width = window.innerWidth, height = window.innerHeight;
        $("#visual").height(height);

        div_width = $("#visual").width(), div_height = $("#visual").height();

        camera.aspect = div_width / div_height;
        camera.updateProjectionMatrix();

        renderer.setSize(div_width, div_height);

        render();
    };

    var render = function () {
        renderer.render(scene, camera);
    };

    var animate = function () {
        if (loaded) {
            controls.update();

            var colormap = Session.get("colormap");
            lut = lut.changeColorMap(colormap);

            // update colormap
            var color_temperature_range = Session.get("slider");
            lut.setMax(color_temperature_range[1]);
            lut.setMin(color_temperature_range[0]);

            // update show outside shell or internal heat map
            var _inside = Session.get("isInside");
            if (_inside != isInside) {
                isInside = _inside;
                if (_inside) {
                    face_inverse = true;
                    render_type = RENDER_LIGHT;
                }
                else {
                    face_inverse = false;
                    render_type = RENDER_EGG;
                }
                reinit();
            }

            graph = Session.get(VISUAL_JSON_DATA);

            if ((m_object != null) && (graph != null)) {
                // console.log("in animating");
                update_temperature(graph, render_type);

                update_position(m_object, graph);

                var isRotate = Session.get("isRotate");
                if (isRotate) {
                    angle += DELTA;
                    rotate_camera_with_yAxis(camera, camera_distance, angle, ZERO);
                }
            }

            var hide_sensor = Session.get("hide_sensor");
            //console.log("hide_sensor", hide_sensor);
            if (hide_sensor != -1) {
                light_points[hide_sensor].visible = false;

                Session.set("hide_sensor", -1);
                Session.set("mouse_on_sensor", -1);
            }

            mouse_on_sensor = Session.get("mouse_on_sensor");
            //console.log("mouse_on_sensor", mouse_on_sensor);
            if (mouse_on_sensor != -1) {
                try {
                    light_points[mouse_on_sensor].visible = !light_points[mouse_on_sensor].visible;
                } catch (e) {
                    // ignore
                }
            }

            render();
        }
        requestAnimationFrame(animate);
    };

    // Data
    init();
    animate();
};