const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-98.5795, 39.8283]),
    zoom: 4
  })
});

const markersLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
});
map.addLayer(markersLayer);

function renderMarkers(sandboxes) {
  const features = sandboxes.map(site => {
    const feature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([site.lng, site.lat])),
      name: site.name,
      site
    });
    return feature;
  });

  markersLayer.getSource().clear();
  markersLayer.getSource().addFeatures(features);

  const element = document.createElement('div');
  element.className = 'ol-popup';

  const popup = new ol.Overlay({
    element,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -10],
  });

  map.addOverlay(popup);

  map.on('click', function (event) {
    popup.setPosition(undefined);
    map.forEachFeatureAtPixel(event.pixel, function (feature) {
      const site = feature.get('site');
      const html = `
        <strong>${site.name}</strong><br/>
        <em>${site.institution}</em><br/>
        Focus: ${site.focus}<br/>
        Funding: ${site.funding}<br/>
        <a href="${site.link}" target="_blank" style="color: #93c5fd;">Learn more</a>
      `;
      element.innerHTML = html;
      popup.setPosition(feature.getGeometry().getCoordinates());
    });
  });
}

renderMarkers(window.sandboxData);
