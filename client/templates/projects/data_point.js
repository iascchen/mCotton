/**
 * Created by chenhao on 15/10/14.
 */
Template.dataPoint.helpers({
    unit: function () {
        return DATA_POINTS[this.data_type].unit;
    }
});