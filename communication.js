var baseUrl = window.location.origin + "/antani/";
$("#endpoint_id").val(baseUrl);
var job_id = '';
var update_call = true;

function getSolution(){
    var url = baseUrl + "/solution";
    $.ajax({url: url
	    ,contentType:"application/json; charset=utf-8;"
	    ,success: function(json) {
		formatSolution(json);
	    }
	    ,error: function(xhr, status, error) {console.log(status + '; ' + error);}
	   });
}

function simplifySolution(){
    var url = baseUrl + "simplify";
    var data = {spot:spotL,path:pathL,conf:confD};
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
	contentType:"application/json",
	success: function(json) {
	    parseSolution(json)
	},
	error: function(xhr, status, error){console.log(status + '; ' + error);}
    });
};

function clusterSpot(){
    var url = baseUrl + "cluster";
    var data = {spot:spotL,path:pathL,conf:confD};
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
	contentType:"application/json",
	success: function(json) {
	    parseSolution(json);
	},
	error: function(xhr, status, error) {console.log(status + '; ' + error);}
    });
};

function outsetSpot(){
    var url = baseUrl + "outset";
    var data = {spot:spotL,path:pathL,conf:confD};
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
	contentType:"application/json",
	success: function(json) {
	    parseSolution(json);
	},
	error: function(xhr, status, error) {console.log(status + '; ' + error);}
    });
};

function initPath(){
    var url = baseUrl + "init";
    var data = {spot:spotL,path:pathL,conf:confD};
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
	contentType:"application/json",
	success: function(json) {
	    parseSolution(json);
	},
	error: function(xhr, status, error) {console.log(status + '; ' + error);}
    });
};

function singleStep(){
    var url = baseUrl + "step";
    var data = {spot:spotL,path:pathL,conf:confD};
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
	contentType:"application/json",
	success: function(json) {
	    parseSolution(json);
	},
	error: function(xhr, status, error) {console.log(status + '; ' + error);}
    });
};

function publish_solution(){
    var url = baseUrl + "publish";
    $.get(url).done(function(response){$("#status").html("published");});
}

function start_long_task() {
    div = $('<div class="progress_bar"><div></div><div>sent: 0%</div></div><hr>');
    $('#progress').html("");
    $('#progress').html(div);
    var nanobar = new Nanobar({bg:'#44f',target:div[0].childNodes[0]});
    var url = baseUrl + "longtask";
    var data = {spot:spotL,path:pathL,conf:confD};
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
    	contentType:"application/json",
    	success: function(data, status,request) {
	    job_id = data['job_id'];
	    $("#job_id").val(job_id);
            status_url = request.getResponseHeader('Location');
            update_progress(status_url, nanobar, div[0]);
    	},
    	error: function(xhr, status, error) {console.log(status + '; ' + error);}
    });
}

function update_progress(status_url, nanobar, status_div) {
    $.getJSON(status_url, function(data) {
        var percent = parseInt(data['current'] * 100/ data['total']);
        nanobar.go(percent);
	let statS = data['status'];
	let infoS = percent + '%' + " energy " + Math.round(-data['energy']);
        $(status_div.childNodes[1]).text(statS + ": " + infoS);
	sol = data['result'];
	if (typeof sol !== 'undefined'){parseSolution(sol);}
	console.log(data['state']);
        if(data['state']!='pending' && data['state']!='processing' && data['state']!='setup'){
	    //kill_task();
            if ('result' in data) {
		$(status_div.childNodes[1]).text('Result: ' + Math.round(-data['energy']));
            }
            else {
                $(status_div.childNodes[1]).text('Result: ' + data['state']);
            }
	    console.log('call ended');
        }
        else {
	    if(!update_call){
		$(status_div.childNodes[1]).text('killed');
		update_call = true;
	    }
	    else{
		setTimeout(function() {
                    update_progress(status_url,nanobar,status_div);
		}, 2000);
	    }
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log("error " + textStatus);
        console.log("incoming Text " + jqXHR.responseText);
    });
}

function load_status(){
    div = $('<div class="progress_bar"><div></div><div>0%</div><div>...</div><div>&nbsp;</div></div><hr>');
    job_id = $("#job_id").val();
    $('#progress').html("");
    $('#progress').html(div);
    var nanobar = new Nanobar({bg:'#44f',target:div[0].childNodes[0]});
    var url = baseUrl + "/status/" + job_id;
    status_div = div[0];
    $.getJSON(url, function(data) {
        var percent = parseInt(data['current'] * 100/ data['total']);
        nanobar.go(percent);
        $(status_div.childNodes[1]).text(percent + '%' + " energy " + Math.round(-data['energy']));
        $(status_div.childNodes[2]).text(data['status']);
	sol = data['result'];
	if (typeof sol !== 'undefined'){
	    parseSolution(sol);
	}
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log("error " + textStatus);
        console.log("incoming Text " + jqXHR.responseText);
    });
}

function kill_task(){
    job_id = $("#job_id").val();
    job_id = job_id.substring(5);
    url = baseUrl + "kill/" + job_id;
    $.ajax({url: url
	    ,contentType:"application/json; charset=utf-8;"
	    ,success: function(sol){console.log('job killed');}
	    ,error: function(xhr, status, error) {console.log(status + '; ' + error);}
	   });
    update_call = false;
}

function test_func(){
    var url = baseUrl + "test";
    var spotP = {};
    var pathP = {};
    for(var k in spotL){
	spotP[k] = "";
    }
    var data = {spot:spotL,path:pathL,conf:confD};
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
	contentType:"application/json",
	success: function(json) {
	    parseSolution(json);
	},
	error: function(xhr, status, error) {console.log(status + '; ' + error);}
    });
};



