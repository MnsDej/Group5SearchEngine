async function search() {
  let searchTerm = document.forms.searchForm.term.value;
  let searchType = document.forms.searchForm.searchType.value;
  console.log(searchType);
  document.forms.searchForm.term.value = '';
  let allData = await fetch('/api/PDF/' + searchTerm + '/' + searchType);
  let datas = await allData.json();
  let html = `
    <p>You searched for "${searchTerm}"...</p>
    <p>Found ${datas.length} results.</p>
  `;
  for (let PDF of datas) {
      let meta = PDF.pdf_metadata.info;
        html += `
            <section>
                <h2>${meta.Title}</h2>
                <p><b>Author:</b> ${meta.Author}</p>
                <p><b>Creator:</b> ${meta.Creator}</p>
              <p>  
                  <embed src="PDF/${PDF.pdf_fileName}" class="pdfView"><br>
                  <a href="PDF/${PDF.pdf_fileName}" target="_blank">View the pdf...</a>
              </p>
            </section>
        `;
    }
  let searchResultsElement = document.querySelector('.searchResults');
  searchResultsElement.innerHTML = html;
}
