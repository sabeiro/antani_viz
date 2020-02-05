var back_url = baseUrl + "/solution";
function ajaxp(url,data){
    $.ajax({
	url: url
	,data: data
	,dataType:'jsonp'
	,contentType:"application/json; charset=utf-8;"
    	,async:false,crossDomain:true
	,success: function(response) {console.log('callback success');}
	,error: function(xhr, status, error) {console.log(status + '; ' + error);}
    });
}

window.jsonpCallback = function(response) {console.log('callback success');};

$(document).ready(function() {
    $("#submit").click(function(){
	var url = baseUrl + "process";
	var data = {spot:spotL,path:pathL,conf:confD};
	console.log("ciccia");
	$.ajax({
            data:JSON.stringify(data),
            type:'POST',
	    contentType:"application/json",
            url:url
	}).done(function(data) {
	    $('#solution').text(data.output).show();
	    console.log(data);
	});
	//event.preventDefault();
	// $.ajax({
	// 	type: "POST",
	// 	url: "/process",
	// 	data: data,
	// 	cache: false,
	// 	success: function(result){
	// 	    $("#solution").text(result);
	// 	}
	// });
    });
});
