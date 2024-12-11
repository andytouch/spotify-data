document.getElementById('processButton').addEventListener('click', processJson);

function processJson() {
  const fileInput = document.getElementById('jsonFileInput');
  const resultsDiv = document.getElementById('results');
  const filterOption = document.getElementById('filterOption').value;
  const showOption = document.getElementById('showOption').value;
  resultsDiv.innerHTML = '';

  if (!fileInput.files.length) {
    resultsDiv.innerHTML = '<p class="text-danger">Please select a JSON file.</p>';
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);

      // Parse date and group by year or month based on filter
      const groupedData = data.reduce((acc, item) => {
        const artist = item.master_metadata_album_artist_name;
        const date = new Date(item.ts);

        if (!artist || isNaN(date)) return acc;

        const key = filterOption === 'year'
            ? date.getFullYear()
            : `${date.getFullYear()} - ${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!acc[key]) acc[key] = {};
        acc[key][artist] = (acc[key][artist] || 0) + 1;

        return acc;
      }, {});

      // Generate result HTML
      const resultHtml = Object.entries(groupedData)
          .map(([timePeriod, artistCounts]) => {
            const sortedArtists = Object.entries(artistCounts)
                .sort(([, countA], [, countB]) => countB - countA);

            const filteredArtists = showOption === 'top10'
                ? sortedArtists.slice(0, 10)
                : sortedArtists;

            const artistHtml = filteredArtists
                .map(([artist, count]) => `<p>${artist}: ${count}</p>`)
                .join('');

            return `<h4>${timePeriod}</h4>${artistHtml}`;
          })
          .join('');

      resultsDiv.innerHTML = `<h3>Artist Counts (Grouped by ${filterOption === 'year' ? 'Year' : 'Month'}):</h3>${resultHtml}`;
    } catch (error) {
      resultsDiv.innerHTML = '<p class="text-danger">Error parsing JSON file. Please check the format.</p>';
    }
  };

  reader.readAsText(file);
}

// Add dropdowns for filter options
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('body');
  const processButton = document.getElementById('processButton');

  // Filter by Year/Month dropdown
  const filterDropdown = document.createElement('div');
  filterDropdown.innerHTML = `
    <div class="mb-3">
      <label for="filterOption" class="form-label">Filter By:</label>
      <select id="filterOption" class="form-select">
        <option value="year">Whole Year</option>
        <option value="month">By Month</option>
      </select>
    </div>
  `;
  processButton.parentNode.insertBefore(filterDropdown, processButton.nextSibling);

  // Show Top 10/All dropdown
  const showDropdown = document.createElement('div');
  showDropdown.innerHTML = `
    <div class="mb-3">
      <label for="showOption" class="form-label">Show:</label>
      <select id="showOption" class="form-select">
        <option value="top10">Top 10</option>
        <option value="all">Show All</option>
      </select>
    </div>
  `;
  filterDropdown.parentNode.insertBefore(showDropdown, filterDropdown.nextSibling);

  // Add event listeners to refresh data when filter changes
  document.getElementById('filterOption').addEventListener('change', () => {
    if (document.getElementById('jsonFileInput').files.length > 0) {
      processJson();
    }
  });

  document.getElementById('showOption').addEventListener('change', () => {
    if (document.getElementById('jsonFileInput').files.length > 0) {
      processJson();
    }
  });
});