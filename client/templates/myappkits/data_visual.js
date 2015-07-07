/**
 * Created by chenhao on 15/4/14.
 */

// Meteor.subscribe("dataevents", Meteor.userId());

Template.dataVisual.helpers({
    dataVisualTemplate: function () {
        // console.log("dataVisualTemplate", this);

        var chart = "LINE";
        var app_kit = AppKits.findOne( {_id: this.app_kit_id} );
        if (app_kit) {
            chart = app_kit.show_chart;
        }
        // console.log("dataVisualTemplate", app_kit.show_chart);

        switch (chart) {
            case "PIE" :
                return Template.dataVisualPie;
            case "BAR" :
                return Template.dataVisualBar;
            case "MY_CITY" :
                return Template.dataVisualMyCity;
            case "LINE" :
                return Template.dataVisualLine;
        }
        return Template.dataVisualLine;
    }
});