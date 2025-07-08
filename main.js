document.addEventListener("DOMContentLoaded", function () {
  const map = L.map('map').setView([39.8283, -98.5795], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const markers = [];
  const data = window.sandboxData;
  let currentVisibleSandboxes = [];

  function renderMap(filteredData) {
    markers.forEach(marker => map.removeLayer(marker));
    markers.length = 0;

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

  // Initial map render (show everything)
  renderMap(data);

  // Filter listeners
  document.getElementById("fundingFilter").addEventListener("change", applyFilters);
  document.getElementById("focusFilter").addEventListener("change", applyFilters);

  // Reset button logic
  document.getElementById("resetFilters").addEventListener("click", () => {
    document.getElementById("fundingFilter").value = "all";
    document.getElementById("focusFilter").value = "all";
    renderMap(data);
    updateSidebar(data);
  });

  // Toggle sidebar list
  document.getElementById("toggleList").addEventListener("click", () => {
    const panel = document.getElementById("sandboxListPanel");
    if (panel.style.display === "none") {
      panel.style.display = "block";
      updateSidebar(currentVisibleSandboxes);
    } else {
      panel.style.display = "none";
    }
  });

  function updateSidebar(sandboxes) {
    currentVisibleSandboxes = sandboxes;
    const list = document.getElementById("sandboxList");
    list.innerHTML = "";
    sandboxes.forEach(site => {
      const li = document.createElement("li");
      li.style.marginBottom = "1rem";
      li.innerHTML = `
        <strong>${site.name}</strong><br/>
        <em>${site.institution}</em><br/>
        <a href="${site.link}" target="_blank" style="color:#60a5fa;">Learn more</a>
      `;
      list.appendChild(li);
    });
  }
});
// Close sidebar with ❌ button
document.getElementById("closeSidebar").addEventListener("click", () => {
  document.getElementById("sandboxListPanel").style.display = "none";
});

