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
      html += `
        <section>
        <img src="photos/${photo.Photo_filename}">
        <a href="https://maps.google.com/?q=${photo.Photo_metadata.latitude},${photo.Photo_metadata.longitude}" target="_blank"><img src="photos/${photo.Photo_filename}"></a>
        </section>
    
`;

}
let searchResultsElement = document.querySelector('.searchResults');
searchResultsElement.innerHTML = html;
}