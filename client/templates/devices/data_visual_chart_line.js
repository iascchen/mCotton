// dataVisual Line

VIAUSL_JSON_DATA = "visual_json_data";
VIAUSL_FROM_TIME = "visual_from_time";
VIAUSL_TO_TIME = "visual_to_time";
VIAUSL_TIME_FORMAT = "visual_time_format";

Template.dataVisualLine.helpers({
    json_data: function () {
        delete Session.keys[VIAUSL_JSON_DATA];

        var hour = moment().hour();
        Session.setDefault(VIAUSL_FROM_TIME, moment(hour - 1, "HH").valueOf());
        Session.setDefault(VIAUSL_TO_TIME, moment(hour + 1, "HH").valueOf());
        Session.setDefault(VIAUSL_TIME_FORMAT, "%H:%M");

        var timeStart = getDateFromSession(VIAUSL_FROM_TIME);
        var events = Collections.DataEvents.find({
                device_id: this._id,
                data_submit_time: {$gte: timeStart.toDate()}
            },
            {sort: {data_name: 1, data_submit_time: 1}}).fetch();

        // console.log("dataVisualEvents", events.length);
        if (events.length <= 0) return;

        var currentKey;
        var retjson = [], values = [];
        var currentSerial;
        var nm, vl, dt;
        _.forEach( events, function(event){
            nm = event.data_name;
            vl = parseFloat(event.data_value);
            dt = event.data_submit_time.getTime();

            // console.log("getDataEvent", n, e, d);

            if (nm != currentKey) {
                if (currentKey) {
                    currentSerial = {
                        key: currentKey,
                        values: values
                    };
                    retjson.push(currentSerial);
                }

                currentKey = nm;
                values = [];
            }

            if (vl != 0)
                values.push({x: dt, y: vl});
        } );

        //for (var i = 0; i < events.length; i++) {
        //    nm = events[i].data_name;
        //    vl = parseFloat(events[i].data_value);
        //    dt = events[i].data_submit_time.getTime();
        //
        //    // console.log("getDataEvent", n, e, d);
        //
        //    if (nm != currentKey) {
        //        if (currentKey) {
        //            currentSerial = {
        //                key: currentKey,
        //                values: values
        //            };
        //            retjson.push(currentSerial);
        //        }
        //
        //        currentKey = nm;
        //        values = [];
        //    }
        //
        //    if (vl != 0)
        //        values.push({x: dt, y: vl});
        //}

        currentSerial = {
            key: currentKey,
            values: values
        };
        retjson.push(currentSerial);

        console.log("retjson", retjson);
        Session.set(VIAUSL_JSON_DATA, retjson);

        // return JSON.stringify(retjson);
        return;
    },
    from_time: function () {
        return getDateFromSession(VIAUSL_FROM_TIME);
    },
    to_time: function () {
        return getDateFromSession(VIAUSL_TO_TIME);
    },
});

Template.dataVisualLine.events({
    "click .showHour": function () {
        console.log("click .showHour");
        var timeinfo = moment().hour();
        addDateToSession(VIAUSL_FROM_TIME, moment(timeinfo - 1, "HH"));
        addDateToSession(VIAUSL_TO_TIME, moment(timeinfo + 1, "HH"));
        Session.set(VIAUSL_TIME_FORMAT, "HH:mm");
    },
    "click .showDay": function () {
        console.log("click .showDay");
        var timeinfo = moment().date();
        addDateToSession(VIAUSL_FROM_TIME, moment(timeinfo - 1, "DD"));
        addDateToSession(VIAUSL_TO_TIME, moment(timeinfo + 1, "DD"));
        Session.set(VIAUSL_TIME_FORMAT, "MM/DD HH:00");
    },
    "click .showWeek": function () {
        console.log("click .showWeek");
        var timeinfo = moment().week();
        addDateToSession(VIAUSL_FROM_TIME, moment(timeinfo - 1, "WW"));
        addDateToSession(VIAUSL_TO_TIME, moment(timeinfo + 1, "WW"));
        Session.set(VIAUSL_TIME_FORMAT, "MM/DD");
    }
});

Template.dataVisualLine.rendered = function () {

    var width = 960, height = 400;

    var timeStart = getDateFromSession(VIAUSL_FROM_TIME);
    var timeEnd = getDateFromSession(VIAUSL_TO_TIME);
    var timeFormat = Session.get(VIAUSL_TIME_FORMAT);

    //console.log(timeStart.format("YYYY-MM-DD HH:mm:ss"));
    //console.log(timeEnd.format("YYYY-MM-DD HH:mm:ss"));
    //console.log(timeFormat);

    var svg = d3.select('#visual svg')
        .attr('width', width)
        .attr('height', height);

    var chart = nv.models.lineChart()
        //.margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
        .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
        .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
        .showYAxis(true)        //Show the y-axis
        .showXAxis(true)        //Show the x-axis
        ;

    nv.addGraph(function () {
        chart.xAxis
            .axisLabel('Time (ms)');

        chart.yAxis
            // .forceY([0,120])
            .axisLabel('Values')
            .tickFormat(d3.format('.02f'));

        nv.utils.windowResize(function () {
            chart.update();
        });
        return chart;
    });

    this.autorun(function () {
        var graph = Session.get(VIAUSL_JSON_DATA);

        var timeStart = getDateFromSession(VIAUSL_FROM_TIME);
        var timeEnd = getDateFromSession(VIAUSL_TO_TIME);
        var timeFormat = Session.get(VIAUSL_TIME_FORMAT);

        //console.log(timeStart.format("YYYY-MM-DD HH:mm:ss"));
        //console.log(timeEnd.format("YYYY-MM-DD HH:mm:ss"));
        //console.log(timeFormat);

        if (!graph) {
            return;
        }
        // console.log("data", graph);
        chart.forceX([timeStart.valueOf(), timeEnd.valueOf()]);

        chart.xAxis
            .tickFormat(function (d) {
                return moment(d).format(timeFormat);
            });
        // .ticks(d3.time.hours, 5);

        svg.datum(graph).call(chart);
        chart.update();
    });
};