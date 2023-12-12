async function search () {

    let searchterm = document.forms.searchform.term.value;
    let searchType = document.forms.searchForm.searchType.value;
    console.log(searchType);
    document.forms.searchForm.term.value = '';

    let rawData = await fetch('/api/photos/'+ searchterm);

    let photos = await rawData.json();
   
    let html = `
    <p>You searched for "${searchTerm}"...</p>
    <p>Found ${photos.description} photos.</p>
  `;

    


    for(let photo of photos) {
        html += `
        <seaction>
        <h2>${photos.metadata.info.Title}</h2>
        <img src="photos/${photo.meta.photos}">
        <p>${photo.meta.description}</p>
        
        </seaction>
    
`;

}
let searchResultsElement = document.querySelector('.searchResults');
searchResultsElement.innerHTML = html;

}