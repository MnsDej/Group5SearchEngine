async function search() {
  let searchTerm = document.forms.searchForm.term.value;
  let searchType = document.forms.searchForm.searchType.value;
  console.log(searchType);
  document.forms.searchForm.term.value = '';
  let rawData = await fetch('/api/powerpoint/' + searchTerm + '/' + searchType);
  let powerpoints = await rawData.json();
  let html = `
    <p>You search for "${searchTerm}"...</p>
    <p>You found ${powerpoints.length} results.</p>
  `;
  for (let PowerPoint of powerpoints) {
    let meta = PowerPoint.PowerPoint_metadata;
    html += `
      <section>
        <h2>${meta.title}</h2>
        <p><b>Company:</b> ${meta.company}</p>
<<<<<<< HEAD
=======
        <p><b>Document:</b> ${meta.urlkey}</p> 
>>>>>>> 92a71709766516be474c0fda68bf921139aa90c6
        <a href="powerpoints/${PowerPoint.PowerPoint_fileName}" target="_blank">View the powerpoint...</a>
      </section>
    `;
  }
  let searchResultsElement = document.querySelector('.searchResults');
  searchResultsElement.innerHTML = html;
}