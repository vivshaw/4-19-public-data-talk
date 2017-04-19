var map = L.map('map').setView([37.8, -96], 5),
	grades = [0, 10, 20, 50, 100, 200, 500, 1000],
	colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A', '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0'];
// data range: -1134 - 9514

L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
    id: 'stamen-toner',
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>. Employment data data &copy; <a href="https://www.bls.gov/oes/home.htm">Bureau of Labor Statistics</a>'
}).addTo(map);

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	this._div.innerHTML = '<h4>US Tech Industry Growth</h4>' +  (props ?
		'<b>' + props.NAME + '</b><br />' + props.growth + ' % / yr'
		: 'Hover over a state');
};

info.addTo(map);

// get color depending on employment growth
function getColor(d) {
	for (var i = grades.length - 1; i >= 0; i--) {
		if (d > grades[i]) return colors[colors.length - 1 - i];
	}

	return colors[colors.length - 1];
}

function style(feature) {
	return {
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7,
		fillColor: getColor(feature.properties.growth)
	};
}

function legendInfo(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
}

var geojson;

function resetLegendInfo(e) {
	geojson.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: legendInfo,
		mouseout: resetLegendInfo,
		click: zoomToFeature
	});
}

geojson = L.geoJson(msaData, {
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);

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