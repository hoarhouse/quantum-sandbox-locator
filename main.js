document.addEventListener("DOMContentLoaded", function () {
  const map = L.map('map').setView([39.8283, -98.5795], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const markers = [];
  const data = window.sandboxData;

  function renderMap(filteredData) {
    // Remove existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers.length = 0;

    // Add new filtered markers
    filteredData.forEach(site => {
      const marker = L.marker([site.lat, site.lng]).addTo(map);
      marker.bindPopup(
        `<strong>${site.name}</strong><br/>
         <em>${site.institution}</em><br/>
         Focus: ${site.focus}<br/>
         Funding: ${site.funding}<br/>
         <a href="${site.link}" target="_blank">Learn more</a>`
      );
      markers.push(marker);
    });

    // Update sandbox count
    const countEl = document.getElementById("sandbox-count");
    if (countEl) {
      countEl.textContent = `${filteredData.length} Quantum Sandboxes Shown`;
    }
  }

  // Initial render
  renderMap(data);

  // Filter listeners
  document.getElementById("fundingFilter").addEventListener("change", applyFilters);
  document.getElementById("focusFilter").addEventListener("change", applyFilters);

  function applyFilters() {
    const funding = document.getElementById("fundingFilter").value;
    const focus = document.getElementById("focusFilter").value;

    const filtered = data.filter(site => {
      const matchFunding = funding === "all" || site.funding.includes(funding);
      const matchFocus = focus === "all" || site.focus === focus;
      return matchFunding && matchFocus;
    });

    renderMap(filtered);
  }
});
