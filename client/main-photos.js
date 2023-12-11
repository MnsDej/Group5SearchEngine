async function search () {

    let searchterm = document.forms.searchform.term.value;

    let rawData = await fetch(''+ searchterm);

    let photos = await rawData.json();
    

    let html = ''

    for(let photo of photos) {
        html += `
        <seaction>
        <h1>${photo.photoSearch}</h1>
        <img src="photos/${photo.meta.photos}">
        <p>${photo.meta.description}</p>
        </seaction>
    
`;

}

document.body.innerHTML += html

}