async function search() {
  let searchTerm = document.forms.searchForm.term.value;
  let searchType = document.forms.searchForm.searchType.value;
  console.log(searchType);
    document.forms.searchForm.term.value = '';

    let allData = await fetch('/api/photos/' + searchTerm + '/' + searchType);

    let photos = await allData.json();
   
    let html = `
    <p>You searched for "${searchTerm}"...</p>
    <p>Found ${photos.length} photos.</p>
  `;


    for(let photo of photos) {
      let meta = photo.Photo_metadata;
      html += `
        <section>
        <h2>${meta.Make}</h2>
        <img src="photos/${photo.Photo_filename}">
        <p>${meta.Make}</p>

        </section>
    
`;

}
let searchResultsElement = document.querySelector('.searchResults');
searchResultsElement.innerHTML = html;
}