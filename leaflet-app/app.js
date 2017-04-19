var map = L.map('map').setView([37.8, -96], 5),
	grades = [0, 10, 20, 50, 100, 200, 500, 1000];

L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
    id: 'mapbox.light'
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
	// d range: -1134 - 9514
	var colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A', '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0'];
	for (var i = grades.length - 1; i >= 0; i--) {
		if (d > grades[i]) return colors[colors.length - 1 - i];
	}

	return colors[colors.length - 1];

	/*
	return d > 1000 ? '#800026' :
			d > 500 ? '#BD0026' :
			d > 200 ? '#E31A1C' :
			d > 100 ? '#FC4E2A' :
			d > 50  ? '#FD8D3C' :
			d > 20  ? '#FEB24C' :
			d > 10  ? '#FED976' :
					  '#FFEDA0';
					  */
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

map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');

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