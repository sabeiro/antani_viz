// init the ol3 map
var features = null;
var spotL = null;
var boundL = null;

var map = new ol.Map({
    target:'map',
    layers:[new ol.layer.Tile({source: new ol.source.OSM()})],
    view: new ol.View({center: ol.proj.transform([13.5, 51],'EPSG:4326','EPSG:3857'),zoom:1})
});
// map.setOptions({projection: "EPSG:4326"});

//---------------------shapes----------------------------

var canvasFunction = function(extent,resolution,pixelRatio,size,projection){
    console.log(size);
    var width = size[0], height = size[1];
    var canvas = d3.select(document.createElement('canvas'));
    canvas.attr('width', width).attr('height', height);
    var context = canvas.node().getContext('2d');
    var d3Projection = d3.geo.mercator().scale(1).translate([0, 0]);
    var d3Path = d3.geo.path().projection(d3Projection);
    var pixelBounds = d3Path.bounds(features);
    var pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0];
    var pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1];
    var geoBounds = d3.geo.bounds(features);
    var geoBoundsLeftBottom = ol.proj.transform(geoBounds[0],'EPSG:4326',projection);
    var geoBoundsRightTop = ol.proj.transform(geoBounds[1],'EPSG:4326',projection);
    var geoBoundsWidth = geoBoundsRightTop[0] - geoBoundsLeftBottom[0];
    if (geoBoundsWidth < 0) {geoBoundsWidth += ol.extent.getWidth(projection.getExtent());}
    var geoBoundsHeight = geoBoundsRightTop[1] - geoBoundsLeftBottom[1];
    var widthResolution = geoBoundsWidth / pixelBoundsWidth;
    var heightResolution = geoBoundsHeight / pixelBoundsHeight;
    var r = Math.max(widthResolution, heightResolution);
    var scale = r / (resolution / pixelRatio);
    var center = ol.proj.transform(ol.extent.getCenter(extent),projection,'EPSG:4326');
    d3Projection.scale(scale).center(center).translate([width / 2, height / 2]);
    d3Path = d3Path.projection(d3Projection).context(context);
    d3Path(features);
    context.stroke();
    var sketch = d3.select("#map").attr('width', width).attr('height', height);
    var binding = sketch.selectAll('custom.rect').data(features.features);
    binding.exit().remove();
    binding.enter()
	.append('custom')
	.classed('rect',true)
	.attr('height',function(d){return(d.properties.EWZ_2013/10) * pixelRatio;})
	.attr('width',10*pixelRatio)
	.attr('fillStyle','blue')
	.attr('strokeStyle','white')
	.attr('lineWidth',1);
    binding
	.attr('x',function(d) {return d3Path.centroid(d)[0];})
	.attr('y',function(d) {return d3Path.centroid(d)[1] - (d.properties.EWZ_2013 / 10) * pixelRatio;});
    var elements = d3.selectAll("custom.rect");
    elements.each(function(d) {
	var node = d3.select(this);
	context.beginPath();
	context.rect(node.attr("x"),node.attr("y"),node.attr("width"),node.attr("height"));
	context.lineWidth = 1;
	context.strokeStyle = 'black';
	context.stroke();
	context.fillStyle = node.attr("fillStyle");
	context.fill();
	context.closePath();
    });
    return canvas[0][0];
};
d3.json('data/shape.geojson', function(error,subunits) {
    features = subunits;
    var layer = new ol.layer.Image({
        source: new ol.source.ImageCanvas({canvasFunction:canvasFunction,projection:'EPSG:3857'})
    });
    map.addLayer(layer);
    // var visible = new ol.dom.Input(document.getElementById('visible'));
    // visible.bindTo('checked',layer,'visible');
    // var opacity = new ol.dom.Input(document.getElementById('opacity'));
    // opacity.bindTo('value' layer,'opacity');
    // opacity.transform(parseFloat, String);
});

//-------------------------------spots-----------------------------------

// var line_feature = plotLines(spotL);
var extent = [-20037508.34, -20037508.34,20037508.34, 20037508.34];
var lon = 5;
var lat = 40;
var zoom = 5;
var map, layer;
var x = [15,50];

var line_source = new ol.source.Vector();
var overlay = new ol.layer.Vector({title:"lines",source:line_source});

function project(x) {
    // var extent = map.getView().calculateExtent(map.getSize());
    // extent = ol.proj.transformExtent(extent,'EPSG:3857','EPSG:4326');
    var coord = ol.proj.transform(x,'EPSG:4326','EPSG:3857')
    var pixel = map.getPixelFromCoordinate(coord);
    // var dx = extent[2] - extent[0];
    // var px = (x[0] - extent[0])/dx;
    // var dy = extent[3] - extent[1];
    // var py = (x[1] - extent[1])/dy;
    return pixel;
}

function getBounds(featL){
    var boxS = [[90,180],[-90,-180]];
    for(var y in featL.features){
	var z  = featL.features[y].geometry.coordinates;
	if(z[0] < boxS[0][0]){boxS[0][0] = z[0];}
	if(z[1] < boxS[0][1]){boxS[0][1] = z[1];}
	if(z[0] > boxS[1][0]){boxS[1][0] = z[0];}
	if(z[1] > boxS[1][1]){boxS[1][1] = z[1];}
    }
    return boxS;
}

var extent,resolution,pixelRatio,size,projection;

var spotCanvas = function(extent1,resolution1,pixelRatio1,size1,projection1){
    extent = extent1; resolution = resolution1; pixelRatio = pixelRatio1; size = size1; projection = projection1;
    console.log(size);
    
    var width = size[0], height = size[1];
    var canvas = d3.select(document.createElement('canvas'));
    canvas.attr('width',width).attr('height',height);
    var context = canvas.node().getContext('2d');
    var d3Projection = d3.geo.mercator().scale(1).translate([0, 0]);
    var d3Path = d3.geo.path().projection(d3Projection);
    var pixelBounds = d3Path.bounds(spotL);
    var pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0];
    var pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1];
    var geoBounds = getBounds(spotL);//d3.geo.bounds(spotL);
    var geoBoundsLeftBottom = ol.proj.transform(geoBounds[0], 'EPSG:4326',projection);
    var geoBoundsRightTop = ol.proj.transform(geoBounds[1], 'EPSG:4326',projection);
    var geoBoundsWidth = geoBoundsRightTop[0] - geoBoundsLeftBottom[0];
    if (geoBoundsWidth < 0) {geoBoundsWidth += ol.extent.getWidth(projection.getExtent());}
    var geoBoundsHeight = geoBoundsRightTop[1] - geoBoundsLeftBottom[1];
    var widthResolution = geoBoundsWidth / pixelBoundsWidth;
    var heightResolution = geoBoundsHeight / pixelBoundsHeight;
    var r = Math.max(widthResolution, heightResolution);
    var scale = r / (resolution / pixelRatio);
    var center = ol.proj.transform(ol.extent.getCenter(extent),projection,'EPSG:4326');
    d3Projection.scale(scale).center(center).translate([width / 2, height / 2]);
    d3Path = d3Path.projection(d3Projection).context(context);
    d3Path(spotL);
    context.stroke();
    var svg = d3.select("#map").insert("svg:svg").attr("width",width).attr("height",height);
    g = svg.append("g");
    //boundL = d3.geo.bounds(spotL);
    boundL = getBounds(spotL);
    var path = d3.geo.path().projection(project);
    var feature = g.selectAll("path")
	.data(spotL.features)
	.enter().append("path")
	.attr("d",path.pointRadius(function(d){
	    return Math.sqrt((Math.exp(parseFloat(d.properties.mag))));
	}))
	.on("mouseover", function (d) {
	    var mousePosition = d3.mouse(this);
	    var format = d3.time.format("%Y-%m-%d %HH:%MM:%SS");
	    $("#pop-up").fadeOut(100, function () {
		// Popup content
		$("#pop-up-title").html(format(new Date(parseInt(d.properties.time))));
		$("#pop-img").html(d.properties.mag);
		$("#pop-desc").html(d.properties.place);
		// Popup position
		var popLeft = mousePosition[0]+300 > screen.width ? mousePosition[0]-400 : mousePosition[0];
		var popTop = mousePosition[1];
		$("#pop-up").css({"left": popLeft + 50,"top": popTop});
		$("#pop-up").fadeIn(100);
	    });
	}).
	on("mouseout", function () {$("#pop-up").fadeOut(50);});
    map.events.register("moveend", map, reset);
    reset();
    function reset() {
	console.log('reset');
	console.log(boundL);
        var bottomLeft = project(boundL[0]), topRight = project(boundL[1]);
	console.log(topRight[0] - bottomLeft[0]);
	console.log(bottomLeft[1] - topRight[1]);
        svg.attr("width",topRight[0] - bottomLeft[0])
            .attr("height",bottomLeft[1] - topRight[1])
            .style("margin-left",bottomLeft[0]+"px")
            .style("margin-top",topRight[1]+"px");
        g.attr("transform","translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");
        feature.attr("d", path);
    }
};

d3.json('data/quakes.json', function(error, subunits) {
    spotL = subunits;
    var layer = new ol.layer.Image({source: new ol.source.ImageCanvas({canvasFunction: spotCanvas,projection: 'EPSG:3857'})
    });
    map.addLayer(layer);
});

