import fs from 'fs';
import mysql from 'mysql2/promise';
 
async function insertDataIntoDatabase(data) {
  const connection = await mysql.createConnection({
    host: '161.97.144.27',
    port: "8095",
    user: 'root',
    password: 'guessagain95',
    database: 'Group5SearchEngine'
  });
 
    for (let powerpointMetadata of data) {
     
      let fileName = powerpointMetadata.digest + '.ppt';
      console.log(fileName)
      delete powerpointMetadata.digest;
 
      delete powerpointMetadata.sha256;
      delete powerpointMetadata.sha512;
 
      console.log('');
      console.log(fileName);
      console.log(powerpointMetadata);
 
      await connection.query('INSERT INTO PowerPoint (PowerPoint_fileName, PowerPoint_metadata) VALUES (?, ?)',
       [fileName, JSON.stringify(powerpointMetadata)]);
    }
 
}
 
let json = fs.readFileSync('./powerpoint.json', 'utf-8');
 
let data = JSON.parse(json);
 
 
 insertDataIntoDatabase(data);