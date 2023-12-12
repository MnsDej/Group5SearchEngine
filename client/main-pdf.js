async function search() {
  let searchTerm = document.forms.searchForm.term.value;
  let searchType = document.forms.searchForm.searchType.value;
  console.log(searchType);
  document.forms.searchForm.term.value = '';
  let rawData = await fetch(`/api/PDF/${searchTerm}/${searchType}`);
  let datas = await rawData.json();
  let html = `
    <p>You searched for "${searchTerm}"...</p>
    <p>Found ${datas.length} results.</p>
  `;
  for (let PDF of datas) {
      let meta = PDF.pdf_metadata.info
        html += `
            <section>
                <h2>${meta.Title}</h2>
                <p><b>Author:</b> ${meta.Author}</p>
                <p><b>Creator:</b> ${meta.Creator}</p>
              <p>  
                <embed src="PDF/${PDF.fileName}">
              </p>
            </section>
        `;
    }
  let searchResultsElement = document.querySelector('.searchResults');
  searchResultsElement.innerHTML = html;
}
