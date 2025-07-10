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
    fill: new ol.style.Fill({ color: '#5e72e4' }),
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
popup.className = 'ol-popup';

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
  countEl.textContent = `${count} Quantum Sandboxes`;
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
      <a href="${site.link}" target="_blank">Learn more</a>
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
  const isOpen = sidebar.classList.contains('open');
  sidebar.classList.toggle('open');
  toggleBtn.textContent = isOpen ? "Show Sandbox List" : "Hide Sandbox List";
});

// Update sidebar content
function updateSidebar(sandboxes) {
  const list = document.getElementById("sandboxList");
  list.innerHTML = "";

  if (sandboxes.length === 0) {
    const li = document.createElement("li");
    li.className = "sandbox-item";
    li.innerHTML = "<div class='sandbox-name'>No sandboxes match the current filters.</div>";
    list.appendChild(li);
    return;
  }

  sandboxes.forEach(site => {
    const li = document.createElement("li");
    li.className = "sandbox-item";
    li.innerHTML = `
      <div class="sandbox-name">${site.name}</div>
      <div class="sandbox-institution">${site.institution}</div>
      <div class="sandbox-details">
        <span class="sandbox-tag">${site.focus}</span>
        <span class="sandbox-tag">${site.funding}</span>
      </div>
      <a href="${site.link}" target="_blank" class="sandbox-link">Learn more →</a>
    `;
    list.appendChild(li);
  });
}
