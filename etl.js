var colorL = ["#B4aaaaf0","#8b122870","#6CAF3070","#F8B19570","#F6728070","#C06C8470","#6C5B7B70","#355C7D70","#99B89870","#2A363B70","#67E68E70","#9F53B570","#3E671470","#7FA8A370","#6F849470","#38577770","#5C527A70","#E8175D30","#47474730","#36363630","#A7226E30","#EC204930","#F26B3830","#F7DB4F30","#2F959930","#E1F5C430","#EDE57430","#F9D42330","#FC913A30","#FF4E5030","#E5FCC230","#9DE0AD30","#45ADA830","#54798030","#594F4F30","#FE436530","#FC9D9A30","#F9CDAD30","#C8C8A930","#83AF9B30"];
var sol = null;
var spotL = null, pathL = null;
var confD = {"reset":false
        ,"cost_route":70.35,"cost_stop":.1,"max_n":50,"temp":.5,"link":5,"phantom":4,"cluster":true
        ,"moveProb":{"move":1,"distance":1,"markov":4,"extrude":3,"flat":1}
        ,"net_layer":[128,128],"load_model":"","init_chain":true}

//----------------------------------transform-data-----------------------------
function formatData(sol){
    var spotL = sol['spot'];
    var pathL = sol['path'];
    for (var loc in spotL){
	var agent = spotL[loc]['agent'];
	agent = parseInt(agent);
	spotL[loc]['agent'] = agent;
	spotL[loc]['color'] = colorL[agent];
    };
    for (var loc in pathL){
	var agent = pathL[loc]['agent'];
	agent = parseInt(agent);
	pathL[loc]['agent'] = agent;
	pathL[loc]['color'] = colorL[agent];
    };
    var geom = new Object();
    geom.spotL = spotL;
    geom.pathL = pathL;
    return geom;
};

function parseSolution(json){
    if(Object.keys(json).length !== 0){
	sol = json;
	geom = formatData(json);
	spotL = geom.spotL;
	pathL = geom.pathL;
	if (typeof json.confD !== 'undefined'){confD = json.confD;}
	refreshLayer(spotL);
	pathMenu(pathL);
	confMenu(confD);
	initD3();
    }
}

//-----------------------projection------------------------------

var current_projection = new ol.proj.Projection({code: "EPSG:4326"});
// var new_projection = raster.getSource().getProjection();
var new_projection = new ol.proj.Projection({code: "EPSG:3857"});
function transform_geometry(element) {
    element.getGeometry().transform(current_projection, new_projection);
}

//---------------------graph-objects------------------------------

function plotLines(spotL){
    var n_agent = Object.keys(pathL).length;
    for(var loc in spotL){n_agent = Math.max(n_agent,spotL[loc]['agent']);}
    var line_feature = [];
    var posV = {};
    for(var a=0;a<=n_agent;a++){
	posV[a] = {};
	posV[a]['color'] = colorL[a];
	posV[a]['path'] = [];
    }
    for(var loc in spotL){
	var agent = spotL[loc]['agent']
	if(agent <= 0){continue;}
	var coordinates = [spotL[loc]['x'],spotL[loc]['y']];
	posV[agent]['path'].push(coordinates);
    }
    for(var p in posV){
	var pointL = posV[p]['path'];
	var color = posV[p]['color'];
	var line = new ol.Feature({geometry: new ol.geom.LineString(pointL)});
	var fill = new ol.style.Fill({color:color});
	var stroke = new ol.style.Stroke({color:color,width:2});
	var style = new ol.style.Style({fill: fill,stroke: stroke});
	line.setStyle(style)
	line_feature.push(line)
    }
    line_feature.forEach(transform_geometry);
    return line_feature;
};

function plotPoint(spotL){
    var features = new Array();
    for (var key in spotL){
	var agent = spotL[key]['agent'];
	agent = parseInt(agent);
	spotL[key]['agent'] = agent;
	spotL[key]['color'] = colorL[agent];
	var textS = spotL[key]['agent'].toString();
	var coordinates = [spotL[key]['x'],spotL[key]['y']];
	var feat = new ol.Feature(new ol.geom.Point(coordinates));
	var fill = new ol.style.Fill({color: spotL[key]['color']});
	var stroke = new ol.style.Stroke({color: spotL[key]['color'],width:1});
	var style = new ol.style.Style({
	    image: new ol.style.Circle({fill: fill,sstroke: stroke,radius:10})
	    ,fill: fill,stroke: stroke
	    ,text: new ol.style.Text({
	    	text: textS,fill: new ol.style.Fill({color: '#fff'})
	    })
	});
	feat['color'] = spotL[key]['color'];
	feat['id'] = key;
	feat['agent'] = spotL[key]['agent'];
	feat.setStyle(style);
	features.push(feat);
    }
    features.forEach(transform_geometry);
    return features;
}

function plotGraph(net){
    var color = "#00000030";
    var fill = new ol.style.Fill({color:color});
    var edgeL = net['edges'];
    var nodeL = net['nodes'];
    var graph_feature = [];
    for(var n in nodeL){
	var coord1 = [nodeL[n]['x'],nodeL[n]['y']];
	for(var m in edgeL[n]){
	    var coord2 = [nodeL[m]['x'],nodeL[m]['y']];
	    var width = edgeL[n][m]['widht']*2.;
	    var line = new ol.Feature({geometry: new ol.geom.LineString([coord1,coord2])});
	    var stroke = new ol.style.Stroke({color:color,width:width});
	    var style = new ol.style.Style({fill:fill,stroke:stroke});
	    line.setStyle(style);
	    graph_feature.push(line);
	}
    }
    graph_feature.forEach(transform_geometry);
    return graph_feature;
};

function plotPoly(spotL){
    var poly = new ol.geom.Polygon( [[[13.4357548 , 52.50797622],[13.43204609, 52.50202178],[13.43254786, 52.50549124],[13.43059576, 52.51060367],[13.43361524, 52.50990525]]])
    var poly_feature = new ol.Feature({name:"poly",geometry:poly})
    return [poly_feature];
};

function defStyle(feature){
    var size = feature.get('features').length;
    var style = styleCache[size];
    if (!style) {
	style = new ol.style.Style({
	    image: new ol.style.CircleStyle({
		radius: Math.min(size,15),
		stroke: new ol.style.Stroke({color: '#fff'}),
		fill: new ol.style.Fill({color: '#3399CC'})
	    }),
	    text: new ol.style.Text({
		text: size.toString(),fill: new ol.style.Fill({color: '#fff'})
	    })
	});
	styleCache[size] = style;
    }
    return style;
}

