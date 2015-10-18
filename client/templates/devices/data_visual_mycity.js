// dataVisual My City

Template.dataVisualMyCity.helpers({
    json_data: function () {
        delete Session.keys[VIAUSL_JSON_DATA];

        var cells = [], nodes_map = {}, nodes = [], links = [];

        var event = Collections.DataEvents.findOne({device_id: this._id, data_name: 'Cell'},
            {sort: {sid: -1}, fields: {sid: true}});

        if (!event) {
            return;
        }
        // console.log("sid", event.sid);

        var events = Collections.DataEvents.find({device_id: this._id, data_name: 'Cell', sid: event.sid},
            {sort: {data_submit_time: -1}}).fetch();
        // console.log("getMyCityJson", events);

        _.forEach( events, function(event){
            cells.push( JSON.parse(event.data_value) );
        });

        var cell, from_node_id, to_node_id, cell_dir, to_node_name;

        // handle nodes
        var node_length = 0;
        for (var i = 0; i < cells.length; i++) {
            cell = cells[i];

            if (!nodes_map[cell.ID]) {
                nodes_map[cell.ID] = {
                    _id: node_length
                };

                nodes.push({
                    name: cell.ID,
                    group: cell.T,
                });

                node_length++;
            }
        }
        //console.log("nodes", nodes);

        // handle links
        for (var i = 0; i < cells.length; i++) {
            cell = cells[i];

            from_node_id = nodes_map[cell.ID]._id;

            cell_dir = cell.D;
            for (var dir in cell_dir) {
                if (cell_dir.hasOwnProperty(dir)) {
                    to_node_name = cell_dir[dir];

                    if (to_node_name && to_node_name != '0') {

                        to_node_id = nodes_map[to_node_name]._id;

                        links.push({
                            source: from_node_id,
                            target: to_node_id,
                            dir: dir,
                            value: 1,
                        });
                    }
                }
            }
        }
        // console.log("links", links);

        var retjson = {
            nodes: nodes,
            links: links
        };

        console.log("retjson", retjson);
        Session.set(VIAUSL_JSON_DATA, retjson);

        // return JSON.stringify(retjson);
        return;
    },
});

Template.dataVisualMyCity.rendered = function () {

    var graph = Session.get(VIAUSL_JSON_DATA);
    if (!graph) {
        return;
    }

    var width = 960, height = 400;
    var rect_width = 100, link_distance = 120;

    var force_value = -1800;
    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(force_value)
        .linkDistance(link_distance)
        .size([width, height]);

    var svg = d3.select('#visual svg')
        .attr('width', width)
        .attr('height', height);

    //svg.append("rect")
    //    .attr("width", "100%")
    //    .attr("height", "100%")
    //    .attr("fill", "gray");

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function (d) {
            return Math.sqrt(d.value);
        });

    var link_text = svg.selectAll("text")
        .data(graph.links)
        .enter()
        .append("g")
        .append("text")
        .text(function (d) {
            return d.dir.toUpperCase();
        })
        .attr("class", "link-label")
        .attr("text-anchor", "start");

    var group = svg.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("g")
        .call(force.drag);

    //var node = group.append("rect")
    //    .attr("width", rect_width)
    //    .attr("height", rect_width)
    //    .style("fill", function (d) {
    //        return color(d.group);
    //    });

    var node = group.append("circle")
        .attr("r", 0)
        .style("fill", function (d) {
            return color(d.group);
        });

    var icon = group.append("image")
        .attr("xlink:href", function (d) {
            return imageByCityGroup(d.group);
        })
        .attr("width", rect_width - 12)
        .attr("height", rect_width - 12);

    var text = group.append("text")
        .text(function (d) {
            //return d.name;
            return labelByCityGroup(d.group);
        })
        .style("font-size", "100%")
        .style("stroke", "gray")
        .style("stroke-width", 0.5)
        .style("fill", "black");

    group.append("title")
        .text(function (d) {
            return labelByCityGroup(d.group) + "\n" + d.name;
        });

    force.on("tick", function () {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("x", function (d) {
                return d.x - rect_width / 2;
            })
            .attr("y", function (d) {
                return d.y - rect_width / 2;
            });

        text
            .attr("x", function (d) {
                return d.x - rect_width / 2;
            })
            .attr("y", function (d) {
                return d.y - rect_width / 2 + 12;
            });

        icon
            .attr("x", function (d) {
                return d.x - rect_width / 2 + 6;
            })
            .attr("y", function (d) {
                return d.y - rect_width / 2 + 12;
            });

        link_text
            .attr("transform", function (d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y;
                var dr = Math.sqrt(dx * dx + dy * dy);
                var offset = (1 - (42 / dr));
                var deg = 180 / Math.PI * Math.atan2(dy, dx);
                var x = (d.target.x - dx * offset);
                var y = (d.target.y - dy * offset);
                return "translate(" + x + ", " + y + ") rotate(" + deg + ")";
            });
    });
};