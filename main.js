// Setup OpenLayers map
const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({ source: new ol.source.OSM() })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-98.5795, 39.8283]),
    zoom: 4
  })
});

// Style for markers
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

// Create popup
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

// Filter + render logic
function applyFilters() {
  const fundingFilter = document.getElementById("fundingFilter").value;
  const focusFilter = document.getElementById("focusFilter").value;

  const filtered = window.sandboxData.filter(site => {
    const fundingMatch = fundingFilter === "all" || site.funding === fundingFilter;
    const focusMatch = focusFilter === "all" || site.focus === focusFilter;
    return fundingMatch && focusMatch;
  });

  renderMarkers(filtered);
  updateCount(filtered.length);
}

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
  updateSidebar(sandboxes);

}

function updateCount(count) {
  const countEl = document.getElementById("sandbox-count");
  countEl.textContent = `${count} Quantum Sandboxes Shown`;
}

// Reset button logic
document.getElementById("resetFilters").addEventListener("click", () => {
  document.getElementById("fundingFilter").value = "all";
  document.getElementById("focusFilter").value = "all";
  applyFilters();
});

// Listen to filter dropdowns
document.getElementById("fundingFilter").addEventListener("change", applyFilters);
document.getElementById("focusFilter").addEventListener("change", applyFilters);

// Initial render
renderMarkers(window.sandboxData);
updateCount(window.sandboxData.length);

// Popup handler
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
    overlay.setPosition(undefined);
  }
});
// Toggle sidebar
const sidebar = document.getElementById("sandboxListPanel");
const toggleBtn = document.getElementById("toggleSidebar");

toggleBtn.addEventListener("click", () => {
  const isOpen = sidebar.style.transform === "translateX(0%)";
  sidebar.style.transform = isOpen ? "translateX(100%)" : "translateX(0%)";
  sidebar.style.display = "block";
  toggleBtn.textContent = isOpen ? "Show Sandbox List" : "Hide Sandbox List";
});

// Update sidebar content
function updateSidebar(sandboxes) {
  const list = document.getElementById("sandboxList");
  list.innerHTML = "";

  if (sandboxes.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No sandboxes match the current filters.";
    list.appendChild(li);
    return;
  }

  sandboxes.forEach(site => {
    const li = document.createElement("li");
    li.style.marginBottom = "1rem";
    li.innerHTML = `
      <strong>${site.name}</strong><br/>
      <em style="font-size: 0.9rem;">${site.institution}</em><br/>
      <span style="font-size: 0.85rem;">Focus: ${site.focus}</span><br/>
      <span style="font-size: 0.85rem;">Funding: ${site.funding}</span><br/>
      <a href="${site.link}" target="_blank" style="color: #93c5fd;">Learn more</a>
    `;
    list.appendChild(li);
  });
}
