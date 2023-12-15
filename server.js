// Import the express package/module
// that let us start up a web server
import express from 'express';

// Import the database driver
import mysql from 'mysql2/promise';

// Create a web server named app
const server = express();

server.use(express.static('client'));


server.listen(5173, () => console.log('Listening on http://localhost:5173'));



  const db = await mysql.createConnection({
    host: '161.97.144.27',
    port: 8095,
    user: 'root',
    password: 'guessagain95',
    database: 'Group5SearchEngine'
  });


async function query(sql, listOfValues) {
  let result = await db.execute(sql, listOfValues);
  return result[0];
}

server.get('/api/photos', async (request, response) => {
  let result = await query('SELECT * FROM photos');
  response.json(result);
});

server.get('/api/photos/:searchTerm/:searchType', async(request,response) => {
    let search = request.params.searchTerm;
    let result = await query('SELECT * FROM photos WHERE LOWER (Photo_metadata) LIKE LOWER(?)', ['%' + search + '%']);
    response.json(result);
});


server.get('/api/pdf', async(request,response) => {
    let search = request.params.searchTerm;
    let result = await query('SELECT pdf_fileName FROM PDF LIMIT 10', ['%' + search + '%']);
    response.json(result);
});

server.get('/api/pdf/:searchTerm/:searchType', async(request,response) => {
    let search = request.params.searchTerm;
    let type = request.params.searchType;
    // sql query for all metadata
    let sql = 'SELECT * FROM PDF WHERE LOWER(pdf_metadata) LIKE LOWER(?)';
    if(type != 'all'){
      sql = `
       SELECT * 
       FROM PDF 
       WHERE LOWER(pdf_metadata -> '$.info.${type}') LIKE LOWER(?)`;
    }
    let result = await query(sql, ['%' + search + '%']);
    response.json(result);
});


server.get('/api/powerpoint/:searchTerm/:searchType', async(request,response) => {
  let search = request.params.searchTerm;
  let searchType = request.params.searchType;
  // sql query for all metadata
  let sql = 'SELECT * FROM PowerPoint WHERE LOWER(PowerPoint_metadata) LIKE LOWER(?)';
  if(searchType != 'all'){
    sql = `
     SELECT * 
     FROM PowerPoint
     WHERE  LOWER(PowerPoint_metadata -> '$.${searchType}') LIKE LOWER(?)`;
  }
  let result = await query(sql, ['%' + search + '%']);
  response.json(result);
});


server.get('/api/music/:searchTerm/:searchType', async (request, response) => {

  let searchTerm = request.params.searchTerm;
 
  let searchType = request.params.searchType;


  let sql = `
   SELECT * 
   FROM music
   WHERE LOWER(music_metadata -> '$.common.${searchType}') LIKE LOWER (?)
  `;

 
  if (searchType == 'all') {
    sql = `
      SELECT *
      FROM music
      WHERE LOWER(music_metadata) LIKE LOWER (?)
    `;
  }

  let result = await query(sql, ['%' + searchTerm + '%']);

  // Send a response to the client
  response.json(result);
});

// Ny endpoint för att söka efter foton baserat på GPS-koordinater
server.get('/api/photos-gps/:searchLatitude/:searchLongitude/:searchRadiusKm', async (request, response) => {
  let searchLatitude = parseFloat(request.params.searchLatitude);
  let searchLongitude = parseFloat(request.params.searchLongitude);
  let searchRadiusKm = parseFloat(request.params.searchRadiusKm);

  let sql = `
    SELECT *,
           JSON_EXTRACT(Photo_metadata, '$.latitude') AS Latitude,
           JSON_EXTRACT(Photo_metadata, '$.longitude') AS Longitude
    FROM photos
    WHERE JSON_EXTRACT(Photo_metadata, '$.latitude') IS NOT NULL
      AND JSON_EXTRACT(Photo_metadata, '$.longitude') IS NOT NULL
      AND SQRT(POW(69.1 * (JSON_EXTRACT(Photo_metadata, '$.latitude') - ?), 2) + POW(69.1 * (? - JSON_EXTRACT(Photo_metadata, '$.longitude')) * COS(JSON_EXTRACT(Photo_metadata, '$.latitude') / 57.3), 2)) < ?;
  `;

  let result = await query(sql, [searchLatitude, searchLongitude, searchRadiusKm]);
  response.json(result);
});

server.get('/api/map-photos-search/:latitude/:longitude/:radius', async (request, response) => {
  let latitude = request.params.latitude;
  let longitude = request.params.longitude;
  let radius = request.params.radius;
  console.log("I GOT", latitude, longitude,radius)
  let result = await query(`
    SELECT * FROM (
      SELECT *,(((acos(sin((?*pi()/180)) * sin((Photo_metadata -> '$.latitude' *pi()/180))+cos((?*pi()/180)) * cos((Photo_metadata -> '$.latitude' * pi()/180)) * cos(((? - Photo_metadata -> '$.longitude')*pi()/180))))*180/pi())*60*1.1515*1.609344) as distance FROM photos) AS subquery
    WHERE distance <= ?
  `, [latitude, latitude, longitude, radius]);
  response.json(result);
});