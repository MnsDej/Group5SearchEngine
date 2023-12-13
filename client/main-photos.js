async function search () {

    let searchterm = document.forms.searchform.term.value;
    let searchType = document.forms.searchForm.searchType.value;
    console.log(searchType);
    document.forms.searchForm.term.value = '';

    let rawData = await fetch('/api/photos/'+ searchTerm + '/' + searchType);

    let photos = await rawData.json();
   
    let html = `
    <p>You searched for "${searchTerm}"...</p>
    <p>Found ${photos.description} photos.</p>
  `;

    


    for(let photo of photos) {
      let meta = photos.Photo_metadata.ISO
      html += `
        <seaction>
        <h2>${meta.Title}</h2>
        <img src="photos/${photo.meta}">
        <p>${meta.CreateDate}</p>

        </seaction>
    
`;

}
let searchResultsElement = document.querySelector('.searchResults');
searchResultsElement.innerHTML = html;

}