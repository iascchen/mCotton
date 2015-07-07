/**
 * Created by chenhao on 15/4/7.
 */
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function () {
        //Meteor.subscribe('myappkits');
        //Meteor.subscribe('mymodules');

        Meteor.subscribe('appkits');
        Meteor.subscribe('modules');
    }
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

// AppKit

Router.route('/appkits', {name: 'appKitsList'});
Router.route('/appkits/submit', {name: 'appKitSubmit'});
Router.route('/appkits/:_id/edit', {
    name: 'appKitEdit',
    data: function () {
        return Modules.findOne(this.params._id);
    }
});

Router.onBeforeAction(requireLogin, {only: 'appKitSubmit'});
Router.onBeforeAction(requireLogin, {only: 'appKitEdit'});

// Module

Router.route('/modules', {name: 'modulesList'});
Router.route('/modules/submit', {name: 'moduleSubmit'});
Router.route('/modules/:_id/edit', {
    name: 'moduleEdit',
    data: function () {
        return Modules.findOne(this.params._id);
    }
});

Router.onBeforeAction(requireLogin, {only: 'moduleSubmit'});
Router.onBeforeAction(requireLogin, {only: 'moduleEdit'});

// My AppKit

Router.route('/myappkits', {name: 'myAppKitsList'});
Router.route('/myappkits/:_id/edit', {
    name: 'myAppKitEdit',
    data: function () {
        return MyAppKits.findOne(this.params._id);
    }
});
Router.route('/myappkits/submit', {
    name: 'myAppKitSubmit',
    data: function () {
        // console.log(this.params);
        return {
            app_kit_id: this.params.query.app_kit_id,
        };
    }
});
Router.route('/myappkits/:_id/vis', {
    name: 'myAppKitDataVisual',
    data: function () {
        return MyAppKits.findOne(this.params._id);
    }
});

Router.onBeforeAction(requireLogin, {only: 'myAppKitsList'});
Router.onBeforeAction(requireLogin, {only: 'myAppKitSubmit'});
Router.onBeforeAction(requireLogin, {only: 'myAppKitEdit'});
Router.onBeforeAction(requireLogin, {only: 'myAppKitDataVisual'});

// My Module

Router.route('/mymodules', {name: 'myModulesList'});
Router.route('/mymodules/:_id/edit', {
    name: 'myModuleEdit',
    data: function () {
        return MyAppKits.findOne(this.params._id);
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

Router.route('/buyappkit/:app_kit_id', {name: 'buyAppKit'}).get(function () {
    this.response.writeHead(302, {
        'Location': "https://www.microduino.cc/store#q=" + this.params.app_kit_id
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
            video_url:"https://www.microduino.cc/store"
        };
    }
});