var line_feature = null, line_source = null, line_layer = null;
var point_feature = null, point_source = null, point_layer = null;
var graph_feature = null, graph_source = null, graph_layer = null;
var poly_feature = null, poly_source = null, poly_layer = null;
//--------------------------popup--------------------------------
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var overlay = new ol.Overlay({element: container,autoPan: true,autoPanAnimation: {duration: 250}});
closer.onclick = function(){overlay.setPosition(undefined);closer.blur();return false;};
//------------------------------initialize-map--------------------------------
var raster = new ol.layer.Tile({title:"tile",source: new ol.source.Stamen({layer: 'watercolor'})});
raster.setOpacity(0.2);
var map_label = new ol.layer.Tile({title:"street",visible:false,source: new ol.source.Stamen({layer: 'terrain-labels'})});
var osmLayer = new ol.layer.Tile({source: new ol.source.OSM()});
var map = new ol.Map({
    layers: [new ol.layer.Group({title:"raster",visible:true,layers:[raster,map_label]})],
    overlays: [overlay],
    target: 'map',
    view: new ol.View({center: ol.proj.fromLonLat([13.435755,52.507976]),zoom: 12})
});
//--------------------------------def-layerss--------------------------------
function initLayers(spotL){
    line_feature = plotLines(spotL);
    line_source = new ol.source.Vector({features:line_feature});
    line_layer = new ol.layer.Vector({title:"lines",source:line_source});
    map.addLayer(line_layer);

    point_feature = plotPoint(spotL);
    point_source = new ol.source.Vector({features: point_feature,minResolution:2500});
    point_layer = new ol.layer.Vector({title:"stops",source:point_source});
    map.addLayer(point_layer);
    
    poly_feature = plotPoly(spotL);
    poly_source = new ol.source.Vector({features: poly_feature});
    poly_layer = new ol.layer.Vector({title:"poly",source:poly_source});
    map.addLayer(poly_layer)
    
    // var distance = document.getElementById('distance');
    // var source = new ol.source.Vector({features: features});
    // var clusterSource = new ol.source.Cluster({distance: parseInt(distance.value, 10),source: source});
    // var styleCache = {};
    // var clusters = new ol.layer.Vector({title:'cluster',source: clusterSource,visible:false,style: function(feature){return defStyle(feature)},maxResolution:2500});
    // distance.addEventListener('input', function() {clusterSource.setDistance(parseInt(distance.value, 10));});
    // map.addLayer(clusters);
};

function pathMenu(pathL){

}
function confMenu(confD){
    $("#phantom_id").val(confD['phantom'])
    $("#cluster_id").prop("checked",confD['cluster']);
    $("#init_id").prop("checked",confD['init_chain']);
}

function refreshLayer(spotL){
    line_feature  = plotLines(spotL);
    line_source.clear();
    line_source.addFeatures(line_feature);
    point_feature = plotPoint(spotL);
    point_source.clear();
    point_source.addFeatures(point_feature);
    poly_feature  = plotPoly(spotL);
    poly_source.clear();
    poly_source.addFeatures(poly_feature);
};

function initGraph(net){
    graph_feature = null;//plotGraph(net);
    graph_source = new ol.source.Vector({features:graph_feature});
    graph_layer = new ol.layer.Vector({title:"graph",source:graph_source});
    map.addLayer(graph_layer);
}

function refreshGraph(net){
    graph_feature = plotGraph(net);
    graph_source.clear();
    graph_source.addFeatures(graph_feature);
};

var layerSwitcher = new ol.control.LayerSwitcher({tipLabel:'layers',groupSelectStyle:'children'});
map.addControl(layerSwitcher);

// var heatmapLayer = new ol.layer.Heatmap({source: new ol.source.GeoJSON({url: './data/world_cities.json',projection: 'EPSG:3857'}),opacity: 0.9});

//-------------------------------------selection--------------------------------

var click = ol.events.condition.click;
var pointerMove = ol.events.condition.pointerMove;
var select = null; 
var selectSingleClick = new ol.interaction.Select();
var selectClick = new ol.interaction.Select({condition: click});
var selectPointerMove = new ol.interaction.Select({condition: pointerMove});
select = selectSingleClick;
map.addInteraction(select);
select.on('select', function(e) {
    var featL = e.target.getFeatures();
    var feat = featL['array_'][0];
    var feat_id = feat['id'];
    var info = 'agent '+feat['agent']+' spot'+feat_id;
    var msg = '';
    $("#agent_id").val(feat['agent']);
    $("#spot_id").val(feat_id);
    document.getElementById('status').innerHTML = msg;;
    // map.on('singleclick', function(evt) {
    var coordinate = e.coordinate;
    content.innerHTML = msg;
    overlay.setPosition(coordinate);
});

