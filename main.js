document.addEventListener("DOMContentLoaded", function () {
  const data = window.sandboxData;

  const map = L.map('map').setView([39.8283, -98.5795], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  data.forEach(site => {
    const marker = L.marker([site.lat, site.lng]).addTo(map);
    marker.bindPopup(
      `<strong>${site.name}</strong><br/>
       <em>${site.institution}</em><br/>
       Focus: ${site.focus}<br/>
       Funding: ${site.funding}<br/>
       <a href="${site.link}" target="_blank">Learn more</a>`
    );
  });

  // Set the visible count
  document.getElementById("sandbox-count").textContent =
    `${data.length} Quantum Sandboxes Shown`;
});
