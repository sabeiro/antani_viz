//------------------------------initialize-map--------------------------------
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var overlay = new ol.Overlay({element: container,autoPan: true,autoPanAnimation: {duration: 250}});
closer.onclick = function() {overlay.setPosition(undefined);closer.blur();return false;};
var raster = new ol.layer.Tile({title:"tile",source: new ol.source.Stamen({layer: 'watercolor'})});
raster.setOpacity(0.2);
var map_label = new ol.layer.Tile({title:"street",visible:false,source: new ol.source.Stamen({layer: 'terrain-labels'})});
var osmLayer = new ol.layer.Tile({source: new ol.source.OSM()});
var map = new ol.Map({
    layers: [
	new ol.layer.Group({title:"raster"
			    ,visible:true
			    ,layers:[raster,map_label]})
    ],
    overlays: [overlay],
    target: 'map',
    view: new ol.View({
	center: ol.proj.fromLonLat([13.435755,52.507976]),
	zoom: 1
    })
});
var w = 1400;
var h = 700;
var svg = d3.select("div#container").append("svg").attr("preserveAspectRatio", "xMinYMin meet").style("background-color","#c9e8fd")
    .attr("viewBox", "0 0 " + w + " " + h)
    .classed("svg-content", true);
var projection = d3.geoMercator().translate([w/2,h/2]).scale(2200).center([0,40]);
var path = d3.geoPath().projection(projection);
var cities = d3.csv("data/nodes.csv");
var spot = null;
Promise.all([cities]).then(function(values){
    spot = values[0];
    svg.selectAll("circle")
        .data(spot)
        .enter()
        .append("circle")
        .attr("class","circles")
        .attr("cx", function(d) {return projection([d.x, d.y])[0];})
        .attr("cy", function(d) {return projection([d.x, d.y])[1];})
        .attr("r", "5px"),
    svg.selectAll("text")
        .data(spot)
        .enter()
        .append("text")
        .text(function(d) {
            return d.name;
        })
        .attr("x", function(d) {return projection([d.x, d.y])[0] + 5;})
        .attr("y", function(d) {return projection([d.x, d.y])[1] + 15;})
        .attr("class","labels");
    
});


var overlay = new ol.layer.Vector("stations");
map.addLayer(overlay);

var collection = null;
var quakes = d3.json("data/quakes.json");




Promise.all([quakes]).then(function(values){
    collection = values[0];
    // overlay.afterAdd = function () {
    var div = d3.selectAll("#" + overlay.div.id);
    div.selectAll("svg").remove();
        var svg = div.append("svg");
        g = svg.append("g");
        var bounds = d3.geo.bounds(collection),
            path = d3.geo.path().projection(project);
        var feature = g.selectAll("path")
            .data(collection.features)
            .enter().append("path")
            .attr("d", path.pointRadius(function (d) {
		console.log(d.properties.mag);
                return Math.sqrt((Math.exp(parseFloat(d.properties.mag))));
            }))
            .on("mouseover", function (d) {
                var mousePosition = d3.svg.mouse(this);
                var format = d3.time.format("%Y-%m-%d %HH:%MM:%SS");
                $("#pop-up").fadeOut(100, function () {
                    // Popup content
                    $("#pop-up-title").html(format(new Date(parseInt(d.properties.time))));
                    $("#pop-img").html(d.properties.mag);
                    $("#pop-desc").html(d.properties.place);

                    // Popup position
                    var popLeft = mousePosition[0] + 300 > screen.width ?
                        mousePosition[0] - 400 : mousePosition[0];
                    var popTop = mousePosition[1];
                    $("#pop-up").css({
                        "left": popLeft + 50,
                        "top": popTop
                    });
                    $("#pop-up").fadeIn(100);
                });
            }).
            on("mouseout", function () {
                $("#pop-up").fadeOut(50);
            });
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
            var point = map.getViewPortPxFromLonLat(new ol.proj.fromLonLat([x[0], x[1]])
						    .transform("EPSG:4326", "EPSG:900913"));
            return [point.x, point.y];
        }
    // }
});
