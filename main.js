// Initialize map centered on USA
const map = L.map('map').setView([39.8283, -98.5795], 4);

// Add base tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Loop through sandbox data and add markers
sandboxData.forEach(site => {
  const marker = L.marker([site.lat, site.lng]).addTo(map);
  marker.bindPopup(
    `<strong>${site.name}</strong><br/>
     <em>${site.institution}</em><br/>
     Focus: ${site.focus}<br/>
     Funding: ${site.funding}<br/>
     <a href="${site.link}" target="_blank">Learn more</a>`
  );
});

// ✅ Show number of sandboxes displayed
document.getElementById("sandbox-count").textContent =
  `${sandboxData.length} Quantum Sandboxes Shown`;
