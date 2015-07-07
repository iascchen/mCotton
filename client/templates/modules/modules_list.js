/**
 * Created by chenhao on 15/4/7.
 */

Template.modulesList.helpers({
    modules: function () {
        return Modules.find({}, {sort: {submitted: -1}});
    }
});