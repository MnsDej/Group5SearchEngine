// Import the express package/module
// that let us start up a web server
import express from 'express';

// Import the database driver
import mysql from 'mysql2/promise';

// Create a web server named app
const app = express();

app.use(express.static('client'));


app.listen(3000, () =>
  console.log('Listening on http://localhost:3000'));



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

app.get('/api/photos/:searchTerm/:searchType', async(request,response) => {
    let search = request.params.searchTerm;
    let result = await query('SELECT * FROM photos WHERE Photo_metadata LIKE ?', ['%' + search + '%']);
    response.json(result);
});


app.get('/api/pdf', async(request,response) => {
    let search = request.params.searchTerm;
    let result = await query('SELECT pdf_fileName FROM PDF LIMIT 10', ['%' + search + '%']);
    response.json(result);
});

app.get('/api/pdf/:searchTerm/:searchType', async(request,response) => {
    let search = request.params.searchTerm;
    let type = request.params.searchType;
    // sql query for all metadata
    let sql = 'SELECT * FROM PDF WHERE pdf_metadata LIKE ?';
    if(type != 'All'){
      sql = `
       SELECT * 
       FROM PDF 
       WHERE pdf_metadata -> '$.info.${type}' LIKE ?`;
    }
    let result = await query(sql, ['%' + search + '%']);
    response.json(result);
});

app.get('/api/music/:searchTerm/:searchType', async (request, response) => {

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
app.get('/api/photos/gps/:searchLatitude/:searchLongitude/:searchRadiusKm', async (request, response) => {
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