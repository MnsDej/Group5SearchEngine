async function search() {
    // Read the user input from the term field in the form searchForm
    let searchTerm = document.forms.searchForm.term.value;
    // Empty the input field
    document.forms.searchForm.term.value = '';
    // Read the JSON
    let rawData = await fetch('/api/PDF/' + searchTerm);
    // Convert JSON to a JavaScript data structure
    let pdf = await rawData.json();
    // Create a variable named html that initially is an empty string
    let html = `
      <p>You searched for "${searchTerm}"...</p>
      <p>Found ${pdf.length} results.</p>
    `;
    // Loop through the pdf
    for (let data of pdf) {
        if (data.fileName && data.metadata && data.metadata.info) {

      html += `
        <section>
          <h2>${data.fileName}</h2>
          <p><b>Author:</b> ${data.info.Author}</p>
          <p><b>Creator:</b> ${data.info.Creator}</p>
          <embed src="pdfs/${data.meta}">
        </section>
      `;
    }
}
    // Grab the element/tag with the class searchResults
    let searchResultsElement = document.querySelector('.searchResults');
    // Change the content of the searchResults element
    searchResultsElement.innerHTML = html;
  }
  