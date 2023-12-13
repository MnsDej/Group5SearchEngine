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
    let result = await query('SELECT * FROM photos');
    response.json(result);
});


app.get('/api/pdf', async(request,response) => {
    let result = await query('SELECT pdf_fileName FROM PDF LIMIT 10');
    response.json(result);
});

app.get('/api/pdf/:searchTerm', async(request,response) => {
    let search = request.params.searchTerm;
    let result = await query('SELECT pdf_fileName FROM PDF WHERE pdf_metadata LIKE ?', ['%' + search + '%']);
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