var urls = {
    map: "https://unpkg.com/us-atlas@1/us/10m.json",
    airports:
    "data/nodes.csv",
    flights:
    "data/edges.csv"
};

var scales = {
    airports: d3.scaleSqrt()
	.range([4, 18]),
    segments: d3.scaleLinear()
	.domain([0, hypotenuse])
	.range([1, 10])
};

var tooltip = d3.select("text#tooltip");
console.assert(tooltip.size() === 1);

// d3.json(urls.map).then(drawMap);

let promises = [
    d3.csv(urls.airports, typeAirport),
    d3.csv(urls.flights,  typeFlight)
];
Promise.all(promises).then(processData);

function processData(values) {
    console.assert(values.length === 2);
    let airports = values[0];
    let flights  = values[1];
    console.log("airports: " + airports.length);
    console.log(" flights: " + flights.length);
    let geohash = new Map(airports.map(node => [node.geohash, node]));
    flights.forEach(function(link) {
	link.source = geohash.get(link.origin);
	link.target = geohash.get(link.destination);
	link.source.outgoing += link.count;
	link.target.incoming += link.count;
    });
    // sort airports by outgoing degree
    airports.sort((a, b) => d3.descending(a.outgoing, b.outgoing));
    // keep only the top airports
    airports = airports.slice(0, 50);
    drawAirports(airports);
    drawPolygons(airports);
    goehash = new Map(airports.map(node => [node.geohash, node]));
    // filter out flights that are not between airports we have leftover
    flights = flights.filter(link => geohash.has(link.source.geohash) && geohash.has(link.target.geohash));
    drawFlights(airports, flights);
}

function drawAirports(airports) {
    let extent = d3.extent(airports, d => d.outgoing);
    scales.airports.domain(extent);
    let bubbles = g.airports.selectAll("circle.airport")
	.data(airports, d => d.geohash)
	.enter()
	.append("circle")
	.attr("r",  d => scales.airports(d.outgoing))
	.attr("cx", d => d.x) // calculated on load
	.attr("cy", d => d.y) // calculated on load
	.attr("class", "airport")
	.each(function(d) {
	    d.bubble = this;
	});
}

function drawPolygons(airports) {
    let geojson = airports.map(function(airport) {
	return {
	    type: "Feature",
	    properties: airport,
	    geometry: {
		type: "Point",
		coordinates: [airport.longitude, airport.latitude]
	    }
	};
    });

    // calculate voronoi polygons
    let polygons = d3.geoVoronoi().polygons(geojson);
    console.log(polygons);

    g.voronoi.selectAll("path")
	.data(polygons.features)
	.enter()
	.append("path")
	.attr("d", d3.geoPath(projection))
	.attr("class", "voronoi")
	.on("mouseover", function(d) {
	    let airport = d.properties.site.properties;

	    d3.select(airport.bubble)
		.classed("highlight", true);

	    d3.selectAll(airport.flights)
		.classed("highlight", true)
		.raise();

	    // make tooltip take up space but keep it invisible
	    tooltip.style("display", null);
	    tooltip.style("visibility", "hidden");

	    // set default tooltip positioning
	    tooltip.attr("text-anchor", "middle");
	    tooltip.attr("dy", -scales.airports(airport.outgoing) - 4);
	    tooltip.attr("x", airport.x);
	    tooltip.attr("y", airport.y);

	    // set the tooltip text
	    tooltip.text(airport.name);

	    // double check if the anchor needs to be changed
	    let bbox = tooltip.node().getBBox();

	    if (bbox.x <= 0) {
		tooltip.attr("text-anchor", "start");
	    }
	    else if (bbox.x + bbox.width >= width) {
		tooltip.attr("text-anchor", "end");
	    }

	    tooltip.style("visibility", "visible");
	})
	.on("mouseout", function(d) {
	    let airport = d.properties.site.properties;

	    d3.select(airport.bubble)
		.classed("highlight", false);

	    d3.selectAll(airport.flights)
		.classed("highlight", false);

	    d3.select("text#tooltip").style("visibility", "hidden");
	})
	.on("dblclick", function(d) {
	    // toggle voronoi outline
	    let toggle = d3.select(this).classed("highlight");
	    d3.select(this).classed("highlight", !toggle);
	});
}

function drawFlights(airports, flights) {
    let bundle = generateSegments(airports, flights);
    let line = d3.line()
	.curve(d3.curveBundle)
	.x(airport => airport.x)
	.y(airport => airport.y);
    let links = g.flights.selectAll("path.flight")
	.data(bundle.paths)
	.enter()
	.append("path")
	.attr("d", line)
	.attr("class", "flight")
	.each(function(d) {
	    d[0].flights.push(this);
	});
    let layout = d3.forceSimulation()
	.alphaDecay(0.1)
	.force("charge", d3.forceManyBody()
	       .strength(10)
	       .distanceMax(scales.airports.range()[1] * 2)
	      )
	.force("link", d3.forceLink()
	       .strength(0.7)
	       .distance(0)
	      )
	.on("tick", function(d) {
	    links.attr("d", line);
	})
	.on("end", function(d) {
	    console.log("layout complete");
	});
    layout.nodes(bundle.nodes).force("link").links(bundle.links);
}
function generateSegments(nodes, links) {
    let bundle = {nodes: [], links: [], paths: []};
    bundle.nodes = nodes.map(function(d, i) {
	d.fx = d.x;
	d.fy = d.y;
	return d;
    });
    links.forEach(function(d, i) {
	let length = distance(d.source, d.target);
	let total = Math.round(scales.segments(length));
	let xscale = d3.scaleLinear()
	    .domain([0, total + 1]) // source, inner nodes, target
	    .range([d.source.x, d.target.x]);
	let yscale = d3.scaleLinear()
	    .domain([0, total + 1])
	    .range([d.source.y, d.target.y]);
	let source = d.source;
	let target = null;
	let local = [source];
	for (let j = 1; j <= total; j++) {
	    target = {
		x: xscale(j),
		y: yscale(j)
	    };
	    local.push(target);
	    bundle.nodes.push(target);
	    bundle.links.push({
		source: source,
		target: target
	    });
	    source = target;
	}
	local.push(d.target);
	bundle.links.push({
	    source: target,
	    target: d.target
	});
	bundle.paths.push(local);
    });
    return bundle;
}

function typeAirport(airport) {
    airport.longitude = parseFloat(airport.x);
    airport.latitude  = parseFloat(airport.y);
    airport.state = "MA"
    let coords = projection([airport.longitude, airport.latitude]);
    airport.x = coords[0];
    airport.y = coords[1];
    airport.outgoing = 0;  // eventually tracks number of outgoing flights
    airport.incoming = 0;  // eventually tracks number of incoming flights
    airport.flights = [];  // eventually tracks outgoing flights
    return airport;
}
function typeFlight(flight) {
    flight.count = parseInt(flight.weight*10);
    return flight;
}
function distance(source, target) {
    var dx2 = Math.pow(target.x - source.x, 2);
    var dy2 = Math.pow(target.y - source.y, 2);
    return Math.sqrt(dx2 + dy2);
}
