/**
 * Created by chenhao on 15/4/14.
 */

Meteor.subscribe("controlevents", Meteor.userId());

Template.controlBoard.helpers({
    controlBoardTemplate: function() {
        switch(this.control_type){
            case 'LED':
            case 'SWT':
                return Template.controlBoardChange;
            case 'BTN':
                return Template.controlBoardClick;
            case 'TXT':
                return Template.controlBoardInput;
        }
        return Template.controlNone;
    }
});