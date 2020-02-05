d3.json("data/us-states.json", function (collection) {
    console.log(collection);
    var overlay = new OpenLayers.Layer.Vector("states");
    overlay.afterAdd = function () {
        var div = d3.selectAll("#" + overlay.div.id);
        div.selectAll("svg").remove();
        var svg = div.append("svg");
        g = svg.append("g");
        var bounds = d3.geo.bounds(collection),
            path = d3.geo.path().projection(project);
        var feature = g.selectAll("path")
            .data(collection.features)
            .enter().append("path");
        map.events.register("moveend", map, reset);
        reset();
        function reset() {
            var bottomLeft = project(bounds[0]),
                topRight = project(bounds[1]);
            svg.attr("width", topRight[0] - bottomLeft[0])
                .attr("height", bottomLeft[1] - topRight[1])
                .style("margin-left", bottomLeft[0] + "px")
                .style("margin-top", topRight[1] + "px");
            g.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");
            feature.attr("d", path);
        }
        function project(x) {
            var point = map.getViewPortPxFromLonLat(new OpenLayers.LonLat(x[0], x[1])
						    .transform("EPSG:4326", "EPSG:900913"));
            return [point.x, point.y];
        }
    }
    map.addLayer(overlay);
});
