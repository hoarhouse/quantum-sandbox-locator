let map = L.map("map").setView([39.5, -98.35], 4);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

let markers = [];

// Render map with filtered data
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

  updateSidebar(filteredData);
}

// Filter logic
function applyFilters() {
  const funding = document.getElementById("fundingFilter").value;
  const focus = document.getElementById("focusFilter").value;

  let filtered = window.data;

  if (funding !== "all") {
    filtered = filtered.filter(item => item.funding.includes(funding));
  }

  if (focus !== "all") {
    filtered = filtered.filter(item => item.focus.includes(focus));
  }

  renderMap(filtered);
}

// Update sidebar list
function updateSidebar(sites) {
  const list = document.getElementById("sandboxList");
  list.innerHTML = "";

  sites.forEach(site => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${site.name}</strong><br/>
      <small>${site.institution}</small><br/>
      <a href="${site.link}" target="_blank" style="color: #60a5fa;">Visit</a>
      <hr style="border-color: #334155;" />
    `;
    list.appendChild(li);
  });
}

// Reset button logic
document.getElementById("resetFilters").addEventListener("click", () => {
  document.getElementById("fundingFilter").value = "all";
  document.getElementById("focusFilter").value = "all";
  renderMap(window.data);
});

// Filter event listeners
document.getElementById("fundingFilter").addEventListener("change", applyFilters);
document.getElementById("focusFilter").addEventListener("change", applyFilters);

// Sidebar toggle
document.getElementById("toggleList").addEventListener("click", () => {
  const panel = document.getElementById("sandboxListPanel");
  panel.style.display = "block";
  setTimeout(() => {
    panel.style.transform = "translateX(0%)";
  }, 10);
});

// Close sidebar
document.getElementById("closeSidebar").addEventListener("click", () => {
  const panel = document.getElementById("sandboxListPanel");
  panel.style.transform = "translateX(100%)";
  setTimeout(() => {
    panel.style.display = "none";
  }, 300);
});

// INITIALIZE
renderMap(window.data);
