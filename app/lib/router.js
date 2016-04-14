/**
 * Created by chenhao on 15/4/7.
 */
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    after: function () {
        Session.set('hash', this.params.hash);
    },
});

var requireLogin = function () {
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
};

Router.route('/', {name: 'home', fastRender: true});

Router.route('/admin', {
    template: 'accountsAdmin',
    onBeforeAction: function () {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else if (!Roles.userIsInRole(Meteor.user(), ['admin'])) {
            console.log('redirecting');
            this.redirect('/');
        } else {
            this.next();
        }
    }
});

Router.route('/imagestore', {
    name: 'imageStore',
    waitOn: function () {
        return Meteor.subscribe('images');
    },
});

Router.onBeforeAction(requireLogin, {only: 'imageStore'});

// User Profile

Router.route('/profile', {
    name: 'profile',
    waitOn: function () {
        return Meteor.subscribe('images');
    }
});

// Module

Router.route('/modules', {name: 'modulesList'});

Router.route('/modules/submit', {
    name: 'moduleSubmit',
    waitOn: function () {
        return Meteor.subscribe('images');
    },
});

Router.route('/modules/:_id/edit', {
    name: 'moduleEdit',
    waitOn: function () {
        return Meteor.subscribe('images');
    },
    data: function () {
        return Collections.Modules.findOne(this.params._id);
    }
});

Router.route('/modules/:_id', {
    name: 'moduleDetail',
    data: function () {
        return Collections.Modules.findOne(this.params._id);
    }
});

Router.onBeforeAction(requireLogin, {only: 'moduleSubmit'});
Router.onBeforeAction(requireLogin, {only: 'moduleEdit'});

// Project

Router.route('/projects', {
    name: 'projectsList',
    waitOn: function () {
        return Meteor.subscribe('projects');
    },
    fastRender: true
});

Router.route('/projects/submit', {
    name: 'projectSubmit',
});

Router.route('/projects/:_id/edit', {
    name: 'projectEdit',
    waitOn: function () {
        return Meteor.subscribe('project', this.params._id);
    },
    data: function () {
        return Collections.Projects.findOne(this.params._id);
    }
});

Router.route('/projects/:_id/dp_edit', {
    name: 'dataPointEdit',
    waitOn: function () {
        return Meteor.subscribe('project', this.params._id);
    },
    data: function () {
        return Collections.Projects.findOne(this.params._id);
    }
});

Router.route('/projects/:_id/cp_edit', {
    name: 'controlPointEdit',
    waitOn: function () {
        return Meteor.subscribe('project', this.params._id);
    },
    data: function () {
        return Collections.Projects.findOne(this.params._id);
    }
});

Router.route('/projects/:_id/md_select', {
    name: 'projectModulesSelect',
    waitOn: function () {
        return Meteor.subscribe('project', this.params._id);
    },
    data: function () {
        return Collections.Projects.findOne(this.params._id);
    }
});

Router.route('/projects/:_id/img_select', {
    name: 'projectImagesSelect',
    waitOn: function () {
        return Meteor.subscribe('project', this.params._id);
    },
    data: function () {
        return Collections.Projects.findOne(this.params._id);
    }
});

Router.route('/projects/:_id', {
    name: 'projectDetail',
    waitOn: function () {
        return [Meteor.subscribe('project', this.params._id),
            Meteor.subscribe('projectDevices', this.params._id, RECOMMENDED_ITEMS)
        ];
    },
    data: function () {
        return Collections.Projects.findOne(this.params._id);
    },
    fastRender: true
});

Router.route('/projects/:_id/pdmap', {
    name: 'projectDeviceMapMarkers',
    waitOn: function () {
        return [Meteor.subscribe('project', this.params._id),
            Meteor.subscribe('projectDevices', this.params._id, RECOMMENDED_ITEMS)
        ];
    },
    data: function () {
        var devices = Collections.Devices.find({
            project_id: this.params._id,
            share: SHARE_PUBLIC,
            $or: [{status: STATUS_NORMAL}, {status: STATUS_READONLY}]
        }, {fields: {_id: true, name: true}});

        return devices;
    },
    fastRender: true
});

Router.onBeforeAction(requireLogin, {only: 'projectSubmit'});
Router.onBeforeAction(requireLogin, {only: 'projectEdit'});

// My Project

Router.route('/devices', {
    name: 'devicesList',
    waitOn: function () {
        return [Meteor.subscribe('devices', DEVICE_PAGINATION, {name: 1}),
            Meteor.subscribe('devicesPublic', RECOMMENDED_ITEMS)
        ];
    },
    fastRender: true
});

//Router.route('/pdmap', {
//    name: 'allPublicDeviceMapMarkers',
//    waitOn: function () {
//        return [Meteor.subscribe('allGpsPublicDevices'),
//            Meteor.subscribe('dataeventsWithGPS')];
//    },
//    fastRender: true
//});

Router.route('/publicdevices', {
    name: 'devicesListPublic',
    waitOn: function () {
        return Meteor.subscribe('devicesPublic');
    },
    fastRender: true
});

Router.route('/devices/submit', {
    name: 'deviceSubmit',
    waitOn: function () {
        return Meteor.subscribe('project', this.params.query.project_id);
    },
    data: function () {
        // console.log(this.params);
        return {
            project_id: this.params.query.project_id,
        };
    }
});

Router.route('/devices/:_id/edit', {
    name: 'deviceEdit',
    waitOn: function () {
        return Meteor.subscribe('device', this.params._id);
    },
    data: function () {
        return Collections.Devices.findOne(this.params._id);
    }
});

Router.route('/devices/:_id/vis', {
    name: 'deviceDataVisual',
    waitOn: function () {
        return [
            Meteor.subscribe('deviceProject', this.params._id),
            Meteor.subscribe('device', this.params._id),
            Meteor.subscribe('deviceDataEvents', this.params._id)
        ];
    },
    data: function () {
        return Collections.Devices.findOne(this.params._id);
    }
});

Router.route('/devices/:_id/img_select', {
    name: 'deviceImagesSelect',
    waitOn: function () {
        return Meteor.subscribe('device', this.params._id);
    },
    data: function () {
        return Collections.Devices.findOne(this.params._id);
    }
});

Router.route('/devices/:_id', {
    name: 'deviceDetail',
    waitOn: function () {
        return [
            Meteor.subscribe('deviceProject', this.params._id),
            Meteor.subscribe('device', this.params._id),
            Meteor.subscribe('deviceDataEvents', this.params._id),
            Meteor.subscribe('deviceControlEvents', this.params._id)
        ];
    },
    data: function () {
        //return [
        //    Collections.Devices.findOne(this.params._id),
        //    Collections.DataEvents.find({device_id:this.params._id}),
        //    Collections.ControlEvents.find({device_id:this.params._id}),
        //];

        return Collections.Devices.findOne(this.params._id);
    },
    fastRender: true
});

Router.onBeforeAction(requireLogin, {only: 'devicesList'});
Router.onBeforeAction(requireLogin, {only: 'deviceDetail'});
Router.onBeforeAction(requireLogin, {only: 'deviceSubmit'});
Router.onBeforeAction(requireLogin, {only: 'deviceEdit'});
Router.onBeforeAction(requireLogin, {only: 'deviceDataVisual'});

// My Module

Router.route('/mymodules', {name: 'myModulesList'});
Router.route('/mymodules/:_id/edit', {
    name: 'myModuleEdit',
    data: function () {
        return Collections.Devices.findOne(this.params._id);
    }
});
Router.route('/mymodules/submit', {
    name: 'myModuleSubmit',
    data: function () {
        // console.log(this.params);
        return {
            module_id: this.params.query.module_id,
            name: this.params.query.name,
        };
    }
});

Router.onBeforeAction(requireLogin, {only: 'myModulesList'});
Router.onBeforeAction(requireLogin, {only: 'myModuleEdit'});
Router.onBeforeAction(requireLogin, {only: 'myModuleSubmit'});

// TODO

//Router.route('/buyappkit/:project_id', {name: 'buyAppKit'}).get(function () {
//    this.response.writeHead(302, {
//        'Location': "https://www.microduino.cc/store#q=" + this.params.project_id
//    });
//    this.response.end();
//});
//
//Router.route('/buymodule/:module_id', {name: 'buyModule'}).get(function () {
//    this.response.writeHead(302, {
//        'Location': "https://www.microduino.cc/store#q=" + this.params.module_id
//    });
//    this.response.end();
//});

//// Router.onBeforeAction('dataNotFound', {only: 'modulePage'});

//Router.route('/video', {
//    name: 'vidoePlayer',
//    data: function () {
//        // console.log(this.params);
//        return {
//            video_url: "https://www.microduino.cc/store"
//        };
//    }
//});