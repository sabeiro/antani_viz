var margin = {top: 10, right: 10, bottom: 20, left: 30},
    width = 260 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
var data_bar = [];

function initD3(){
    var n_agent = Object.keys(pathL).length;
    data_bar = [];
    var tx = [], ty = [];
    var i = 0;
    var distance = 0., score = 0., energy = 0.;
    var max_distance = 0., max_score = 0., max_energy = 0., max_completion = 1.;
    var sum_distance = 0., sum_score = 0., sum_completion = 0., sum_energy = 0.;
    var agentS = 'agent) ';
    for(var a in pathL){
	if(a == 0){continue;}
	distance = pathL[a]['distance'];
	completion = pathL[a]['completion'];
	energy = -pathL[a]['energy'];
	agentS = agentS+"["+a+"]"+pathL[a]['load']+"/"+pathL[a]['capacity']+"-"+parseInt(-pathL[a]['energy'])+" ";
	max_distance = Math.max(max_distance,distance);
	score = completion/distance;
	if(!isFinite(score)){score = 0.;}
	max_score = Math.max(max_score,score);
	max_energy = Math.max(max_energy,energy);
	max_completion = Math.max(max_completion,completion);
	sum_score += score;
	sum_distance += distance;
	sum_completion += completion;
	data_bar.push({"agent":pathL[a]['agent']
		       ,"x":i++
		       ,"completion":completion
		       ,"distance":distance
		       ,"color":pathL[a]['color']
		       ,"score":score
		       ,"energy":energy
		      });
    }
    $("#agent_info").text(agentS);

    $('#status').text(parseInt(sum_completion*10.)+"% dist:"+parseInt(sum_distance*10)+" score:"+parseInt(max_score*10));
    
    var xScale = d3.scaleBand().range([0,width]).domain(d3.range(n_agent-1)).padding(0.2);

    var yScale = d3.scaleLinear()
	.domain([0, 1])
	.range([ height, 0]);

    $("#completion_bar").html('completion');
    var svg = d3.select("#completion_bar")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(xScale))
	.selectAll("text")
	.attr("transform", "translate(-10,0)rotate(-45)")
	.style("text-anchor", "end");

    svg.append("g")
	.call(d3.axisLeft(yScale));
    
    svg.selectAll("mybar")
	.data(data_bar,function(d) { return d; })
	.enter()
	.append("rect")
	.attr("x", function(d) { return xScale(d.x); })
	.attr("y", function(d) { return yScale(d.completion); })
	.attr("width", xScale.bandwidth())
	.attr("height", function(d) { return height - yScale(d.completion); })
	.attr("fill", function(d) { return d.color; })

    svg.selectAll(".text")
    	.data(data_bar,function(d) { return d; })
    	.enter()
    	.append("text")
    	.attr("class","label")
    	.attr("x", function(d) { return xScale(d.x); })
    	.attr("y", function(d) { return yScale(0) + 1; })
    	.attr("dy", "-.75em")
    	.attr("dx", ".3em")
    	.text(function(d) { return d.agent; });   	  
    
    $("#duration_bar").html('length');
    yScale = d3.scaleLinear()
	.domain([0, max_distance])
	.range([ height, 0]);

    var svg = d3.select("#duration_bar")
    	.append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")
    	.attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
    	.attr("transform", "translate(0," + height + ")")
    	.call(d3.axisBottom(xScale))
    	.selectAll("text")
    	.attr("transform", "translate(-10,0)rotate(-45)")
    	.style("text-anchor", "end");

    svg.append("g")
    	.call(d3.axisLeft(yScale));
    
    svg.selectAll("mybar")
    	.data(data_bar,function(d) { return d; })
    	.enter()
    	.append("rect")
    	.attr("x", function(d) { return xScale(d.x); })
    	.attr("y", function(d) { return yScale(d.distance); })
    	.attr("width", xScale.bandwidth())
    	.attr("height", function(d) { return height - yScale(d.distance); })
    	.attr("fill", function(d) { return d.color; })
    
    yScale  = d3.scaleLinear()
	.domain([0,max_score])
	.range([height,0]);

    $("#energy_bar").html('energy');
    yScale = d3.scaleLinear()
	.domain([0, max_energy])
	.range([ height, 0]);

    var svg = d3.select("#energy_bar")
    	.append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")
    	.attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
    	.attr("transform", "translate(0," + height + ")")
    	.call(d3.axisBottom(xScale))
    	.selectAll("text")
    	.attr("transform", "translate(-10,0)rotate(-45)")
    	.style("text-anchor", "end");

    svg.append("g")
    	.call(d3.axisLeft(yScale));
    
    svg.selectAll("mybar")
    	.data(data_bar,function(d) { return d; })
    	.enter()
    	.append("rect")
    	.attr("x", function(d) { return xScale(d.x); })
    	.attr("y", function(d) { return yScale(d.energy); })
    	.attr("width", xScale.bandwidth())
    	.attr("height", function(d) { return height - yScale(d.energy); })
    	.attr("fill", function(d) { return d.color; })
    
    yScale  = d3.scaleLinear()
	.domain([0,max_score])
	.range([height,0]);

    $("#score_bar").html('score');
    
    var svg = d3.select("#score_bar")
    	.append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")
    	.attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
    	.attr("transform", "translate(0," + height + ")")
    	.call(d3.axisBottom(xScale))
    	.selectAll("text")
    	.attr("transform", "translate(-10,0)rotate(-45)")
    	.style("text-anchor", "end");

    svg.append("g")
    	.call(d3.axisLeft(yScale));
    
    svg.selectAll("mybar")
    	.data(data_bar,function(d) { return d; })
    	.enter()
    	.append("rect")
    	.attr("x", function(d) { return xScale(d.x); })
    	.attr("y", function(d) { return yScale(d.score); })
    	.attr("width", xScale.bandwidth())
    	.attr("height", function(d) { return height - yScale(d.score); })
    	.attr("fill", function(d) { return d.color; })

};
    
