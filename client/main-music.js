async function search() {
    let searchTerm = document.forms.searchForm.term.value;
    let searchType = document.forms.searchForm.searchType.value;
    console.log(searchType);
    document.forms.searchForm.term.value = '';
    let allData = await fetch('/api/music/' + searchTerm + '/' + searchType);
    let Tracks = await allData.json();
    let html = `
      <p>You searched for "${searchTerm}"...</p>
      <p>Found ${Tracks.length} songs.</p>
    `;
    for (let music of Tracks) {
      let meta = music.music_metadata.common;
      html += `
        <section>
          <h2>${meta.title}</h2>
          <p><b>Artist:</b> ${meta.artist}</p>
          <p><b>Album:</b> ${meta.album}</p> 
          <p><b>Release Year:</b> ${meta.year}</p>
          <p><b>Genre:</b> ${meta.genre}</p>  
          <p>
            <audio controls src="music/${music.fileName}">
          </p>
        </section>  
      `;
    }
    let searchResultsElement = document.querySelector('.searchResults');
    searchResultsElement.innerHTML = html;
  }