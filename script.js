document.getElementById('processButton').addEventListener('click', () => {
  const fileInput = document.getElementById('jsonFileInput');
  const resultsDiv = document.getElementById('results');
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

      // Example: Count artist occurrences
      const artistCounts = data.reduce((acc, item) => {
        const artist = item.master_metadata_album_artist_name;
        if (artist) acc[artist] = (acc[artist] || 0) + 1;
        return acc;
      }, {});

      // Display results
      const resultHtml = Object.entries(artistCounts)
        .map(([artist, count]) => `<p>${artist}: ${count}</p>`)
        .join('');
      resultsDiv.innerHTML = `<h3>Artist Counts:</h3>${resultHtml}`;
    } catch (error) {
      resultsDiv.innerHTML = '<p class="text-danger">Error parsing JSON file. Please check the format.</p>';
    }
  };

  reader.readAsText(file);
});