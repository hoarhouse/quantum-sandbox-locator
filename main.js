// Setup the map
const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-98.5795, 39.8283]), // Center of USA
    zoom: 4
  })
});

// Style for larger, colored markers
const markerStyle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 8,
    fill: new ol.style.Fill({ color: '#3b82f6' }),
    stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
  })
});

const markersLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: markerStyle
});
map.addLayer(markersLayer);

// Render pins
function renderMarkers(sandboxes) {
  const features = sandboxes.map(site => {
    const feature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([site.lng, site.lat])),
      site: site
    });
    return feature;
  });

  markersLayer.getSource().clear();
  markersLayer.getSource().addFeatures(features);
}

renderMarkers(window.sandboxData);

// Create a popup overlay
const popup = document.createElement('div');
popup.id = 'popup';
popup.style.background = '#1e293b';
popup.style.color = '#f1f5f9';
popup.style.padding = '0.75rem';
popup.style.borderRadius = '8px';
popup.style.fontSize = '14px';
popup.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
popup.style.position = 'absolute';
popup.style.bottom = '12px';
popup.style.left = '-50px';
popup.style.minWidth = '220px';

const overlay = new ol.Overlay({
  element: popup,
  positioning: 'bottom-center',
  offset: [0, -15],
  stopEvent: false
});

map.addOverlay(overlay);

// Show popup on click
map.on('click', function (event) {
  const feature = map.forEachFeatureAtPixel(event.pixel, f => f);
  if (feature && feature.get('site')) {
    const site = feature.get('site');
    popup.innerHTML = `
      <strong>${site.name}</strong><br/>
      <em>${site.institution}</em><br/>
      Focus: ${site.focus}<br/>
      Funding: ${site.funding}<br/>
      <a href="${site.link}" target="_blank" style="color: #93c5fd;">Learn more</a>
    `;
    overlay.setPosition(feature.getGeometry().getCoordinates());
  } else {
    overlay.setPosition(undefined); // Hide popup
  }
});
