var map = L.map('map', {attributionControl: false}).setView([37.8, -96], 5),
	grades = [-1134, -400, -50, 1, 2500, 4000, 5500, 9514],
	colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A', '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0'];
// data range: -1134 - 9514

var positiveColorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 9514])
var negativeColorScale = d3.scaleSequential(d3.interpolateReds).domain([0, -1134])

L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
    id: 'stamen-toner',
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>. Employment data &copy; <a href="https://www.bls.gov/oes/home.htm">Bureau of Labor Statistics</a>'
}).addTo(map);

L.control.attribution({position: 'topright'}).addTo(map);

// map control that shows MSA info on hover
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

legend.update = function (props) {
	this._div.innerHTML = '<h4 class="display-4">Tech Job Growth <small class="text-muted">(3-year avg.)</small></h4>' +  (props ?
		'<div class="lead"><b>' + props.NAME + '</b><br /><b>' + props.growth + '</b> positions ' + ((props.growth >= 0) ? 'added' : 'lost') + '</div>'
		: '<div class="lead">Hover over an MSA for info<br />&nbsp</div>');
};

legend.addTo(map);

// get color depending on employment growth
function getColor(d) {
	return d >= 0 ? positiveColorScale(d) : negativeColorScale(d)
}

function style(feature) {
	return {
		weight: 1,
		opacity: 1,
		color: 'gray',
		dashArray: '',
		fillOpacity: 0.7,
		fillColor: getColor(feature.properties.growth)
	};
}

function setLegendInfo(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 3,
		color: 'white',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	legend.update(layer.feature.properties);
}

var geojson;

function resetLegendInfo(e) {
	geojson.resetStyle(e.target);
	legend.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: setLegendInfo,
		mouseout: resetLegendInfo,
		click: zoomToFeature
	});
}

geojson = L.geoJson(msaData, {
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);


// color scale control for choropleth
var scale = L.control({position: 'bottomright'});

scale.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'info legend'),
		labels = [],
		from, to;

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push('<i style="background:' + getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

scale.addTo(map);