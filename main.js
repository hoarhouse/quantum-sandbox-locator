window.onload = () => {
  const map = L.map("map").setView([39.8283, -98.5795], 4); // Center of U.S.

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  let markers = [];

  function renderMap(filteredData) {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

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

    const countEl = document.getElementById("sandbox-count");
    if (countEl) {
      countEl.textContent = `${filteredData.length} Quantum Sandboxes Shown`;
    }
  }

  function applyFilters() {
    const funding = document.getElementById("fundingFilter").value;
    const focus = document.getElementById("focusFilter").value;

    const filtered = window.data.filter(site => {
      const matchFunding = funding === "all" || site.funding.includes(funding);
      const matchFocus = focus === "all" || site.focus.includes(focus);
      return matchFunding && matchFocus;
    });

    renderMap(filtered);
  }

  // Reset Button
  document.getElementById("resetFilters").addEventListener("click", () => {
    document.getElementById("fundingFilter").value = "all";
    document.getElementById("focusFilter").value = "all";
    renderMap(window.data);
  });

  // Filter change listeners
  document.getElementById("fundingFilter").addEventListener("change", applyFilters);
  document.getElementById("focusFilter").addEventListener("change", applyFilters);

  // Initial map render
  renderMap(window.data);
};
