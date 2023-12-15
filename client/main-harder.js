
// Position on map
let myPosition = {
    lat: 59.324,
    lng: 18.070
};

function initMap() {

  
    // Create a new google map
    const map = new google.maps.Map(
      document.querySelector('#map'), {
      center: myPosition,
      zoom: 2
    });
  
    // Create the initial InfoWindow
    let infoWindow = new google.maps.InfoWindow({
      content: "Click the map to get Latitude/Longitude!",
      position: myPosition
    });
  
    // Open infoWindow
    infoWindow.open(map);
  
    // Make something happen when you click
    map.addListener("click", (mapsMouseEvent) => {
      // Close the current InfoWindow
      infoWindow.close();
      // create a new InfoWindow
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      // Update myPosition (my position)
      myPosition = mapsMouseEvent.latLng.toJSON();
      // Show the clicked longitude and latitude
      infoWindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      );
      infoWindow.open(map);
    });
  }
  
  // Needed to start displaying the map
  window.initMap = initMap;
  
  // Search function
  async function search() {
    let radius = document.getElementById('mapForm').radius.value;
    let latitude = myPosition.lat;
    let longitude = myPosition.lng;
    console.log('radius', radius);
    console.log('latitude', latitude);
    console.log('longitude', longitude);
    let data = await fetch('/api/map-photos-search/' + latitude + '/' + longitude + '/' + radius);
    let images = await data.json();
    // now loop the result and create html
    let html = '';
    for (let photo of images) {
      html += `
        <section>
          <img src="/photos/${photo.Photo_filename}">
        </section>
      `;
    }
    document.querySelector('.searchResult').innerHTML = html;
  }
