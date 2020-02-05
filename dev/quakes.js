var extent = [-20037508.34, -20037508.34,20037508.34, 20037508.34];
var lon = 5;
var lat = 40;
var zoom = 5;
var map, layer;
var width = 400;
var height = 500;
var spotL = null;

function init() {
    var raster = new OpenLayers.Layer.WMS("OpenLayers WMS","http://vmap0.tiles.osgeo.org/wms/vmap0",{layers:'basic'});
    // var raster = new ol.layer.Tile({title:"tile",source: new ol.source.Stamen({layer: 'watercolor'})});
    // var map_label = new ol.layer.Tile({title:"street",visible:false,source: new ol.source.Stamen({layer: 'terrain-labels'})});
    // var raster = new OpenLayers.Layer.WMS("OpenLayers WMS","http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'} );
    // raster.setOpacity(0.2);
    map = new OpenLayers.Map('map');
    map.addLayers([raster]);
    map.setCenter(new OpenLayers.LonLat(0, 0), 3);
    map.addControl( new OpenLayers.Control.LayerSwitcher() );
    var overlay = new OpenLayers.Layer.Vector("stations");
    // var line_feature = plotLines(spotL);
    var line_source = new ol.source.Vector();
    var line_layer = new ol.layer.Vector({title:"lines",source:line_source});
    var svg = d3.select("#map").insert("svg:svg").attr("width", width).attr("height", height);
    d3.json("data/quakes.json", function(collection){
        overlay.afterAdd = function(){
	    spotL = collection;
	    var div = d3.selectAll("#" + overlay.div.id);
	    console.log(div);
	    div.selectAll("svg").remove();
	    var svg = div.append("svg");
	    g = svg.append("g");
	    var bounds = d3.geo.bounds(collection), path = d3.geo.path().projection(project);
	    var feature = g.selectAll("path")
		.data(collection.features)
		.enter().append("path")
		.attr("d",path.pointRadius(function(d){
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
		console.log(bounds);
                var bottomLeft = project(bounds[0]),
		    topRight = project(bounds[1]);
		console.log(bottomLeft);
		console.log(topRight);
		console.log(topRight[0] - bottomLeft[0]);
		console.log(bottomLeft[1] - topRight[1]);
                svg.attr("width", topRight[0] - bottomLeft[0])
                    .attr("height", bottomLeft[1] - topRight[1])
                    .style("margin-left", bottomLeft[0] + "px")
                    .style("margin-top", topRight[1] + "px");
                g.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");
                feature.attr("d", path);
	    }
	    function project(x) {
		// var projP = new OpenLayers.LonLat(x[0],x[1]).transform("EPSG:4326","EPSG:4326");
                // var projP = ol.proj.fromLonLat([x[0],x[1]]);
		var projP = {"lon":x[0],"lat":x[1]};
                var point = map.getViewPortPxFromLonLat(projP);
                return [point.x, point.y];
	    }
        }
        map.addLayer(overlay);
    });

}
