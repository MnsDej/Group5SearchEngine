async function search() {
    let searchTerm = document.forms.searchForm.term.value;
    let searchType = document.forms.searchForm.searchType.value;
    console.log(searchType);
    document.forms.searchForm.term.value = '';
    let rawData = await fetch('/api/PowerPoint/' + searchTerm + '/' + searchType);
    let powerpoints = await rawData.json();
    let html = `
      <p>You search for "${searchTerm}"...</p>
      <p>You found ${powerpoints.length} results.</p>
    `;
    for (let PowerPoint of powerpoints) {
      let meta = PowerPoint.metadata;
      html += `
        <section>
          <h2>${meta.title}</h2>
          <p><b>company:</b> ${meta.company}</p>
          <p><b>Document:</b> ${meta.urlkey}</p> 
          <p><embed src="powerpoints/${powerpoints.fileName}" width='60%' height='150px' frameborder='0'></p>
        </section>
      `;
    }
    let searchResultsElement = document.querySelector('.searchResults');
    searchResultsElement.innerHTML = html;
  }