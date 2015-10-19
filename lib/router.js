/**
 * Created by chenhao on 15/4/7.
 */
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function () {
        return [
            Meteor.subscribe('modules'),
            Meteor.subscribe('projects')
        ]
    },
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

Router.route('/', {name: 'home'});

Router.route('/admin', {
    template: 'accountsAdmin',
    onBeforeAction: function() {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
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
});

Router.route('/projects/submit', {
    name: 'projectSubmit',
});

Router.route('/projects/:_id/edit', {
    name: 'projectEdit',
    data: function () {
        return Collections.Projects.findOne(this.params._id);
    }
});

Router.route('/projects/:_id/dp_edit', {
    name: 'dataPointEdit',
    data: function () {
        return Collections.Projects.findOne(this.params._id);
    }
});

Router.route('/projects/:_id/cp_edit', {
    name: 'controlPointEdit',
    data: function () {
        return Collections.Projects.findOne(this.params._id);
    }
});

Router.route('/projects/:_id/md_select', {
    name: 'projectModulesSelect',
    data: function () {
        return Collections.Projects.findOne(this.params._id);
    }
});

Router.route('/projects/:_id/img_select', {
    name: 'projectImagesSelect',
    data: function () {
        return Collections.Projects.findOne(this.params._id);
    }
});

Router.route('/projects/:_id', {
    name: 'projectDetail',
    waitOn: function () {
        return Meteor.subscribe('projects');
    },
    data: function () {
        return Collections.Projects.findOne(this.params._id);
    }
});

Router.onBeforeAction(requireLogin, {only: 'projectSubmit'});
Router.onBeforeAction(requireLogin, {only: 'projectEdit'});

// My Project

Router.route('/devices', {
    name: 'devicesList',
    waitOn: function () {
        return [
            Meteor.subscribe('projects'),
            Meteor.subscribe('devices', Meteor.userId())
        ];
    }
});

Router.route('/devices/submit', {
    name: 'deviceSubmit',
    data: function () {
        // console.log(this.params);
        return {
            project_id: this.params.query.project_id,
        };
    }
});

Router.route('/devices/:_id/edit', {
    name: 'deviceEdit',
    data: function () {
        return Collections.Devices.findOne(this.params._id);
    }
});

Router.route('/devices/:_id/vis', {
    name: 'deviceDataVisual',
    data: function () {
        return Collections.Devices.findOne(this.params._id);
    }
});

Router.route('/devices/:_id/img_select', {
    name: 'deviceImagesSelect',
    data: function () {
        return Collections.Devices.findOne(this.params._id);
    }
});

Router.route('/devices/:_id', {
    name: 'deviceDetail',
    waitOn: function () {
        return [
            Meteor.subscribe('projects'),
            Meteor.subscribe('devices', Meteor.userId()),
            Meteor.subscribe('dataevents', Meteor.userId()),
            Meteor.subscribe('controlevents', Meteor.userId())
        ];
    },
    data: function () {
        return Collections.Devices.findOne(this.params._id);
    }
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

Router.route('/buyappkit/:project_id', {name: 'buyAppKit'}).get(function () {
    this.response.writeHead(302, {
        'Location': "https://www.microduino.cc/store#q=" + this.params.project_id
    });
    this.response.end();
});

Router.route('/buymodule/:module_id', {name: 'buyModule'}).get(function () {
    this.response.writeHead(302, {
        'Location': "https://www.microduino.cc/store#q=" + this.params.module_id
    });
    this.response.end();
});

//// Router.onBeforeAction('dataNotFound', {only: 'modulePage'});

Router.route('/video', {
    name: 'vidoePlayer',
    data: function () {
        // console.log(this.params);
        return {
            video_url: "https://www.microduino.cc/store"
        };
    }
});