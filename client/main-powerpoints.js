async function search() {
  let searchTerm = document.forms.searchForm.term.value;
  let searchType = document.forms.searchForm.searchType.value;
  console.log(searchType);
  document.forms.searchForm.term.value = '';
  let rawData = await fetch('/api/powerpoint/' + searchTerm + '/' + searchType);
  let powerpoints = await rawData.json();
  let html = `
    <p>You searched for "${searchTerm}"...</p>
    <p>You found ${powerpoints.length} results.</p>
  `;
  for (let PowerPoint of powerpoints) {
    let meta = PowerPoint.PowerPoint_metadata;
    html += `
      <section>
        <h2>${meta.title}</h2>
        <p><b>Company Name:</b> ${meta.company}</p>
        <p><b>Creation Date:</b> ${meta.creation_date.split('T')[0]}</p> 
        <a href="powerpoints/${PowerPoint.PowerPoint_fileName}" target="_blank">Download the PowerPoint here...</a>
      </section>
    `;
  }
  let searchResultsElement = document.querySelector('.searchResults');
  searchResultsElement.innerHTML = html;
}