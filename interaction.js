function loadInitial(){
    $.getJSON("data/sol_grandC.json", function(json) {
	sol = json;
        geom = formatData(sol);
        spotL = geom.spotL;
        pathL = geom.pathL;
	initGraph(json);
	initLayers(spotL);
	parseSolution(json);
   });
};
loadInitial();

function loadGraph(how="first"){
    $.getJSON("data/markov_chain.json", function(json){
	//initGraph(json);
	refreshGraph(json);
    });
};

$("#agent_id").change(function(x){
    var feat_id = $("#spot_id").val();
    var agent = $("#agent_id").val();
    console.log(feat_id,agent);
    spotL[feat_id]['agent'] = parseInt(agent);
    point_feature = plotPoint(spotL);
    point_source.clear();
    point_source.addFeatures(point_feature);
});

$("#endpoint_id").change(function(x){
    baseUrl = $("#endpoint_id").val();
    var url = baseUrl + "/";
    $.getJSON(url,
	      {format:"json"}
	      ,function(data){console.log(data);}
	      ,function(xhr, status, error) {console.log(status + '; ' + error);}
	     );
});

$('#phantom_id').on('change', function() {confD['phantom'] = parseInt($('#phantom_id').val());})
$('#init_id').on('change', function() {confD['init_chain'] = $('#init_id').prop('checked');})
$('#cluster_id').on('change', function() {confD['cluster'] = $('#cluster_id').prop('checked');})

function eraseSol(){
    for(var a in spotL){spotL[a]['agent'] = 0;}
    refreshLayer(spotL);
};

$(document).ready(function() {
    $("#sol_file").change(function(x){
	var fileN = $("#sol_file").val();
	$.getJSON("data/"+fileN+".json", function(json) {
	    parseSolution(json);
	});
	// .error(function(x){console.log("error")});
    });

});

function updateConf(){
    var conf = {"reset":false
		,"cost_route":70.35,"cost_stop":.1,"max_n":50,"temp":.5,"link":5,"phantom":0,"cluster":false
		,"moveProb":{"move":1,"distance":1,"markov":4,"extrude":3,"flat":1}
		,"net_layer":[128,128],"load_model":"","init_chain":true}
    var url = baseUrl + "conf";
    var data = conf;
    $.post(url,data).done(function(response){$("#status").html("updated conf");});
}

$(function() {$('#start-bg-job').click(start_long_task);});
$(function() {$('#kill-bg-job').click(kill_task);});
$(function() {$('#test_func').click(test_func);});
$(function() {$('#load_status').click(load_status);});

function downloadFile(){
    var exportName = "job_frontend.json";
    var dlAnchorElem = document.getElementById('save-bg-job');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", exportName);
    dlAnchorElem.click();
}

$( "#save-bg-job" ).click(function( event ) {
    var data = {spot:spotL,path:pathL,conf:confD};
    var dataStr = encodeURIComponent(JSON.stringify(data));
    this.href = 'data:plain/text,' + dataStr;
});
$("#load-bg-job").change(function(event){
    var fr = new FileReader();
    fr.onload = function(x){
        x.loadFromJSON(this.result, x.renderAll.bind(x));
	parseSolution(x);
    }
    fr.readAsText(this.files[0]);    
});
